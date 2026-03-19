# State Management & API Integration Plan

## What We're Working With

**Packages already installed (no additions needed):**
- `zustand` — global client state (auth, onboarding session)
- `@tanstack/react-query` — server state (fetching, caching, loading/error)
- `axios` — HTTP client
- `expo-secure-store` — encrypted token persistence
- `react-hook-form` + `zod` — form state and validation
- `QueryProvider` already wraps the app in `src/shared/providers/QueryProvider.tsx`

**The rule:**
- Zustand = who the user is and what they've entered across screens (client state)
- React Query = anything fetched from the server (server state)
- SecureStore = persisting the JWT token and user data between app restarts
- React Hook Form = local form field state within a single screen

---

## Layer Architecture

```
src/
├── services/
│   └── api/
│       ├── client.ts          ← axios instance with auth interceptor
│       ├── auth.api.ts        ← auth endpoint functions
│       ├── onboarding.api.ts  ← onboarding endpoint functions
│       ├── dashboard.api.ts   ← accounts, details, mini-statement
│       ├── transactions.api.ts← deposit, withdraw, transfer
│       ├── loans.api.ts       ← all loan endpoints
│       └── statements.api.ts  ← statement endpoints
├── store/
│   ├── auth.store.ts          ← token, user, orgId (persisted)
│   └── onboarding.store.ts    ← multi-step onboarding session state
├── hooks/
│   ├── useAuth.ts             ← login mutation, logout
│   ├── useDashboard.ts        ← useAccounts, useClientDetails, useMiniStatement
│   ├── useLoans.ts            ← useLoanProducts, useActiveLoans, useLoanCalculator
│   ├── useTransactions.ts     ← useServiceProviders, deposit/withdraw mutations
│   └── useStatements.ts       ← useAccountStatement, statement mutations
└── shared/
    └── providers/
        └── QueryProvider.tsx  ← already exists
```

---

## The API Client

**`src/services/api/client.ts`**

Single axios instance. Reads the token from the auth store on every request. All modules import from this.

```typescript
import axios from 'axios';
import { useAuthStore } from '../../store/auth.store';

export const BASE_URL = 'http://app.finovateltd.com:8081/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// Inject token on every request
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — clear auth and redirect
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
  }
);

// Helper: parse the "5,464,478.00" string amounts the API returns
export const parseAmount = (value: string | number): number => {
  if (typeof value === 'number') return value;
  return parseFloat(String(value).replace(/,/g, '')) || 0;
};

// Helper: parse "KES 10,000" transaction amounts
export const parseCurrencyAmount = (value: string): number => {
  const parts = value.split(' ');
  const numStr = parts.length > 1 ? parts[1] : parts[0];
  return parseFloat(numStr.replace(/,/g, '')) || 0;
};
```

---

## State Stores

### Auth Store — `src/store/auth.store.ts`

Holds everything the app needs after a successful login. Persisted to SecureStore so the user stays logged in between app restarts.

```typescript
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface User {
  name: string;
  username: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  org_id: number;
  client_id: number;
}

interface AuthState {
  token: string | null;
  user: User | null;
  lastLogin: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (token: string, user: User, lastLogin: string) => void;
  clearAuth: () => void;
  hydrateFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  lastLogin: null,
  isAuthenticated: false,

  setAuth: async (token, user, lastLogin) => {
    // Persist to SecureStore
    await SecureStore.setItemAsync('auth_token', token);
    await SecureStore.setItemAsync('auth_user', JSON.stringify(user));
    await SecureStore.setItemAsync('auth_last_login', lastLogin);

    set({ token, user, lastLogin, isAuthenticated: true });
  },

  clearAuth: async () => {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('auth_user');
    await SecureStore.deleteItemAsync('auth_last_login');
    set({ token: null, user: null, lastLogin: null, isAuthenticated: false });
  },

  hydrateFromStorage: async () => {
    const token = await SecureStore.getItemAsync('auth_token');
    const userStr = await SecureStore.getItemAsync('auth_user');
    const lastLogin = await SecureStore.getItemAsync('auth_last_login');

    if (token && userStr) {
      set({
        token,
        user: JSON.parse(userStr),
        lastLogin,
        isAuthenticated: true,
      });
    }
  },
}));
```

**What uses it:**
- `AppNavigator` reads `isAuthenticated` on startup → decides initial route
- `LoginPINScreen` calls `setAuth` after successful login
- `PINAuthScreen` calls `clearAuth` on logout
- `apiClient` reads `token` on every request
- `LoginLandingScreen` reads `user.firstname` and `lastLogin`

---

### Onboarding Store — `src/store/onboarding.store.ts`

Multi-step onboarding is the hardest module because data created on step 1 is needed on step 3. Navigation params can't carry file URIs or large objects cleanly. This store holds the session state across all onboarding screens.

```typescript
import { create } from 'zustand';

interface GenderOption   { id: number; name: string; }
interface Organisation   { id: number; name: string; isSacco: boolean; logo: string; }

interface OnboardingState {
  // Step 1: LookupScreen
  phone: string;              // full phone e.g. "+254716735875"
  idNumber: string;

  // Step 2: SaccoSelection
  selectedOrg: Organisation | null;

  // Step 3: KYC — reference data loaded on mount
  genders: GenderOption[];

  // Step 4: KYC — after submit
  kycFormId: number | null;   // form_id from /client/create/basic/initial

  // Step 5: UploadID — local URIs picked by user
  idFrontUri: string | null;
  idBackUri: string | null;

  // Actions
  setPhone: (phone: string, idNumber: string) => void;
  setSelectedOrg: (org: Organisation) => void;
  setGenders: (genders: GenderOption[]) => void;
  setKycFormId: (formId: number) => void;
  setIdPhotos: (frontUri: string, backUri: string) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  phone: '',
  idNumber: '',
  selectedOrg: null,
  genders: [],
  kycFormId: null,
  idFrontUri: null,
  idBackUri: null,

  setPhone: (phone, idNumber) => set({ phone, idNumber }),
  setSelectedOrg: (org) => set({ selectedOrg: org }),
  setGenders: (genders) => set({ genders }),
  setKycFormId: (formId) => set({ kycFormId: formId }),
  setIdPhotos: (frontUri, backUri) => set({ idFrontUri: frontUri, idBackUri: backUri }),
  reset: () => set({
    phone: '', idNumber: '', selectedOrg: null, genders: [],
    kycFormId: null, idFrontUri: null, idBackUri: null,
  }),
}));
```

**Why a store and not nav params?**
- `form_id` from KYC step 1 needs to reach UploadID step — you'd have to thread it through multiple navigation calls
- Photo URIs are long strings — messy in nav params
- Genders list fetched on KYC mount shouldn't re-fetch if user goes back and forward
- The store resets after onboarding completes

---

## Module 1: Onboarding (Hardest)

### The full screen-by-screen conversion

---

#### `LookupScreen` — Current → Target

**Currently:** Navigates straight to OTPVerification with phone/idNumber params. No API calls.

**Target:**
1. On "Continue" press: call `POST /auth/get-associated-orgs` with `phone` + `notYetJoined: true`
2. Then call `POST /auth/activate` to send the OTP
3. Store `phone` in onboarding store
4. Navigate to `OTPVerification` with just the phone (idNumber no longer needed as a nav param — stored in the store)

**State changes:**
```
onboardingStore.setPhone(phone, idNumber)
```

**API calls:**
```
useMutation → POST /auth/get-associated-orgs   (check if user exists)
useMutation → POST /auth/activate              (trigger OTP)
```

**Loading/error states:**
- Button shows loading spinner while calling activate
- If activate fails → show inline error below phone field
- If getAssociatedOrgs returns empty → user is new, still proceed to OTP (they'll register via KYC)

**Navigation after success:**
```typescript
navigation.navigate('OTPVerification', { phoneNumber: fullPhone })
// idNumber no longer passed in params — it's in the store
```

---

#### `OTPVerificationScreen` — Current → Target

**Currently:** Has timer, navigates to SaccoSelection on "Verify". No API calls.

**Target:**
1. On "Verify": call `POST /auth/verify-code` with `{ token: otpCode }`
2. On "Resend": call `POST /auth/resend-otp` with `{ username: phone }`
3. On success: navigate to `SaccoSelection`

**State changes:** None — no store updates here.

**API calls:**
```
useMutation → POST /auth/verify-code    (on verify press)
useMutation → POST /auth/resend-otp     (on resend press)
```

**Loading/error states:**
- Verify button shows spinner while calling
- If status 0 → show "Invalid OTP. Please try again." below OTP input, clear the input
- Resend disabled during API call, re-enable the timer on resend success

---

#### `SaccoSelectionScreen` — Current → Target

**Currently:** Uses 3 hardcoded static SACCO objects with local asset logos.

**Target:**
1. On mount: fetch `POST /organization/index` with `{ limit: 50 }`
2. Render the real list from API
3. On SACCO tap: store selected org in onboarding store, navigate to `KYC`
4. Remove the "Activate Account" link — that was confusing (KYC IS activation)

**State changes:**
```
onboardingStore.setSelectedOrg(org)
```

**React Query hook:**
```typescript
// hooks/useOnboarding.ts
export const useOrganisations = () =>
  useQuery({
    queryKey: ['organisations'],
    queryFn: () => apiClient.post('/organization/index', { limit: 50 })
                            .then(r => r.data.data as Organisation[]),
    staleTime: Infinity, // orgs don't change
  });
```

**Loading/error states:**
- While loading: show skeleton cards (3 placeholder SaccoCard-shaped grey boxes)
- On error: show "Failed to load SACCOs. Tap to retry." with retry button

**Key change:** The `handleSaccoPress` function currently navigates to PINEntry. New behaviour: navigate to `KYC`. The PIN is only created at the END of onboarding.

```typescript
const handleSaccoPress = (org: Organisation) => {
  onboardingStore.setSelectedOrg(org);
  navigation.navigate('KYC');
};
```

---

#### `KYCScreen` — Current → Target

**Currently:** Has firstName, lastName, phone, idNumber, dateOfBirth fields. Missing gender. No org context. No API call on submit.

**Target:**
1. On mount: parallel fetch `POST /gender/index` (with `org_id` from store) + pre-fill phone from store
2. Add a **Gender** dropdown field (uses gender list from API)
3. On "Continue": call `POST /client/create/basic/initial`
4. On success: store the returned `form_id`, navigate to `UploadID`

**New fields to add:** Gender picker (dropdown of genders from API)

**State read:**
```typescript
const { phone, selectedOrg } = useOnboardingStore();
// Pre-fill phone, use selectedOrg.id as org_id
```

**State write on success:**
```typescript
onboardingStore.setKycFormId(response.data.form_id);
```

**React Query (for reference data):**
```typescript
export const useGenders = (orgId: number) =>
  useQuery({
    queryKey: ['genders', orgId],
    queryFn: () => apiClient.post('/gender/index', { org_id: String(orgId) })
                            .then(r => r.data.data as GenderOption[]),
    enabled: !!orgId,
    staleTime: Infinity,
  });
```

**Mutation for submit:**
```typescript
export const useCreateClientInitial = () =>
  useMutation({
    mutationFn: (data: KYCInitialPayload) =>
      apiClient.post('/client/create/basic/initial', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(r => r.data),
  });
```

**Form validation with Zod:**
```typescript
const kycSchema = z.object({
  firstName:   z.string().min(2, 'First name required'),
  lastName:    z.string().min(2, 'Last name required'),
  phone:       z.string().min(9, 'Valid phone required'),
  idNumber:    z.string().min(5, 'ID number required'),
  dob:         z.string().min(1, 'Date of birth required'),
  genderId:    z.number({ required_error: 'Gender required' }),
});
```

**API body built from form:**
```typescript
{
  first_name:        data.firstName,
  last_name:         data.lastName,
  middle_name:       '',           // optional field
  phone:             phone,        // from store (already has country code)
  national_identity: data.idNumber,
  dob:               formatDOB(data.dob), // "DD-MM-YYYY"
  gender:            data.genderId,
  org_id:            selectedOrg.id,
}
```

---

#### `UploadIDScreen` — Current → Target

**Currently:** Simulates file selection with `setSelectedFile('national_id.jpg')`. No actual file picker. No API call.

**Target:**
1. User taps "Browse Gallery" → open expo-image-picker (already in expo) to pick image
2. User taps "Take Photo" → open camera
3. Collect BOTH front and back of ID
4. On "Continue": call `POST /client/create/basic/final` with form data including files
5. Store photo URIs in onboarding store
6. Navigate to `PINEntry` on success

**The screen needs two uploads:** front and back of the ID. Current UI only shows one upload box. Will need to show two separate upload areas.

**State read:**
```typescript
const { kycFormId } = useOnboardingStore();
// kycFormId is the form_id from KYC step
```

**State write:**
```typescript
onboardingStore.setIdPhotos(frontUri, backUri);
```

**Mutation:**
```typescript
export const useCreateClientFinal = () =>
  useMutation({
    mutationFn: async ({ formId, taxPin, email, frontUri, backUri }: UploadIDPayload) => {
      const formData = new FormData();
      formData.append('form_id', String(formId));
      formData.append('tax_pin', taxPin);
      formData.append('email', email);
      formData.append('id_front_photo', {
        uri: frontUri,
        name: 'id_front.jpg',
        type: 'image/jpeg',
      } as any);
      formData.append('id_back_photo', {
        uri: backUri,
        name: 'id_back.jpg',
        type: 'image/jpeg',
      } as any);
      return apiClient.post('/client/create/basic/final', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(r => r.data);
    },
  });
```

---

#### `PINEntryScreen` — Current → Target

**Currently:** mode='create' → stores PIN locally → mode='confirm' validates match → navigates to Auth. No API call.

**Target (for onboarding flow):**
- mode='enter' → user enters the OTP/default PIN sent by SMS → call `POST /auth/validate-default-pin`
- mode='create' → user types new PIN (local, no API yet)
- mode='confirm' → re-enters to confirm match → call `POST /auth/change-default-pin`
- On PIN set success: clear onboarding store → navigate to Auth (LoginLanding)

**The PIN flow is 3 steps:**
1. Enter OTP/default PIN (validates with API)
2. Create new 4-digit PIN (local)
3. Confirm new PIN (local match) → submit to API → done

**Mutations:**
```typescript
// Validate the default/OTP PIN
export const useValidateDefaultPin = () =>
  useMutation({
    mutationFn: ({ username, defaultPin }: { username: string; defaultPin: string }) =>
      apiClient.post('/auth/validate-default-pin', { username, defaultPin },
        { headers: { 'Content-Type': 'multipart/form-data' } }
      ).then(r => r.data),
  });

// Set the permanent PIN after confirmation
export const useChangeDefaultPin = () =>
  useMutation({
    mutationFn: ({ username, password, confirm }: { username: string; password: string; confirm: string }) =>
      apiClient.post('/auth/change-default-pin', { username, password, confirm })
               .then(r => r.data),
    onSuccess: () => {
      useOnboardingStore.getState().reset(); // clear onboarding state
    },
  });
```

---

## Module 2: Auth (Login)

### `AppNavigator` — Boot check

**Currently:** Always starts on Onboarding.

**Target:** On app start, check SecureStore for a token. If found → go to Main. If not → go to Onboarding.

```typescript
export const AppNavigator = () => {
  const { isAuthenticated, hydrateFromStorage } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    hydrateFromStorage().then(() => setIsReady(true));
  }, []);

  if (!isReady) return <SplashScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? 'Main' : 'Onboarding'}>
        ...
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

---

### `LoginLandingScreen` — Current → Target

**Currently:** Hardcoded `userName = 'Tafari'` and `saccoName = 'Stima SACCO'`.

**Target:** Read from auth store (populated from SecureStore).

```typescript
const { user, lastLogin } = useAuthStore();
const userName = user?.firstname ?? 'there';
const saccoName = user?.org_id ? `SACCO #${user.org_id}` : 'your SACCO';
```

Also: the profile image should use `user.facePhotoUrl` from `/client/details` if available — but that requires a fetch. For the login landing, use the stored user data. The full profile image can be fetched post-login on the Dashboard.

---

### `LoginPINScreen` — Current → Target

**Currently:** `isValidPin = true` hardcoded. Navigates to Main regardless.

**Target:**
1. On 4th digit entered: call `POST /auth/login` with `{ username, password: pin, org_id }`
2. On success: call `authStore.setAuth(token, user, lastLogin)`
3. Navigate to Main
4. On failure: show "Incorrect PIN" error, clear pin, increment attempt counter

**Where does `username` come from?**
- After onboarding: the phone number used during registration
- For returning users: stored in SecureStore as part of the user object (`user.username`)

**Where does `org_id` come from?**
- Stored in `user.org_id` in the auth store

**Mutation:**
```typescript
export const useLogin = () => {
  const { setAuth } = useAuthStore();
  return useMutation({
    mutationFn: ({ username, password, orgId }: LoginPayload) =>
      apiClient.post('/auth/login', { username, password, org_id: orgId })
               .then(r => r.data),
    onSuccess: (data) => {
      if (data.status === 1) {
        setAuth(data.data.token, data.data.user, data.data.last_login);
      }
    },
  });
};
```

---

### `PINAuthScreen` (shared screen for in-app PIN confirmation)

**Currently:** No validation — any 4 digits succeeds.

**Target:** Call `POST /auth/verify-user` with `{ password: pin }`. On success → execute the `successScreen` navigation or `onSuccess` callback.

This screen is used as a security gate before loan confirmations and transfers. Real PIN validation must happen here.

```typescript
const useVerifyUser = () =>
  useMutation({
    mutationFn: (password: string) =>
      apiClient.post('/auth/verify-user', { password },
        { headers: { 'Content-Type': 'multipart/form-data' } }
      ).then(r => r.data),
  });
```

---

## Module 3: Dashboard

### `DashboardScreen` — Current → Target

**Currently:** All mock data passed as props to child components.

**Target:** Fetch in parallel on mount, pass real data down.

**React Query hooks:**
```typescript
// hooks/useDashboard.ts

export const useClientDetails = () =>
  useQuery({
    queryKey: ['clientDetails'],
    queryFn: () => apiClient.post('/client/details').then(r => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

export const useClientAccounts = () =>
  useQuery({
    queryKey: ['clientAccounts'],
    queryFn: () => apiClient.post('/client/accounts').then(r => r.data.data as Account[]),
    staleTime: 2 * 60 * 1000,
  });

export const useMiniStatement = (accountId: number, productId: number) =>
  useQuery({
    queryKey: ['miniStatement', accountId, productId],
    queryFn: () =>
      apiClient.post('/client/mini-statement', { accountId, productId })
               .then(r => r.data.data as Transaction[]),
    enabled: !!accountId && !!productId,
    staleTime: 60 * 1000,
  });
```

**DashboardScreen data flow:**
```typescript
const { data: details, isLoading: detailsLoading } = useClientDetails();
const { data: accounts, isLoading: accountsLoading } = useClientAccounts();

// Get first savings account for mini-statement
const primaryAccount = accounts?.find(a => a.isShare === 0);
const { data: transactions } = useMiniStatement(
  primaryAccount?.accountId,
  primaryAccount?.productId
);
```

**Loading state:** Show skeleton placeholders in `AccountCarousel` and `RecentTransactions` while loading. These are the two most visible parts of the dashboard.

**Pull-to-refresh:** `ScrollView` gets `refreshControl` prop that calls `queryClient.invalidateQueries(['clientAccounts', 'miniStatement'])`.

---

### `DashboardHeader` — Current → Target

**Currently:** Receives `userName`, `lastLogin`, `notificationCount` as props with mock values.

**Target:** Props stay the same — caller (DashboardScreen) passes real values:
```typescript
<DashboardHeader
  userName={details?.identification.fullName.split(' ')[0] ?? '...'}
  lastLogin={authStore.lastLogin ?? ''}
  notificationCount={0}  // no notifications endpoint — hardcode 0 for now
/>
```

---

### `AccountCarousel` — Current → Target

**Currently:** Receives `accounts` array with mock `{ id, accountName, accountNumber, availableBalance, actualBalance }`.

**Target:** Real accounts from API. Balance strings need parsing.

```typescript
// Map API account to component's expected shape
const mappedAccounts = (accounts ?? [])
  .filter(a => a.isShare === 0)  // savings only, not shares
  .map(a => ({
    id: String(a.accountId),
    accountName: a.accountName,
    accountNumber: a.accountNumber,
    availableBalance: parseAmount(a.availableBalance),
    actualBalance: parseAmount(a.currentBalance),
    productId: a.productId,        // pass through for mini-statement calls
    accountId: a.accountId,
  }));
```

When user swipes to a different account card → call `useBalanceInquiry(accountId, productId)` to refresh that card's balance, and trigger a new `useMiniStatement` with the new account's IDs.

---

### `RecentTransactions` — Current → Target

**Currently:** Hardcoded single transaction.

**Target:** Receives `transactions` prop from `DashboardScreen`.

```typescript
// Transaction from API:
// { transactionDate, account, transactionType, entryType: "CREDIT"|"DEBIT", amount: "KES 10,000" }

const parsedTransactions = (transactions ?? []).map(t => ({
  id: `${t.transactionDate}-${t.amount}`,
  title: t.transactionType,
  date: t.transactionDate,
  entryType: t.entryType,   // "CREDIT" or "DEBIT"
  amount: parseCurrencyAmount(t.amount),
  isCredit: t.entryType === 'CREDIT',
}));
```

Amount colour: green if `isCredit`, red if debit.

---

## Module 4: Transactions (Deposit & Withdrawal)

### `MakeDepositScreen` — Current → Target

**Currently:** Hardcoded accounts array and `['Mpesa']` providers array. No API call on submit.

**Target:**
1. On mount: fetch service providers + use accounts from React Query cache (already fetched by Dashboard)
2. Accounts dropdown populates from `useClientAccounts()` cache
3. Providers dropdown populates from `useServiceProviders()`
4. On "Continue": call `POST /payment-deposit`
5. On success: show success state, pop back to Dashboard

**React Query:**
```typescript
export const useServiceProviders = () =>
  useQuery({
    queryKey: ['serviceProviders'],
    queryFn: () => apiClient.post('/service-provider/index').then(r => r.data.data as ServiceProvider[]),
    staleTime: Infinity, // providers don't change
  });
```

**Mutation:**
```typescript
export const useDeposit = () =>
  useMutation({
    mutationFn: ({ accountId, amount, providerId, providerPhone }: DepositPayload) =>
      apiClient.post('/payment-deposit', { accountId, amount, providerId, providerPhone })
               .then(r => r.data),
    onSuccess: () => {
      // Invalidate account balances so Dashboard refreshes
      queryClient.invalidateQueries({ queryKey: ['clientAccounts'] });
      queryClient.invalidateQueries({ queryKey: ['miniStatement'] });
    },
  });
```

**Selected account state:** local `useState` — user picks which account to deposit into. The `accountId` comes from the selected account object.

**Provider selection:** local `useState` — user picks provider. `providerId` comes from selected provider object.

**On submit:** disable button + show spinner. After success → show "STK Push sent — check your phone" message. Don't pop immediately; wait for user to confirm or give them a "Done" button.

---

### Loan Repayment Screen — Same pattern as Deposit

`LoanRepaymentScreen` currently mirrors `MakeDepositScreen` exactly. The integration is the same except:
- Account picker = the **loan account** to repay (from `useClientLoanAccounts`)
- Can also repay via M-Pesa — use provider picker same way
- Calls `POST /loan/repayment-preview` then `POST /loan/repayment-commit`
- Uses the preview → commit pattern (deposit does not)

---

## Module 5: Loans

### `LoansScreen` — Current → Target

**Currently:** `hasActiveLoan = true` hardcoded, `mockLoanData` object.

**Target:**
```typescript
const { data: loanProducts, isLoading: productsLoading } = useLoanProducts();
const { data: activeLoans, isLoading: loansLoading } = useActiveLoans();
```

**React Query:**
```typescript
export const useLoanProducts = () =>
  useQuery({
    queryKey: ['loanProducts'],
    queryFn: () => apiClient.post('/loan/products').then(r => r.data.data as LoanProduct[]),
    staleTime: 5 * 60 * 1000,
  });

export const useActiveLoans = () =>
  useQuery({
    queryKey: ['activeLoans'],
    queryFn: () =>
      apiClient.post('/loan/active-loans', { pendingDisbursement: false })
               .then(r => r.data.data as ActiveLoan[]),
    staleTime: 2 * 60 * 1000,
  });
```

**`LoanCard` receives:**
- `hasActiveLoan: activeLoans && activeLoans.length > 0`
- `loanAmount: parseAmount(activeLoans[0]?.amountDisbursed)`
- `outstandingBalance: parseAmount(activeLoans[0]?.loanBalance)` — parse "KES 14,000.00"
- `loanLimit: parseAmount(loanProducts[0]?.maxAmount)` — parse "KES 200,000.00"

**`LoanProducts` component** receives the real `loanProducts` array instead of hardcoded IDs.

---

### `LoanApplicationScreen` — Current → Target

**Currently:** Hardcoded repayment periods array. Goes to `LoanConfirmation` with raw data. No API calls.

**Target:**
1. Receives `productId` (not just `loanType` string) in nav params — must update `types.ts`
2. On amount/period change (debounced 600ms): call `/loan/calculator`
3. On submit: call `/loan/application-preview` → get `formId` + `charges`
4. Navigate to `LoanConfirmation` with `formId` + preview data

**Types change needed:**
```typescript
// types.ts
LoanApplication: {
  productId: number;        // ADD THIS
  loanType: string;
  loanLimit: number;
  depositAccountId: number; // ADD THIS — needed for preview
};
```

**Local state:**
```typescript
const [amount, setAmount] = useState('');
const [repaymentPeriod, setRepaymentPeriod] = useState<number>(1);
const [applicationReason, setApplicationReason] = useState(''); // ADD THIS FIELD
```

**React Query for calculator (debounced):**
```typescript
export const useLoanCalculator = (productId: number, amount: number, period: number) =>
  useQuery({
    queryKey: ['loanCalculator', productId, amount, period],
    queryFn: () =>
      apiClient.post('/loan/calculator', { productId, amount, repaymentPeriod: period })
               .then(r => r.data.data),
    enabled: !!productId && amount > 0 && period > 0,
    staleTime: 30 * 1000,
  });
```

**Preview mutation:**
```typescript
export const useLoanApplicationPreview = () =>
  useMutation({
    mutationFn: (payload: LoanPreviewPayload) =>
      apiClient.post('/loan/application-preview', payload).then(r => r.data),
  });
```

**On submit:**
```typescript
const previewMutation = useLoanApplicationPreview();

const handleApply = async () => {
  const result = await previewMutation.mutateAsync({
    productId,
    amount: parseFloat(amount),
    depositAccountId,
    applicationReason,
  });

  navigation.navigate('LoanConfirmation', {
    formId: result.data.formId,
    charges: result.data.charges,
    loanData: { loanType, amount: parseFloat(amount), repaymentPeriod, loanLimit },
    calculatorData: calculatorData, // from useLoanCalculator
  });
};
```

---

### `LoanConfirmationScreen` — Current → Target

**Currently:** Calculates fees with `amount * 0.007` mock math. Navigates to PINAuth.

**Target:**
- Receives real `formId` and `charges` from preview
- Shows real fee from API (charges from preview response)
- On "Confirm" → navigate to PINAuth → on PIN success → call `POST /loan/application-commit`

**The commit must happen AFTER PIN verification.** The `PINAuthScreen` currently navigates to a `successScreen` by name. The commit call can't happen inside that navigation. Solutions:
1. Pass `onSuccess` callback to `PINAuthScreen` that fires the commit → then navigate to LoanSuccess
2. Or: treat LoanSuccess screen as the screen that fires the commit (it receives `formId` and calls commit on mount)

**Recommended approach: Option 1 — onSuccess callback:**
```typescript
const commitMutation = useLoanApplicationCommit();

const handleConfirm = () => {
  navigation.navigate('PINAuth', {
    title: 'Enter PIN',
    subtitle: 'Confirm your loan application',
    onSuccess: async () => {
      await commitMutation.mutateAsync({ formId });
      navigation.navigate('LoanSuccess', { loanData: { ... } });
    },
  });
};
```

The `PINAuthScreen` needs to call `onSuccess()` after PIN verification, not just navigate.

---

## Module 6: Statements

### `StatementFormScreen` — Current → Target

**Currently:** Logs to console. No API calls.

**Target:**
1. Pre-fill email from auth store user
2. On "Get Statement": call `/client/full-statement-preview` → get `formId`
3. Show loading state
4. Then call `/client/full-statement-generate` with `formId`
5. Show success message "Statement sent to your email"

**Note:** Server has a permission bug on `/full-statement-preview`. Implement it anyway. Show a user-friendly error if it fails ("Statement generation is temporarily unavailable").

**Mutations:**
```typescript
export const useStatementPreview = () =>
  useMutation({
    mutationFn: (payload: StatementPreviewPayload) =>
      apiClient.post('/client/full-statement-preview', payload).then(r => r.data),
  });

export const useStatementGenerate = () =>
  useMutation({
    mutationFn: (formId: number) =>
      apiClient.post('/client/full-statement-generate', { formId }).then(r => r.data),
  });
```

**Chained mutations:**
```typescript
const handleGetStatement = async () => {
  try {
    const preview = await previewMutation.mutateAsync({
      accountId: primaryAccount.accountId,
      from: formatDate(startDate),   // "2025-01-01"
      to: formatDate(endDate),
      recipientEmail: email,
    });
    await generateMutation.mutateAsync(preview.data.formId);
    // Show success banner
    setSuccess(true);
  } catch (err) {
    // Show error — likely the server permission bug
    setError('Statement generation is temporarily unavailable. Please try again later.');
  }
};
```

---

## State Flow Diagram

```
App Start
  └─► hydrateFromStorage()
        ├─ token found → isAuthenticated = true → go to Main (Dashboard)
        └─ no token    → isAuthenticated = false → go to Onboarding

Onboarding Flow
  LookupScreen
    writes: onboardingStore.phone, onboardingStore.idNumber
    calls:  /auth/get-associated-orgs, /auth/activate
      ↓
  OTPVerificationScreen
    reads:  onboardingStore.phone
    calls:  /auth/verify-code
      ↓
  SaccoSelectionScreen
    writes: onboardingStore.selectedOrg
    fetches: /organization/index (React Query)
      ↓
  KYCScreen
    reads:  onboardingStore.phone, onboardingStore.selectedOrg.id
    writes: onboardingStore.kycFormId
    fetches: /gender/index (React Query, on mount)
    calls:  /client/create/basic/initial (mutation, on submit)
      ↓
  UploadIDScreen
    reads:  onboardingStore.kycFormId
    writes: onboardingStore.idFrontUri, onboardingStore.idBackUri
    calls:  /client/create/basic/final (mutation, on submit)
      ↓
  PINEntryScreen (mode=enter)
    reads:  onboardingStore.phone
    calls:  /auth/validate-default-pin
      ↓
  PINEntryScreen (mode=create → mode=confirm)
    calls:  /auth/change-default-pin (on confirm match)
    writes: onboardingStore.reset()
      ↓
  → navigate to Auth (LoginLanding)

Auth Flow
  LoginLandingScreen
    reads:  authStore.user.firstname, authStore.lastLogin
      ↓
  LoginPINScreen
    reads:  authStore.user.username, authStore.user.org_id
    writes: authStore.setAuth(token, user, lastLogin)
    calls:  /auth/login (mutation)
      ↓
  → navigate to Main

Main (Dashboard)
  DashboardScreen (mount)
    fetches: /client/details (React Query)
    fetches: /client/accounts (React Query)
    fetches: /client/mini-statement (React Query, uses first account's ids)
    ↓
  Account swipe
    fetches: /client/balance-inquiry (React Query, per account)
    fetches: /client/mini-statement (React Query, per account)

Deposit Flow
  MakeDepositScreen (mount)
    fetches: /service-provider/index (React Query)
    reads:   clientAccounts from cache (already fetched by Dashboard)
    calls:   /payment-deposit (mutation, on submit)
    invalidates: clientAccounts, miniStatement cache

Loan Flow
  LoansScreen (mount)
    fetches: /loan/products (React Query)
    fetches: /loan/active-loans (React Query)
    fetches: /client/loan-accounts (React Query)
  LoanApplicationScreen
    fetches: /loan/calculator (React Query, debounced on amount/period change)
    calls:   /loan/application-preview (mutation, on submit)
  LoanConfirmationScreen
    calls:   /auth/verify-user via PINAuth (mutation, on confirm)
    calls:   /loan/application-commit (mutation, after PIN success)
    invalidates: activeLoans, loanProducts cache
  LoanRepaymentScreen
    fetches: /service-provider/index (React Query)
    calls:   /loan/repayment-preview (mutation)
    calls:   /loan/repayment-commit (mutation, after PIN success)
    invalidates: activeLoans cache
```

---

## Error Handling Rules

**Consistent across all screens:**

1. **API validation error** (status: 0): show the `message` string from the response inline below the relevant field or in a toast
2. **Network error** (no connection): show "No internet connection. Please check your connection and try again."
3. **401 Unauthorized**: the axios interceptor fires `clearAuth()` automatically → user is sent back to login by the navigator
4. **500 Server error**: show "Something went wrong. Please try again later." — never show the raw PHP stack trace to the user
5. **Loading states**: every button that triggers a mutation shows `ActivityIndicator` in place of its label while loading and is disabled to prevent double-submits

---

## Navigation Types to Update

Before coding, update `types.ts` to carry the IDs the API actually needs:

```typescript
// LoanApplication needs productId (numeric) not just loanType (string)
LoanApplication: {
  productId: number;        // for /loan/calculator and /loan/application-preview
  loanType: string;         // for display
  loanLimit: number;
  depositAccountId: number; // pre-selected account to receive disbursement
};

// LoanConfirmation needs formId from preview + real data
LoanConfirmation: {
  formId: number;           // from /loan/application-preview
  charges: number;          // from preview response
  loanData: {
    loanType: string;
    amount: number;
    repaymentPeriod: number;
    loanLimit: number;
  };
  calculatorData: {         // from /loan/calculator
    installmentAmount: string;
    installmentCount: number;
    totalLoanAmount: string;
    interestAmount: string;
  };
};

// OTPVerification no longer needs idNumber (it's in the store)
OTPVerification: { phoneNumber: string };
```

---

## Implementation Order

Do these in sequence. Each module depends on the previous.

```
1. API client (client.ts)              → foundation for everything
2. Auth store (auth.store.ts)          → needed by client interceptor
3. Onboarding store (onboarding.store.ts) → needed by KYC/UploadID
4. AppNavigator boot check             → gates everything
5. MODULE: Onboarding                  → LookupScreen → OTP → Sacco → KYC → Upload → PIN
6. MODULE: Auth                        → LoginLanding → LoginPIN → PINAuth
7. MODULE: Dashboard                   → DashboardScreen → AccountCarousel → RecentTransactions
8. MODULE: Transactions                → MakeDeposit → ServiceProviders
9. MODULE: Loans                       → LoansScreen → LoanApplication → LoanConfirmation → Repayment
10. MODULE: Statements                 → StatementForm
```

Each module should be fully working end-to-end before starting the next one.