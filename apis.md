[
  {
    "endpoint": "Withdrawal (to M-Pesa)",
    "timestamp": "2026-03-18T12:54:10.862Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/saving-account-withdrawal",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••HLTAOg"
      },
      "body": {
        "accountId": 1521,
        "amount": 20000,
        "providerId": 1,
        "providerPhone": "0716735875"
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "842ms",
      "body": {
        "status": 1,
        "message": "Success",
        "data": null
      }
    }
  },
  {
    "endpoint": "Deposit (via M-Pesa)",
    "timestamp": "2026-03-18T12:53:36.686Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/payment-deposit",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••HLTAOg"
      },
      "body": {
        "accountId": 1521,
        "amount": 20000,
        "providerId": 1,
        "providerPhone": "0703757369"
      }
    },
    "response": {
      "status": 201,
      "statusText": "Created",
      "elapsed": "961ms",
      "body": {
        "status": 1,
        "message": "Deposit is successful",
        "data": null
      }
    }
  },
  {
    "endpoint": "Balance Inquiry",
    "timestamp": "2026-03-18T12:52:24.076Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/client/balance-inquiry",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••HLTAOg"
      },
      "formData": {
        "accountId": "1521",
        "productId": "1"
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "1238ms",
      "body": {
        "status": 1,
        "message": "Success",
        "data": {
          "availableBalance": "0.00",
          "currentBalance": "0.00"
        }
      }
    }
  },
  {
    "endpoint": "Client Accounts",
    "timestamp": "2026-03-18T12:51:52.204Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/client/accounts",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••HLTAOg"
      },
      "body": {}
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "559ms",
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
            "currentBalance": "0.00",
            "availableBalance": "0.00",
            "lastAmountTransacted": "",
            "lastSavingDate": null
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
    "endpoint": "Client Details",
    "timestamp": "2026-03-18T12:51:43.503Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/client/details",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••HLTAOg"
      },
      "body": {}
    },
    "response": {
      "status": 500,
      "statusText": "Internal Server Error",
      "elapsed": "622ms",
      "body": {
        "errors": {
          "name": "PHP Warning",
          "message": "Attempt to read property \"name\" on null",
          "code": 2,
          "type": "yii\\base\\ErrorException",
          "file": "/var/www/html-8081/src/api/modules/v1/controllers/ClientController.php",
          "line": 307,
          "stack-trace": [
            "#0 /var/www/html-8081/src/api/modules/v1/controllers/ClientController.php(307): yii\\base\\ErrorHandler->handleError()",
            "#1 [internal function]: api\\modules\\v1\\controllers\\ClientController->actionDetails()",
            "#2 /var/www/html-8081/src/vendor/yiisoft/yii2/base/InlineAction.php(66): call_user_func_array()",
            "#3 /var/www/html-8081/src/vendor/yiisoft/yii2/base/Controller.php(197): yii\\base\\InlineAction->runWithParams()",
            "#4 /var/www/html-8081/src/vendor/yiisoft/yii2/base/Module.php(554): yii\\base\\Controller->runAction()",
            "#5 /var/www/html-8081/src/vendor/yiisoft/yii2/web/Application.php(112): yii\\base\\Module->runAction()",
            "#6 /var/www/html-8081/src/vendor/yiisoft/yii2/base/Application.php(391): yii\\web\\Application->handleRequest()",
            "#7 /var/www/html-8081/api/index.php(15): yii\\base\\Application->run()",
            "#8 {main}"
          ]
        },
        "code": 500
      }
    }
  },
  {
    "endpoint": "Login",
    "timestamp": "2026-03-18T12:51:23.447Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/auth/login",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Iak4s0"
      },
      "body": {
        "username": "e491",
        "password": "12343",
        "org_id": 89
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "564ms",
      "body": {
        "status": 1,
        "message": "Login Success",
        "data": {
          "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXBwLmZpbm92YXRlbHRkLmNvbTo4MDgxIiwiYXVkIjoiaHR0cDovL2FwcC5maW5vdmF0ZWx0ZC5jb206ODA4MSIsImp0aSI6ImQ2NDkyODU2YTRhNGMxMDQ2ODFkZTRmM2EyZTBmOTg5MSIsImlhdCI6MTc3MzgzODI4My40MjI1NDYsImV4cCI6MTc3MzkyNDY4My40MjI1NDYsInVpZCI6NzMzLCJuYW1lIjoiSm9obiBLYW1hdSBEb2UiLCJ1c2VybmFtZSI6ImU0OTEiLCJkZXZpY2VJZCI6bnVsbH0.vfklLoH4f_YhoI-N7pZytDL2oTv39p8t6ddSXHLTAOg",
          "last_login": "2026-03-18 15:51:23",
          "securityQuestionsSet": false,
          "is_first_login": true,
          "changePassword": true,
          "is_group": false,
          "portalUrl": "https://test-portal.ekenya.co.ke/tijara",
          "isSacco": false,
          "user": {
            "name": "John Kamau Doe",
            "username": "e491",
            "firstname": "John",
            "lastname": "Doe",
            "dob": "1990-12-25",
            "idNumber": "12345678es",
            "genderId": null,
            "phone": "071673587534",
            "email": "john@example.coms",
            "org_id": 12,
            "client_id": 1189
          },
          "member_groups": []
        }
      }
    }
  },
  {
    "endpoint": "Change Default PIN (Set New PIN)",
    "timestamp": "2026-03-18T12:50:49.460Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/auth/change-default-pin",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Iak4s0"
      },
      "body": {
        "username": "e491",
        "password": "1234",
        "confirm": "1234"
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "8469ms",
      "body": {
        "status": 1,
        "message": "New pin generated successfully",
        "data": null
      }
    }
  },
  {
    "endpoint": "Validate Default PIN",
    "timestamp": "2026-03-18T12:50:25.004Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/auth/validate-default-pin",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Iak4s0"
      },
      "formData": {
        "username": "e491",
        "defaultPin": "2222"
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "1071ms",
      "body": {
        "status": 0,
        "message": "Default pin provided is wrong",
        "data": null
      }
    }
  },
  {
    "endpoint": "Create Client — ID Upload (Step 2)",
    "timestamp": "2026-03-18T12:50:09.343Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/client/create/basic/final",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Iak4s0"
      },
      "formData": {
        "form_id": "15",
        "tax_pin": "A123456789Bs",
        "email": "john@example.coms"
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "31083ms",
      "body": {
        "status": 1,
        "message": "Data Successfully Validated",
        "data": {
          "username": "e491",
          "firstName": "John",
          "memberNumber": "MN413S",
          "idFrontUrl": "",
          "idBackUrl": "",
          "facePhotoUrl": "",
          "passportPhotoUrl": "",
          "associatedOrgs": [
            {
              "id": 12,
              "org_id": 12,
              "name": "Finovate Finance",
              "username": "e491",
              "firstName": "John",
              "lastName": "Doe",
              "phone": "071673587534",
              "nationalIdentity": "12345678es",
              "dob": "1990-12-25",
              "email": "john@example.coms",
              "genderId": null,
              "memberNumber": "MN413S",
              "isSacco": true,
              "userId": 733,
              "customerId": 1189,
              "fullName": "John Doe",
              "website": "",
              "isFullyRegistered": true,
              "isBlocked": false,
              "isPartiallyRegistered": false,
              "ussdIsActivated": false,
              "isMobileBanking": 0,
              "isInternetBanking": 0,
              "internetBankingAccounts": 0,
              "mobileBankingAccounts": 0
            }
          ]
        }
      }
    }
  },
  {
    "endpoint": "Create Client — ID Upload (Step 2)",
    "timestamp": "2026-03-18T12:49:33.399Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/client/create/basic/final",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Iak4s0"
      },
      "formData": {
        "form_id": "15",
        "tax_pin": "A123456789B",
        "email": "john@example.com"
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "463ms",
      "body": {
        "status": 0,
        "message": "email:Email john@example.com is already used.",
        "data": null
      }
    }
  },
  {
    "endpoint": "Create Client — Basic Info (Step 1)",
    "timestamp": "2026-03-18T12:49:19.115Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/client/create/basic/initial",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Iak4s0"
      },
      "formData": {
        "first_name": "John",
        "middle_name": "Kamau",
        "last_name": "Doe",
        "phone": "071673587534",
        "national_identity": "12345678es",
        "dob": "25-12-1990",
        "gender": "37",
        "org_id": "12"
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "680ms",
      "body": {
        "status": 1,
        "message": "Success",
        "data": {
          "form_id": 15
        }
      }
    }
  },
  {
    "endpoint": "Gender List",
    "timestamp": "2026-03-18T12:49:04.887Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/gender/index",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Iak4s0"
      },
      "body": {
        "org_id": "12"
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "415ms",
      "body": {
        "status": 1,
        "message": "Success",
        "data": [
          {
            "id": 39,
            "name": "Other"
          },
          {
            "id": 38,
            "name": "Female"
          },
          {
            "id": 37,
            "name": "Male"
          }
        ]
      }
    }
  },
  {
    "endpoint": "Get Organisations List",
    "timestamp": "2026-03-18T12:48:53.542Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/organization/index",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Iak4s0"
      },
      "body": {
        "limit": 50
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "524ms",
      "body": {
        "status": 1,
        "message": "Success",
        "data": [
          {
            "id": 12,
            "name": "Finovate Finance"
          },
          {
            "id": 89,
            "name": "Simple Credit MFI"
          },
          {
            "id": 92,
            "name": "Saamaya Finance"
          },
          {
            "id": 93,
            "name": "John John"
          }
        ]
      }
    }
  },
  {
    "endpoint": "Resend OTP",
    "timestamp": "2026-03-18T12:48:47.026Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/auth/resend-otp",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Iak4s0"
      },
      "body": {
        "username": "0716735875"
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "680ms",
      "body": {
        "status": 0,
        "message": "Failed generating OTP",
        "data": null
      }
    }
  },
  {
    "endpoint": "Verify OTP Code",
    "timestamp": "2026-03-18T12:48:40.134Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/auth/verify-code",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Iak4s0"
      },
      "body": {
        "token": "222222"
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "548ms",
      "body": {
        "status": 0,
        "message": "The token is expired. Please generate another token",
        "data": null
      }
    }
  },
  {
    "endpoint": "Trigger OTP (App Activation)",
    "timestamp": "2026-03-18T12:48:34.174Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/auth/activate",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Iak4s0"
      },
      "formData": {
        "phone": "0703757369"
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "1108ms",
      "body": {
        "status": 1,
        "message": "Success",
        "data": {
          "phone": "0703757369"
        }
      }
    }
  },
  {
    "endpoint": "Check Associated Organisations",
    "timestamp": "2026-03-18T12:48:23.583Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/auth/get-associated-orgs",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Iak4s0"
      },
      "formData": {
        "phone": "0723686428",
        "notYetJoined": "true",
        "nationalIdNumber": "123123123",
        "dateOfBirth": "1231231"
      }
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "828ms",
      "body": {
        "status": 1,
        "message": "Success",
        "data": [
          {
            "id": 12,
            "name": "Finovate Finance",
            "isSacco": true,
            "website": null,
            "logo": "https://test-portal.ekenya.co.ke/tenz-cbs/assets/b70eb24e/logo.png",
            "org_id": 12,
            "username": "",
            "firstName": "",
            "lastName": "",
            "phone": "0723686428",
            "nationalIdentity": "",
            "dob": "",
            "email": "",
            "genderId": "",
            "memberNumber": "",
            "userId": "",
            "customerId": "",
            "fullName": "",
            "isFullyRegistered": "",
            "isBlocked": "",
            "isPartiallyRegistered": "",
            "ussdIsActivated": ""
          },
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
            "phone": "0723686428",
            "nationalIdentity": "",
            "dob": "",
            "email": "",
            "genderId": "",
            "memberNumber": "",
            "userId": "",
            "customerId": "",
            "fullName": "",
            "isFullyRegistered": "",
            "isBlocked": "",
            "isPartiallyRegistered": "",
            "ussdIsActivated": ""
          },
          {
            "id": 92,
            "name": "Saamaya Finance",
            "isSacco": false,
            "website": null,
            "logo": "",
            "org_id": 92,
            "username": "",
            "firstName": "",
            "lastName": "",
            "phone": "0723686428",
            "nationalIdentity": "",
            "dob": "",
            "email": "",
            "genderId": "",
            "memberNumber": "",
            "userId": "",
            "customerId": "",
            "fullName": "",
            "isFullyRegistered": "",
            "isBlocked": "",
            "isPartiallyRegistered": "",
            "ussdIsActivated": ""
          },
          {
            "id": 93,
            "name": "John John",
            "isSacco": false,
            "website": null,
            "logo": "",
            "org_id": 93,
            "username": "",
            "firstName": "",
            "lastName": "",
            "phone": "0723686428",
            "nationalIdentity": "",
            "dob": "",
            "email": "",
            "genderId": "",
            "memberNumber": "",
            "userId": "",
            "customerId": "",
            "fullName": "",
            "isFullyRegistered": "",
            "isBlocked": "",
            "isPartiallyRegistered": "",
            "ussdIsActivated": ""
          }
        ]
      }
    }
  },
  {
    "endpoint": "Identity Types",
    "timestamp": "2026-03-18T12:48:17.086Z",
    "request": {
      "url": "http://app.finovateltd.com:8081/api/identity-type/index",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ••••Iak4s0"
      },
      "body": {}
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "elapsed": "443ms",
      "body": {
        "status": 1,
        "message": "Success",
        "data": [
          {
            "id": 1,
            "name": "National ID"
          },
          {
            "id": 2,
            "name": "Passport No."
          },
          {
            "id": 3,
            "name": "Military ID"
          },
          {
            "id": 4,
            "name": "Alien ID"
          }
        ]
      }
    }
  }
]