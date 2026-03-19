[
  {
    "endpoint": "Loan Repayment — Preview",
    "timestamp": "2026-03-18T15:13:00.260Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/loan/repayment-preview",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Y7imS0"
      },
      "body": {
        "loanId": 507,
        "amount": 0,
        "accountId": 1521,
        "payAll": false
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "853ms",
      "body": {
        "status": 0,
        "message": "original_amount:Original Amount must be greater than \\0\\.",
        "data": null
      }
    }
  },
  {
    "endpoint": "Loan Repayment — Preview",
    "timestamp": "2026-03-18T15:12:34.099Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/loan/repayment-preview",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Y7imS0"
      },
      "body": {
        "loanId": 507,
        "amount": 0,
        "accountId": 366,
        "payAll": false
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "700ms",
      "body": {
        "status": 0,
        "message": "accountId provided not linked to the member",
        "data": null
      }
    }
  },
  {
    "endpoint": "Loan Repayment — Preview",
    "timestamp": "2026-03-18T15:12:27.482Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/loan/repayment-preview",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Y7imS0"
      },
      "body": {
        "loanId": 507,
        "amount": 5000,
        "accountId": 366,
        "payAll": false
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "691ms",
      "body": {
        "status": 0,
        "message": "Ýou cannot pay more than the loan balance of 0.0000",
        "data": null
      }
    }
  },
  {
    "endpoint": "Active Loans",
    "timestamp": "2026-03-18T15:12:15.087Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/loan/active-loans",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Y7imS0"
      },
      "body": {
        "pendingDisbursement": false
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "659ms",
      "body": {
        "status": 1,
        "message": "Success",
        "data": [
          {
            "loanId": 507,
            "productId": 85,
            "canBeToppedUp": true,
            "name": "NANO LOAN",
            "product": "NANO LOAN",
            "imageUrl": null,
            "mustBeGuarateed": false,
            "amountApplied": "KES 20,000.00",
            "amountDisbursed": "KES 0.00",
            "interestAmount": "KES 0.00",
            "penaltyAmount": "KES 0.00",
            "amountRepaid": "KES 0.00",
            "lastAmountRepaid": "KES 0.00",
            "loanBalance": "KES 0.00",
            "applicationDate": "2026-03-18"
          }
        ]
      }
    }
  },
  {
    "endpoint": "Loan Repayment — Preview",
    "timestamp": "2026-03-18T15:12:03.658Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/loan/repayment-preview",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Y7imS0"
      },
      "body": {
        "loanId": 504,
        "amount": 5000,
        "accountId": 366,
        "payAll": false
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "1090ms",
      "body": {
        "status": 0,
        "message": "loanId provided not linked to the member",
        "data": null
      }
    }
  },
  {
    "endpoint": "Loan Application — Commit",
    "timestamp": "2026-03-18T15:11:42.567Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/loan/application-commit",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Y7imS0"
      },
      "body": {
        "formId": 21
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "1114ms",
      "body": {
        "status": 1,
        "message": "Application is successful",
        "data": {
          "transactionCode": "GVR6JB3A",
          "loanBalance": "0.0000",
          "defaultCurrency": "KES"
        }
      }
    }
  },
  {
    "endpoint": "Loan Application — Preview",
    "timestamp": "2026-03-18T15:11:18.960Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/loan/application-preview",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Y7imS0"
      },
      "body": {
        "productId": 85,
        "amount": 20000,
        "depositAccountId": 1521,
        "applicationReason": "School fees for my children"
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "949ms",
      "body": {
        "status": 1,
        "message": "Preview",
        "data": {
          "formId": 21,
          "charges": "0.00",
          "exerciseDuty": 0
        }
      }
    }
  },
  {
    "endpoint": "Client Accounts",
    "timestamp": "2026-03-18T15:10:59.071Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/client/accounts",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Y7imS0"
      },
      "body": {}
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "718ms",
      "body": {
        "status": 1,
        "message": "Success",
        "data": [
          {
            "product": "PRIME ACCOUNT",
            "isShare": 0,
            "productId": 1,
            "accountId": 1521,
            "accountNumber": "PR/451/M001",
            "accountName": "PRIME ACCOUNT",
            "defaultCurrency": "KES",
            "dateOpened": "18-03-2026",
            "currentBalance": "40,000.00",
            "availableBalance": "40,000.00",
            "lastAmountTransacted": "20,000.00",
            "lastSavingDate": "18-03-2026"
          },
          {
            "product": "ALPHA DEPOSIT",
            "isShare": 0,
            "productId": 58,
            "accountId": 1522,
            "accountNumber": "ALP237DP",
            "accountName": "ALPHA DEPOSIT",
            "defaultCurrency": "KES",
            "dateOpened": "18-03-2026",
            "currentBalance": "0.00",
            "availableBalance": "0.00",
            "lastAmountTransacted": "",
            "lastSavingDate": null
          },
          {
            "product": "HUDUMA",
            "isShare": 0,
            "productId": 70,
            "accountId": 1523,
            "accountNumber": "HGM173A/N",
            "accountName": "HUDUMA",
            "defaultCurrency": "KES",
            "dateOpened": "18-03-2026",
            "currentBalance": "0.00",
            "availableBalance": "0.00",
            "lastAmountTransacted": "",
            "lastSavingDate": null
          },
          {
            "product": "FIXED ACCOUNT",
            "isShare": 0,
            "productId": 71,
            "accountId": 1524,
            "accountNumber": "136",
            "accountName": "FIXED ACCOUNT",
            "defaultCurrency": "KES",
            "dateOpened": "18-03-2026",
            "currentBalance": "0.00",
            "availableBalance": "0.00",
            "lastAmountTransacted": "",
            "lastSavingDate": null
          },
          {
            "product": "Basic Savings Account",
            "isShare": 0,
            "productId": 73,
            "accountId": 1525,
            "accountNumber": "BS132A",
            "accountName": "Basic Savings Account",
            "defaultCurrency": "KES",
            "dateOpened": "18-03-2026",
            "currentBalance": "0.00",
            "availableBalance": "0.00",
            "lastAmountTransacted": "",
            "lastSavingDate": null
          },
          {
            "accountName": "SHARE",
            "shareCapital": 0,
            "dividend": 0,
            "dividendRate": 0,
            "product": "SHARE",
            "productId": 38,
            "accountId": 395,
            "accountNumber": "MN413S227",
            "defaultCurrency": "KES",
            "isShare": 1
          }
        ]
      }
    }
  },
  {
    "endpoint": "Loan Application — Preview",
    "timestamp": "2026-03-18T15:10:31.093Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/loan/application-preview",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Y7imS0"
      },
      "body": {
        "productId": 85,
        "amount": 20000,
        "depositAccountId": 366,
        "applicationReason": "School fees for my children"
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "1037ms",
      "body": {
        "status": 0,
        "message": "depositAccountId provided not linked to the member",
        "data": null
      }
    }
  },
  {
    "endpoint": "Active Loans",
    "timestamp": "2026-03-18T15:10:09.774Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/loan/active-loans",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Y7imS0"
      },
      "body": {
        "pendingDisbursement": true
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "617ms",
      "body": {
        "status": 1,
        "message": "Success",
        "data": []
      }
    }
  },
  {
    "endpoint": "Active Loans",
    "timestamp": "2026-03-18T15:10:04.307Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/loan/active-loans",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Y7imS0"
      },
      "body": {
        "pendingDisbursement": false
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "649ms",
      "body": {
        "status": 1,
        "message": "Success",
        "data": []
      }
    }
  },
  {
    "endpoint": "Loan Calculator",
    "timestamp": "2026-03-18T15:09:52.562Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/loan/calculator",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Y7imS0"
      },
      "body": {
        "productId": 85,
        "amount": 20000,
        "repaymentPeriod": 3
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "707ms",
      "body": {
        "status": 1,
        "message": "Success",
        "data": {
          "principalAmount": "20,000.00",
          "interestAmount": "1,000.00",
          "totalLoanAmount": "21,000.00",
          "installmentAmount": "7,000.00",
          "installmentCount": 3,
          "currency": "KES"
        }
      }
    }
  },
  {
    "endpoint": "Loan Products",
    "timestamp": "2026-03-18T15:09:35.579Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/loan/products",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Y7imS0"
      },
      "body": {}
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "1024ms",
      "body": {
        "status": 1,
        "message": "Success",
        "data": [
          {
            "productId": 85,
            "code": "NN",
            "name": "NANO LOAN",
            "imageUrl": null,
            "limit": "KES 100,000",
            "canTopUp": false,
            "mustBeGuarateed": false,
            "approvalThreshhold": "0.00 %",
            "minAmount": "KES 1,000.00",
            "maxAmount": "KES 100,000.00",
            "interestRate": "20.00% Per YEAR(S)",
            "maxRepaymentPeriod": "2 MONTH(S)",
            "calculationMethod": "Fixed Method",
            "penaltyRate": "5.00% Per MONTH(S)",
            "hasActiveLoan": false,
            "borrowedAmount": 0,
            "availableBalance": "KES 100000",
            "date": "18-03-2026",
            "activeLoan": null,
            "canApply": true,
            "canRepay": false,
            "showHistory": false
          },
          {
            "productId": 77,
            "code": "INSTM",
            "name": "Instant  Mobile Loan",
            "imageUrl": "/var/www/html/tijara/uploads/billers/INSTM/logo.png",
            "limit": "KES 200,000",
            "canTopUp": false,
            "mustBeGuarateed": false,
            "approvalThreshhold": "0.00 %",
            "minAmount": "KES 0.00",
            "maxAmount": "KES 200,000.00",
            "interestRate": "20.00% Per YEAR(S)",
            "maxRepaymentPeriod": "3 MONTH(S)",
            "calculationMethod": "Reducing Balance",
            "penaltyRate": "0.00% Per MONTH(S)",
            "hasActiveLoan": false,
            "borrowedAmount": 0,
            "availableBalance": "KES 200000",
            "date": "18-03-2026",
            "activeLoan": null,
            "canApply": true,
            "canRepay": false,
            "showHistory": false
          },
          {
            "productId": 72,
            "code": "POP",
            "name": "PHASING OUT PRODUCTS - REDUCING BALANCE",
            "imageUrl": null,
            "limit": "KES 5,000,000",
            "canTopUp": false,
            "mustBeGuarateed": false,
            "approvalThreshhold": "0.00 %",
            "minAmount": "KES 10,000.00",
            "maxAmount": "KES 5,000,000.00",
            "interestRate": "30.00% Per YEAR(S)",
            "maxRepaymentPeriod": "6 MONTH(S)",
            "calculationMethod": "Fixed Method",
            "penaltyRate": "0.00% Per MONTH(S)",
            "hasActiveLoan": false,
            "borrowedAmount": 0,
            "availableBalance": "KES 5000000",
            "date": "18-03-2026",
            "activeLoan": null,
            "canApply": true,
            "canRepay": false,
            "showHistory": false
          },
          {
            "productId": 68,
            "code": "BSLN",
            "name": "BUSINESS LOANS",
            "imageUrl": null,
            "limit": "KES 1,000,000",
            "canTopUp": false,
            "mustBeGuarateed": false,
            "approvalThreshhold": "0.00 %",
            "minAmount": "KES 0.00",
            "maxAmount": "KES 1,000,000.00",
            "interestRate": "10.00% Per MONTH(S)",
            "maxRepaymentPeriod": "10 MONTH(S)",
            "calculationMethod": "Fixed Method",
            "penaltyRate": "0.00% Per MONTH(S)",
            "hasActiveLoan": false,
            "borrowedAmount": 0,
            "availableBalance": "KES 1000000",
            "date": "18-03-2026",
            "activeLoan": null,
            "canApply": true,
            "canRepay": false,
            "showHistory": false
          },
          {
            "productId": 67,
            "code": "CNLN",
            "name": "CONSUMER LOANS",
            "imageUrl": null,
            "limit": "KES 10,000,000",
            "canTopUp": false,
            "mustBeGuarateed": false,
            "approvalThreshhold": "0.00 %",
            "minAmount": "KES 0.00",
            "maxAmount": "KES 10,000,000.00",
            "interestRate": "5.00% Per MONTH(S)",
            "maxRepaymentPeriod": "12 MONTH(S)",
            "calculationMethod": "Aggregated Method [PMT]",
            "penaltyRate": "0.00% Per MONTH(S)",
            "hasActiveLoan": false,
            "borrowedAmount": 0,
            "availableBalance": "KES 10000000",
            "date": "18-03-2026",
            "activeLoan": null,
            "canApply": true,
            "canRepay": false,
            "showHistory": false
          },
          {
            "productId": 65,
            "code": "AGRLN",
            "name": "AGRICULTURE LOANS",
            "imageUrl": null,
            "limit": "KES 1,500,000",
            "canTopUp": false,
            "mustBeGuarateed": false,
            "approvalThreshhold": "0.00 %",
            "minAmount": "KES 1,000.00",
            "maxAmount": "KES 1,500,000.00",
            "interestRate": "15.00% Per MONTH(S)",
            "maxRepaymentPeriod": "5 MONTH(S)",
            "calculationMethod": "Fixed Method",
            "penaltyRate": "0.00% Per MONTH(S)",
            "hasActiveLoan": false,
            "borrowedAmount": 0,
            "availableBalance": "KES 1500000",
            "date": "18-03-2026",
            "activeLoan": null,
            "canApply": true,
            "canRepay": false,
            "showHistory": false
          },
          {
            "productId": 45,
            "code": "AFL",
            "name": "ASSET FINANCING",
            "imageUrl": null,
            "limit": "EUR 90,000",
            "canTopUp": false,
            "mustBeGuarateed": false,
            "approvalThreshhold": "0.00 %",
            "minAmount": "EUR 0.00",
            "maxAmount": "EUR 90,000.00",
            "interestRate": "3.00% Per MONTH(S)",
            "maxRepaymentPeriod": "3 MONTH(S)",
            "calculationMethod": "Aggregated Method [PMT]",
            "penaltyRate": "0.00% Per MONTH(S)",
            "hasActiveLoan": false,
            "borrowedAmount": 0,
            "availableBalance": "EUR 90000",
            "date": "18-03-2026",
            "activeLoan": null,
            "canApply": true,
            "canRepay": false,
            "showHistory": false
          },
          {
            "productId": 44,
            "code": "SADL",
            "name": "STAFF ADVANCES",
            "imageUrl": null,
            "limit": "KES 5,000,000",
            "canTopUp": false,
            "mustBeGuarateed": false,
            "approvalThreshhold": "0.00 %",
            "minAmount": "KES 0.00",
            "maxAmount": "KES 5,000,000.00",
            "interestRate": "10.00% Per MONTH(S)",
            "maxRepaymentPeriod": "6 MONTH(S)",
            "calculationMethod": "Fixed Method",
            "penaltyRate": "0.00% Per MONTH(S)",
            "hasActiveLoan": false,
            "borrowedAmount": 0,
            "availableBalance": "KES 5000000",
            "date": "18-03-2026",
            "activeLoan": null,
            "canApply": true,
            "canRepay": false,
            "showHistory": false
          }
        ]
      }
    }
  }
]