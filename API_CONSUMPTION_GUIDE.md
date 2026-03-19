# Finovate API Consumption Guide

This document covers two things:
1. **How to curl and verify any endpoint** before writing a single line of app code
2. **Module-by-module consumption plans** — what to call, when, what to expect, and known gotchas

All responses were verified by hitting the live server at `http://app.finovateltd.com:8081/api`.

---

## Part 1 — How to Test Endpoints (For Claude Code / Any Dev Agent)

### The Golden Rule

> **Never implement an endpoint without curling it first.**

The Postman collection is the spec, but the live server is the truth. They differ in places — extra required fields, different enum values, string-formatted numbers, etc. Always curl to get the real response shape before writing TypeScript interfaces or API calls.

---

### Shell Setup

All curl testing follows this pattern in a single shell script or sequence of commands.

**Step 1 — Get a token and export it:**
```bash
RESPONSE=$(curl -s http://app.finovateltd.com:8081/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username": "moses", "password": "1234", "org_id": 12}')

TOKEN=$(echo $RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['token'])")

echo "Token acquired: ${TOKEN:0:60}..."
```

**Step 2 — Use `$TOKEN` in subsequent calls:**
```bash
curl -s http://app.finovateltd.com:8081/api/client/accounts \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  | python3 -m json.tool
```

**Step 3 — Pretty-print and save a real response for reference:**
```bash
curl -s http://app.finovateltd.com:8081/api/client/accounts \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  | python3 -m json.tool > /tmp/accounts_response.json

cat /tmp/accounts_response.json
```

---

### Curl Template for Each Endpoint Type

**JSON body (most authenticated endpoints):**
```bash
curl -s <BASE_URL>/<path> \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}' \
  | python3 -m json.tool
```

**Form data (auth/onboarding endpoints):**
```bash
curl -s <BASE_URL>/<path> \
  -X POST \
  -F "key=value" \
  -F "key2=value2" \
  | python3 -m json.tool
```

**File upload (KYC photo uploads):**
```bash
curl -s <BASE_URL>/client/create/basic/final \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -F "form_id=123" \
  -F "tax_pin=A123456789B" \
  -F "email=test@example.com" \
  -F "id_front_photo=@/path/to/front.jpg" \
  -F "id_back_photo=@/path/to/back.jpg" \
  | python3 -m json.tool
```

**Check HTTP status code separately:**
```bash
curl -s -o /dev/null -w "%{http_code}" \
  http://app.finovateltd.com:8081/api/client/accounts \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

### Response Envelope

Every response follows one of two shapes:

**Success:**
```json
{
  "status": 1,
  "message": "Success",
  "data": { ... }
}
```

**Validation failure (4xx from bad input):**
```json
{
  "status": 0,
  "message": "fieldName: error description",
  "data": null
}
```

**Auth failure (401):**
```json
{
  "errors": {
    "name": "Unauthorized",
    "message": "Your request was made with invalid credentials.",
    "code": 0,
    "status": 401,
    "type": "yii\\web\\UnauthorizedHttpException"
  },
  "code": 401
}
```

**Server error (500):**
```json
{
  "errors": {
    "name": "PHP Warning",
    "message": "...",
    "code": 500,
    "type": "...",
    "stack-trace": [...]
  },
  "code": 500
}
```

---

### Critical Gotchas Discovered From Live Testing

| Gotcha | Detail |
|---|---|
| `login` requires `org_id` | Not in Postman body. `{"username":"moses","password":"1234","org_id":12}` — without `org_id` it returns `"org_id:Org Id cannot be blank."` |
| Money values are **strings with commas** | `"availableBalance": "5,464,478.00"` NOT a number. Strip commas before `parseFloat()` |
| Transaction amounts have currency prefix | `"amount": "KES 10,000"` — parse with `split(' ')[1]` then strip commas |
| `transferType` values are `"SELF"` or `"Other"` | Postman shows `"OTHER"` but the server says `"transferType must either be SELF or Other"` |
| `internalTransfer/preview` for SELF needs `toAccountId` | Not `accountNumber`. Use the `accountId` number from `/client/accounts` |
| `loan/application-preview` returns minimal data | Only `formId`, `charges`, `exerciseDuty` — no full loan summary back |
| `full-statement-preview` has a server-side permission bug | Returns 500 `mkdir(): Permission denied` — backend issue, not client issue. Report to API team |
| `account-statement/index` returns `{transactions: []}` | Wrapped inside `data` object |
| `{{baseURL}}` and `{{tlocalURL}}` are the SAME server | Both point to `http://app.finovateltd.com:8081/api` |
| Token expires in 24 hours | Re-login if you get 401 during dev/testing |

---

## Part 2 — Module-by-Module Consumption

---

## Module 1: Onboarding

### Consumption Flow

```
LookupScreen
  → POST /auth/get-associated-orgs   (check if number has accounts)
  → POST /auth/activate              (send OTP)
    ↓
OTPVerificationScreen
  → POST /auth/verify-code           (submit OTP)
  → POST /auth/resend-otp            (resend)
    ↓
SaccoSelectionScreen
  → POST /organization/index         (list saccos)
    ↓
KYCScreen
  → POST /gender/index               (load gender options)
  → POST /identity-type/index        (load ID type options)
  → POST /client/create/basic/initial (submit form → get form_id)
    ↓
UploadIDScreen
  → POST /client/create/basic/final  (upload photos with form_id)
    ↓
PINEntryScreen
  → POST /auth/change-default-pin    (set new PIN)
```

---

### 1.1 — Check Phone & Send OTP

**Curl to verify:**
```bash
# Step 1: Check associated orgs
curl -s http://app.finovateltd.com:8081/api/auth/get-associated-orgs \
  -X POST \
  -F "phone=0716735875" \
  -F "notYetJoined=true" \
  | python3 -m json.tool

# Step 2: Trigger OTP
curl -s http://app.finovateltd.com:8081/api/auth/activate \
  -X POST \
  -F "phone=0716735875" \
  | python3 -m json.tool
```

**Real response — get-associated-orgs:**
```json
{
  "status": 1,
  "message": "Success",
  "data": [
    {
      "id": 89,
      "name": "Simple Credit MFI",
      "isSacco": false,
      "website": null,
      "logo": "",
      "org_id": 89,
      "username": "",
      "firstName": "",
      "lastName": "",
      "phone": "0716735875",
      "nationalIdentity": "",
      "memberNumber": "",
      "isFullyRegistered": "",
      "isPartiallyRegistered": ""
    }
  ]
}
```

**Real response — activate:**
```json
{
  "status": 1,
  "message": "Success",
  "data": { "phone": "0716735875" }
}
```

**App consumption:**
- If `data` array is non-empty → user exists, proceed to OTP
- If `data` is empty → new user, still proceed to OTP (they'll register)
- `isSacco` flag tells you if the org is a SACCO or MFI — can use for display
- Immediately call `/auth/activate` after `/get-associated-orgs` succeeds

---

### 1.2 — Verify OTP

**Curl to verify:**
```bash
curl -s http://app.finovateltd.com:8081/api/auth/verify-code \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"token": "123456"}' \
  | python3 -m json.tool

# Resend:
curl -s http://app.finovateltd.com:8081/api/auth/resend-otp \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username": "0716735875"}' \
  | python3 -m json.tool
```

**App consumption:**
- The OTP is a 6-digit code sent to the phone
- `token` field is the 6-digit string the user enters
- On success → navigate to `SaccoSelectionScreen`

---

### 1.3 — Load SACCOs

**Curl to verify:**
```bash
curl -s http://app.finovateltd.com:8081/api/organization/index \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"limit": 50}' \
  | python3 -m json.tool
```

**Real response:**
```json
{
  "status": 1,
  "message": "Success",
  "data": [
    { "id": 12, "name": "Finovate Finance", "isSacco": true, "logo": "https://..." },
    { "id": 89, "name": "Simple Credit MFI", "isSacco": false, "logo": "" },
    { "id": 92, "name": "Saamaya Finance", "isSacco": false, "logo": "" },
    { "id": 93, "name": "John John", "isSacco": false, "logo": "" }
  ]
}
```

**App consumption:**
- Render each `name` as a selectable item
- Load `logo` as image if non-empty
- Store the selected `id` as `org_id` — needed for login and KYC

---

### 1.4 — KYC Reference Data (load before rendering form)

**Curl to verify:**
```bash
# Gender options
curl -s http://app.finovateltd.com:8081/api/gender/index \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"org_id": "12"}' \
  | python3 -m json.tool

# ID types (no auth needed)
curl -s http://app.finovateltd.com:8081/api/identity-type/index \
  -X POST \
  -H "Content-Type: application/json" \
  | python3 -m json.tool
```

**Real response — gender:**
```json
{
  "status": 1,
  "message": "Success",
  "data": [
    { "id": 39, "name": "Other" },
    { "id": 38, "name": "Female" },
    { "id": 37, "name": "Male" }
  ]
}
```

**Real response — identity-type:**
```json
{
  "status": 1,
  "message": "Success",
  "data": [
    { "id": 1, "name": "National ID" },
    { "id": 2, "name": "Passport No." },
    { "id": 3, "name": "Military ID" },
    { "id": 4, "name": "Alien ID" }
  ]
}
```

**App consumption:**
- Fetch both in parallel on `KYCScreen` mount using `Promise.all`
- Store `id` of selected gender/ID type — not the name string — send the numeric `id` to the API

---

### 1.5 — Submit KYC (Basic Initial)

**Curl to verify:**
```bash
curl -s http://app.finovateltd.com:8081/api/client/create/basic/initial \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -F "first_name=John" \
  -F "middle_name=Kamau" \
  -F "last_name=Doe" \
  -F "phone=0712345678" \
  -F "national_identity=12345678" \
  -F "dob=25-12-1990" \
  -F "gender=37" \
  -F "org_id=12" \
  | python3 -m json.tool
```

**App consumption:**
- `dob` format is `DD-MM-YYYY` — convert from date picker value
- `gender` is the numeric ID from gender list
- Response `data.form_id` is passed to the next step (ID upload)

---

### 1.6 — Upload ID Photos (Basic Final)

**Curl to verify:**
```bash
curl -s http://app.finovateltd.com:8081/api/client/create/basic/final \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -F "form_id=123" \
  -F "tax_pin=A123456789B" \
  -F "email=john@example.com" \
  -F "id_front_photo=@/tmp/front.jpg" \
  -F "id_back_photo=@/tmp/back.jpg" \
  | python3 -m json.tool
```

**App consumption:**
- Use `react-native-image-picker` or `expo-image-picker` to get local file URI
- Send as `multipart/form-data` — use `FormData` in React Native
- `form_id` comes from step 1.5 response

---

## Module 2: Authentication

### Consumption Flow

```
LoginLandingScreen
  → navigate to LoginPINScreen
    ↓
LoginPINScreen
  → POST /auth/login   (with org_id)
  → store token in AsyncStorage
  → navigate to Dashboard
```

---

### 2.1 — Login

**Curl to verify:**
```bash
curl -s http://app.finovateltd.com:8081/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username": "moses", "password": "1234", "org_id": 12}' \
  | python3 -m json.tool
```

**Real response:**
```json
{
  "status": 1,
  "message": "Login Success",
  "data": {
    "token": "eyJ0eXAiOiJKV1Qi...",
    "last_login": "2026-03-01 18:11:35",
    "securityQuestionsSet": true,
    "is_first_login": false,
    "changePassword": false,
    "is_group": false,
    "isSacco": true,
    "user": {
      "name": "Jacktone Orikoh",
      "username": "moses",
      "firstname": "Jacktone",
      "lastname": "Orikoh",
      "dob": "1985-01-06",
      "idNumber": "234367743",
      "genderId": 37,
      "phone": "0716735875",
      "email": "damaris@gmail.com",
      "org_id": 12,
      "client_id": 110
    },
    "member_groups": []
  }
}
```

**App consumption:**
- Store `data.token` in `AsyncStorage` under key `@finovate_token`
- Store `data.user` for profile display
- Store `data.user.org_id` — needed for future calls
- Check `data.changePassword` — if `true`, redirect to change PIN screen
- Check `data.is_first_login` — if `true`, may need to show welcome flow

---

### 2.2 — Reset PIN (Forgot PIN)

**Curl to verify:**
```bash
curl -s http://app.finovateltd.com:8081/api/auth/reset-pin \
  -X POST \
  -F "resetOption=NATIONAL_ID" \
  -F "identifierNumber=12345678" \
  -F "selfiePhoto=@/tmp/selfie.jpg" \
  | python3 -m json.tool
```

---

## Module 3: Dashboard

### Consumption Flow

```
DashboardScreen (on mount)
  → Promise.all([
      POST /client/details,
      POST /client/accounts,
    ])
  → For first account in list:
      POST /client/mini-statement   (uses accountId + productId from accounts)
```

---

### 3.1 — Client Details

**Curl to verify:**
```bash
curl -s http://app.finovateltd.com:8081/api/client/details \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  | python3 -m json.tool
```

**Real response shape:**
```json
{
  "status": 1,
  "message": "Success",
  "data": {
    "personalInfo": {
      "memberNumber": "MOM110",
      "email": "orikoh@gmail.com",
      "phone": "0716735875",
      "kraPin": "A0098456",
      "idFrontUrl": "https://...",
      "idBackUrl": "https://...",
      "facePhotoUrl": "https://...",
      "passportPhotoUrl": "https://..."
    },
    "identification": {
      "fullName": "Jacktone Orikoh",
      "idNumber": "234367743",
      "gender": "Male",
      "dob": "1985-01-06"
    },
    "bankInfo": [...],
    "nextOfKin": [...],
    "workInfo": [...],
    "residenceInfo": { ... }
  }
}
```

**App consumption:**
- `data.identification.fullName` → `DashboardHeader` greeting ("Hello, Jacktone")
- `data.personalInfo.facePhotoUrl` → profile avatar
- `data.personalInfo.memberNumber` → member ID display

---

### 3.2 — Client Accounts

**Curl to verify:**
```bash
curl -s http://app.finovateltd.com:8081/api/client/accounts \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  | python3 -m json.tool
```

**Real response shape:**
```json
{
  "status": 1,
  "message": "Success",
  "data": [
    {
      "product": "FOSA",
      "isShare": 0,
      "productId": 33,
      "accountId": 354,
      "accountNumber": "206200012628",
      "accountName": "PRIME ACCOUNT",
      "defaultCurrency": "KES",
      "dateOpened": "01-07-2021",
      "currentBalance": "5,464,478.00",
      "availableBalance": "5,464,478.00",
      "lastAmountTransacted": "10,000.00",
      "lastSavingDate": "26-06-2025"
    },
    {
      "accountName": "SHARE CAPITAL 2",
      "shareCapital": 28027,
      "dividend": 0,
      "product": "SHARE",
      "productId": 38,
      "accountId": 1,
      "isShare": 1
    }
  ]
}
```

**App consumption:**
- Filter `isShare === 0` for savings accounts to display in `AccountCarousel`
- Filter `isShare === 1` for shares accounts (show separately)
- `currentBalance` is a **string with commas** — parse with:
  ```typescript
  const balance = parseFloat(account.currentBalance.replace(/,/g, ''))
  ```
- Store `accountId` + `productId` pair for each account — used in nearly every subsequent call
- The first `isShare === 0` account's `accountId` + `productId` → use for mini-statement

---

### 3.3 — Mini Statement (Recent Transactions)

**Curl to verify:**
```bash
curl -s http://app.finovateltd.com:8081/api/client/mini-statement \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"accountId": 354, "productId": 33}' \
  | python3 -m json.tool
```

**Real response shape:**
```json
{
  "status": 1,
  "message": "Success",
  "data": [
    {
      "transactionDate": "26-06-2025",
      "account": "PRIME ACCOUNT",
      "transactionType": "Deposit",
      "entryType": "CREDIT",
      "amount": "KES 10,000"
    },
    {
      "transactionDate": "26-06-2025",
      "account": "PRIME ACCOUNT",
      "transactionType": "Withdrawal",
      "entryType": "DEBIT",
      "amount": "KES 500"
    }
  ]
}
```

**App consumption:**
- `entryType` is `"CREDIT"` or `"DEBIT"` — use for +/- colour coding
- Parse amount: `"KES 10,000"` → `parseFloat("10,000".replace(/,/g, ''))` → `10000`
- `transactionType` is a human-readable string — display as-is
- Colour: `CREDIT` → green, `DEBIT` → red

---

### 3.4 — Balance Inquiry (refresh/pull-to-refresh)

**Curl to verify:**
```bash
curl -s http://app.finovateltd.com:8081/api/client/balance-inquiry \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"accountId": 354, "productId": 33}' \
  | python3 -m json.tool
```

**Real response shape:**
```json
{
  "status": 1,
  "message": "Success",
  "data": {
    "availableBalance": "5,464,478.00",
    "currentBalance": "5,464,478.00"
  }
}
```

**App consumption:**
- Call per-account when user swipes to a different card in `AccountCarousel`
- Both values are strings with commas — parse as above

---

## Module 4: Transactions

### Consumption Flow

```
QuickActions → user taps "Deposit"
  MakeDepositScreen (on mount)
    → POST /service-provider/index   (load M-Pesa, Airtel list)
    → user fills amount + provider phone
    → POST /payment-deposit
```

---

### 4.1 — Service Providers (load on mount of any transaction screen)

**Curl to verify:**
```bash
curl -s http://app.finovateltd.com:8081/api/service-provider/index \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  | python3 -m json.tool
```

**Real response:**
```json
{
  "status": 1,
  "message": "Success",
  "data": [
    { "id": 19, "name": "MPESA",  "code": "SAF",    "logoUrl": "https://..." },
    { "id": 20, "name": "AIRTEL MONEY", "code": "AIRTEL", "logoUrl": "https://..." },
    { "id": 21, "name": "T-KASH", "code": "TELCOM", "logoUrl": "https://..." }
  ]
}
```

**App consumption:**
- Render as a horizontal pill/chip selector
- Load `logoUrl` as provider logo image
- Store selected provider's `id` as `providerId` for deposit/withdrawal calls

---

### 4.2 — Deposit

**Curl to verify:**
```bash
curl -s http://app.finovateltd.com:8081/api/payment-deposit \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"accountId": 354, "amount": 500, "providerId": 19, "providerPhone": "0716735875"}' \
  | python3 -m json.tool
```

**App consumption:**
- `accountId` → from selected account in carousel
- `providerId` → from selected service provider (19 = M-Pesa)
- `providerPhone` → user-entered phone number (the M-Pesa registered number)
- Success triggers STK push on user's phone — show "Check your phone" confirmation UI
- This is a **fire and done** call (no preview/commit needed)

---

### 4.3 — Withdrawal

**Curl to verify:**
```bash
curl -s http://app.finovateltd.com:8081/api/saving-account-withdrawal \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"accountId": 354, "amount": 500, "providerId": 19, "providerPhone": "0716735875"}' \
  | python3 -m json.tool
```

---

### 4.4 — Send Money via PesaLink

**Curl to verify:**
```bash
curl -s http://app.finovateltd.com:8081/api/saving-account-withdrawal/pesalink-to-phone \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"accountId": 354, "amount": 50, "recipientPhone": "0716735875", "recipientName": "Jacktone"}' \
  | python3 -m json.tool
```

---

### 4.5 — Internal Transfer (Preview → Commit)

**Curl to verify:**
```bash
# Step 1: Preview
curl -s http://app.finovateltd.com:8081/api/internal-transfer/preview \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "fromAccountId": 354, "toAccountId": 273, "transferType": "SELF"}' \
  | python3 -m json.tool

# Step 2: Commit (use formId from preview response)
curl -s http://app.finovateltd.com:8081/api/internal-transfer/commit \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"formId": 12}' \
  | python3 -m json.tool
```

**Confirmed values for `transferType`:**
- `"SELF"` — transfer between your own accounts (requires `toAccountId`)
- `"Other"` — transfer to another member (requires `accountNumber` — their account number string)

**App consumption:**
- For SELF transfer: show a dropdown of user's own accounts (from `/client/accounts`) as "To Account"
- For Other transfer: show a text input for their account number
- Preview → show charges + formId → user confirms → commit

---

## Module 5: Statements

### Consumption Flow

```
StatementOptionsScreen
  → POST /account-statement/index   (loads paginated transaction list)
  → "Download" button →
StatementFormScreen
  → user picks date range + email
  → POST /client/full-statement-preview
  → POST /client/full-statement-generate
```

---

### 5.1 — Account Statement

**Curl to verify:**
```bash
curl -s http://app.finovateltd.com:8081/api/account-statement/index \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -F "accountId=354" \
  -F "productId=33" \
  | python3 -m json.tool
```

**Real response:**
```json
{
  "status": 1,
  "message": "Success",
  "data": {
    "transactions": []
  }
}
```

**App consumption:**
- `data.transactions` is the array of transaction records
- Handle empty array gracefully — show "No transactions" state

---

### 5.2 — Full Statement (Preview → Generate)

> ⚠️ **Known server bug:** `full-statement-preview` returns a 500 error (`mkdir(): Permission denied`) on the test server. This is a backend filesystem permissions issue. Report to API team. Implement the call anyway — it will work once fixed.

**Curl to verify (when fixed):**
```bash
# Preview
curl -s http://app.finovateltd.com:8081/api/client/full-statement-preview \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"accountId": 354, "from": "2025-01-01", "to": "2025-12-31", "recipientEmail": "john@example.com"}' \
  | python3 -m json.tool

# Generate
curl -s http://app.finovateltd.com:8081/api/client/full-statement-generate \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"formId": 99}' \
  | python3 -m json.tool
```

---

## Module 6: Loans

### Consumption Flow

```
LoansScreen (on mount)
  → Promise.all([
      POST /loan/products,       (list with hasActiveLoan per product)
      POST /loan/active-loans,   (current active loans)
      POST /client/loan-accounts
    ])

  → User taps "Apply" on a product →
LoanApplicationScreen
  → POST /loan/calculator   (live calculation as user types)
  → POST /loan/application-preview   (on submit → get formId)
    ↓
LoanConfirmationScreen
  → POST /loan/application-commit   (user confirms)
    ↓
LoanSuccessScreen

  → User taps "Repay" →
LoanRepaymentScreen
  → POST /loan/repayment-preview   (get formId + charges)
  → POST /loan/repayment-commit    (confirm)
```

---

### 6.1 — Loan Products

**Curl to verify:**
```bash
curl -s http://app.finovateltd.com:8081/api/loan/products \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  | python3 -m json.tool
```

**Real response shape (one item):**
```json
{
  "productId": 85,
  "code": "NN",
  "name": "NANO LOAN",
  "imageUrl": null,
  "limit": "KES 100,000",
  "canTopUp": false,
  "mustBeGuarateed": false,
  "minAmount": "KES 1,000.00",
  "maxAmount": "KES 100,000.00",
  "interestRate": "20.00% Per YEAR(S)",
  "maxRepaymentPeriod": "2 MONTH(S)",
  "calculationMethod": "Fixed Method",
  "penaltyRate": "5.00% Per MONTH(S)",
  "hasActiveLoan": false,
  "borrowedAmount": 0,
  "availableBalance": "KES 100000",
  "date": "01-03-2026",
  "activeLoan": null,
  "canApply": true,
  "canRepay": false,
  "showHistory": true
}
```

**App consumption:**
- `hasActiveLoan` → show/hide "Repay" vs "Apply" button per product
- `canApply` → enable/disable Apply button
- `activeLoan` object → show outstanding balance when not null
- `maxRepaymentPeriod` is a string like `"2 MONTH(S)"` — parse the number for the repayment period slider/picker max
- `interestRate`, `penaltyRate`, `calculationMethod` → display in loan product detail card

---

### 6.2 — Loan Calculator

**Curl to verify:**
```bash
curl -s http://app.finovateltd.com:8081/api/loan/calculator \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId": 85, "amount": 10000, "repaymentPeriod": 2}' \
  | python3 -m json.tool
```

**Real response:**
```json
{
  "status": 1,
  "message": "Success",
  "data": {
    "principalAmount": "10,000.00",
    "interestAmount": "333.33",
    "totalLoanAmount": "10,333.33",
    "installmentAmount": "5,166.67",
    "installmentCount": 2,
    "currency": "KES"
  }
}
```

**App consumption:**
- Call on every amount/period change (debounce 500ms)
- `repaymentPeriod` is an integer number of months
- Display `installmentAmount` × `installmentCount` as the repayment breakdown
- All amounts are strings with commas — parse before displaying formatted values

---

### 6.3 — Loan Application (Preview → Commit)

**Curl to verify:**
```bash
# Preview
curl -s http://app.finovateltd.com:8081/api/loan/application-preview \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 85,
    "amount": 5000,
    "depositAccountId": 354,
    "applicationReason": "School fees"
  }' \
  | python3 -m json.tool

# Commit
curl -s http://app.finovateltd.com:8081/api/loan/application-commit \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"formId": 10}' \
  | python3 -m json.tool
```

**Real preview response:**
```json
{
  "status": 1,
  "message": "Preview",
  "data": {
    "formId": 10,
    "charges": "0.00",
    "exerciseDuty": 0
  }
}
```

**App consumption:**
- `depositAccountId` → the `accountId` of the savings account to receive the disbursement (user picks from their accounts list)
- Preview returns only `formId` + charges — supplement with calculator data for the confirmation screen display
- Pass `formId` via navigation params to `LoanConfirmationScreen`

---

### 6.4 — Active Loans

**Curl to verify:**
```bash
curl -s http://app.finovateltd.com:8081/api/loan/active-loans \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"pendingDisbursement": false}' \
  | python3 -m json.tool
```

**Real response shape (one item):**
```json
{
  "loanId": 434,
  "productId": 77,
  "canBeToppedUp": true,
  "name": "Instant Mobile Loan",
  "product": "Instant Mobile Loan",
  "imageUrl": "...",
  "mustBeGuarateed": false,
  "amountApplied": "KES 10,000.00",
  "amountDisbursed": "KES 10,000.00",
  "interestAmount": "KES 4,000.00",
  "penaltyAmount": "KES 0.00",
  "amountRepaid": "KES 0.00",
  "loanBalance": "KES 14,000.00",
  "applicationDate": "2025-04-04"
}
```

**App consumption:**
- `loanBalance` is string with currency prefix — parse as: `parseFloat("KES 14,000.00".replace("KES ", "").replace(/,/g, ''))`
- `loanId` is used for repayment preview
- `canBeToppedUp` → show/hide top-up option
- All amounts are strings — parse consistently

---

### 6.5 — Loan Repayment (Preview → Commit)

**Curl to verify:**
```bash
# Preview (from savings account)
curl -s http://app.finovateltd.com:8081/api/loan/repayment-preview \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"loanId": 434, "amount": 500, "accountId": 354, "payAll": false}' \
  | python3 -m json.tool

# Commit
curl -s http://app.finovateltd.com:8081/api/loan/repayment-commit \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"formId": 11}' \
  | python3 -m json.tool
```

**Real preview response:**
```json
{
  "status": 1,
  "message": "Preview",
  "data": {
    "formId": 11,
    "charges": 0,
    "exerciseDuty": 0
  }
}
```

**App consumption:**
- Offer two repayment sources: savings account or M-Pesa
- For savings: use `accountId` field
- For M-Pesa: use `providerId` + `providerPhone` (omit `accountId`)
- `payAll: true` settles the full outstanding balance

---

## Module 7: Loan History

### 7.1 — Loan Product Details (History)

**Curl to verify:**
```bash
curl -s http://app.finovateltd.com:8081/api/loan/product-details \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId": 85}' \
  | python3 -m json.tool
```

**Real response (returns history, not product spec):**
```json
{
  "status": 1,
  "message": "Success",
  "data": {
    "history": [
      {
        "loanId": 504,
        "productCode": "NN",
        "name": "NANO LOAN",
        "applicationDate": "2025-06-26",
        "amountApplied": "20,000.00",
        "amountApproved": "10,000.00",
        "amountDisbursed": "10,000.00",
        "disbursementDate": "2025-06-26",
        "amountRepaid": "10,333.33",
        "status": "CLOSED",
        "loanBalance": "0.00"
      }
    ]
  }
}
```

**App consumption:**
- This returns **loan history**, not product specs
- Use when `showHistory: true` on the product from `/loan/products`
- Display as a table of past loans for the selected product

---

### 7.2 — Loan Statement (per loan account)

**Curl to verify:**
```bash
curl -s http://app.finovateltd.com:8081/api/loan/statement \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"loanAccountId": 434}' \
  | python3 -m json.tool
```

**App consumption:**
- `loanAccountId` is from `/client/loan-accounts` response
- Renders a detailed repayment schedule / transaction history for a loan

---

## Appendix A — Re-usable TypeScript Parse Helpers

Document these utilities once and use them everywhere:

```typescript
// Balances come as "5,464,478.00" — parse to number
export const parseAmount = (value: string): number => {
  return parseFloat(value.replace(/,/g, '')) || 0
}

// Transaction amounts come as "KES 10,000" — strip currency prefix first
export const parseCurrencyAmount = (value: string): number => {
  const parts = value.split(' ')
  const numStr = parts.length > 1 ? parts[1] : parts[0]
  return parseFloat(numStr.replace(/,/g, '')) || 0
}

// Active loan balances come as "KES 14,000.00"
export const parseLoanBalance = (value: string): number => {
  return parseCurrencyAmount(value)
}
```

---

## Appendix B — API Response TypeScript Interfaces

```typescript
// Standard envelope
interface ApiResponse<T> {
  status: 0 | 1
  message: string
  data: T | null
}

// Auth — Login
interface LoginData {
  token: string
  last_login: string
  is_first_login: boolean
  changePassword: boolean
  isSacco: boolean
  user: {
    name: string
    username: string
    firstname: string
    lastname: string
    dob: string
    idNumber: string
    genderId: number
    phone: string
    email: string
    org_id: number
    client_id: number
  }
}

// Account
interface Account {
  product: string
  isShare: 0 | 1
  productId: number
  accountId: number
  accountNumber: string
  accountName: string
  defaultCurrency: string
  currentBalance: string   // "5,464,478.00" — parse with parseAmount()
  availableBalance: string
  lastAmountTransacted: string
  lastSavingDate: string | null
  dateOpened: string
}

// Transaction (mini-statement)
interface Transaction {
  transactionDate: string   // "26-06-2025"
  account: string
  transactionType: string
  entryType: 'CREDIT' | 'DEBIT'
  amount: string            // "KES 10,000" — parse with parseCurrencyAmount()
}

// Loan Product
interface LoanProduct {
  productId: number
  code: string
  name: string
  imageUrl: string | null
  minAmount: string         // "KES 1,000.00"
  maxAmount: string         // "KES 100,000.00"
  interestRate: string      // "20.00% Per YEAR(S)"
  maxRepaymentPeriod: string // "2 MONTH(S)"
  hasActiveLoan: boolean
  canApply: boolean
  canRepay: boolean
  canTopUp: boolean
  activeLoan: ActiveLoan | null
}

// Active Loan
interface ActiveLoan {
  loanId: number
  productId: number
  name: string
  amountApplied: string   // "KES 10,000.00"
  amountDisbursed: string
  loanBalance: string     // "KES 14,000.00"
  canBeToppedUp: boolean
}

// Service Provider
interface ServiceProvider {
  id: number
  name: string
  code: string
  logoUrl: string
}

// Organisation
interface Organisation {
  id: number
  name: string
  isSacco: boolean
  logo: string
}
```

---

## Appendix C — Quick Curl Reference (Copy-Paste)

Save and source this file to set up your test environment instantly:

```bash
#!/bin/bash
# finovate_curl_env.sh
# Usage: source finovate_curl_env.sh

BASE="http://app.finovateltd.com:8081/api"

RESPONSE=$(curl -s $BASE/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username": "moses", "password": "1234", "org_id": 12}')

TOKEN=$(echo $RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['token'])")

echo "✓ Token set (expires in 24h)"
echo "  Use: curl -H \"Authorization: Bearer \$TOKEN\" ..."

# Helper function
api() {
  curl -s "$BASE/$1" \
    -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    "${@:2}" \
    | python3 -m json.tool
}

# Usage examples:
# api client/accounts
# api client/mini-statement -d '{"accountId": 354, "productId": 33}'
# api loan/products
# api loan/calculator -d '{"productId": 85, "amount": 10000, "repaymentPeriod": 2}'
```
