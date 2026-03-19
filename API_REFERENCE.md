# Finovate API Reference

**Base URL:** `http://app.finovateltd.com:8081/api`

## Global Rules

- Every request is `POST` — no exceptions, including data fetching
- Auth endpoints use `multipart/form-data`
- All other endpoints use `Content-Type: application/json`
- Every authenticated endpoint requires the header:
  ```
  Authorization: Bearer <jwt_token>
  ```
- The JWT token is obtained from the login response and must be stored locally (AsyncStorage) after login
- Logout is client-side only — just clear the stored token

---

## The Preview → Commit Pattern

Several transactional endpoints (transfers, loan applications, statements) use a two-step pattern:

1. Call the **preview** endpoint with full details → server validates and returns a `form_id` (or `formId`) plus a summary of what will happen
2. Show the user a confirmation screen with the summary
3. On confirm, call the **commit** endpoint with just the `form_id` → server executes the transaction

This means **never execute a transaction in one call**. Always preview first.

---

## 1. Onboarding

### 1.1 Check Associated Organisations
Used on `LookupScreen` to verify if the phone number has any registered SACCO accounts.

```
POST /auth/get-associated-orgs
Content-Type: multipart/form-data

phone         string  e.g. "0723686428"
notYetJoined  string  "true" (send this always on lookup)
```

**When to call:** When user submits the Lookup form (before triggering OTP).
**Expected response:** List of organisations associated with this phone, or empty if new user.

---

### 1.2 Trigger OTP (App Activation)
Sends an OTP SMS to the phone number.

```
POST /auth/activate
Content-Type: multipart/form-data

phone  string  e.g. "0716735875"
```

**When to call:** Immediately after `get-associated-orgs` succeeds on `LookupScreen`, before navigating to `OTPVerificationScreen`.

---

### 1.3 Verify OTP Code
Verifies the 6-digit OTP the user entered.

```
POST /auth/verify-code
Content-Type: application/json

{
  "token": "123456"
}
```

**When to call:** On `OTPVerificationScreen` when user taps "Verify".
**On success:** Navigate to `SaccoSelection`.

---

### 1.4 Resend OTP
Re-sends the OTP to the same phone number.

```
POST /auth/resend-otp
Content-Type: application/json

{
  "username": "0716735875"
}
```

**When to call:** On `OTPVerificationScreen` when the timer expires and user taps "Resend Code".

---

### 1.5 Get Organisations List
Fetches the list of SACCOs to display in the picker.

```
POST /organization/index
Authorization: Bearer <token>
Content-Type: application/json

{
  "limit": 50
}
```

**When to call:** On `SaccoSelectionScreen` on mount.
**Expected response:** Array of organisations with `id`, `name`, and other metadata.

---

### 1.6 Create Client — Basic Info (Initial)
First step of KYC. Creates the member record with personal info.

```
POST /client/create/basic/initial
Authorization: Bearer <token>
Content-Type: multipart/form-data

first_name          string   e.g. "John"
middle_name         string   e.g. "Kamau"
last_name           string   e.g. "Doe"
phone               string   e.g. "0716735875"
national_identity   string   e.g. "12345678"
dob                 string   e.g. "25-12-1990"  (DD-MM-YYYY)
gender              number   gender ID from /gender/index
org_id              number   organisation ID from /organization/index
```

**When to call:** On `KYCScreen` when user submits the form.
**Returns:** A `form_id` needed for the next step.

---

### 1.7 Create Client — Basic Info (Final / ID Upload)
Second KYC step. Uploads ID photos and additional info.

```
POST /client/create/basic/final
Authorization: Bearer <token>
Content-Type: multipart/form-data

form_id         number   from step 1.6 response
tax_pin         string   e.g. "A123456789B"
email           string   e.g. "john@example.com"
id_front_photo  file     front image of national ID
id_back_photo   file     back image of national ID
```

**When to call:** On `UploadIDScreen` when user submits.
**On success:** Navigate to `PINEntryScreen`.

---

### 1.8 Validate Default PIN
Checks the system-generated default PIN before allowing the user to change it.

```
POST /auth/validate-default-pin
Content-Type: multipart/form-data

username    string   phone number used during registration
defaultPin  string   the default PIN sent via SMS
```

**When to call:** On `PINEntryScreen` before showing the "set new PIN" form (if the flow requires validating old PIN first).

---

### 1.9 Change Default PIN (Set New PIN)
Sets the user's permanent PIN.

```
POST /auth/change-default-pin
Content-Type: application/json

{
  "username": "0716735875",
  "password": "1234",
  "confirm":  "1234"
}
```

**When to call:** On `PINEntryScreen` when user confirms their new PIN.
**On success:** Navigate to the main app (Dashboard).

---

### 1.10 Gender List
Reference data for the gender dropdown in KYC.

```
POST /gender/index
Authorization: Bearer <token>
Content-Type: application/json

{
  "org_id": "12"
}
```

**When to call:** On `KYCScreen` mount to populate the gender picker.
**Expected response:** Array of `{ id, name }` objects.

---

### 1.11 Identity Types
Reference data for ID type picker in KYC.

```
POST /identity-type/index
Content-Type: application/json
(no body required)
```

**When to call:** On `KYCScreen` mount if showing an ID type selector.

---

### 1.12 Residence Types
Reference data for residence type dropdown.

```
POST /residence-types/index
Authorization: Bearer <token>
Content-Type: application/json
(no body required)
```

**When to call:** If collecting residence info during onboarding.

---

### 1.13 Create Client — Residence Info
Saves the member's residence details.

```
POST /client/create/residence-info
Authorization: Bearer <token>
Content-Type: multipart/form-data

estate_name     string   e.g. "Chiromo"
residency_type  number   ID from /residence-types/index
```

---

## 2. Authentication

### 2.1 Login
Authenticates the user with their PIN.

```
POST /auth/login
Content-Type: application/json

{
  "username": "0716735875",
  "password": "1234"
}
```

**When to call:** On `LoginPINScreen` when user submits their PIN.
**Expected response:**
```json
{
  "token": "eyJ0eXAiOiJKV1Qi...",
  "name":  "John Doe",
  "uid":   40
}
```
Store the token in AsyncStorage. All subsequent calls use this token.

---

### 2.2 Verify User (Re-authenticate)
Re-verifies the current user's PIN before sensitive actions (e.g. before a transfer confirmation).

```
POST /auth/verify-user
Authorization: Bearer <token>
Content-Type: multipart/form-data

password  string   current PIN
```

**When to call:** As a security gate before committing high-value transactions.

---

### 2.3 Change Password / PIN
Changes the user's PIN while logged in.

```
POST /auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "old_password": "1234",
  "new_password": "5678"
}
```

---

### 2.4 Reset PIN (Forgot PIN)
Initiates a PIN reset for locked-out users.

```
POST /auth/reset-pin
Content-Type: multipart/form-data

resetOption        string   method of verification (e.g. "NATIONAL_ID")
identifierNumber   string   ID number or phone
selfiePhoto        file     selfie for identity verification
```

**When to call:** On "Forgot PIN" flow from `LoginPINScreen`.

---

## 3. Dashboard

### 3.1 Client Details
Fetches the logged-in user's profile information.

```
POST /client/details
Authorization: Bearer <token>
Content-Type: application/json
(no body required)
```

**When to call:** On `DashboardScreen` mount. Use the response to populate the user's name and avatar in `DashboardHeader`.

**Expected response shape:**
```json
{
  "name":         "John Doe",
  "email":        "john@example.com",
  "phone":        "0716735875",
  "member_no":    "MBR001",
  "photo_url":    "https://..."
}
```

---

### 3.2 Client Accounts
Returns all saving/FOSA accounts belonging to the logged-in member.

```
POST /client/accounts
Authorization: Bearer <token>
Content-Type: application/json
(no body required)
```

**When to call:** On `DashboardScreen` mount. Feed into `AccountCarousel`.

**Expected response shape:**
```json
[
  {
    "accountId":        366,
    "productId":        48,
    "accountName":      "FOSA",
    "accountNumber":    "01000023647586",
    "availableBalance": 12500.00,
    "actualBalance":    28000.00
  }
]
```

> **Important:** Store `accountId` and `productId` from this response. They are required for balance inquiries, mini-statements, deposits, and withdrawals.

---

### 3.3 Balance Inquiry
Returns the live balance for a specific account.

```
POST /client/balance-inquiry
Authorization: Bearer <token>
Content-Type: multipart/form-data

accountId   number   from /client/accounts response
productId   number   from /client/accounts response
```

**When to call:** When user taps an account card to refresh the balance, or on pull-to-refresh.

---

### 3.4 Mini Statement (Recent Transactions)
Returns the last N transactions for an account.

```
POST /client/mini-statement
Authorization: Bearer <token>
Content-Type: application/json

{
  "accountId": 366,
  "productId": 48
}
```

**When to call:** On `DashboardScreen` mount to populate `RecentTransactions`. Use `accountId` + `productId` from the `/client/accounts` response.

---

### 3.5 Loan Accounts
Returns all loan accounts for the logged-in member.

```
POST /client/loan-accounts
Authorization: Bearer <token>
Content-Type: application/json
(no body required)
```

**When to call:** On `LoansScreen` mount.

---

### 3.6 Update Profile Photo / Email
Updates the user's profile picture and/or email address.

```
POST /client/update/basic
Authorization: Bearer <token>
Content-Type: multipart/form-data

selfie_photo   file     new profile photo
newEmail       string   new email address
```

---

## 4. Transactions

### 4.1 Get Service Providers
Returns the list of payment providers (M-Pesa, Airtel Money, etc.).

```
POST /service-provider/index
Authorization: Bearer <token>
Content-Type: application/json
(no body required)
```

**When to call:** Before showing any deposit or withdrawal screen. Needed to get the `providerId` for each provider.

**Expected response shape:**
```json
[
  { "id": 1, "name": "M-Pesa" },
  { "id": 2, "name": "Airtel Money" }
]
```

---

### 4.2 Deposit (via M-Pesa / Mobile Money)
Initiates a deposit from mobile money into a savings account. Triggers an STK push to the user's phone.

```
POST /payment-deposit
Authorization: Bearer <token>
Content-Type: application/json

{
  "accountId":    366,
  "amount":       20000,
  "providerId":   1,
  "providerPhone":"0716735875"
}
```

**When to call:** On `MakeDepositScreen` when user confirms deposit.
- `accountId` — from `/client/accounts`
- `providerId` — from `/service-provider/index`
- `providerPhone` — the M-Pesa registered phone (may differ from login phone)

---

### 4.3 Withdrawal (to M-Pesa / Mobile Money)
Withdraws from a savings account to mobile money.

```
POST /saving-account-withdrawal
Authorization: Bearer <token>
Content-Type: application/json

{
  "accountId":    366,
  "amount":       2000,
  "providerId":   1,
  "providerPhone":"0716735875"
}
```

---

### 4.4 Send Money via PesaLink (to Phone)
Transfers funds to another person via PesaLink using their phone number.

```
POST /saving-account-withdrawal/pesalink-to-phone
Authorization: Bearer <token>
Content-Type: application/json

{
  "accountId":      366,
  "amount":         50,
  "recipientPhone": "0716735875",
  "recipientName":  "Jacktone"
}
```

---

### 4.5 Buy Airtime
Purchases airtime from a savings account balance.

```
POST /saving-account-withdrawal/buy-airtime
Authorization: Bearer <token>
Content-Type: application/json

{
  "accountId":    366,
  "amount":       100,
  "providerId":   1,
  "providerPhone":"0716735875"
}
```

- `providerId` — the telco (e.g. Safaricom = 1)
- `providerPhone` — the number to top up

---

### 4.6 Internal Transfer — Preview
Previews a transfer between accounts (e.g. FOSA → Savings, or to another member).

```
POST /internal-transfer/preview
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount":        240,
  "fromAccountId": 366,
  "accountNumber": "01000023647587",
  "transferType":  "OTHER"
}
```

**transferType values:**
- `"OWN"` — transfer between your own accounts
- `"OTHER"` — transfer to another member's account

**Returns:** Preview summary + `form_id` for commit step.

---

### 4.7 Internal Transfer — Commit
Executes the internal transfer after user confirmation.

```
POST /internal-transfer/commit
Authorization: Bearer <token>
Content-Type: application/json

{
  "formId": 12
}
```

**When to call:** After user confirms on the transfer confirmation screen.

---

## 5. Statements

### 5.1 Account Statement (Summary)
Returns a paginated account statement.

```
POST /account-statement/index
Authorization: Bearer <token>
Content-Type: multipart/form-data

accountId   number   from /client/accounts
productId   number   from /client/accounts
```

**When to call:** On `StatementOptionsScreen` to show a summary of transactions.

---

### 5.2 Full Statement — Preview
Previews the date-ranged statement generation and returns a `form_id`.

```
POST /client/full-statement-preview
Authorization: Bearer <token>
Content-Type: application/json

{
  "accountId":      366,
  "from":           "2024-01-01",
  "to":             "2024-12-31",
  "recipientEmail": "john@example.com"
}
```

**When to call:** On `StatementFormScreen` when user sets date range and taps "Generate".
**Returns:** Preview of what will be generated + `form_id`.

---

### 5.3 Full Statement — Generate (Commit)
Triggers the actual statement generation and email delivery.

```
POST /client/full-statement-generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "formId": 99
}
```

**When to call:** After user confirms statement details on `StatementFormScreen`.

---

## 6. Loans

### 6.1 Loan Products
Returns available loan products for the member's SACCO.

```
POST /loan/products
Authorization: Bearer <token>
Content-Type: application/json
(no body required)
```

**When to call:** On `LoansScreen` mount to populate `LoanProducts` component.

**Expected response shape:**
```json
[
  {
    "id":       1,
    "name":     "School Fee Loan",
    "maxAmount": 75000,
    "minAmount": 1000
  }
]
```

---

### 6.2 Loan Calculator
Calculates repayment schedule for a given loan.

```
POST /loan/calculator
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId":       1,
  "amount":          20000,
  "repaymentPeriod": 3
}
```

**When to call:** On `LoanApplicationScreen` as the user types the amount or changes the repayment period (debounced). Show the results so the user can see their monthly instalment before applying.

---

### 6.3 Active Loans
Returns the member's currently active loan(s).

```
POST /loan/active-loans
Authorization: Bearer <token>
Content-Type: application/json

{
  "pendingDisbursement": false
}
```

- Set `pendingDisbursement: true` to include loans approved but not yet disbursed.
**When to call:** On `LoansScreen` mount to populate `LoanCard`.

---

### 6.4 Loan Application — Preview
Validates and previews a loan application. Returns `form_id`.

```
POST /loan/application-preview
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId":        1,
  "amount":           20000,
  "depositAccountId": 366,
  "applicationReason":"School fees for my children"
}
```

- `depositAccountId` — the savings account the loan will be disbursed into (from `/client/accounts`)
- `applicationReason` — required text field the user must fill in

**Returns:** Loan summary + `form_id`.

---

### 6.5 Loan Application — Commit
Submits the loan application after user confirmation.

```
POST /loan/application-commit
Authorization: Bearer <token>
Content-Type: application/json

{
  "formId": 55
}
```

**When to call:** On `LoanConfirmationScreen` when user taps "Confirm".
**On success:** Navigate to `LoanSuccessScreen`.

---

### 6.6 Loan Statement
Returns the transaction history for a specific loan account.

```
POST /loan/statement
Authorization: Bearer <token>
Content-Type: application/json

{
  "loanAccountId": 504
}
```

**When to call:** From the loans screen when user taps "Statement".

---

### 6.7 Loan Repayment — Preview (from Savings Account)
Previews a loan repayment using the member's savings balance.

```
POST /loan/repayment-preview
Authorization: Bearer <token>
Content-Type: application/json

{
  "loanId":    504,
  "amount":    5000,
  "accountId": 366,
  "payAll":    false
}
```

- Set `payAll: true` to settle the full outstanding balance in one payment.

---

### 6.8 Loan Repayment — Preview (from Mobile Money)
Same as above but pays via M-Pesa instead of savings balance.

```
POST /loan/repayment-preview
Authorization: Bearer <token>
Content-Type: application/json

{
  "loanId":       504,
  "amount":       5000,
  "providerId":   1,
  "providerPhone":"0716735875",
  "payAll":       false
}
```

---

### 6.9 Loan Repayment — Commit
Executes the loan repayment after user confirmation.

```
POST /loan/repayment-commit
Authorization: Bearer <token>
Content-Type: application/json

{
  "formId": 77
}
```

**When to call:** On `LoanRepaymentScreen` confirmation step.

---

### 6.10 Loan Top-Up
Requests a top-up on an existing active loan.

```
POST /loan/top-up
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1,
  "amount":    10000
}
```

---

### 6.11 Loan Product Details
Returns the full details and terms for a single loan product.

```
POST /loan/product-details
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1
}
```

**When to call:** When user selects a loan product to view its terms before applying.

---

## 7. Guarantors

### 7.1 My Guarantors
Returns the list of people currently guaranteeing the member's loans.

```
POST /loan-guarantor/my-guarantors
Authorization: Bearer <token>
Content-Type: application/json
(no body required)
```

---

### 7.2 Loans I'm Guaranteeing
Returns loans where the logged-in member is acting as guarantor for others.

```
POST /loan-guarantor/loans-guaranteed
Authorization: Bearer <token>
Content-Type: application/json

{
  "isNew": false
}
```

- `isNew: true` — returns only pending requests that need a response.

---

### 7.3 Request Guarantor — Preview
Preview adding a guarantor to a loan application.

```
POST /loan-guarantor/request-preview
Authorization: Bearer <token>
Content-Type: application/json

{
  "memberNumber": "MBR001",
  "amount":       10000,
  "loanId":       504
}
```

---

### 7.4 Request Guarantor — Commit

```
POST /loan-guarantor/commit-request
Authorization: Bearer <token>
Content-Type: application/json

{
  "formId": 33
}
```

---

### 7.5 Respond to Guarantor Request
Accepts or rejects a request to guarantee someone else's loan.

```
POST /loan-guarantor/commission-request
Authorization: Bearer <token>
Content-Type: application/json

{
  "requestId":    22,
  "responseType": "ACCEPT",   // or "REJECT"
  "remarks":      "Happy to help"
}
```

---

### 7.6 Guarantor Response Types
Reference list of valid response type values.

```
POST /loan-guarantor/response-type
Authorization: Bearer <token>
Content-Type: application/json
(no body required)
```

---

## 8. Profile & Supplementary Info

### 8.1 Client Personal Info
Returns the member's full personal profile.

```
POST /client/personal-info
Authorization: Bearer <token>
Content-Type: application/json
(no body required)
```

---

### 8.2 Client Work Info
Returns employment details on file.

```
POST /client/work-info
Authorization: Bearer <token>
Content-Type: application/json
(no body required)
```

---

### 8.3 Client Bank Info
Returns linked bank accounts.

```
POST /client/bank-info
Authorization: Bearer <token>
Content-Type: application/json
(no body required)
```

---

### 8.4 Client Residence Info
Returns the member's saved address.

```
POST /client/residence-info
Authorization: Bearer <token>
Content-Type: application/json
(no body required)
```

---

### 8.5 Create Work Info
Saves employment details for the member.

```
POST /client/create/work-info
Authorization: Bearer <token>
Content-Type: multipart/form-data

employer_id         number   from /employer/index
employment_term_id  number   from /employment-terms/index
department          string   e.g. "ICT"
work_station        string   e.g. "Nairobi"
employment_id       string   staff/payroll number
```

---

### 8.6 Create Next of Kin
Saves the member's next of kin details.

```
POST /client/create/kin
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name":         "Jane Arasa",
  "relationship_id":   133,
  "phone":             "0716745676",
  "gender_id":         37,
  "national_identity": "3243954411",
  "allocation":        "1",
  "dob":               "25-12-1998",
  "email":             "jane@example.com"
}
```

- `relationship_id` — from `/relationship-types/index`
- `gender_id` — from `/gender/index`

---

### 8.7 Create Bank Account
Links an external bank account to the member profile.

```
POST /client/create/bank-accounts
Authorization: Bearer <token>
Content-Type: application/json

{
  "bank_id":              25,
  "branch_id":            26,
  "account_no":           "4588889-45",
  "account_name":         "JOHN DOE",
  "is_default_account":   1
}
```

- `bank_id` — from `/bank/index`
- `branch_id` — from `/bank-branch/index`

---

## 9. Reference Data Endpoints

These return lookup lists for populating dropdowns. Call them on screen mount.

| Endpoint | Used For | Auth Required |
|---|---|---|
| `POST /gender/index` | Gender picker in KYC | Yes |
| `POST /identity-type/index` | ID type picker in KYC | No |
| `POST /residence-types/index` | Residence type picker | Yes |
| `POST /relationship-types/index` | Next of kin relationship picker | Yes |
| `POST /employer/index` | Employer picker in work info | Yes |
| `POST /employment-terms/index` | Employment type picker | Yes |
| `POST /bank/index` | Bank picker for bank account linking | Yes |
| `POST /bank-branch/index` body: `{ "bank_id": 25 }` | Branch picker | Yes |
| `POST /organization-branch/index` | SACCO branch picker | Yes |
| `POST /service-provider/index` | M-Pesa / Airtel picker for transactions | Yes |

---

## 10. Client Requests & Complaints

### 10.1 My Requests
Lists all service requests submitted by the member.

```
POST /client-request/index
Authorization: Bearer <token>
Content-Type: application/json
(no body required)
```

---

### 10.2 ATM Card Request — Preview

```
POST /client-request/preview
Authorization: Bearer <token>
Content-Type: application/json

{
  "requestType":    "ATM_CARD",
  "branchId":       5,
  "accountNoToLink":"01000023647586",
  "isNew":          true
}
```

---

### 10.3 Cheque Book Request — Preview

```
POST /client-request/preview
Authorization: Bearer <token>
Content-Type: application/json

{
  "requestType":    "CHEQUE",
  "payee":          "John Doe",
  "collectionDate": "2024-03-15",
  "branchId":       5,
  "amount":         10000
}
```

---

### 10.4 Request — Commit

```
POST /client-request/commit
Authorization: Bearer <token>
Content-Type: application/json

{
  "formId": 88
}
```

---

### 10.5 Submit Complaint

```
POST /client-complaint/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject":     "Failed transaction",
  "branchId":    5,
  "description": "I deposited KES 5000 but my balance was not updated."
}
```

---

## 11. Shares (SACCO Shares Module)

### 11.1 Shares Request — Preview
Preview a share purchase/sale request.

```
POST /shares/request-preview
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipientMemberNumber": "MBR001",
  "numberOfShares":        100,
  "transactionType":       "PURCHASE"
}
```

---

### 11.2 Shares Request — Commit

```
POST /shares/commit-request
Authorization: Bearer <token>
Content-Type: application/json

{
  "numberOfShares":    100,
  "valuePerShare":     20,
  "currency":          "KES",
  "charges":           50,
  "exciseDuty":        8,
  "transactionType":   "PURCHASE",
  "fromAccountId":     366,
  "toClientId":        40,
  "transactionDate":   "2024-01-15",
  "transactionCode":   "TXN001",
  "orgId":             12,
  "fromClientId":      56
}
```

---

### 11.3 Member Lookup (by Phone)
Looks up a member by phone number (for shares transfer recipient).

```
POST /shares/member-lookup
Authorization: Bearer <token>
Content-Type: application/json

{
  "phoneNumber": "0716735875"
}
```

---

### 11.4 Member Lookup (by Member Number)

```
POST /shares/member-lookup
Authorization: Bearer <token>
Content-Type: application/json

{
  "memberNumber": "MBR001"
}
```

---

### 11.5 Transfer Shares

```
POST /shares/transfer
Authorization: Bearer <token>
Content-Type: application/json

{
  "accountId": 366,
  "amount":    2000
}
```

---

### 11.6 My Shares Requests

```
POST /shares/requests
Authorization: Bearer <token>
Content-Type: application/json
(no body required)
```

---

## Appendix: Screen → Endpoint Map

| Screen | Endpoints Called |
|---|---|
| `LookupScreen` | `/auth/get-associated-orgs`, `/auth/activate` |
| `OTPVerificationScreen` | `/auth/verify-code`, `/auth/resend-otp` |
| `SaccoSelectionScreen` | `/organization/index` |
| `KYCScreen` | `/gender/index`, `/identity-type/index`, `/client/create/basic/initial` |
| `UploadIDScreen` | `/client/create/basic/final` |
| `PINEntryScreen` | `/auth/validate-default-pin`, `/auth/change-default-pin` |
| `LoginPINScreen` | `/auth/login`, `/auth/reset-pin` |
| `DashboardScreen` | `/client/details`, `/client/accounts`, `/client/mini-statement` |
| `MakeDepositScreen` | `/service-provider/index`, `/payment-deposit` |
| `Withdrawal` | `/service-provider/index`, `/saving-account-withdrawal` |
| `SendMoney` | `/saving-account-withdrawal/pesalink-to-phone` |
| `BuyAirtime` | `/service-provider/index`, `/saving-account-withdrawal/buy-airtime` |
| `InternalTransfer` | `/internal-transfer/preview`, `/internal-transfer/commit` |
| `StatementOptionsScreen` | `/account-statement/index` |
| `StatementFormScreen` | `/client/full-statement-preview`, `/client/full-statement-generate` |
| `LoansScreen` | `/loan/products`, `/loan/active-loans`, `/client/loan-accounts` |
| `LoanApplicationScreen` | `/loan/calculator`, `/loan/application-preview` |
| `LoanConfirmationScreen` | `/loan/application-commit` |
| `LoanRepaymentScreen` | `/loan/repayment-preview`, `/loan/repayment-commit` |
