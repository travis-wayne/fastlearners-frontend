# Fastlearners API Documentation

Generated: 2026-06-09 15:09:06 +01:00
Base API URL: `https://api.fastlearnersapp.com`
Documentation pages: 37
Endpoints documented: 113

## Table of Contents

- [Endpoint Index](#endpoint-index)
- [Authentication System](#authentication-system)
- [Guardian Management](#guardian-management)
- [Children Request Management](#children-request-management)
- [Guest Management](#guest-management)
- [Parental Consent Management](#parental-consent-management)
- [Student Management](#student-management)
- [Student's Class, Classes, Terms & Weeks](#students-class-classes-terms-weeks)
- [Guardian Request Management](#guardian-request-management)
- [Handle Answering System](#handle-answering-system)
- [Lesson Completion Check System](#lesson-completion-check-system)
- [Lesson Content](#lesson-content)
- [Topics Overview](#topics-overview)
- [Student's Subject](#students-subject)
- [Topics](#topics)
- [Total Scores API Request](#total-scores-api-request)
- [Student's Subject](#students-subject)
- [Subscription Management](#subscription-management)
- [Packages](#packages)
- [Ticket Management](#ticket-management)
- [Delete Lesson](#delete-lesson)
- [Get Specific Lesson](#get-specific-lesson)
- [Get Lessons](#get-lessons)
- [All Lessons Upload](#all-lessons-upload)
- [Check Markers Upload](#check-markers-upload)
- [Concepts Upload](#concepts-upload)
- [Examples Upload](#examples-upload)
- [Exercises Upload](#exercises-upload)
- [General Exercises Upload](#general-exercises-upload)
- [Lessons Upload](#lessons-upload)
- [Scheme Of Work Upload](#scheme-of-work-upload)
- [View Trashed Lessons](#view-trashed-lessons)
- [Subscription Management](#subscription-management)
- [Coupon Management](#coupon-management)
- [Package Management](#package-management)
- [Transaction Management](#transaction-management)
- [Ticket Management](#ticket-management)
- [User Management](#user-management)

## Endpoint Index

| Method | Path | Area | Section |
| --- | --- | --- | --- |
| POST | `/api/v1/superadmin/lessons/uploads/all-lesson-files` | All Lessons Upload | All In One Lesson Upload |
| POST | `/api/v1/create-password` | Authentication System | Create Password |
| POST | `/api/v1/forgot-password` | Authentication System | Forgot Password |
| POST | `/api/v1/login` | Authentication System | Login |
| POST | `/api/v1/google/redirect` | Authentication System | Login/Register With Google |
| POST | `/api/v1/logout` | Authentication System | Logout |
| POST | `/api/v1/register` | Authentication System | Registration |
| POST | `/api/v1/resend-reset-code` | Authentication System | Resend Password Reset Code |
| POST | `/api/v1/resend-verification-code` | Authentication System | Resend Verification Code |
| POST | `/api/v1/reset-password` | Authentication System | Reset Password |
| POST | `/api/v1/set-role` | Authentication System | Set Role |
| POST | `/api/v1/verify-email` | Authentication System | Verify Email After Registration |
| POST | `/api/v1/verify-reset-code` | Authentication System | Verify Password Reset Code |
| POST | `/api/v1/verify-referral-code` | Authentication System | Verify Referral Code |
| POST | `/api/v1/superadmin/lessons/uploads/check-markers` | Check Markers Upload | Check Markers Upload |
| GET | `/api/v1/guardian/children/request/cancel/{id}` | Children Request Management | Cancel Request |
| POST | `/api/v1/guardian/children/request/new` | Children Request Management | Make New Request |
| GET | `/api/v1/guardian/children/request/history` | Children Request Management | Request History |
| POST | `/api/v1/superadmin/lessons/uploads/concepts` | Concepts Upload | Concepts Upload |
| POST | `/api/v1/superadmin/coupons/search` | Coupon Management | Coupon Search |
| POST | `/api/v1/superadmin/coupons/create` | Coupon Management | Create Coupon |
| DELETE | `/api/v1/superadmin/coupons/2/delete` | Coupon Management | Delete Coupon |
| GET | `/api/v1/superadmin/coupons/1/view` | Coupon Management | Get Coupon Detail |
| POST | `/api/v1/superadmin/coupons/1/update` | Coupon Management | Update Coupon |
| POST | `/api/v1/superadmin/coupons/2/update-status` | Coupon Management | Update Coupon Status |
| GET | `/api/v1/superadmin/coupons` | Coupon Management | View Coupons |
| DELETE | `/api/v1/superadmin/lessons/lessons/1/delete` | Delete Lesson | Permanently Delete Lesson |
| POST | `/api/v1/superadmin/lessons/lessons/1/restore` | Delete Lesson | Restore Lesson |
| DELETE | `/api/v1/superadmin/lessons/lessons/1/trash` | Delete Lesson | Trash Lesson |
| POST | `/api/v1/superadmin/lessons/uploads/examples` | Examples Upload | Examples Upload |
| POST | `/api/v1/superadmin/lessons/uploads/exercises` | Exercises Upload | Exercises Upload |
| POST | `/api/v1/superadmin/lessons/uploads/general-exercises` | General Exercises Upload | General Exercises Upload |
| GET | `/api/v1/superadmin/lessons/get-classes-subjects-terms-weeks` | Get Lessons | Get Classes, Subjects, Terms And Weeks |
| POST | `/api/v1/superadmin/lessons/lessons/` | Get Lessons | Get Lessons |
| GET | `/api/v1/superadmin/lessons/lesson/2` | Get Specific Lesson | Get Specific Lesson |
| GET | `/api/v1/superadmin/lessons/lesson/2/content` | Get Specific Lesson | Get Specific Lesson Content |
| GET | `/api/v1/guardian` | Guardian Management | Dashboard |
| GET | `/api/v1/student/guardian/request/accept/{id}` | Guardian Request Management | Accept Request |
| GET | `/api/v1/student/guardian/request/reject/{id}` | Guardian Request Management | Reject Request |
| GET | `/api/v1/student/guardian/request/history` | Guardian Request Management | Request History |
| GET | `/api/v1/guest` | Guest Management | Dashboard |
| POST | `/api/v1/lessons/check-exercise-answer` | Handle Answering System | Handle Concept Exercise Answers |
| POST | `/api/v1/lessons/check-general-exercise-answer` | Handle Answering System | Handle General Exercise Answers |
| POST | `/api/v1/lessons/check-exercise-answer` | Lesson Completion Check System | Handle General Exercise Answers |
| GET | `/api/v1/lessons/check/summary-and-application/2/1` | Lesson Completion Check System | Lesson Concepts Completion Check |
| GET | `/api/v1/lessons/check/general-exercises/2` | Lesson Completion Check System | Lesson General Exercises Completion Check |
| GET | `/api/v1/lessons/check/overview/2` | Lesson Completion Check System | Lesson Overview Completion Check |
| GET | `/api/v1/lessons/check/summary-and-application/2` | Lesson Completion Check System | Lesson Summary & Application Completion Check |
| GET | `/api/v1/lessons/general-mathematics/number-bases-system/content` | Lesson Content | Get Lesson Content |
| POST | `/api/v1/superadmin/lessons/uploads/lessons` | Lessons Upload | Lessons Upload |
| POST | `/api/v1/superadmin/packages/create` | Package Management | Create Package |
| DELETE | `/api/v1/superadmin/packages/2/delete` | Package Management | Delete Package |
| GET | `/api/v1/superadmin/packages/1/view` | Package Management | Get Package Detail |
| POST | `/api/v1/superadmin/packages/1/update` | Package Management | Update Package |
| POST | `/api/v1/superadmin/packages/2/update-status` | Package Management | Update Package Status |
| GET | `/api/v1/superadmin/packages` | Package Management | View Packages |
| GET | `/api/v1/packages/1/view` | Packages | View Package |
| GET | `/api/v1/packages` | Packages | View Packages |
| POST | `/api/v1/parental-consent/6d18-1bf5-66d6-03e2-c6cb-19ca/accept` | Parental Consent Management | Accept Consent |
| POST | `/api/v1/parental-consent/6d18-1bf5-66d6-03e2-c6cb-19ca/reject` | Parental Consent Management | Reject Consent |
| POST | `/api/v1/superadmin/lessons/uploads/scheme-of-work` | Scheme Of Work Upload | Scheme Of Work Upload |
| GET | `/api/v1/dashboard` | Student Management | Dashboard |
| GET | `/api/v1/student/classes` | Student&#039;s Class, Classes, Terms &amp; Weeks | Get Classes |
| GET | `/api/v1/student/class` | Student&#039;s Class, Classes, Terms &amp; Weeks | Get Student's Class |
| GET | `/api/v1/student/terms` | Student&#039;s Class, Classes, Terms &amp; Weeks | Get Terms |
| GET | `/api/v1/student/weeks` | Student&#039;s Class, Classes, Terms &amp; Weeks | Get Weeks |
| GET | `/api/v1/subjects` | Student&#039;s Subject | List Student's Subjects |
| GET | `/api/v1/lessons/` | Student&#039;s Subject | Student's Subject |
| POST | `/api/v1/subjects/update-compulsory-selective` | Student&#039;s Subject | Update compulsory selective subject |
| POST | `/api/v1/subjects/update-selective` | Student&#039;s Subject | Update selective subject |
| GET | `/api/v1/subscriptions/payment-status/:reference` | Subscription Management | Get Payment Status |
| GET | `/api/v1/subscriptions` | Subscription Management | Get Subscription History |
| GET | `/api/v1/transactions` | Subscription Management | Get Transaction History |
| POST | `/api/v1/subscriptions/subscribe` | Subscription Management | Subscribe Package |
| POST | `/api/v1/subscriptions/verify-coupon` | Subscription Management | Verify Coupon |
| GET | `/api/v1/superadmin/subscriptions/1/view` | Subscription Management | View Subscription Detail |
| GET | `/api/v1/superadmin/subscriptions` | Subscription Management | View Subscriptions |
| POST | `/api/v1/tickets/assign-support-agent` | Ticket Management | Assign Support Agent |
| POST | `/api/v1/tickets/3/close` | Ticket Management | Close Ticket |
| POST | `/api/v1/tickets/create` | Ticket Management | Create Ticket |
| DELETE | `/api/v1/tickets/3/delete-assignment` | Ticket Management | Delete Ticket |
| DELETE | `/api/v1/tickets/3/delete-ticket` | Ticket Management | Delete Ticket |
| GET | `/api/v1/tickets/5/assignment-history` | Ticket Management | Get Assignment History |
| GET | `/api/v1/tickets/support-agents` | Ticket Management | Get Support Agent |
| POST | `/api/v1/superadmin/tickets/5/reply` | Ticket Management | Reply Ticket |
| POST | `/api/v1/tickets/5/reply` | Ticket Management | Reply Ticket |
| POST | `/api/v1/tickets/2/update-status` | Ticket Management | Update Ticket Status |
| GET | `/api/v1/superadmin/tickets/2/view` | Ticket Management | View Ticket |
| GET | `/api/v1/tickets/2/view` | Ticket Management | View Ticket |
| GET | `/api/v1/tickets/categories` | Ticket Management | View Ticket Categories |
| GET | `/api/v1/tickets/priorities` | Ticket Management | View Ticket Priority |
| GET | `/api/v1/tickets/statuses` | Ticket Management | View Ticket Statuses |
| GET | `/api/v1/superadmin/tickets` | Ticket Management | View Tickets |
| GET | `/api/v1/tickets` | Ticket Management | View Tickets |
| GET | `/api/v1/lessons/general-mathematics` | Topics | Get Topics |
| GET | `/api/v1/lessons/general-mathematics/number-bases-system/overview` | Topics Overview | Get Topics Overview |
| GET | `/api/v1/lessons/scores/lessons/total/4/1` | Total Scores API Request | All Lessons Total Scores API Request |
| GET | `/api/v1/lessons/scores/subjects/total/1` | Total Scores API Request | All Subjects Total Scores API Request |
| GET | `/api/v1/lessons/scores/concepts/1` | Total Scores API Request | Concepts Total Scores API Request |
| GET | `/api/v1/lessons/scores/general-exercises/1` | Total Scores API Request | General Exercises Total Scores API Request |
| GET | `/api/v1/lessons/scores/lessons/1` | Total Scores API Request | Lessons Total Scores API Request |
| GET | `/api/v1/lessons/scores/lessons/summary/1` | Total Scores API Request | Lessons Total Scores Summary API Request |
| GET | `/api/v1/lessons/scores/subjects/4/1` | Total Scores API Request | Subjects Total Scores API Request |
| GET | `/api/v1/superadmin/transactions/1/view` | Transaction Management | View Transaction Detail |
| GET | `/api/v1/superadmin/transactions` | Transaction Management | View Transactions |
| GET | `/api/v1/profile/edit/password` | User Management | Change Password |
| GET | `/api/v1/check-username-availability/{username}` | User Management | Check Username Availability |
| DELETE | `/api/v1/profile/delete-now` | User Management | Delete Account Now |
| DELETE | `/api/v1/profile/delete` | User Management | Delete Account Request |
| GET | `/api/v1/profile` | User Management | Profile Details |
| POST | `/api/v1/profile/edit` | User Management | Profile Edit |
| GET | `/api/v1/profile/data` | User Management | Profile Page Data |
| POST | `/api/v1/profile/edit/profile-picture` | User Management | Profile Picture Upload |

## Authentication System

**Base Url:** `https://api.fastlearnersapp.com`

### Registration

**Endpoint:** `POST /api/v1/register`

**Description:** Register a new user with their email address and a referral code.

**Note:**

=> The referral code input field is optional.

=> The referral code is 8 characters

=> User's can verify referral code before continuing with the registration.

#### Headers

| Key | Value |
| --- | --- |
| Accept | application/json |

#### Request Body

```json
{
  "email": "john@example.com",
  "referral_code": "ABC1DEF2",
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | verify-email |
| validation error | none |
| user not found error | none |

#### Success Response (200)

```json
{
  "success" : true,
  "message": "A verification code has been sent to your registered email address.",
  "content":{},
  "code": 200,
}
```

#### Validation Error (422)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": [
      "The email field is required."
    ]
  },
  "code": 422,
}
```

#### User Exist Error (422)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": [
      "The email has already been taken."
    ]
  },
  "code": 422
}
```

### Verify Referral Code

**Endpoint:** `POST /api/v1/verify-referral-code`

**Description:** Verify referral code before proceeding with the user registration.

#### Headers

| Key | Value |
| --- | --- |
| Accept | application/json |

#### Request Body

```json
{
  "referral_code": "ABC1DEF2"
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |
| validation error | none |
| code not found error | none |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Agent Ceetny was verified successfully !",
  "content": null,
  "code": 200
}
```

#### Validation Error (422)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors":{
    "referral_code": [
      "The referral code field is required.",
      "The referral code field must be 8 characters."
    ],
  },
  "code": 422
}
```

#### Code Not Found Error (404)

```json
{
  "success": false,
  "message": "Referral code does not exist, try again!",
  "errors": null,
  "code": 404,
}
```

#### Server Error

```json
{
  "success": false,
  "message": "An error occurred while verifying your referral code, try again!",
  "errors": ["error massage"],
  "code": 500,
}
```

### Verify Email After Registration

**Endpoint:** `POST /api/v1/verify-email`

**Description:** Verify email address after registration with a 6 digit code sent to the registered email address of the user which expires after 15 minutes.

#### Headers

| Key | Value |
| --- | --- |
| Accept | application/json |

#### Request Body

```json
{
  "email": "john@example.com",
  "code": "849201"
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | create-password |
| validation error | none |
| code not found error | none |
| code expired error | none |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Email verified successfully!",
  "content": {
    "access_token": "1|LyQYHtUKysAukDrUMQRHv2OoieEHlCKqQxpywRxy12146d17",
    "user": {
      "id": 1,
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "phone": "08012345678",
      "school": null,
      "class": null,
      "discipline": null,
      "date_of_birth": null,
      "country": null,
      "state": null,
      "city": null,
      "gender": null,
      "status": "active",
      "created_at": "2025-06-21T12:56:48.000000Z",
      "role": [
        "student"
      ]
    }
  },
  "code": 200
}
```

#### Validation Error (422)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors":{
    "email": [
      "The email field is required."
    ],
  "code": [
      "The code field is required."
    ],
  },
  "code": 422
}
```

#### Code Not Found Error (404)

```json
{
  "success": false,
  "message": "Registration request not found!",
  "errors": null,
  "code": 404,
}
```

#### Invalid Code Error (400)

```json
{
  "success": false,
  "message": "Invalid verification code!",
  "errors": null,
  "code": 400,
}
```

#### Code Expired Error (400)

```json
{
  "success": false,
  "message": "Registration code has expired, try again!",
  "errors": null,
  "code": 400,
}
```

### Create Password

**Endpoint:** `POST /api/v1/create-password`

**Description:** Create password after successfully verifying email address.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "password": "password",
  "password_confirmation": "password",
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | set-role |
| validation error | none |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Your password has been created successfully!",
  "content": {},
  "code": 200
}
```

#### Validation Error (422)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors":{
    "password": [
      "The password field is required.",
    ],
    "password": [
      "The password confirmation field is required.",
    ]
    "password": [
      "The password field confirmation does not match.",
    ]
  },
  "code": 422
}
```

#### Error Response (400)

```json
{
  "success": false,
  "message": "An error occurred while creating your password, try again",
  "errors": null,
  "code": 400,
}
```

### Set Role

**Endpoint:** `POST /api/v1/set-role`

**Description:** Set role after successfully creating password.

**Note:** User's are to select from `['guest','student','guardian']`.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "user_role": "student"
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | dashboard (redirect according to user's role) |
| validation error | none |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Your role has been set successfully!",
  "content": {},
  "code": 200
}
```

#### Validation Error (422)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors":{
    "user_role": [
      "The user role field is required.",
    ],
  },
  "code": 422
}
```

#### Invalid Role Error (422)

```json
{
  "success": false,
  "message": "Invalid role selected!",
  "errors": null,
  "code": 400
}
```

#### Error Response (400)

```json
{
  "success": false,
  "message": "An error occurred while assigning role, try again",
  "errors": null,
  "code": 500,
}
```

### Resend Verification Code

**Endpoint:** `POST /api/v1/resend-verification-code`

**Description:** Resend registration verification code in a case of delay or haven't received any.

| Key | Value |
| --- | --- |
| Accept | application/json |

#### Request Body

```json
{
  "email": "john@example.com"
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |
| validation error | none |
| user not found error | none |
| error sending code | none |

#### Success Response (200)

```json
{
  "success": true,
  "message": "A verification code has been sent to your register email address.",
  "content": null,
  "code": 200,
}
```

#### Validation Error (422)

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "email": [
      "The email field is required."
    ]
  }
  "code": 422,
}
```

#### User Not Found Error (404)

```json
{
  "success": false,
  "message": "User not found.",
  "errors": null,
  "code": 404
}
```

#### Error Sending Code (500)

```json
{
  "success": false,
  "message": "There was an error sending verification code, try again.",
  "errors": null,
  "code": 500
}
```

### Login

**Endpoint:** `POST /api/v1/login`

**Description:** Login using email or phone and password. If user is inactive, a verification code will be sent to their email, else they'll be logged in and redirected to the dashboard.

| Key | Value |
| --- | --- |
| Accept | application/json |

#### Request Body

```json
{
  "email_phone": "john@example.com",
  "password": "password"
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | dashboard (redirect according to user's role) |
| validation error | none |
| invalid login details error | none |
| inactive user error | verify-email |
| user suspended error | none |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Email verified successfully!",
  "content": {
    "access_token": "1|LyQYHtUKysAukDrUMQRHv2OoieEHlCKqQxpywRxy12146d17",
    "user": {
      "id": 1,
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "phone": "08012345678",
      "school": null,
      "class": null,
      "discipline": null,
      "date_of_birth": null,
      "country": null,
      "state": null,
      "city": null,
      "gender": null,
      "status": "active",
      "created_at": "2025-06-21T12:56:48.000000Z",
      "role": [
        "student"
      ]
    }
  },
  "code": 200
}
```

#### Validation Error (422)

```json
{
  "success": false,
  "message": "Validation failed!",
  "errors":{
    "email": [
      "The email field is required."
    ],
    "password": [
      "The password field is required."
    ],
  },
  "code": 422
}
```

#### Invalid Login Details Error (401)

```json
{
  "success": false,
  "message": "Valid login details!",
  "error": null,
  "code": 401,
}
```

#### Inactive User Response (401)

```json
{
  "success": false,
  "message": "Your account is not active. Please verify your account with the verification code sent to your email address",
  "error": null,
  "code": 401,
}
```

#### User Suspended Response (400)

```json
{
  "success": false,
  "message": "Your account has been suspended, please contact support!",
  "error": null,
  "code": 400,
}
```

### Login/Register With Google

**Endpoint:** `POST /api/v1/google/redirect`

**Description:** Login with a google account.

#### Headers

| Key | Value |
| --- | --- |
| Accept | application/json |

#### Request Body

```json
{}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | dashboard or create-password |
| validation error | none |

### Logout

**Endpoint:** `POST /api/v1/logout`

**Description:** Logs out an authenticated user.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | login |
| unauthorized error | none |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Logged out successfully."
  "content": null,
  "code": 200,
}
```

#### Unauthorized (401)

```json
{
  "success": false,
  "message": "Unauthorized."
  "errors": null,
  "code": 401,
}
```

### Forgot Password

**Endpoint:** `POST /api/v1/forgot-password`

**Description:** Sends a 6-digit reset code to the user's email.

| Key | Value |
| --- | --- |
| Accept | application/json |

#### Request Body

```json
{
  "email": "john@example.com"
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | verify reset code |
| validation error | none |
| email not found error | none |
| email sending error | none |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Password reset code sent to your email!",
  "content": null,
  "code": 200,
}
```

#### Validation Error (422)

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "email": [
      "The email field is required."
    ]
  },
  "code": 422,
}
```

#### Email Not Found Error (404)

```json
{
  "success": false,
  "message": "Email not found.",
  "errors":{
      "email": [
        "This email address was not found on our record!"
      ]
  },
  "code": 404,
}
```

### Verify Password Reset Code

**Endpoint:** `POST /api/v1/verify-reset-code`

**Description:** Verify a 6-digit reset code that was sent to a user's email.

| Key | Value |
| --- | --- |
| Accept | application/json |

#### Request Body

```json
{
  "email": "john@example.com",
  "code": "849201",
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | reset password |
| validation error | none |
| code not found error | none |
| invalid code error | none |
| code expired error | none |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Your code was verified, Create new password."
  "content": null,
  "code": 200,
}
```

#### Validation Error (422)

```json
{
  "success": false,
  "message": "Validation failed."
  "errors":{
    "email": [
      "The email field is required."
    ],
    "code": [
      "The code field is required."
    ],
    "password": [
      "The password field is required."
    ],
    "password_confirmation": [
      "The password_confirmation field is required."
    ],
  }
  "code": 422,
}
```

#### Code Not Found Error (404)

```json
{
  "success": false,
  "message": "Reset request was not found!"
  "errors": null,
  "code": 404,
}
```

#### Invalid Code Error (400)

```json
{
  "success": false,
  "message": "Invalid reset code!"
  "errors": null,
  "code": 400,
}
```

#### Code Expired Error (400)

```json
{
  "success": false,
  "message": "Reset request has expired, try again!"
  "errors": null,
  "code": 400,
}
```

### Resend Password Reset Code

**Endpoint:** `POST /api/v1/resend-reset-code`

**Description:** resends a 6-digit reset code to the user's email.

| Key | Value |
| --- | --- |
| Accept | application/json |

#### Request Body

```json
{
  "email": "john@example.com"
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |
| validation error | none |
| email not found error | none |
| email sending error | none |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Password reset code sent to your email!",
  "content": null,
  "code": 200,
}
```

#### Validation Error (422)

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "email": [
      "The email field is required."
    ]
  },
  "code": 422,
}
```

#### Email Not Found Error (404)

```json
{
  "success": false,
  "message": "Email not found.",
  "errors":{
      "email": [
        "This email address was not found on our record!"
      ]
  },
  "code": 404,
}
```

### Reset Password

**Endpoint:** `POST /api/v1/reset-password`

**Description:** Reset a users password

| Key | Value |
| --- | --- |
| Accept | application/json |

#### Request Body

```json
{
  "email": "john@example.com",
  "password": "NewPass123",
  "password_confirmation": "NewPass123"
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | login |
| validation error | none |
| email not found error | none |
| email sending error | none |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Your password has been reset successfully. You may now log in.",
  "content": null,
  "code": 200,
}
```

#### Validation Error (422)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors":{
    "email": [
      "The email field is required."
    ],
    "password": [
      "The password field is required."
    ],
    "password_confirmation": [
      "The password_confirmation field is required."
    ],
  }
  "code": 422
}
```

#### Code Not Found Error (404)

```json
{
  "success": false,
  "message": "Reset code was not found!",
  "errors": null,
  "code": 404
}
```

#### Invalid Code Error (400)

```json
{
  "success": false,
  "message": "Invalid reset code!",
  "errors": null,
  "code": 400
}
```

#### Code Expired Error (400)

```json
{
  "success": false,
  "message": "Reset code has expired!",
  "error": null,
  "code": 400,
}
```


## Guardian Management

**Base Url:** `https://api.fastlearnersapp.com`

### Dashboard

**Endpoint:** `Get /api/v1/guardian`

**Description:** Guardian's dashboard overview and reports.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Your children's report and statistics",
  "content": {
    "children": 1,
    "active_children": 1,
    "active_subscriptions": 0,
    "account_status": "active",
    "reports": []
  },
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Error Message

```json
{
  "success": false,
  "message": "Server error",
  "errors": null,
  "code": 500,
}
```


## Children Request Management

**Base Url:** `https://api.fastlearnersapp.com`

### Make New Request

**Endpoint:** `Post /api/v1/guardian/children/request/new`

**Description:** Guardian's can make new child request using this endpoint.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "child_email": "johndoe@email.com",
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | request-history |
| validation error | none |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Child request sent successfully!",
  "content": null,
  "code": 200
}
```

#### Validation Error (422)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors":{
    "child_email": [
      "The child email field is required.",
      "Child email does not exist on our record!",
    ]
  },
  "code": 422
}
```

#### Email Does Not Exist Error

```json
{
  "success": false,
  "message": "Child email does not exist on our record!",
  "errors": null,
  "code": 400,
}
```

#### User Not A Guardian Error

```json
{
  "success": false,
  "message": "Only guardians can make this request!",
  "errors": null,
  "code": 400,
}
```

#### User Not A Student Error

```json
{
  "success": false,
  "message": "The email you entered does not belong to a student, try again!",
  "errors": null,
  "code": 400,
}
```

#### Pending Request Error

```json
{
  "success": false,
  "message": "This child request is still pending!",
  "errors": null,
  "code": 400,
}
```

#### Accepted Request Error

```json
{
  "success": false,
  "message": "This child request was accepted and assigned to you as child!",
  "errors": null,
  "code": 400,
}
```

#### Mail Sending Error

```json
{
  "success": false,
  "message": "An error occurred while sending request mail to your child, but your request has been sent successfully!",
  "errors": null,
  "code": 400,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "success": false,
  "message": "Server error",
  "errors": ["error message"],
  "code": 500,
}
```

`

### Cancel Request

**Endpoint:** `Get /api/v1/guardian/children/request/cancel/{id}`

**Description:** Cancel child request with this endpoint using the request `id`.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | request-history |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Child request cancelled successfully!",
  "content": null,
  "code": 200
}
```

#### Request Not Found Error

```json
{
  "success": false,
  "message": "This child request was not found!",
  "errors": null,
  "code": 404
}
```

#### Cancel Error

```json
{
  "success": false,
  "message": "Sorry, you can only cancel a pending request!",
  "errors": null,
  "code": 400
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "success": false,
  "message": "Server error",
  "errors": ["error message"],
  "code": 500,
}
```

### Request History

**Endpoint:** `Get /api/v1/guardian/children/request/history`

**Description:** Get all children history request with this endpoint.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | request-history |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "history": {
      "request_history": [
        {
          "id": 1,
          "child_name": "Student User",
          "child_email": "student@fastlearnersapp.com",
          "class": "SSS1",
          "status": "accepted",
          "response_date": "10-03-2026 12:17:46"
        },
        {
          "id": 2,
          "child_name": "John Doe",
          "child_email": "johndoe@email.com",
          "class": "SSS1",
          "status": "cancelled",
          "response_date": "21-03-2026 07:22:00"
        },
        {
          "id": 7,
          "child_name": "John Doe",
          "child_email": "johndoe@email.com",
          "class": "SSS1",
          "status": "pending",
          "response_date": "21-03-2026 06:38:36"
        }
      ],
      "links": {
        "first": "https://api.fastlearnersapp.com/api/v1/guardian/children/request/history?page=1",
        "last": "https://api.fastlearnersapp.com/api/v1/guardian/children/request/history?page=1",
        "prev": null,
        "next": null
      },
      "meta": {
        "current_page": 1,
        "last_page": 1,
        "per_page": 20,
        "total": 3
      }
    }
  },
  "code": 200

}
```

#### Not Found Error

```json
{
  "success": false,
  "message": "No history found!",
  "errors": null,
  "code": 404
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "success": false,
  "message": "Server error",
  "errors": ["error message"],
  "code": 500,
}
```


## Guest Management

**Base Url:** `https://api.fastlearnersapp.com`

### Dashboard

**Endpoint:** `Get /api/v1/guest`

**Description:** Guest's dashboard overview.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Your dashboard!",
  "content": {
    "data": '',
  },
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Error Message

```json
{
  "success": false,
  "message": "Server error",
  "errors": null,
  "code": 500,
}
```


## Parental Consent Management

**Base Url:** `https://api.fastlearnersapp.com`

### Accept Consent

**Endpoint:** `Post /api/v1/parental-consent/6d18-1bf5-66d6-03e2-c6cb-19ca/accept`

**Description:** Parent can accept parental consent request through this endpoint.

**Note:**

=> The token (`6d18-1bf5-66d6-03e2-c6cb-19ca`) in the endpoint is to be gotten from the acceptance url.

=> Acceptance link (sample link: `https://fastlearnersapp.com/6d18-1bf5-66d6-03e2-c6cb-19ca/accept`) will be sent to the parent email, so capture this link to process the parental consent acceptance.

=> The name in the request body is optional.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "name": "John Doe",
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |
| validation error | none |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Parental consent request accepted successfully!",
  "content": null,
  "code": 200
}
```

#### Consent Request Not Found Error

```json
{
  "success": false,
  "message": "Consent request not found!",
  "errors": null,
  "code": 400,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "success": false,
  "message": "Server error",
  "errors": ["error message"],
  "code": 500,
}
```

`

### Reject Consent

**Endpoint:** `Post /api/v1/parental-consent/6d18-1bf5-66d6-03e2-c6cb-19ca/reject`

**Description:** Parent can reject parental consent request through this endpoint.

**Note:**

=> The token (`6d18-1bf5-66d6-03e2-c6cb-19ca`) in the endpoint is to be gotten from the rejection url.

=> Rejection link (sample link: `https://fastlearnersapp.com/6d18-1bf5-66d6-03e2-c6cb-19ca/reject`) will be sent to the parent email, so capture this link to process the parental consent rejection.

=> The name in the request body is optional.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "name": "John Doe",
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |
| validation error | none |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Parental consent request rejected successfully!",
  "content": null,
  "code": 200
}
```

#### Consent Request Not Found Error

```json
{
  "success": false,
  "message": "Consent request not found!",
  "errors": null,
  "code": 400,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "success": false,
  "message": "Server error",
  "errors": ["error message"],
  "code": 500,
}
```

`


## Student Management

**Base Url:** `https://api.fastlearnersapp.com`

### Dashboard

**Endpoint:** `Get /api/v1/dashboard`

**Description:** User's dashboard overview and reports.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "type": "success",
  "success": true,
  "message": "Student information",
  "content": {
    "cards": {
      "class": "SSS1",
      "total_subjects": 5,
      "subscription": {
        "status": "active",
        "expires_at": "14-06-2026",
        "days_remaining": 7
      },
      "account_status": "active"
    },
    "lessons_covered": 0,
    "total_lessons": 50
  },
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Error Message

```json
{
  "success": false,
  "message": "Server error",
  "errors": null,
  "code": 500,
}
```


## Student's Class, Classes, Terms & Weeks

**Base Url:** `https://api.fastlearnersapp.com`

### Get Student's Class

**Endpoint:** `Get /api/v1/student/class`

**Description:** Get a student's current class.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "class_id": 4,
    "class_name": "SSS1"
  },
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error

```json
{
  "success": false,
  "message": "An error occurred while getting student class",
  "errors": ['error message],
  "code": 500,
}
```

### Get Classes

**Endpoint:** `Get /api/v1/student/classes`

**Description:** Get all classes.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "classes": [
      {
        "id": 1,
        "name": "JSS1"
      },
      {
        "id": 2,
        "name": "JSS2"
      },
      {
        "id": 3,
        "name": "JSS3"
      },
      {
        "id": 4,
        "name": "SSS1"
      },
      {
        "id": 5,
        "name": "SSS2"
      },
      {
        "id": 6,
        "name": "SSS3"
      }
    ]
  },
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Not Found Error

```json
{
  "success": false,
  "message": "No class was found!",
  "errors": null,
  "code": 404,
}
```

#### Server Error

```json
{
  "success": false,
  "message": "An error occurred while getting classes",
  "errors": ['error message],
  "code": 500,
}
```

### Get Terms

**Endpoint:** `Get /api/v1/student/terms`

**Description:** Get all Terms.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "terms": [
      {
        "id": 1,
        "name": "First"
      },
      {
        "id": 2,
        "name": "Second"
      },
      {
        "id": 3,
        "name": "Third"
      }
    ]
  },
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Not Found Error

```json
{
  "success": false,
  "message": "No term was found!",
  "errors": null,
  "code": 404,
}
```

#### Server Error

```json
{
  "success": false,
  "message": "An error occurred while getting terms",
  "errors": ['error message],
  "code": 500,
}
```

### Get Weeks

**Endpoint:** `Get /api/v1/student/weeks`

**Description:** Get all weeks.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "weeks": [
      {
        "id": 1,
        "name": 1
      },
      {
        "id": 2,
        "name": 2
      },
      {
        "id": 3,
        "name": 3
      },
      {
        "id": 4,
        "name": 4
      },
      {
        "id": 5,
        "name": 5
      },
      {
        "id": 6,
        "name": 6
      },
      {
        "id": 7,
        "name": 7
      },
      {
        "id": 8,
        "name": 8
      },
      {
        "id": 9,
        "name": 9
      },
      {
        "id": 10,
        "name": 10
      },
      {
        "id": 11,
        "name": 11
      },
      {
        "id": 12,
        "name": 12
      }
    ]
  },
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Not Found Error

```json
{
  "success": false,
  "message": "No week was found!",
  "errors": null,
  "code": 404,
}
```

#### Server Error

```json
{
  "success": false,
  "message": "An error occurred while getting weeks",
  "errors": ['error message],
  "code": 500,
}
```


## Guardian Request Management

**Base Url:** `https://api.fastlearnersapp.com`

### Accept Request

**Endpoint:** `Get /api/v1/student/guardian/request/accept/{id}`

**Description:** Accept guardian request with this endpoint using the request `id`.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | request-history |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Guardian request accepted successfully!",
  "content": null,
  "code": 200
}
```

#### Request Not Found Error

```json
{
  "success": false,
  "message": "This request was not found, try again!",
  "errors": null,
  "code": 404
}
```

#### Guardian Not Found Error

```json
{
  "success": false,
  "message": "This guardian was not found, try again!",
  "errors": null,
  "code": 404
}
```

#### Acceptance Error

```json
{
  "success": false,
  "message": "Request already accepted!",
  "errors": null,
  "code": 400
}
```

#### Request Already Rejected Error

```json
{
  "success": false,
  "message": "Request already rejected!",
  "errors": null,
  "code": 400
}
```

#### Mail Sending Error

```json
{
  "success": false,
  "message": "An error occurred while sending rejection mail, but the request was rejected successfully!",
  "errors": null,
  "code": 400,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "success": false,
  "message": "Server error",
  "errors": ["error message"],
  "code": 500,
}
```

### Reject Request

**Endpoint:** `Get /api/v1/student/guardian/request/reject/{id}`

**Description:** Reject guardian request with this endpoint using the request `id`.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | request-history |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Guardian request rejected successfully!",
  "content": null,
  "code": 200
}
```

#### Request Not Found Error

```json
{
  "success": false,
  "message": "This request was not found, try again",
  "errors": null,
  "code": 404
}
```

#### Guardian Not Found Error

```json
{
  "success": false,
  "message": "This guardian was not found, try again!",
  "errors": null,
  "code": 404
}
```

#### Acceptance Error

```json
{
  "success": false,
  "message": "Only pending requests can be accepted!",
  "errors": null,
  "code": 400
}
```

#### Request Already Accepted Error

```json
{
  "success": false,
  "message": "Request already accepted!",
  "errors": null,
  "code": 400
}
```

#### Mail Sending Error

```json
{
  "success": false,
  "message": "An error occurred while sending acceptance mail, but the request was accepted successfully!",
  "errors": null,
  "code": 400,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "success": false,
  "message": "Server error",
  "errors": ["error message"],
  "code": 500,
}
```

### Request History

**Endpoint:** `Get /api/v1/student/guardian/request/history`

**Description:** Get all guardian history request with this endpoint.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | request-history |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "history": {
      "request_history": [
        {
          "id": 1,
          "guardian_name": "Parent User",
          "guardian_email": "parent@fastlearnersapp.com",
          "status": "accepted",
          "response_date": "10-03-2026 12:17:46"
        }
      ],
      "links": {
        "first": "https://api.fastlearnersapp.com/api/v1/student/guardian/request/history?page=1",
        "last": "https://api.fastlearnersapp.com/api/v1/student/guardian/request/history?page=1",
        "prev": null,
        "next": null
      },
      "meta": {
        "current_page": 1,
        "last_page": 1,
        "per_page": 20,
        "total": 1
      }
    }
  },
  "code": 200

}
```

#### Not Found Error

```json
{
  "success": false,
  "message": "No history found!",
  "errors": null,
  "code": 404
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "success": false,
  "message": "Server error",
  "errors": ["error message"],
  "code": 500,
}
```


## Handle Answering System

**Base Url:** `https://api.fastlearnersapp.com`

### Handle Concept Exercise Answers

**Endpoint:** `Post /api/v1/lessons/check-exercise-answer`

**Description:** Use this endpoint to verify student's answers to concept exercises

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "exercise_id": 5,
  "answer": "B"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Great job! You scored 50% on your 1st attempt.",
  "content": {
    "score": "50",
    "attempt": "1st",
    "concept_total_score": "5.00",
    "concept_weight": "10.00"
  },
  "code": 200
}
```

#### Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "answer": [
      "The answer field is required."
    ],
    "exercise_id": [
      "The exercise id field is required."
    ]
  },
  "code": 422
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Exercise Already Answered Error

```json
{
  "success": true,
  "message": "Exercise already answered, continue learning!",
  "content": {
    "score": "50",
    "attempt": "1st",
  },
  "code": 200
}
```

#### Wrong Answer Response

```json
{
  "success": false,
  "message": "Wrong answer. Try again!",
  "errors": null,
  "code": 400,
}
```

#### Exercise Not Found Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "exercise_id": [
      "The selected exercise was not found!!"
    ]
  },
  "code": 422
}
```

#### Server Error Response

```json
{
  "success": false,
  "message": "There was an error checking your answer!",
  "errors": ["error messages"],
  "code": 500,
}
```

### Handle General Exercise Answers

**Endpoint:** `Post /api/v1/lessons/check-general-exercise-answer`

**Description:** Use this endpoint to verify student's general exercises answers

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "general_exercise_id": 3,
  "answer": "C"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Great job! You scored 5% on your 1st attempt.",
  "content": {
    "score": "5",
    "attempt": "1st",
    "general_exercise_total_score": "1.50",
    "general_exercise_weight": "30.00"
  },
  "code": 200
}
```

#### Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "answer": [
      "The answer field is required."
    ],
    "general_exercise_id": [
      "The general exercise id field is required."
    ]
  },
  "code": 422
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### General Exercise Already Answered Error

```json
{
  "success": true,
  "message": "General Exercise already answered, continue learning!",
  "content": {
    "score": "5",
    "attempt": "1st",
  },
  "code": 200
}
```

#### Wrong Answer Response

```json
{
  "success": false,
  "message": "Wrong answer. Try again!",
  "errors": null,
  "code": 400,
}
```

#### General Exercise Not Found Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "exercise_id": [
      "The selected general exercise was not found!"
    ]
  },
  "code": 422
}
```

#### Server Error Response

```json
{
  "success": false,
  "message": "There was an error checking your answer!",
  "errors": ["error messages"],
  "code": 500,
}
```


## Lesson Completion Check System

**Base Url:** `https://api.fastlearnersapp.com`

### Lesson Overview Completion Check

**Endpoint Format:** `Get /api/v1/lessons/check/{type}/{lesson_id}`

**Endpoint:** `Get /api/v1/lessons/check/overview/2`

**Description:** Use this endpoint to check if a student has completed the lesson overview section before continuing to the next section (Concepts)

**Note:** The `{type}` is the section type `(overview, concept, summary-and-application & general-exercises)` in this case `overview`, and `lesson_id` is the lesson id.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Overview completed successfully.",
  "content": {
    "check": [
      "is_completed": true,
      "score": "100%"
    ]
  },
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Lesson Check Marker Not Found Error

```json
{
  "success": false,
  "message": "No lesson check marker found, contact support with this error message code: 1001-2",
  "errors": null,
  "code": 400
}
```

#### Server Error Response

```json
{
  "success": false,
  "message": "There was an error verifying overview completion!",
  "errors": ["error messages"],
  "code": 500,
}
```

### Lesson Concepts Completion Check

**Endpoint Format:** `Get /api/v1/lessons/check/{type}/{lesson_id}/{concept_id}`

**Endpoint:** `Get /api/v1/lessons/check/summary-and-application/2/1`

**Description:** Use this endpoint to check if a student has completed the lesson concepts section before continuing to the next section

**Note:** The `{type}` is the section type `(overview, concept, summary-and-application & general-exercises)` in this case `concept`, `lesson_id` is the lesson id, and the `concept_id` is the concept id.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Concept completed successfully.",
  "content": {
    "check": [
      "is_completed": true,
      "score": "20%"
    ]
  },
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Lesson Check Marker Not Found Error

```json
{
  "success": false,
  "message": "No lesson check marker found, contact support with this error message code: 1001-2",
  "errors": null,
  "code": 400
}
```

#### Server Error Response

```json
{
  "success": false,
  "message": "There was an error verifying summary and application completion!",
  "errors": ["error messages"],
  "code": 500,
}
```

### Lesson Summary & Application Completion Check

**Endpoint Format:** `Get /api/v1/lessons/check/{type}/{lesson_id}`

**Endpoint:** `Get /api/v1/lessons/check/summary-and-application/2`

**Description:** Use this endpoint to check if a student has completed the lesson summary and application section before continuing to the next section (General Exercises)

**Note:** The `{type}` is the section type `(overview, concept, summary-and-application & general-exercises)` in this case `summary-and-application`, and `lesson_id` is the lesson id.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Summary and Application completed successfully.",
  "content": {
    "check": [
      "is_completed": true,
      "score": "100%"
    ]
  },
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Lesson Check Marker Not Found Error

```json
{
  "success": false,
  "message": "No lesson check marker found, contact support with this error message code: 1001-2",
  "errors": null,
  "code": 400
}
```

#### Server Error Response

```json
{
  "success": false,
  "message": "There was an error verifying summary and application completion!",
  "errors": ["error messages"],
  "code": 500,
}
```

### Lesson General Exercises Completion Check

**Endpoint Format:** `Get /api/v1/lessons/check/{type}/{lesson_id}`

**Endpoint:** `Get /api/v1/lessons/check/general-exercises/2`

**Description:** Use this endpoint to check if a student has completed the lesson general exercise section before continuing to the next lesson topic

**Note:** The `{type}` is the section type `(overview, concept, summary-and-application & general-exercises)` in this case `general-exercises`, and `lesson_id` is the lesson id.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "General exercises completed successfully.",
  "content": {
    "check": [
      "is_completed": true,
      "score": "65%"
    ]
  },
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Lesson Check Marker Not Found Error

```json
{
  "success": false,
  "message": "No lesson check marker found, contact support with this error message code: 1001-2",
  "errors": null,
  "code": 400
}
```

#### Not Completed Error Response

```json
{
  "success": false,
  "message": "Complete your lesson general exercises to continue learning!",
  "errors": null,
  "code": 400,
}
```

#### Server Error Response

```json
{
  "success": false,
  "message": "There was an error verifying general exercises completion!",
  "errors": ["error messages"],
  "code": 500,
}
```

### Handle General Exercise Answers

**Endpoint:** `Post /api/v1/lessons/check-exercise-answer`

**Description:** Use this endpoint to verify student's general exercises answers

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "general_exercise_id": 3,
  "answer": "C"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Great job! You scored 5% on your 1st attempt.",
  "content": null,
  "code": 200
}
```

#### Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "answer": [
      "The answer field is required."
    ],
    "general_exercise_id": [
      "The general exercise id field is required."
    ]
  },
  "code": 422
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Exercise Already Answered Error

```json
{
  "success": false,
  "message": "General exercise already answered, continue learning!",
  "errors": null,
  "code": 400,
}
```

#### Wrong Answer Response

```json
{
  "success": false,
  "message": "Wrong answer. Try again!",
  "errors": null,
  "code": 400,
}
```

#### General Exercise Not Found Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "exercise_id": [
      "The selected general exercise was not found!"
    ]
  },
  "code": 422
}
```

#### Server Error Response

```json
{
  "success": false,
  "message": "There was an error checking your answer!",
  "errors": ["error messages"],
  "code": 500,
}
```


## Lesson Content

**Base Url:** `https://api.fastlearnersapp.com`

### Get Lesson Content

**Endpoint:** `Get /api/v1/lessons/general-mathematics/number-bases-system/content`

**Description:** Get the lesson content which includes the Introduction, Concepts, Application, Summary and General Exercises.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "lesson": {
      "id": 2,
      "order_index": 1,
      "class": "SSS1",
      "subject": "General Mathematics",
      "term": "First",
      "week": 1,
      "topic": "Number Bases System",
      "overview": "A number base system is a way of representing numbers using a set of digits or symbols.",
      "objectives": [
        {
          "description": "At the end of the lesson, students should understand the following concepts:",
          "points": [
            "Convert from base 10 to other bases",
            "Convert from other bases to base 10",
            "Convert decimal fractions to base 10",
            "Convert between bases other than base 10",
            "Solve basic operations involving number bases"
          ]
        }
      ],
      "key_concepts": {
        "Conversion of number bases": "Changing numbers between different base systems using division or expansion methods.",
        "Operations in number bases": "Performing arithmetic such as addition, subtraction, multiplication, and division under specific base rules.",
        "Base 10 Conversion": "Understanding base 10 as a reference system for calculations between other bases.",
        "Borrowing and Carrying in Bases": "Applying modular arithmetic concepts during operations."
      },
      "summary": "Summary",
      "application": "Application",
      "video_path": null,
      "status": "active",
      "created_at": "22-08-2025",
      "updated_at": "22-08-2025",
      "concepts": [
        {
          "id": 4,
          "order_index": 1,
          "lesson_topic": "Number Bases System",
          "title": "Conversion from Base 10 to Other Bases",
          "description": [
            {
              "heading": null,
              "description": "The Modal Arithmetic that you will learn later in the session is useful in this problem. Its utility here will prepare you for the main topic. For conversion from base 10 to other bases;",
              "image_path": "https://api.fastlearnersapp.com/uploads/lessons/images/general-mathematics/ss1/first-term/concept-1-number-bases-system.png",
              "audio_path": null,
              "points": [
                "Divide the given number repeatedly by the required base",
                "Write down the remainders by the right side.",
                "Divide till the quotient becomes 0.",
                "The answer is the remainder read from bottom to top."
              ],
            }
          ],
          "created_at": "22-08-2025",
          "updated_at": "22-08-2025",
          "examples": [
            {
              "id": 7,
              "order_index": 1,
              "concept_title": "Conversion from Base 10 to Other Bases",
              "title": "Example 1",
              "problem": "Convert 67₁₀ to base 2",
              "solution_steps": [
                "67 ÷ 2 = 33 R1",
                "33 ÷ 2 = 16 R1",
                "16 ÷ 2 = 8 R0",
                "8 ÷ 2 = 4 R0",
                "4 ÷ 2 = 2 R0",
                "2 ÷ 2 = 1 R0",
                "1 ÷ 2 = 0 R1"
              ],
              "answer": "1000011₂",
              "image_path": "null,
              "audio_path": null,
              "created_at": "22-08-2025",
              "updated_at": "22-08-2025"
            },
            {
              "id": 8,
              "order_index": 2,
              "concept_title": "Conversion from Base 10 to Other Bases",
              "title": "Example 2",
              "problem": "Convert 67₁₀ to base 8",
              "solution_steps": [
                "67 ÷ 8 = 8 R3",
                "8 ÷ 8 = 1 R0",
                "1 ÷ 8 = 0 R1"
              ],
              "answer": "103₈",
              "image_path": "null,
              "audio_path": null,
              "created_at": "22-08-2025",
              "updated_at": "22-08-2025"
            }
          ],
          "exercises": [
            {
              "id": 5,
              "order_index": 1,
              "concept_title": "Conversion from Base 10 to Other Bases",
              "title": "Exercise 1",
              "problem": "Convert 97₁₀ to base 2",
              "solution_steps": [
                "67 ÷ 2 = 33 R1",
                "33 ÷ 2 = 16 R1",
                "16 ÷ 2 = 8 R0",
                "8 ÷ 2 = 4 R0",
                "4 ÷ 2 = 2 R0",
                "2 ÷ 2 = 1 R0",
                "1 ÷ 2 = 0 R1"
              ],
              "answers": [
                "1110011₂",
                "1001011₂",
                "0101011₂",
                "1000011₂"
              ],
              "correct_answer": "1000011₂",
              "correct_answer_option": "D",
              "image_path": "null,
              "audio_path": null,
              "created_at": "22-08-2025",
              "updated_at": "22-08-2025"
            },
            {
              "id": 6,
              "order_index": 2,
              "concept_title": "Conversion from Base 10 to Other Bases",
              "title": "Exercise 2",
              "problem": "Convert 152₁₀ to base 5",
              "solution_steps": [
                "67 ÷ 8 = 8 R3",
                "8 ÷ 8 = 1 R0",
                "1 ÷ 8 = 0 R1"
              ],
              "answers": [
                "103₈",
                "123₈",
                "116₈",
                "100₈"
              ],
              "correct_answer": "103₈",
              "correct_answer_option": "A",
              "image_path": "null,
              "audio_path": null,
              "created_at": "22-08-2025",
              "updated_at": "22-08-2025"
            }
          ]
        },
        {
          "id": 5,
          "order_index": 2,
          "lesson_topic": "Number Bases System",
          "title": "Conversion from Any Base to Base 10",
          "description": [
            {
              "heading": null,
              "description": "One of the methods is by expansion in the power of base as shown below.",
              "image_path": "null,
              "audio_path": null,
              "points": [],
            }
          ],
          "created_at": "22-08-2025",
          "updated_at": "22-08-2025",
          "examples": [
            {
              "id": 9,
              "order_index": 1,
              "concept_title": "Conversion from Any Base to Base 10",
              "title": "Example 1",
              "problem": "Convert 321₅ to a number in base 10",
              "solution_steps": [
                "321₅ = 3 × 5² + 2 × 5¹ + 1 × 5⁰",
                "321₅ = 3 × 25 + 10 + 1",
                "321₅ = 75 + 10 + 1"
              ],
              "answer": "86₁₀",
              "image_path": "null,
              "audio_path": null,
              "created_at": "22-08-2025",
              "updated_at": "22-08-2025"
            },
            {
              "id": 10,
              "order_index": 2,
              "concept_title": "Conversion from Any Base to Base 10",
              "title": "Example 2",
              "problem": "Convert 110101₂ to base 10",
              "solution_steps": [
                "110101₂ = 1 × 2⁵ + 1 × 2⁴ + 0 × 2³ + 1 × 2² + 0 × 2¹ + 1 × 2⁰",
                "110101₂ = 1 × 32 + 1 × 16 + 0 × 8 + 1 × 4 + 0 × 2 + 1 × 1",
                "110101₂ = 32 + 16 + 0 + 4 + 0 + 1"
              ],
              "answer": "53₁₀",
              "image_path": "null,
              "audio_path": null,
              "created_at": "22-08-2025",
              "updated_at": "22-08-2025"
            }
          ],
          "exercises": [
            {
              "id": 7,
              "order_index": 1,
              "concept_title": "Conversion from Any Base to Base 10",
              "title": "Exercise 1",
              "problem": "Convert 4156 to base 10",
              "solution_steps": [
                "67 ÷ 8 = 8 R3",
                "8 ÷ 8 = 1 R0",
                "1 ÷ 8 = 0 R1"
              ],
              "answers": [
                "86₁₀",
                "72₁₀",
                "84₁₀",
                "68₁₀"
              ],
              "correct_answer": "86₁₀",
              "correct_answer_option": "A",
              "image_path": "null,
              "audio_path": null,
              "created_at": "22-08-2025",
              "updated_at": "22-08-2025"
            },
            {
              "id": 8,
              "order_index": 2,
              "concept_title": "Conversion from Any Base to Base 10",
              "title": "Exercise 2",
              "problem": "Convert 101101₂ to base 10",
              "solution_steps": [
                "101101₂ = 1 × 2⁵ + 1 × 2⁴ + 0 × 2³ + 1 × 2² + 0 × 2¹ + 1 × 2⁰",
                "101101₂ = 1 × 32 + 1 × 16 + 0 × 8 + 1 × 4 + 0 × 2 + 1 × 1",
                "101101₂ = 32 + 16 + 0 + 4 + 0 + 1"
              ],
              "answers": [
                "63₁₀",
                "53₁₀",
                "55₁₀",
                "45₁₀"
              ],
              "correct_answer": "53₁₀",
              "correct_answer_option": "B",
              "image_path": "null,
              "audio_path": null,
              "created_at": "22-08-2025",
              "updated_at": "22-08-2025"
            }
          ]
        },
        {
          "id": 6,
          "order_index": 3,
          "lesson_topic": "Number Bases System",
          "title": "Conversion of Decimal Fractions to Base 10",
          "description": [
            {
              "heading": null,
              "description": "Conversion of Decimal Fractions to Base 10.",
              "image_path": "null,
              "audio_path": null,
              "points": [].
            }
          ],
          "created_at": "22-08-2025",
          "updated_at": "22-08-2025",
          "examples": [
            {
              "id": 11,
              "order_index": 1,
              "concept_title": "Conversion of Decimal Fractions to Base 10",
              "title": "Example 1",
              "problem": "Convert 11.011₂ to base 10",
              "solution_steps": [
                "11.011₂ = 1 × 2¹ + 1 × 20 + 0 × 2-1 + 1 × 2-2 + 1 × 2-3",
                "11.011₂ = 2 + 1 + 0 + (1/22) + (1/23) ",
                "11.011₂ = 3 + (1/4) + (1/8) = 27/8"
              ],
              "answer": "3(3/8₁₀)",
              "image_path": "null,
              "audio_path": null,
              "created_at": "22-08-2025",
              "updated_at": "22-08-2025"
            },
            {
              "id": 12,
              "order_index": 2,
              "concept_title": "Conversion of Decimal Fractions to Base 10",
              "title": "Example 2",
              "problem": "Convert 241.238 to base 10",
              "solution_steps": [
                "241.238  = 2 × 82 + 4 × 81 + 1 × 80 + 2 × 8−1 + 3 × 8−2",
                "241.238 = 2 × 64 + 4 × 8 + 1 × 1 + 2 × (1/8) + 3 × (1/64)",
                "241.238 = 128 + 32 + 1 + (2/8) + (3/64)",
                "241.238 = 161 + (19/64)"
              ],
              "answer": "161.29710",
              "image_path": "null,
              "audio_path": null,
              "created_at": "22-08-2025",
              "updated_at": "22-08-2025"
            }
          ],
          "exercises": []
        }
      ],
      "general_exercises": [
        {
          "id": 5,
          "order_index": 1,
          "lesson_topic": "Number Bases System",
          "problem": "Convert 97₁₀ to base 2",
          "solution_steps": [
            "67 ÷ 2 = 33 R1",
            "33 ÷ 2 = 16 R1",
            "16 ÷ 2 = 8 R0",
            "8 ÷ 2 = 4 R0",
            "4 ÷ 2 = 2 R0",
            "2 ÷ 2 = 1 R0",
            "1 ÷ 2 = 0 R1"
          ],
          "answers": [
            "1110011₂",
            "1001011₂",
            "0101011₂",
            "1000011₂"
          ],
          "correct_answer": "1000011₂",
          "correct_answer_option": "D",
          "image_path": "null,
          "audio_path": null,
          "created_at": "22-08-2025",
          "updated_at": "22-08-2025"
        },
        {
          "id": 6,
          "order_index": 2,
          "lesson_topic": "Number Bases System",
          "problem": "Convert 152₁₀ to base 5",
          "solution_steps": [
            "67 ÷ 8 = 8 R3",
            "8 ÷ 8 = 1 R0",
            "1 ÷ 8 = 0 R1"
          ],
          "answers": [
            "103₈",
            "123₈",
            "116₈",
            "100₈"
          ],
          "correct_answer": "103₈",
          "correct_answer_option": "A",
          "image_path": "null,
          "audio_path": null,
          "created_at": "22-08-2025",
          "updated_at": "22-08-2025"
        },
        {
          "id": 7,
          "order_index": 3,
          "lesson_topic": "Number Bases System",
          "problem": "Convert 4156 to base 10",
          "solution_steps": [
            "67 ÷ 8 = 8 R3",
            "8 ÷ 8 = 1 R0",
            "1 ÷ 8 = 0 R1"
          ],
          "answers": [
            "86₁₀",
            "72₁₀",
            "84₁₀",
            "68₁₀"
          ],
          "correct_answer": "86₁₀",
          "correct_answer_option": "A",
          "image_path": "null,
          "audio_path": null,
          "created_at": "22-08-2025",
          "updated_at": "22-08-2025"
        },
        {
          "id": 8,
          "order_index": 4,
          "lesson_topic": "Number Bases System",
          "problem": "Convert 101101₂ to base 10",
          "solution_steps": [
            "101101₂ = 1 × 2⁵ + 1 × 2⁴ + 0 × 2³ + 1 × 2² + 0 × 2¹ + 1 × 2⁰",
            "101101₂ = 1 × 32 + 1 × 16 + 0 × 8 + 1 × 4 + 0 × 2 + 1 × 1",
            "101101₂ = 32 + 16 + 0 + 4 + 0 + 1"
          ],
          "answers": [
            "63₁₀",
            "53₁₀",
            "55₁₀",
            "45₁₀"
          ],
          "correct_answer": "53₁₀",
          "correct_answer_option": "B",
          "image_path": "null,
          "audio_path": null,
          "created_at": "22-08-2025",
          "updated_at": "22-08-2025"
        }
      ],
      "check_markers": [
        {
          "id": 2,
          "lesson_topic": "Number Bases System",
          "overview": 5,
          "lesson_video": 5,
          "concept_one": 20,
          "concept_two": 25,
          "concept_three": 25,
          "concept_four": 0,
          "concept_five": 0,
          "concept_six": 0,
          "concept_seven": 0,
          "general_exercises": 20,
          "created_at": "22-08-2025",
          "updated_at": "22-08-2025"
        }
      ]
    }
  },
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Class Not Found Error

```json
{
  "success": false,
  "message": "Class not found!",
  "errors": null,
  "code": 404,
}
```

#### Lesson Not Found Error

```json
{
  "success": false,
  "message": "Lesson not found!",
  "errors": null,
  "code": 404,
}
```

#### Server Error Response

```json
{
  "success": false,
  "message": "An error occurred while getting lesson content: ",
  "errors": ["error messages"],
  "code": 500,
}
```


## Topics Overview

**Base Url:** `https://api.fastlearnersapp.com`

### Get Topics Overview

**Endpoint:** `Get /api/v1/lessons/general-mathematics/number-bases-system/overview`

**Description:** Get the overview of a topic which comprises of Introduction, Concepts, Application, Summary and General Exercises.

**Note:** => For the concepts, it returns a count of the total number of the concept a lesson topic has, so you'll have to loop through the count. The count number will be appended to the concept url to display it specific content e.g `lessons/economics/meaning-of-economics-and-related-concepts/concepts/1` for concept 1

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "overview": {
      "introduction": "Introduction",
      "concepts_count": 3,
      "summary": "Summary",
      "application": "Application",
      "general_exercises": "General Exercises"
    }
  },
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Subject Not Found Error

```json
{
  "success": false,
  "message": "Subject not found!",
  "errors": null,
  "code": 404,
}
```

#### Topic Not Found Error

```json
{
  "success": false,
  "message": "Lesson topic not found!",
  "errors": null,
  "code": 404,
}
```

#### Server Error Response

```json
{
  "success": false,
  "message": "An error occurred while getting lesson content: ",
  "errors": ["error messages"],
  "code": 500,
}
```


## Student's Subject

**Base Url:** `https://api.fastlearnersapp.com`

### Student's Subject

**Endpoint:** `Get /api/v1/lessons/`

**Description:** Get the list of a student's subjects (compulsory subject, compulsory selective, selective subjects.

**Note:** => The subject "slug" should be appended to the topics url to get the topics.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "subjects": [
      {
        "id": 1,
        "name": "General Mathematics",
        "slug": "general-mathematics"
      },
      {
        "id": 2,
        "name": "English Language",
        "slug": "english-language"
      },
      {
        "id": 18,
        "name": "Civic Education",
        "slug": "civic-education"
      },
      {
        "id": 4,
        "name": "Biology",
        "slug": "biology"
      },
      {
        "id": 5,
        "name": "Physics",
        "slug": "physics"
      },
      {
        "id": 6,
        "name": "Chemistry",
        "slug": "chemistry"
      },
      {
        "id": 22,
        "name": "Christian Religious Studies",
        "slug": "christian-religious-studies"
      },
      {
        "id": 31,
        "name": "Efik",
        "slug": "efik"
      },
      {
        "id": 7,
        "name": "Further Mathematics",
        "slug": "further-mathematics"
      },
      {
        "id": 8,
        "name": "Economics",
        "slug": "economics"
      },
      {
        "id": 36,
        "name": "Computer Studies",
        "slug": "computer-studies"
      }
    ]
  },
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### User Class Not Found Error

```json
{
  "success": false,
  "message": "User class not found!",
  "errors": null,
  "code": 404,
}
```

#### Server Error Response

```json
{
  "success": false,
  "message": "There was an error fetching your subjects!",
  "errors": ["error messages"],
  "code": 500,
}
```


## Topics

**Base Url:** `https://api.fastlearnersapp.com`

### Get Topics

**Endpoint:** `Get /api/v1/lessons/general-mathematics`

**Description:** Get the list of topics of a subject

**Note:** => The subject "slug" should be appended to the overview url to get the lesson topic overview.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Lesson topics!",
  "content": {
    "topics": {
      "first_term": [
        {
          "id": 1,
          "topic": "Number Bases System",
          "slug": "number-bases-system",
          "week": 1,
          "order_index": 1
        }
      ],
      "second_term": [
        {
          "id": 2,
          "topic": "Number Bases System",
          "slug": "number-bases-system",
          "week": 1,
          "order_index": 2
        }
      ],
      "third_term": [
        {
          "id": 3,
          "topic": "Number Bases System",
          "slug": "number-bases-system",
          "week": 1,
          "order_index": 3
        }
      ]
    }
  },
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Subject Not Found Error

```json
{
  "success": false,
  "message": "Subject not found!",
  "errors": null,
  "code": 404,
}
```

#### Class Not Found Error

```json
{
  "success": false,
  "message": "Error getting your class!",
  "errors": null,
  "code": 404,
}
```

#### Term Not Found Error

```json
{
  "success": false,
  "message": "Error getting your term!",
  "errors": null,
  "code": 404,
}
```

#### Server Error Response

```json
{
  "success": false,
  "message": "An error occurred while getting lesson topics!",
  "errors": ["error messages"],
  "code": 500,
}
```


## Total Scores API Request

**Base Url:** `https://api.fastlearnersapp.com`

### Concepts Total Scores API Request

**Endpoint Format:** `Get /api/v1/lessons/scores/concepts/{concept_id}`

**Endpoint:** `Get /api/v1/lessons/scores/concepts/1`

**Description:** Use this endpoint to get a lesson's concept total score using the `concept_id`.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "concept_id": 1,
    "total_score": "10.00",
    "weight": "10.00"
  },
  "code": 200
}
```

#### Concept Total Score Not Found Error

```json
{
  "success": false,
  "message": "Concept total score not found!",
  "errors": null,
  "code": 400
}
```

#### Server Error Response

```json
{
  "success": false,
  "message": "An error occurred while getting the concept total score!",
  "errors": ["error messages"],
  "code": 500,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

### General Exercises Total Scores API Request

**Endpoint Format:** `Get /api/v1/lessons/scores/general-exercises/{lesson_id}`

**Endpoint:** `Get /api/v1/lessons/scores/general-exercises/1`

**Description:** Use this endpoint to get a lesson's general exercise total score using the `lesson_id`.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "total_score": "4.50",
    "weight": "30.00"
  },
  "code": 200
}
```

#### General Exercise Total Score Not Found Error

```json
{
  "success": false,
  "message": "General Exercise total score not found!",
  "errors": null,
  "code": 400
}
```

#### Server Error Response

```json
{
  "success": false,
  "message": "An error occurred while getting the general exercise total score!",
  "errors": ["error messages"],
  "code": 500,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

### Lessons Total Scores API Request

**Endpoint Format:** `Get /api/v1/lessons/scores/lessons/{lesson_id}`

**Endpoint:** `Get /api/v1/lessons/scores/lessons/1`

**Description:** Use this endpoint to get a lesson's total score using the `lesson_id`.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "lesson_total_score": "32.50"
    "weight": 100.00
  },
  "code": 200
}
```

#### Lesson Total Score Not Found Error

```json
{
  "success": false,
  "message": "Lesson total score not found!",
  "errors": null,
  "code": 400
}
```

#### Server Error Response

```json
{
  "success": false,
  "message": "An error occurred while getting the lesson total score!",
  "errors": ["error messages"],
  "code": 500,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

### Lessons Total Scores Summary API Request

**Endpoint Format:** `Get /api/v1/lessons/scores/lessons/summary/{lesson_id}`

**Endpoint:** `Get /api/v1/lessons/scores/lessons/summary/1`

**Description:** Use this endpoint to get a lesson's total score summary using the `lesson_id`.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "lesson_summary": {
      "overview": "5.00/5.00",
      "video": "5.00/5.00",
      "concepts": {
        "Definition of Science and Biology": "10.00/10.00",
        "Process of Science": "8.00/10.00"
      },
      "general_exercise": "4.5/30.00"
    },
    "lesson_total": "32.50/100"
  },
  "code": 200
}
```

#### Lesson Check Marker Not Found Error

```json
{
  "success": false,
  "message": "Lesson check marker not found!",
  "errors": null,
  "code": 400
}
```

#### Lesson Total Score Not Found Error

```json
{
  "success": false,
  "message": "Lesson total score not found!",
  "errors": null,
  "code": 400
}
```

#### Concept Total Scores Not Found Error

```json
{
  "success": false,
  "message": "No concepts total scores found!",
  "errors": null,
  "code": 400
}
```

#### Server Error Response

```json
{
  "success": false,
  "message": "An error occurred while getting lesson's total scores summary!",
  "errors": ["error messages"],
  "code": 500,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

### Subjects Total Scores API Request

**Endpoint Format:** `Get /api/v1/lessons/scores/subjects/{subject_id}/{term_id}`

**Endpoint:** `Get /api/v1/lessons/scores/subjects/4/1`

**Description:** Use this endpoint to get a subject's total score using the `subject_id` and `term_id`.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "subject_total_score": "3.25"
    "weight": 100.00
  },
  "code": 200
}
```

#### Subject Total Score Not Found Error

```json
{
  "success": false,
  "message": "Subject total score not found!",
  "errors": null,
  "code": 400
}
```

#### Server Error Response

```json
{
  "success": false,
  "message": "An error occurred while getting the subject total score!",
  "errors": ["error messages"],
  "code": 500,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

### All Lessons Total Scores API Request

**Endpoint Format:** `Get /api/v1/lessons/scores/lessons/total/{subject_id}/{term_id}`

**Endpoint:** `Get /api/v1/lessons/scores/lessons/total/4/1`

**Description:** Use this endpoint to get all the lesson's total scores of a specific subject using the `subject_id` and `term_id`.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "total_scores": {
      "Introduction to Biology": [
        {
          "total_score": "32.50"
        }
      ]
    }
  },
  "code": 200
}
```

#### Lessons Total Score Not Found Error

```json
{
  "success": false,
  "message": "No lessons total score found!",
  "errors": null,
  "code": 400
}
```

#### Server Error Response

```json
{
  "success": false,
  "message": "An error occurred while getting all lesson's total scores!",
  "errors": ["error messages"],
  "code": 500,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

### All Subjects Total Scores API Request

**Endpoint Format:** `Get /api/v1/lessons/scores/subjects/total/{term_id}`

**Endpoint:** `Get /api/v1/lessons/scores/subjects/total/1`

**Description:** Use this endpoint to get all the subject's total score of the student current class.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "total_scores": {
      "Biology": [
        {
          "total_score": "3.25"
        }
      ]
    }
  },
  "code": 200
}
```

#### Subject Total Score Not Found Error

```json
{
  "success": false,
  "message": "No subjects total score found!",
  "errors": null,
  "code": 400
}
```

#### Server Error Response

```json
{
  "success": false,
  "message": "An error occurred while getting all subject's total scores!",
  "errors": ["error messages"],
  "code": 500,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


## Student's Subject

**Base Url:** `https://api.fastlearnersapp.com`

### List Student's Subjects

**Endpoint:** `Get /api/v1/subjects`

**Description:** Get the list of a student's subjects, compulsory selective subjects, compulsory selective subject status, selective subjects and selective subject status.

**Note:** => The compulsory selective subject status and selective subjects data is returned if the student is in a JSS class.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "subjects": [
      {
        "id": 1,
        "name": "General Mathematics"
      },
      {
        "id": 2,
        "name": "English Language"
      },
      {
        "id": 18,
        "name": "Civic Education"
      },
      {
        "id": 4,
        "name": "Biology"
      },
      {
        "id": 5,
        "name": "Physics"
      },
      {
        "id": 6,
        "name": "Chemistry"
      },
      {
        "id": 22,
        "name": "Christian Religious Studies"
      },
      {
        "id": 31,
        "name": "Efik"
      },
      {
        "id": 7,
        "name": "Further Mathematics"
      },
      {
        "id": 8,
        "name": "Economics"
      },
      {
        "id": 36,
        "name": "Computer Studies"
      }
    ],
    "compulsory_selective_status": "selected",
    "compulsory_selective": [
      {
        "id": 22,
        "name": "Christian Religious Studies"
      },
      {
        "id": 23,
        "name": "Islamic Religious Studies"
      },
      {
        "id": 24,
        "name": "Religious and Moral Education"
      }
    ],
    "selective_status": "selected",
    "selective": [
      {
        "id": 3,
        "name": "Agricultural Science"
      },
      {
        "id": 7,
        "name": "Further Mathematics"
      },
      {
        "id": 8,
        "name": "Economics"
      },
      {
        "id": 9,
        "name": "Geography"
      },
      {
        "id": 27,
        "name": "Yoruba"
      },
      {
        "id": 28,
        "name": "Hausa"
      },
      {
        "id": 29,
        "name": "Igbo"
      },
      {
        "id": 30,
        "name": "Ibibio"
      },
      {
        "id": 31,
        "name": "Efik"
      },
      {
        "id": 32,
        "name": "Obolo"
      },
      {
        "id": 35,
        "name": "Technical Drawing"
      },
      {
        "id": 36,
        "name": "Computer Studies"
      }
    ]
  },
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

### Update compulsory selective subject

**Endpoint:** `Post /api/v1/subjects/update-compulsory-selective`

**Description:** Updating compulsory selective subject is only applicable to JSS classes.

**Note:**
=> Under compulsory selective subject, a student is to select one (1) subject from the list of the religious studies.

=> Post the subject id in the request body.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "subject": 22,
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |
| validation error | none |
| unauthorized | login |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Compulsory Selective subject Updated successfully!",
  "content": null,
  "code": 200,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Error Response

```json
{
  "success": false,
  "message": "Error updating compulsory selective subject, try again!",
  "errors": null,
  "code": 400,
}
```

#### Server Error Response

```json
{
  "success": false,
  "message": "An error occurred while updating compulsory selective subject!",
  "errors": ["error messages"],
  "code": 500,
}
```

### Update selective subject

**Endpoint:** `Post /api/v1/subjects/update-selective`

**Description:** Update a student's selective/discipline selective subjects.

**Note:**
=> Under selective (for JSS class) or discipline selective subjects (for SSS class), students are to select four (4) subjects from the list of subjects

=> Post the subject ids in the request body.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "subjects[]": 31,
  "subjects[]": 7,
  "subjects[]": 8,
  "subjects[]": 36,
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |
| validation error | none |
| unauthorized | login |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Selective subjects Updated successfully!",
  "content": null,
  "code": 200,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Response

```json
{
  "success": false,
  "message": "An error occurred while updating selective subjects!",
  "errors": ["error messages"],
  "code": 500,
}
```


## Subscription Management

**Base Url:** `https://api.fastlearnersapp.com`

### Verify Coupon

**Endpoint:** `POST /api/v1/subscriptions/verify-coupon`

**Description:** This endpoint verifies the coupon of a user and calculate their discount.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "package_id": 1,
  "coupon_code": "NEWCOM",
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |
| validation error | none |

#### Success Response (200)

```json
{
  "type": "success",
  "success": true,
  "message": "Success",
  "content": {
    "amount": "4,000.00",
    "discount_amount": "600.00",
    "payment_amount": "3,400.00"
  },
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while calculating coupon, try again!",
  "errors": ["error message"],
  "code": 500,
}
```

### Subscribe Package

**Endpoint:** `POST /api/v1/subscriptions/subscribe`

**Description:** This endpoint generates the paystack payment link (authorization_url) for student to make payment. It returns the payment link where you'll open the link for payment to be made on the paystack payment page.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "package_id": 1,
  "coupon_code": "NEWCOM",
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | payment link (authorization_url) |
| validation error | none |

#### Success Response (200)

```json
{
  "type": "success",
  "success": true,
  "message": "Authorization URL created",
  "content": {
    "authorization_url": "https://checkout.paystack.com/q3gxk68ush3zu4l",
    "access_code": "q3gxk68ush3zu4l",
    "reference": "fl-4d04c63c-2eb0-443e-a78a-c23f3bc4308a"
  },
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "success": false,
  "message": "An error occurred while processing payment, try again!",
  "errors": ["error message"],
  "code": 500,
}
```

### Get Payment Status

**Frontend Url:** `https://fastlearnersapp.com/subscriptions/payment-status`

**Endpoint:** `GET /api/v1/subscriptions/payment-status/:reference`

**Description:** Get the payment status after a payment has been made with this endpoint using the reference that will be added to the frontend url by paystack after payment.

**Note:**

=> Make your frontend url exactly as stated above.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Payment was successful",
  "content": {
    "transaction_detail": {
      "id": 6,
      "package": "Basic",
      "coupon": "NEWCOM",
      "reference": "fl-330048f4-8db5-40c5-883b-a87ad5669696",
      "amount": "4,000.00",
      "discount_amount": "600.00",
      "payment_amount": "3,400.00",
      "status": "pending",
      "created_at": "01-06-2026"
    }
  },
  "code": 200
}
```

#### Payment Failed Error

```json
{
  "success": false,
  "message": "Payment Failed",
  "errors": null,
  "code": 400
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "success": false,
  "message": "An error occurred while processing payment, try again!",
  "errors": ["error message"],
  "code": 500,
}
```

### Get Transaction History

**Endpoint:** `GET /api/v1/transactions`

**Description:** Get user transaction history.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |

#### Success Response (200)

```json
{
  "type": "success",
  "success": true,
  "message": "Success",
  "content": [
    {
      "transactions": [
        {
          "id": 1,
          "package": "Basic",
          "coupon": null,
          "reference": "fl-eb7b64d6-18b7-40cf-8198-f7fc7e09ef6b",
          "amount": "4,000.00",
          "discount_amount": "0.00",
          "payment_amount": "4,000.00",
          "status": "pending",
          "created_at": "30-05-2026"
        },
        {
          "id": 2,
          "package": "Basic",
          "coupon": "NEWCOM",
          "reference": "fl-751bdfa8-aaaa-4058-acc0-2e819d08a51f",
          "amount": "4,000.00",
          "discount_amount": "600.00",
          "payment_amount": "3,400.00",
          "status": "pending",
          "created_at": "31-05-2026"
        },
        {
          "id": 3,
          "package": "Basic",
          "coupon": "NEWCOM",
          "reference": "fl-ff8a6ec8-ab22-42e8-a93e-c07569f56f88",
          "amount": "4,000.00",
          "discount_amount": "600.00",
          "payment_amount": "3,400.00",
          "status": "pending",
          "created_at": "31-05-2026"
        },
        {
          "id": 4,
          "package": "Basic",
          "coupon": "NEWCOM",
          "reference": "fl-b869af89-84be-4d36-98af-1b95f6bc0b5e",
          "amount": "4,000.00",
          "discount_amount": "600.00",
          "payment_amount": "3,400.00",
          "status": "pending",
          "created_at": "31-05-2026"
        },
        {
          "id": 5,
          "package": "Basic",
          "coupon": "NEWCOM",
          "reference": "fl-1f026f44-af42-426c-b8f8-56104827c790",
          "amount": "4,000.00",
          "discount_amount": "600.00",
          "payment_amount": "3,400.00",
          "status": "pending",
          "created_at": "31-05-2026"
        }
      ],
      "links": {
        "first": "https://api.fastlearnersapp.com/api/v1/transactions?page=1",
        "last": "https://api.fastlearnersapp.com/api/v1/transactions?page=2",
        "prev": null,
        "next": "https://api.fastlearnersapp.com/api/v1/transactions?page=2"
      },
      "meta": {
        "current_page": 1,
        "last_page": 2,
        "per_page": 10,
        "total": 5
      }
    }
  ],
  "code": 200
}
}
```

#### Transaction Not Found Error

```json
{
  "success": false,
  "message": "No transaction found!",
  "errors": null,
  "code": 400
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "success": false,
  "message": "An error occurred while verifying your payment, try again!",
  "errors": ["error message"],
  "code": 500,
}
```

### Get Subscription History

**Endpoint:** `GET /api/v1/subscriptions`

**Description:** Get user subscription history.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |

#### Success Response (200)

```json
{
  "type": "success",
  "success": true,
  "message": "Success",
  "content": [
    {
      "subscriptions": [
        {
          "id": 2,
          "package": "Basic",
          "subscription_reference": "SUB-3IWQEUF6JDFGFKSG",
          "starts_at": "15-05-2026",
          "expires_at": "14-06-2026",
          "status": "active",
          "created": "01-06-2026"
        },
        {
          "id": 1,
          "package": "Basic",
          "subscription_reference": "SUB-3IWQEUF6CIKMUFNY",
          "starts_at": "01-06-2026",
          "expires_at": "01-07-2026",
          "status": "active",
          "created": "01-06-2026"
        }
      ],
      "links": {
        "first": "https://api.fastlearnersapp.com/api/v1/subscriptions?page=1",
        "last": "https://api.fastlearnersapp.com/api/v1/subscriptions?page=1",
        "prev": null,
        "next": null
      },
      "meta": {
        "current_page": 1,
        "last_page": 1,
        "per_page": 10,
        "total": 2
      }
    }
  ],
  "code": 200
}
}
```

#### Transaction Not Found Error

```json
{
  "success": false,
  "message": "No transaction found!",
  "errors": null,
  "code": 400
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "success": false,
  "message": "An error occurred while verifying your payment, try again!",
  "errors": ["error message"],
  "code": 500,
}
```


## Packages

**Base Url:** `https://api.fastlearnersapp.com`

### View Packages

**Endpoint:** `Get /api/v1/packages`

**Description:** Get the list of all the subscription packages.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | None |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Subscription packages",
  "content": {
    "packages": [
      {
        "id": 1,
        "name": "Basic",
        "slug": "basic",
        "amount": "2,500.00",
        "billing_cycle": "monthly",
        "duration_days": 30,
        "description": null,
        "is_active": true,
        "created_at": "21-05-2026",
        "updated_at": "21-05-2026"
      }
    ]
  },
  "code": 200
}
```

#### Package Not Found Error

```json
{
  "success": false,
  "message": "No package was found!",
  "errors": null,
  "code": 404
}
```

#### Server Error Message

```json
{
  "success": false,
  "message": "An error occurred while retrieving packages",
  "errors": ["error message"],
  "code": 500,
}
```

### View Package

**Endpoint:** `Get /api/v1/packages/1/view`

**Description:** Get a specific subscription package detail.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | None |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Subscription packages",
  "content": {
     "package": {
      "id": 1,
      "name": "Basic",
      "slug": "basic",
      "amount": "4,000.00",
      "original_amount": null,
      "billing_cycle": "monthly",
      "duration_days": 30,
      "description": null,
      "is_active": true,
      "created_at": "30-05-2026",
      "updated_at": "30-05-2026"
    }
  },
  "code": 200
}
```

#### Package Not Found Error

```json
{
  "success": false,
  "message": "No package was found!",
  "errors": null,
  "code": 404
}
```

#### Server Error Message

```json
{
  "success": false,
  "message": "An error occurred while retrieving packages",
  "errors": ["error message"],
  "code": 500,
}
```


## Ticket Management

**Base Url:** `https://api.fastlearnersapp.com`

### View Tickets

**Endpoint:** `GET /api/v1/tickets`

**Description:** This endpoint retrieves the list of user's tickets.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |
| validation error | none |

#### Success Response (200)

```json
{
  "type": "success",
  "success": true,
  "message": "Tickets retrieved successfully!",
  "content": [
    {
      "tickets": [
        {
          "id": 5,
          "category": "Billing",
          "priority": "High",
          "status": "Open",
          "assigned_to": [
            {
              "id": 4,
              "ticket_id": 5,
              "ticket_subject": "Invoice",
              "assigned_by": "Super Admin",
              "assigned_to": "Super Admin",
              "created_at": "07-06-2026",
              "updated_at": "07-06-2026"
            },
            {
              "id": 5,
              "ticket_id": 5,
              "ticket_subject": "Invoice",
              "assigned_by": "Super Admin",
              "assigned_to": "Admin User",
              "created_at": "07-06-2026",
              "updated_at": "07-06-2026"
            }
          ],
          "closed_by": [],
          "subject": "Invoice",
          "description": "Will I get an invoice after payment?",
          "created_at": "05-06-2026",
          "updated_at": "07-06-2026"
        },
        {
          "id": 4,
          "category": "Billing",
          "priority": "High",
          "status": "Open",
          "assigned_to": [],
          "closed_by": [],
          "subject": "Invoice",
          "description": "Will I get an invoice after payment?",
          "created_at": "05-06-2026",
          "updated_at": "05-06-2026"
        },
        {
          "id": 3,
          "category": "Billing",
          "priority": "High",
          "status": "Closed",
          "assigned_to": [],
          "closed_by": [],
          "subject": "Invoice",
          "description": "Will I get an invoice after payment?",
          "created_at": "05-06-2026",
          "updated_at": "06-06-2026"
        },
        {
          "id": 2,
          "category": "Billing",
          "priority": "High",
          "status": "Open",
          "assigned_to": [],
          "closed_by": {
            "name": "Student User",
            "email": "student@fastlearnersapp.com"
          },
          "subject": "Invoice",
          "description": "Will I get an invoice after payment?",
          "created_at": "05-06-2026",
          "updated_at": "07-06-2026"
        },
        {
          "id": 1,
          "category": "Account",
          "priority": "High",
          "status": "Open",
          "assigned_to": [
            {
              "id": 6,
              "ticket_id": 1,
              "ticket_subject": "Account creation issue",
              "assigned_by": "Super Admin",
              "assigned_to": "Admin User",
              "created_at": "07-06-2026",
              "updated_at": "07-06-2026"
            }
          ],
          "closed_by": [],
          "subject": "Account creation issue",
          "description": "I'm having issue create my account successfully",
          "created_at": "05-06-2026",
          "updated_at": "07-06-2026"
        }
      ],
      "links": {
        "first": "https://api.fastlearnersapp.com/api/v1/superadmin/tickets?page=1",
        "last": "https://api.fastlearnersapp.com/api/v1/superadmin/tickets?page=1",
        "prev": null,
        "next": null
      },
      "meta": {
        "current_page": 1,
        "last_page": 1,
        "per_page": 10,
        "total": 5
      }
    }
  ],
  "code": 200
}
```

#### Ticket Not Found Error

```json
{
  "type": "error",
  "success": false,
  "message": "No ticket created yet!",
  "errors": null,
  "code": 400,
}
```

#### Unauthorized Access

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving tickets!",
  "errors": ["error message"],
  "code": 500,
}
```

### View Ticket

**Endpoint:** `GET /api/v1/tickets/2/view`

**Description:** This endpoint retrieves a specific ticket.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |
| validation error | none |

#### Success Response (200)

```json
{
  "type": "success",
  "success": true,
  "message": "Ticket retrieved successfully!",
  "content": {
    "ticket": {
      "id": 2,
      "category": "Billing",
      "priority": "High",
      "status": "Open",
      "assigned_to": null,
      "subject": "Invoice",
      "description": "Will I get an invoice after payment?",
      "replies": [],
      "ticket_attachments": [
        {
          "id": 1,
          "ticket_id": 2,
          "ticket_message_id": null,
          "path": "https://api.fastlearnersapp.com/storage/tickets/6a221a5e8f561_student.png",
          "original_file_name": "time.png",
          "file_type": "image/png",
          "file_size": 7048,
          "created_at": "05-06-2026",
          "updated_at": "05-06-2026"
        },
        {
          "id": 2,
          "ticket_id": 2,
          "ticket_message_id": null,
          "path": "https://api.fastlearnersapp.com/storage/tickets/6a221a5e9c4a3_student.png",
          "original_file_name": "Training Exercise.png",
          "file_type": "image/png",
          "file_size": 72954,
          "created_at": "05-06-2026",
          "updated_at": "05-06-2026"
        },
        {
          "id": 3,
          "ticket_id": 2,
          "ticket_message_id": null,
          "path": "https://api.fastlearnersapp.com/storage/tickets/6a221a5e9dc1c_student.png",
          "original_file_name": "logo-n-01.png",
          "file_type": "image/png",
          "file_size": 37529,
          "created_at": "05-06-2026",
          "updated_at": "05-06-2026"
        }
      ],
      "created_at": "05-06-2026",
      "updated_at": "07-06-2026"
    }
  },
  "code": 200
}
```

#### Ticket Not Found Error

```json
{
  "type": "error",
  "success": false,
  "message": "Ticket not found!",
  "errors": null,
  "code": 400,
}
```

#### Unauthorized Access

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving ticket!",
  "errors": ["error message"],
  "code": 500,
}
```

### View Ticket Priority

**Endpoint:** `GET /api/v1/tickets/priorities`

**Description:** This endpoint retrieves the list of ticket priorities.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |
| validation error | none |

#### Success Response (200)

```json
{
  "type": "success",
  "success": true,
  "message": "Success",
  "content": {
    "priorities": [
      {
        "id": 1,
        "name": "Low",
        "is_active": "active",
        "created_at": "30-05-2026",
        "updated_at": "30-05-2026"
      },
      {
        "id": 2,
        "name": "Medium",
        "is_active": "active",
        "created_at": "30-05-2026",
        "updated_at": "30-05-2026"
      },
      {
        "id": 3,
        "name": "High",
        "is_active": "active",
        "created_at": "30-05-2026",
        "updated_at": "30-05-2026"
      },
      {
        "id": 4,
        "name": "Urgent",
        "is_active": "active",
        "created_at": "30-05-2026",
        "updated_at": "30-05-2026"
      }
    ]
  },
  "code": 200
}
```

#### Ticket Priority Not Found Error

```json
{
  "type": "error",
  "success": false,
  "message": "No ticket priority found!",
  "errors": null,
  "code": 400,
}
```

#### Unauthorized Access

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving ticket priorities!",
  "errors": ["error message"],
  "code": 500,
}
```

### View Ticket Categories

**Endpoint:** `GET /api/v1/tickets/categories`

**Description:** This endpoint retrieves the list of ticket categories.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |
| validation error | none |

#### Success Response (200)

```json
{
  "type": "success",
  "success": true,
  "message": "Success",
  "content": {
    "categories": [
      {
        "id": 1,
        "name": "Account",
        "is_active": "active",
        "created_at": "30-05-2026",
        "updated_at": "30-05-2026"
      },
      {
        "id": 2,
        "name": "Technical Support",
        "is_active": "active",
        "created_at": "30-05-2026",
        "updated_at": "30-05-2026"
      },
      {
        "id": 3,
        "name": "Billing",
        "is_active": "active",
        "created_at": "30-05-2026",
        "updated_at": "30-05-2026"
      },
      {
        "id": 4,
        "name": "Complaint",
        "is_active": "active",
        "created_at": "30-05-2026",
        "updated_at": "30-05-2026"
      },
      {
        "id": 5,
        "name": "Academic",
        "is_active": "active",
        "created_at": "30-05-2026",
        "updated_at": "30-05-2026"
      },
      {
        "id": 6,
        "name": "General Inquiry",
        "is_active": "active",
        "created_at": "30-05-2026",
        "updated_at": "30-05-2026"
      }
    ]
  },
}
```

#### Ticket Category Not Found Error

```json
{
  "type": "error",
  "success": false,
  "message": "No ticket category found!",
  "errors": null,
  "code": 400,
}
```

#### Unauthorized Access

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving ticket categories!",
  "errors": ["error message"],
  "code": 500,
}
```

### Create Ticket

**Endpoint:** `POST /api/v1/tickets/create`

**Description:** With this endpoint users can create tickets .

**Note:**

=> Users can add maximum of 3 attachment (file or image) of mime type doc, docx, pdf jpg, jpeg, png, pdf, doc, docx and max file size of 200kb.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "subject": Invoice,
  "description": "Will I get an invoice after payment?",
  "category_id": 3,
  "priority_id": 3,
  "attachments[]": (the attachment),
  "attachments[]": (the attachment),
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | view tickets |
| validation error | none |

#### Success Response (200)

```json
{
  "type": "success",
  "success": true,
  "message": "Ticket created successfully!",
  "content": [
    {
      "id": 5,
      "category": "Billing",
      "priority": "High",
      "status": "Open",
      "assigned_to": null,
      "subject": "Invoice",
      "description": "Will I get an invoice after payment?",
      "attachments": [
        {
          "id": 10,
          "ticket_id": 5,
          "ticket": "Invoice",
          "ticket_message_id": null,
          "path": "https://api.fastlearnersapp.com/storage/tickets/6a22228eee662_175476309546.png",
          "original_file_name": "time.png",
          "file_type": "image/png",
          "file_size": 7048,
          "created_at": "05-06-2026",
          "updated_at": "05-06-2026"
        },
        {
          "id": 11,
          "ticket_id": 5,
          "ticket": "Invoice",
          "ticket_message_id": null,
          "path": "https://api.fastlearnersapp.com/storage/tickets/6a22228ef3e3b_175476309546.png",
          "original_file_name": "Training Exercise.png",
          "file_type": "image/png",
          "file_size": 72954,
          "created_at": "05-06-2026",
          "updated_at": "05-06-2026"
        },
      ],
      "created_at": "05-06-2026",
      "updated_at": "05-06-2026"
    }
  ],
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "success": false,
  "message": "An error occurred while creating your ticket, try again!",
  "errors": ["error message"],
  "code": 500,
}
```

### Reply Ticket

**Endpoint:** `POST /api/v1/tickets/5/reply`

**Description:** With this endpoint users can reply tickets.

**Note:**

=> Users can add maximum of 3 attachments (file or image) of mime type doc, docx, pdf jpg, jpeg, png, pdf, doc, docx and max file size of 200kb.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "message": "When should I be expecting the update?",
  "attachments[]": (the attachment),
  "attachments[]": (the attachment),
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | view ticket |
| validation error | none |

#### Success Response (200)

```json
{
  "type": "success",
  "success": true,
  "message": "Ticket replied successfully!",
  "content": [
    {
      "id": 14,
      "sender_type": 'user,
      "reply": "When should I be expecting the update?",
      "reply_attachments": [
        {
          "id": 20,
          "path": "https://fastlearnersapp.com/storage/tickets/6a27be1f59d3a_1780989471.png",
          "created_at": "09-06-2026",
          "updated_at": "09-06-2026"
        }
      ],
      "created_at": "09-06-2026 07:17",
      "updated_at": "09-06-2026 07:17"
    }
  ],
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "success": false,
  "message": "An error occurred while replying your ticket, try again!",
  "errors": ["error message"],
  "code": 500,
}
```

### Close Ticket

**Endpoint:** `POST /api/v1/tickets/3/close`

**Description:** With this endpoint users can close tickets .

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | view ticket |
| validation error | none |

#### Success Response (200)

```json
{
  "type": "success",
  "success": true,
  "message": "Ticket is closed successfully!",
  "content": null,
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "success": false,
  "message": "An error occurred while closing ticket, try again!",
  "errors": ["error message"],
  "code": 500,
}
```


## Delete Lesson

**Base Url:** `https://api.fastlearnersapp.com`

### Trash Lesson

**Endpoint:** `Delete /api/v1/superadmin/lessons/lessons/1/trash`

**Description:** Move lesson to trash using the lesson id.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |
| unauthorized | login |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Lesson moved to trash successfully!",
  "content": null,
  "code": 200
}
```

#### Lesson Not Found Error

```json
{
  "success": false,
  "message": "This lesson cannot be found!",
  "errors": null,
  "code": 404,
}
```

#### Fetch Error

```json
{
  "success": false,
  "message": "Error moving lesson to trash: (error message)",
  "errors": null,
  "code": 500,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

Restore Lesson

### Restore Lesson

**Endpoint:** `Post /api/v1/superadmin/lessons/lessons/1/restore`

**Description:** Restore lesson from trash using the lesson id.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | view-trashed-lessons |
| unauthorized | login |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Lesson restored successfully!",
  "content": null,
  "code": 200
}
```

#### Lesson Not Found Error

```json
{
  "success": false,
  "message": "This lesson does not exist in the trash!",
  "errors": null,
  "code": 404,
}
```

#### Restore Error

```json
{
  "success": false,
  "message": "Error restoring lesson: (error message)",
  "errors": null,
  "code": 500,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

Delete Lesson

### Permanently Delete Lesson

**Endpoint:** `Delete /api/v1/superadmin/lessons/lessons/1/delete`

**Description:** Permanently delete a lesson from trash using the lesson id.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | viw-trashed-lessons |
| unauthorized | login |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Lesson permanently deleted successfully!",
  "content": null,
  "code": 200
}
```

#### Lesson Not Found Error

```json
{
  "success": false,
  "message": "This lesson does not exist in the trash!",
  "errors": null,
  "code": 404,
}
```

#### Fetch Error

```json
{
  "success": false,
  "message": "Error deleting lesson permanently: (error message)",
  "errors": null,
  "code": 500,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


## Get Specific Lesson

**Base Url:** `https://api.fastlearnersapp.com`

### Get Specific Lesson

**Endpoint:** `Get /api/v1/superadmin/lessons/lesson/2`

**Description:** Get specific lesson.

**Notes:**

=> To get a specific lesson, the lesson id has to be passed as a url parameter.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "id": 2,
    "order_index": 1,
    "class": "SSS1",
    "subject": "General Mathematics",
    "term": "First",
    "week": 1,
    "topic": "Number Bases System",
    "overview": "A number base system is a way of representing numbers using a set of digits or symbols.",
    "objectives": [
      {
        "description": "At the end of the lesson, students should understand the following concepts:",
        "points": [
          "Convert from base 10 to other bases",
          "Convert from other bases to base 10",
          "Convert decimal fractions to base 10",
          "Convert between bases other than base 10",
          "Solve basic operations involving number bases"
        ]
      }
    ],
    "key_concepts": {
      "Conversion of number bases": "Changing numbers between different base systems using division or expansion methods.",
      "Operations in number bases": "Performing arithmetic such as addition, subtraction, multiplication, and division under specific base rules.",
      "Base 10 Conversion": "Understanding base 10 as a reference system for calculations between other bases.",
      "Borrowing and Carrying in Bases": "Applying modular arithmetic concepts during operations."
    },
    "summary": "Summary",
    "application": "Application",
    "video_path": null,
    "status": "active",
    "created_at": "22-08-2025",
    "updated_at": "22-08-2025"
  },
  "code": 200
}
```

#### Lesson Not Found Error

```json
{
  "success": false,
  "message": "Lesson not found!",
  "errors": null,
  "code": 404,
}
```

#### Fetch Error

```json
{
  "success": false,
  "message": "An error occurred while fetching lessons: (error message)",
  "errors": null,
  "code": 500,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

### Get Specific Lesson Content

**Endpoint:** `Get /api/v1/superadmin/lessons/lesson/2/content`

**Description:** Get specific lesson content.

**Notes:**

=> To get a lesson content, the lesson id needs to be passed as a url parameter.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "id": 2,
    "order_index": 1,
    "class": "SSS1",
    "subject": "General Mathematics",
    "term": "First",
    "week": 1,
    "topic": "Number Bases System",
    "overview": "A number base system is a way of representing numbers using a set of digits or symbols.",
    "objectives": [
      {
        "description": "At the end of the lesson, students should understand the following concepts:",
        "points": [
          "Convert from base 10 to other bases",
          "Convert from other bases to base 10",
          "Convert decimal fractions to base 10",
          "Convert between bases other than base 10",
          "Solve basic operations involving number bases"
        ]
      }
    ],
    "key_concepts": {
      "Conversion of number bases": "Changing numbers between different base systems using division or expansion methods.",
      "Operations in number bases": "Performing arithmetic such as addition, subtraction, multiplication, and division under specific base rules.",
      "Base 10 Conversion": "Understanding base 10 as a reference system for calculations between other bases.",
      "Borrowing and Carrying in Bases": "Applying modular arithmetic concepts during operations."
    },
    "summary": "Summary",
    "application": "Application",
    "video_path": null,
    "status": "active",
    "created_at": "22-08-2025",
    "updated_at": "22-08-2025",
    "concepts": [
      {
        "id": 4,
        "order_index": 1,
        "lesson_topic": "Number Bases System",
        "title": "Conversion from Base 10 to Other Bases",
        "description": [
          {
            "heading": null,
            "description": "The Modal Arithmetic that you will learn later in the session is useful in this problem. Its utility here will prepare you for the main topic. For conversion from base 10 to other bases;",
            "image_path": null,
            "points": [
              "Divide the given number repeatedly by the required base",
              "Write down the remainders by the right side.",
              "Divide till the quotient becomes 0.",
              "The answer is the remainder read from bottom to top."
            ]
          }
        ],
        "created_at": "22-08-2025",
        "updated_at": "22-08-2025",
        "examples": [
          {
            "id": 7,
            "order_index": 1,
            "concept_title": "Conversion from Base 10 to Other Bases",
            "title": "Example 1",
            "problem": "Convert 67₁₀ to base 2",
            "solution_steps": [
              "67 ÷ 2 = 33 R1",
              "33 ÷ 2 = 16 R1",
              "16 ÷ 2 = 8 R0",
              "8 ÷ 2 = 4 R0",
              "4 ÷ 2 = 2 R0",
              "2 ÷ 2 = 1 R0",
              "1 ÷ 2 = 0 R1"
            ],
            "answer": "1000011₂",
            "created_at": "22-08-2025",
            "updated_at": "22-08-2025"
          },
          {
            "id": 8,
            "order_index": 2,
            "concept_title": "Conversion from Base 10 to Other Bases",
            "title": "Example 2",
            "problem": "Convert 67₁₀ to base 8",
            "solution_steps": [
              "67 ÷ 8 = 8 R3",
              "8 ÷ 8 = 1 R0",
              "1 ÷ 8 = 0 R1"
            ],
            "answer": "103₈",
            "created_at": "22-08-2025",
            "updated_at": "22-08-2025"
          }
        ],
        "exercises": [
          {
            "id": 5,
            "order_index": 1,
            "concept_title": "Conversion from Base 10 to Other Bases",
            "title": "Exercise 1",
            "problem": "Convert 97₁₀ to base 2",
            "solution_steps": [
              "67 ÷ 2 = 33 R1",
              "33 ÷ 2 = 16 R1",
              "16 ÷ 2 = 8 R0",
              "8 ÷ 2 = 4 R0",
              "4 ÷ 2 = 2 R0",
              "2 ÷ 2 = 1 R0",
              "1 ÷ 2 = 0 R1"
            ],
            "answers": [
              "1110011₂",
              "1001011₂",
              "0101011₂",
              "1000011₂"
            ],
            "correct_answer": "1000011₂",
            "correct_answer_option": "B",
            "created_at": "22-08-2025",
            "updated_at": "22-08-2025"
          },
          {
            "id": 6,
            "order_index": 2,
            "concept_title": "Conversion from Base 10 to Other Bases",
            "title": "Exercise 2",
            "problem": "Convert 152₁₀ to base 5",
            "solution_steps": [
              "67 ÷ 8 = 8 R3",
              "8 ÷ 8 = 1 R0",
              "1 ÷ 8 = 0 R1"
            ],
            "answers": [
              "103₈",
              "123₈",
              "116₈",
              "100₈"
            ],
            "correct_answer": "103₈",
            "correct_answer_option": "C",
            "created_at": "22-08-2025",
            "updated_at": "22-08-2025"
          }
        ]
      },
      {
        "id": 5,
        "order_index": 2,
        "lesson_topic": "Number Bases System",
        "title": "Conversion from Any Base to Base 10",
        "description": [
          {
            "heading": null,
            "description": "One of the methods is by expansion in the power of base as shown below.",
            "image_path": null,
            "points": []
          }
        ],
        "created_at": "22-08-2025",
        "updated_at": "22-08-2025",
        "examples": [
          {
            "id": 9,
            "order_index": 1,
            "concept_title": "Conversion from Any Base to Base 10",
            "title": "Example 1",
            "problem": "Convert 321₅ to a number in base 10",
            "solution_steps": [
              "321₅ = 3 × 5² + 2 × 5¹ + 1 × 5⁰",
              "321₅ = 3 × 25 + 10 + 1",
              "321₅ = 75 + 10 + 1"
            ],
            "answer": "86₁₀",
            "created_at": "22-08-2025",
            "updated_at": "22-08-2025"
          },
          {
            "id": 10,
            "order_index": 2,
            "concept_title": "Conversion from Any Base to Base 10",
            "title": "Example 2",
            "problem": "Convert 110101₂ to base 10",
            "solution_steps": [
              "110101₂ = 1 × 2⁵ + 1 × 2⁴ + 0 × 2³ + 1 × 2² + 0 × 2¹ + 1 × 2⁰",
              "110101₂ = 1 × 32 + 1 × 16 + 0 × 8 + 1 × 4 + 0 × 2 + 1 × 1",
              "110101₂ = 32 + 16 + 0 + 4 + 0 + 1"
            ],
            "answer": "53₁₀",
            "created_at": "22-08-2025",
            "updated_at": "22-08-2025"
          }
        ],
        "exercises": [
          {
            "id": 7,
            "order_index": 1,
            "concept_title": "Conversion from Any Base to Base 10",
            "title": "Exercise 1",
            "problem": "Convert 4156 to base 10",
            "solution_steps": [
              "67 ÷ 8 = 8 R3",
              "8 ÷ 8 = 1 R0",
              "1 ÷ 8 = 0 R1"
            ],
            "answers": [
              "86₁₀",
              "72₁₀",
              "84₁₀",
              "68₁₀"
            ],
            "correct_answer": "86₁₀",
            "correct_answer_option": "A",
            "created_at": "22-08-2025",
            "updated_at": "22-08-2025"
          },
          {
            "id": 8,
            "order_index": 2,
            "concept_title": "Conversion from Any Base to Base 10",
            "title": "Exercise 2",
            "problem": "Convert 101101₂ to base 10",
            "solution_steps": [
              "101101₂ = 1 × 2⁵ + 1 × 2⁴ + 0 × 2³ + 1 × 2² + 0 × 2¹ + 1 × 2⁰",
              "101101₂ = 1 × 32 + 1 × 16 + 0 × 8 + 1 × 4 + 0 × 2 + 1 × 1",
              "101101₂ = 32 + 16 + 0 + 4 + 0 + 1"
            ],
            "answers": [
              "63₁₀",
              "53₁₀",
              "55₁₀",
              "45₁₀"
            ],
            "correct_answer": "53₁₀",
            "correct_answer_option": "D",
            "created_at": "22-08-2025",
            "updated_at": "22-08-2025"
          }
        ]
      },
      {
        "id": 6,
        "order_index": 3,
        "lesson_topic": "Number Bases System",
        "title": "Conversion of Decimal Fractions to Base 10",
        "description": [
          {
            "heading": null,
            "description": "Conversion of Decimal Fractions to Base 10.",
            "image_path": null,
            "points": []
          }
        ],
        "created_at": "22-08-2025",
        "updated_at": "22-08-2025",
        "examples": [
          {
            "id": 11,
            "order_index": 1,
            "concept_title": "Conversion of Decimal Fractions to Base 10",
            "title": "Example 1",
            "problem": "Convert 11.011₂ to base 10",
            "solution_steps": [
              "11.011₂ = 1 × 2¹ + 1 × 20 + 0 × 2-1 + 1 × 2-2 + 1 × 2-3",
              "11.011₂ = 2 + 1 + 0 + (1/22) + (1/23) ",
              "11.011₂ = 3 + (1/4) + (1/8) = 27/8"
            ],
            "answer": "3(3/8₁₀)",
            "created_at": "22-08-2025",
            "updated_at": "22-08-2025"
          },
          {
            "id": 12,
            "order_index": 2,
            "concept_title": "Conversion of Decimal Fractions to Base 10",
            "title": "Example 2",
            "problem": "Convert 241.238 to base 10",
            "solution_steps": [
              "241.238  = 2 × 82 + 4 × 81 + 1 × 80 + 2 × 8−1 + 3 × 8−2",
              "241.238 = 2 × 64 + 4 × 8 + 1 × 1 + 2 × (1/8) + 3 × (1/64)",
              "241.238 = 128 + 32 + 1 + (2/8) + (3/64)",
              "241.238 = 161 + (19/64)"
            ],
            "answer": "161.29710",
            "created_at": "22-08-2025",
            "updated_at": "22-08-2025"
          }
        ],
        "exercises": []
      }
    ],
    "general_exercises": [
      {
        "id": 5,
        "order_index": 1,
        "lesson_topic": "Number Bases System",
        "problem": "Convert 97₁₀ to base 2",
        "solution_steps": [
          "67 ÷ 2 = 33 R1",
          "33 ÷ 2 = 16 R1",
          "16 ÷ 2 = 8 R0",
          "8 ÷ 2 = 4 R0",
          "4 ÷ 2 = 2 R0",
          "2 ÷ 2 = 1 R0",
          "1 ÷ 2 = 0 R1"
        ],
        "answers": [
          "1110011₂",
          "1001011₂",
          "0101011₂",
          "1000011₂"
        ],
        "correct_answer": "1000011₂",
        "created_at": "22-08-2025",
        "updated_at": "22-08-2025"
      },
      {
        "id": 6,
        "order_index": 2,
        "lesson_topic": "Number Bases System",
        "problem": "Convert 152₁₀ to base 5",
        "solution_steps": [
          "67 ÷ 8 = 8 R3",
          "8 ÷ 8 = 1 R0",
          "1 ÷ 8 = 0 R1"
        ],
        "answers": [
          "103₈",
          "123₈",
          "116₈",
          "100₈"
        ],
        "correct_answer": "103₈",
        "created_at": "22-08-2025",
        "updated_at": "22-08-2025"
      },
      {
        "id": 7,
        "order_index": 3,
        "lesson_topic": "Number Bases System",
        "problem": "Convert 4156 to base 10",
        "solution_steps": [
          "67 ÷ 8 = 8 R3",
          "8 ÷ 8 = 1 R0",
          "1 ÷ 8 = 0 R1"
        ],
        "answers": [
          "86₁₀",
          "72₁₀",
          "84₁₀",
          "68₁₀"
        ],
        "correct_answer": "86₁₀",
        "created_at": "22-08-2025",
        "updated_at": "22-08-2025"
      },
      {
        "id": 8,
        "order_index": 4,
        "lesson_topic": "Number Bases System",
        "problem": "Convert 101101₂ to base 10",
        "solution_steps": [
          "101101₂ = 1 × 2⁵ + 1 × 2⁴ + 0 × 2³ + 1 × 2² + 0 × 2¹ + 1 × 2⁰",
          "101101₂ = 1 × 32 + 1 × 16 + 0 × 8 + 1 × 4 + 0 × 2 + 1 × 1",
          "101101₂ = 32 + 16 + 0 + 4 + 0 + 1"
        ],
        "answers": [
          "63₁₀",
          "53₁₀",
          "55₁₀",
          "45₁₀"
        ],
        "correct_answer": "53₁₀",
        "created_at": "22-08-2025",
        "updated_at": "22-08-2025"
      }
    ],
    "check_markers": [
      {
        "id": 2,
        "lesson_topic": "Number Bases System",
        "overview": 5,
        "lesson_video": 5,
        "concept_one": 20,
        "concept_two": 25,
        "concept_three": 25,
        "concept_four": 0,
        "concept_five": 0,
        "concept_six": 0,
        "concept_seven": 0,
        "general_exercises": 20,
        "created_at": "22-08-2025",
        "updated_at": "22-08-2025"
      }
    ]
  },
  "code": 200
}
```

#### Lesson Not Found Error

```json
{
  "success": false,
  "message": "Lesson not found!",
  "errors": null,
  "code": 404,
}
```

#### Fetch Error

```json
{
  "success": false,
  "message": "An error occurred while fetching lessons: (error message)",
  "errors": null,
  "code": 500,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


## Get Lessons

**Base Url:** `https://api.fastlearnersapp.com`

### Get Classes, Subjects, Terms And Weeks

**Endpoint:** `Get /api/v1/superadmin/lessons/get-classes-subjects-terms-weeks`

**Description:** Get classes, subjects, terms and week to query lessons according to class, subject, term and week.

**Note:** To get lessons you have to select classes, subjects, terms and week to query lessons according to class, subject, term and week.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |
| validation error | none |
| unauthorized | login |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "classes": [
      {
        "id": 1,
        "name": "JSS1"
      },
      {
        "id": 2,
        "name": "JSS2"
      },
      {
        "id": 3,
        "name": "JSS3"
      },
      {
        "id": 4,
        "name": "SSS1"
      },
      {
        "id": 5,
        "name": "SSS2"
      },
      {
        "id": 6,
        "name": "SSS3"
      }
    ],
    "subjects": [
      {
        "id": 3,
        "name": "Agricultural Science"
      },
      {
        "id": 34,
        "name": "Arabic"
      },
      {
        "id": 16,
        "name": "Basic Science"
      },
      {
        "id": 17,
        "name": "Basic Technology"
      },
      {
        "id": 4,
        "name": "Biology"
      },
      {
        "id": 15,
        "name": "Business Studies"
      },
      {
        "id": 6,
        "name": "Chemistry"
      },
      {
        "id": 22,
        "name": "Christian Religious Studies"
      },
      {
        "id": 18,
        "name": "Civic Education"
      },
      {
        "id": 12,
        "name": "Commerce"
      },
      {
        "id": 36,
        "name": "Computer Studies"
      },
      {
        "id": 8,
        "name": "Economics"
      },
      {
        "id": 31,
        "name": "Efik"
      },
      {
        "id": 2,
        "name": "English Language"
      },
      {
        "id": 37,
        "name": "Financial Accounting"
      },
      {
        "id": 33,
        "name": "French"
      },
      {
        "id": 7,
        "name": "Further Mathematics"
      },
      {
        "id": 1,
        "name": "General Mathematics"
      },
      {
        "id": 9,
        "name": "Geography"
      },
      {
        "id": 13,
        "name": "Government"
      },
      {
        "id": 28,
        "name": "Hausa"
      },
      {
        "id": 11,
        "name": "History"
      },
      {
        "id": 21,
        "name": "Home Economics"
      },
      {
        "id": 30,
        "name": "Ibibio"
      },
      {
        "id": 29,
        "name": "Igbo"
      },
      {
        "id": 19,
        "name": "Information and Communication Technology (ICT)"
      },
      {
        "id": 23,
        "name": "Islamic Religious Studies"
      },
      {
        "id": 10,
        "name": "Literature in English"
      },
      {
        "id": 38,
        "name": "Marketing"
      },
      {
        "id": 26,
        "name": "Music"
      },
      {
        "id": 32,
        "name": "Obolo"
      },
      {
        "id": 39,
        "name": "Office Practice"
      },
      {
        "id": 20,
        "name": "Physical and Health Education"
      },
      {
        "id": 5,
        "name": "Physics"
      },
      {
        "id": 24,
        "name": "Religious and Moral Education"
      },
      {
        "id": 14,
        "name": "Social Studies"
      },
      {
        "id": 35,
        "name": "Technical Drawing"
      },
      {
        "id": 25,
        "name": "Visual/Fine Arts"
      },
      {
        "id": 27,
        "name": "Yoruba"
      }
    ],
    "terms": [
      {
        "id": 1,
        "name": "First"
      },
      {
        "id": 2,
        "name": "Second"
      },
      {
        "id": 3,
        "name": "Third"
      }
    ],
    "weeks": [
      {
        "id": 1,
        "name": 1
      },
      {
        "id": 2,
        "name": 2
      },
      {
        "id": 3,
        "name": 3
      },
      {
        "id": 4,
        "name": 4
      },
      {
        "id": 5,
        "name": 5
      },
      {
        "id": 6,
        "name": 6
      },
      {
        "id": 7,
        "name": 7
      },
      {
        "id": 8,
        "name": 8
      },
      {
        "id": 9,
        "name": 9
      },
      {
        "id": 10,
        "name": 10
      },
      {
        "id": 11,
        "name": 11
      },
      {
        "id": 12,
        "name": 12
      }
    ]
  },
  "code": 200
}
```

#### Classes Not Found Error

```json
{
  "success": false,
  "message": "No class found, add classes!",
  "errors": null,
  "code": 404,
}
```

#### Subjects Not Found Error

```json
{
  "success": false,
  "message": "No subject found, add subjects!",
  "errors": null,
  "code": 404,
}
```

#### Terms Not Found Error

```json
{
  "success": false,
  "message": "No term found, add terms!",
  "errors": null,
  "code": 404,
}
```

#### Weeks Not Found Error

```json
{
  "success": false,
  "message": "No week found, add weeks!",
  "errors": null,
  "code": 404,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

### Get Lessons

**Endpoint:** `Post /api/v1/superadmin/lessons/lessons/`

**Description:** Get lessons.

**Notes:**

=> To get lessons you'll have to query it by class id, subject id, term id and week id through the request body.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "class": "4"
  "subject": "1",
  "term": "1"
  "week": "1",
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "lessons": [
      {
        "id": 2,
        "class": "SSS1",
        "subject": "General Mathematics",
        "term": "First",
        "week": 1,
        "topic": "Number Bases System",
        "status": "active",
        "created_at": "22-08-2025",
        "updated_at": "22-08-2025"
      }
    ],
    "links": {
      "first": "http://fastleanersapp.com/api/v1/superadmin/lessons/lessons?page=1",
      "last": "http://fastleanersapp.com/api/v1/superadmin/lessons/lessons?page=1",
      "prev": null,
      "next": null
    },
    "meta": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 20,
      "total": 1
    }
  },
  "code": 200
}
```

#### No Lesson Found Response (200)

```json
{
  "success": true,
  "message": "No lesson found, add lessons",
  "content": null,
  "code": 200,
}
```

#### Validation Error

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "class": [
      "The class field is required."
    ]
    "subject": [
      "The subject field is required."
    ]
    "term": [
      "The term field is required."
    ]
    "week": [
      "The week field is required."
    ]
  },
  "code": 422
}
```

#### Fetch Error

```json
{
  "success": false,
  "message": "An error occurred while fetching lessons: (error message)",
  "errors": null,
  "code": 500,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


## All Lessons Upload

**Base Url:** `https://api.fastlearnersapp.com`

### All In One Lesson Upload

**Endpoint:** `Post /api/v1/superadmin/lessons/uploads/all-lesson-files`

**Description:** All lesson files (lesson, concepts, examples, exercises, general-exercises, check-markers) upload.

**Notes:**

=> Uploaded file type should only be csv or txt.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "lessons_file": "(binary-file)",
  "concepts_file": "(binary-file)",
  "examples_file": "(binary-file)",
  "exercises_file": "(binary-file)",
  "general_exercises_file": "(binary-file)",
  "check_markers_file": "(binary-file)",

}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "All CSV files uploaded successfully.",
  "content": null,
  "code": 200
}
```

#### Validation Error

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "lessons_file": [
      "The lessons file field is required."
    ],
    "concepts_file": [
      "The concepts file field is required."
    ],
    "examples_file": [
      "The school examples file is required."
    ],
    "exercises_file": [
      "The exercises file field is required."
    ],
    "general_exercises_file": [
      "The general exercises file field is required."
    ],
    "check_markers_file": [
      "The check markers file field is required."
    ]
  },
  "code": 422
}
```

#### Missing Column Error

```json
{
  "success": false,
  "message": "Invalid (filename) CSV format. Missing column: (column name)",
  "errors": null,
  "code": 400,
}
```

#### Class Not Found Error

```json
{
  "success": false,
  "message": "Class (class name) not found",
  "errors": null,
  "code": 404,
}
```

#### Subject Not Found Error

```json
{
  "success": false,
  "message": "Subject (subject name) not found",
  "errors": null,
  "code": 404,
}
```

#### Term Not Found Error

```json
{
  "success": false,
  "message": "Term (term name) not found",
  "errors": null,
  "code": 404,
}
```

#### Week Not Found Error

```json
{
  "success": false,
  "message": "Week (week name) not found",
  "errors": null,
  "code": 404,
}
```

#### Lesson Not Found Error

```json
{
  "success": false,
  "message": "Lesson (lesson topic) not found",
  "errors": null,
  "code": 404,
}
```

#### Concept Not Found Error

```json
{
  "success": false,
  "message": "Concept (concept title) not found",
  "errors": null,
  "code": 404,
}
```

#### Upload Error

```json
{
  "success": false,
  "message": "Error processing CSV files: (error message)",
  "errors": null,
  "code": 500,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


## Check Markers Upload

**Base Url:** `https://api.fastlearnersapp.com`

### Check Markers Upload

**Endpoint:** `Post /api/v1/superadmin/lessons/uploads/check-markers`

**Description:** Check markers files upload.

**Notes:**

=> Check markers file type should be csv or txt.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "check_marker_file": "(binary-file)"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Check markers uploaded successfully.",
  "content": null,
  "code": 200
}
```

#### Validation Error

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "check_markers_file": [
      "The check markers file field is required."
    ]
  },
  "code": 422
}
```

#### Missing Column Error

```json
{
  "success": false,
  "message": "Invalid check markers CSV format. All columns are required.",
  "errors": null,
  "code": 400,
}
```

#### Lesson Not Found Error

```json
{
  "success": false,
  "message": "Lesson (lesson topic) not found",
  "errors": null,
  "code": 404,
}
```

#### Check Marker Exist Error

```json
{
  "success": false,
  "message": "Check marker already exist.",
  "errors": null,
  "code": 400,
}
```

#### Upload Error

```json
{
  "success": false,
  "message": "Error uploading check markers: (error message)",
  "errors": null,
  "code": 500,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


## Concepts Upload

**Base Url:** `https://api.fastlearnersapp.com`

### Concepts Upload

**Endpoint:** `Post /api/v1/superadmin/lessons/uploads/concepts`

**Description:** Concepts files upload.

**Notes:**

=> Concepts file type should be csv or txt.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "concepts_file": "(binary-file)"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Lesson's concepts uploaded successfully.",
  "content": null,
  "code": 200
}
```

#### Validation Error

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "concepts_file": [
      "The concepts file field is required."
    ]
  },
  "code": 422
}
```

#### Missing Column Error

```json
{
  "success": false,
  "message": "Invalid concepts CSV format. All columns are required.",
  "errors": null,
  "code": 400,
}
```

#### Lesson Not Found Error

```json
{
  "success": false,
  "message": "Lesson (lesson topic) not found",
  "errors": null,
  "code": 404,
}
```

#### Concept Already Exist Error

```json
{
  "success": false,
  "message": "Concept (title) already exist.",
  "errors": null,
  "code": 400,
}
```

#### Invalid JSON Format Error

```json
{
  "success": false,
  "message": "Invalid JSON format in description",
  "errors": null,
  "code": 400,
}
```

#### Upload Error

```json
{
  "success": false,
  "message": "Error uploading lesson's concept: (error message)",
  "errors": null,
  "code": 500,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


## Examples Upload

**Base Url:** `https://api.fastlearnersapp.com`

### Examples Upload

**Endpoint:** `Post /api/v1/superadmin/lessons/uploads/examples`

**Description:** Examples files upload.

**Notes:**

=> Examples file type should be csv or txt.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "examples_file": "(binary-file)"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Lesson's concepts examples uploaded successfully.",
  "content": null,
  "code": 200
}
```

#### Validation Error

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "examples_file": [
      "The examples file field is required."
    ]
  },
  "code": 422
}
```

#### Missing Column Error

```json
{
  "success": false,
  "message": "Invalid examples CSV format. All columns are required.",
  "errors": null,
  "code": 400,
}
```

#### Concept Not Found Error

```json
{
  "success": false,
  "message": "Concept (concept title) not found",
  "errors": null,
  "code": 404,
}
```

#### Example Already Exist Error

```json
{
  "success": false,
  "message": "Example problem (problem) already exist.",
  "errors": null,
  "code": 400,
}
```

#### Invalid JSON Format Error

```json
{
  "success": false,
  "message": "Invalid JSON format in solution_steps",
  "errors": null,
  "code": 400,
}
```

#### Upload Error

```json
{
  "success": false,
  "message": "Error uploading lesson's concepts examples: (error message)",
  "errors": null,
  "code": 500,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


## Exercises Upload

**Base Url:** `https://api.fastlearnersapp.com`

### Exercises Upload

**Endpoint:** `Post /api/v1/superadmin/lessons/uploads/exercises`

**Description:** Exercises files upload.

**Notes:**

=> Exercises file type should be csv or txt.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "exercises_file": "(binary-file)"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Lesson's concepts exercises uploaded successfully.",
  "content": null,
  "code": 200
}
```

#### Validation Error

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "exercises_file": [
      "The exercises file field is required."
    ]
  },
  "code": 422
}
```

#### Missing Column Error

```json
{
  "success": false,
  "message": "Invalid exercises CSV format. All columns are required.",
  "errors": null,
  "code": 400,
}
```

#### Concept Not Found Error

```json
{
  "success": false,
  "message": "Concept (concept title) not found",
  "errors": null,
  "code": 404,
}
```

#### Exercise Already Exist Error

```json
{
  "success": false,
  "message": "Exercise problem (problem) already exist.",
  "errors": null,
  "code": 400,
}
```

#### Invalid JSON Format Error

```json
{
  "success": false,
  "message": "Invalid JSON format in solution_steps or answers",
  "errors": null,
  "code": 400,
}
```

#### Upload Error

```json
{
  "success": false,
  "message": "Error uploading lesson's concepts exercises: (error message)",
  "errors": null,
  "code": 500,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


## General Exercises Upload

**Base Url:** `https://api.fastlearnersapp.com`

### General Exercises Upload

**Endpoint:** `Post /api/v1/superadmin/lessons/uploads/general-exercises`

**Description:** General exercises files upload.

**Notes:**

=> General exercises file type should be csv or txt.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "general_exercises_file": "(binary-file)"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "General exercises uploaded successfully.",
  "content": null,
  "code": 200
}
```

#### Validation Error

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "general_exercises_file": [
      "The general exercises file field is required."
    ]
  },
  "code": 422
}
```

#### Missing Column Error

```json
{
  "success": false,
  "message": "Invalid general exercises CSV format. All columns are required.",
  "errors": null,
  "code": 400,
}
```

#### Lesson Not Found Error

```json
{
  "success": false,
  "message": "Lesson (lesson topic) not found",
  "errors": null,
  "code": 404,
}
```

#### General Exercise Already Exist Error

```json
{
  "success": false,
  "message": "General exercise problem (problem) already exist.",
  "errors": null,
  "code": 400,
}
```

#### Invalid JSON Format Error

```json
{
  "success": false,
  "message": "Invalid JSON format in solution_steps or answers",
  "errors": null,
  "code": 400,
}
```

#### Upload Error

```json
{
  "success": false,
  "message": "Error uploading general exercises: (error message)",
  "errors": null,
  "code": 500,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


## Lessons Upload

**Base Url:** `https://api.fastlearnersapp.com`

### Lessons Upload

**Endpoint:** `Post /api/v1/superadmin/lessons/uploads/lessons`

**Description:** Lessons files upload.

**Notes:**

=> Lessons file type should be csv or txt.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "lessons_file": "(binary-file)"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Lessons uploaded successfully.",
  "content": null,
  "code": 200
}
```

#### Validation Error

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "lessons_file": [
      "The lessons file field is required."
    ]
  },
  "code": 422
}
```

#### Missing Column Error

```json
{
  "success": false,
  "message": "Invalid lesson CSV format. All columns are required.",
  "errors": null,
  "code": 400,
}
```

#### Lesson Already Exist Error

```json
{
  "success": false,
  "message": "Lesson (topic) already exist.",
  "errors": null,
  "code": 400,
}
```

#### Class Not Found Error

```json
{
  "success": false,
  "message": "Class (class name) not found",
  "errors": null,
  "code": 404,
}
```

#### Subject Not Found Error

```json
{
  "success": false,
  "message": "Subject (subject name) not found",
  "errors": null,
  "code": 404,
}
```

#### Term Not Found Error

```json
{
  "success": false,
  "message": "Term (term name) not found",
  "errors": null,
  "code": 404,
}
```

#### Week Not Found Error

```json
{
  "success": false,
  "message": "Week (week name) not found",
  "errors": null,
  "code": 404,
}
```

#### Invalid JSON Format Error

```json
{
  "success": false,
  "message": "Invalid JSON format in objectives or key_concepts",
  "errors": null,
  "code": 400,
}
```

#### Upload Error

```json
{
  "success": false,
  "message": "Error uploading lessons: (error message)",
  "errors": null,
  "code": 500,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


## Scheme Of Work Upload

**Base Url:** `https://api.fastlearnersapp.com`

### Scheme Of Work Upload

**Endpoint:** `Post /api/v1/superadmin/lessons/uploads/scheme-of-work`

**Description:** Scheme of work files upload.

**Notes:**

=> Scheme of work file type should be csv or txt.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "scheme_of_work_file": "(binary-file)"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Scheme of work uploaded successfully.",
  "content": null,
  "code": 200
}
```

#### Validation Error

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "scheme_of_work_file": [
      "The scheme of work file field is required."
    ]
  },
  "code": 422
}
```

#### Missing Column Error

```json
{
  "success": false,
  "message": "Invalid scheme of work CSV format. All columns are required.",
  "errors": null,
  "code": 400,
}
```

#### Class Not Found Error

```json
{
  "success": false,
  "message": "Class (class name) not found",
  "errors": null,
  "code": 404,
}
```

#### Subject Not Found Error

```json
{
  "success": false,
  "message": "Subject (subject name) not found",
  "errors": null,
  "code": 404,
}
```

#### Term Not Found Error

```json
{
  "success": false,
  "message": "Term (term name) not found",
  "errors": null,
  "code": 404,
}
```

#### Week Not Found Error

```json
{
  "success": false,
  "message": "Week (week name) not found",
  "errors": null,
  "code": 404,
}
```

#### Scheme Of Work Exist Error

```json
{
  "success": false,
  "message": "Scheme of work already exist.",
  "errors": null,
  "code": 400,
}
```

#### Invalid JSON Format Error

```json
{
  "success": false,
  "message": "Invalid JSON format in breakdown",
  "errors": null,
  "code": 400,
}
```

#### Upload Error

```json
{
  "success": false,
  "message": "Error uploading scheme of work: (error message)",
  "errors": null,
  "code": 500,
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


## View Trashed Lessons

**Base Url:** `https://api.fastlearnersapp.com`

**Endpoint:** `Get /api/v1/superadmin/lessons/lessons/view-trashed`

**Description:** Get trashed lessons .

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |
| validation error | none |
| unauthorized | login |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "lessons": [
      {
        "id": 5,
        "order_index": 1,
        "class": "SSS1",
        "subject": "Biology",
        "term": "First",
        "week": 1,
        "topic": "Introduction to Biology",
        "status": "active",
        "created_at": "01-12-2025",
        "updated_at": "11-01-2026"
      }
    ],
    "links": {
      "first": "https://api.fastlearnersapp.com/api/v1/superadmin/lessons/lessons/view-trashed?page=1",
      "last": "https://api.fastlearnersapp.com/api/v1/superadmin/lessons/lessons/view-trashed?page=1",
      "prev": null,
      "next": null
    },
    "meta": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 20,
      "total": 1
    }
  },
  "code": 200
}
```

#### Lesson Not Found Error

```json
{
  "success": false,
  "message": "No class found, add classes!",
  "errors": null,
  "code": 404,
}
```


## Subscription Management

**Base Url:** `https://api.fastlearnersapp.com`


### View Subscriptions

**Endpoint:** `GET /api/v1/superadmin/subscriptions`

**Description:** This endpoint returns the list of available subscriptions.


#### Headers


| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |


#### Redirection


| Response | Redirect To |
| --- | --- |
| success | none |


#### Success Response (200)


```json
{
  "type": "success",
  "success": true,
  "message": "Success",
  "content": [
    {
      "subscriptions": [
        {
          "id": 1,
          "user_name": "Student User",
          "user_email": "student@fastlearnersapp.com",
          "package": "Basic",
          "reference": "fl-496bd9ea-936b-48f5-a5be-6e313e4f300d",
          "subscription_reference": "SUB-3IWQEUF6CIKMUFNY",
          "starts_at": "01-06-2026",
          "expires_at": "01-07-2026",
          "status": "active",
          "is_first_subscription": true,
          "created_at": "01-06-2026 10:40",
          "updated_at": "01-06-2026 10:40"
        },
        {
          "id": 2,
          "user_name": "Student User",
          "user_email": "student@fastlearnersapp.com",
          "package": "Basic",
          "reference": "fl-9cfe4d2c-6c71-4490-995d-1000f8107d6f",
          "subscription_reference": "SUB-3IWQEUF6JDFGFKSG",
          "starts_at": "15-05-2026",
          "expires_at": "14-06-2026",
          "status": "active",
          "is_first_subscription": false,
          "created_at": "01-06-2026 10:40",
          "updated_at": "01-06-2026 10:40"
        }
      ],
      "links": {
        "first": "https://api.fastlearnersapp.com/api/v1/superadmin/subscriptions?page=1",
        "last": "https://api.fastlearnersapp.com/api/v1/superadmin/subscriptions?page=1",
        "prev": null,
        "next": null
      },
      "meta": {
        "current_page": 1,
        "last_page": 1,
        "per_page": 10,
        "total": 2
      }
    }
  ],
  "code": 200
}
```


#### Subscription Not Found Error


```json
{
  "type": "error",
  "success": false,
  "message": "No subscription was found!",
  "errors": null,
  "code": 404,
}
```


#### Unauthorized Access


```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


#### Server Error Message


```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving subscriptions!",
  "errors": ["error message"],
  "code": 500,
}
```


### View Subscription Detail


**Endpoint:** `GET /api/v1/superadmin/subscriptions/1/view`

**Description:** Get a specific subscription detail with this endpoint using the id (1)


#### Headers


| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |


#### Redirection


| Response | Redirect To |
| --- | --- |
| success | none |


#### Success Response (200)


```json
{
  "type": "success",
  "success": true,
  "message": "Success",
  "content": [
    {
      "id": 1,
      "user_name": "Student User",
      "user_email": "student@fastlearnersapp.com",
      "package": "Basic",
      "reference": "fl-496bd9ea-936b-48f5-a5be-6e313e4f300d",
      "subscription_reference": "SUB-3IWQEUF6CIKMUFNY",
      "starts_at": "01-06-2026",
      "expires_at": "01-07-2026",
      "status": "active",
      "is_first_subscription": true,
      "created_at": "01-06-2026 10:40",
      "updated_at": "01-06-2026 10:40"
    }
  ],
  "code": 200
}
```


#### Subscription Not Found Error


```json
{
  "type": "error",
  "success": false,
  "message": "Subscription not found!",
  "errors": null,
  "code": 404
}
```


#### Unauthorized Access


```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


#### Server Error Message


```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving subscription!",
  "errors": ["error message"],
  "code": 500,
}
```


## Coupon Management

**Base Url:** `https://api.fastlearnersapp.com`


### View Coupons

**Endpoint:** `GET /api/v1/superadmin/coupons`

**Description:** This endpoint returns the list of available coupons.


#### Headers


| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |


#### Redirection


| Response | Redirect To |
| --- | --- |
| success | none |


#### Success Response (200)


```json
{
  "type": "success",
  "success": true,
  "message": "Success",
  "content": [
    {
      "coupons": [
        {
          "id": 5,
          "code": "BONUS",
          "package_name": "Basic",
          "description": "Free coupon for student",
          "type": "fixed",
          "value": "500.00",
          "minimum_amount": "1,000.00",
          "usage_limit": 5,
          "used_count": 0,
          "is_active": "inactive",
          "expires_at": "15-06-2026",
          "created_at": "31-05-2026",
          "updated_at": "03-06-2026"
        },
        {
          "id": 2,
          "code": "QUIZWIN",
          "package_name": "Basic",
          "description": "Quiz winners coupon",
          "type": "fixed",
          "value": "700.00",
          "minimum_amount": "1,000.00",
          "usage_limit": 3,
          "used_count": 1,
          "is_active": "active",
          "expires_at": "08-06-2026",
          "created_at": "30-05-2026",
          "updated_at": "01-06-2026"
        },
        {
          "id": 1,
          "code": "NEWCOM",
          "package_name": "Basic",
          "description": "New comers coupon",
          "type": "percentage",
          "value": "15.00",
          "minimum_amount": "1,000.00",
          "usage_limit": 50,
          "used_count": 0,
          "is_active": "active",
          "expires_at": "25-06-2026",
          "created_at": "30-05-2026",
          "updated_at": "30-05-2026"
        }
      ],
      "links": {
        "first": "https://api.fastlearnersapp.com/api/v1/superadmin/coupons?page=1",
        "last": "https://api.fastlearnersapp.com/api/v1/superadmin/coupons?page=1",
        "prev": null,
        "next": null
      },
      "meta": {
        "current_page": 1,
        "last_page": 1,
        "per_page": 20,
        "total": 3
      }
    }
  ],
  "code": 200
}
```


#### Coupon Not Found Error


```json
{
  "type": "error",
  "success": false,
  "message": "No coupon was found!",
  "errors": null,
  "code": 404,
}
```


#### Unauthorized Access


```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


#### Server Error Message


```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving coupons!",
  "errors": ["error message"],
  "code": 500,
}
```


### Get Coupon Detail


**Endpoint:** `GET /api/v1/superadmin/coupons/1/view`

**Description:** Get a specific coupon detail with this endpoint using the id (1)


#### Headers


| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |


#### Redirection


| Response | Redirect To |
| --- | --- |
| success | none |


#### Success Response (200)


```json
{
  "type": "success",
  "success": true,
  "message": "Success",
  "content": {
    "coupon": {
      "id": 1,
      "code": "NEWCOM",
      "package_name": "Basic",
      "description": "New comers coupon",
      "type": "percentage",
      "value": "15.00",
      "minimum_amount": "1,000.00",
      "usage_limit": 50,
      "used_count": 0,
      "is_active": "active",
      "expires_at": "25-06-2026",
      "created_at": "30-05-2026",
      "updated_at": "30-05-2026"
    }
  },
  "code": 200
}
```


#### Coupon Not Found Error


```json
{
  "type": "error",
  "success": false,
  "message": "Coupon not found!",
  "errors": null,
  "code": 404
}
```


#### Unauthorized Access


```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


#### Server Error Message


```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving coupon!",
  "errors": ["error message"],
  "code": 500,
}
```


### Create Coupon

**Endpoint:** `POST /api/v1/superadmin/coupons/create`

**Description:** Create coupon using this endpoint.

**Note:** => The values for `type` will be `select` options of `percentage` and `fixed`


=> For the `package_id`, make a call the view packages endpoint and load the ids in a select element option value and the package name in the option name


#### Headers


| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |


#### Request Body


```json
{
  "code": "Premium",
  "package_id": 1,
  "type": percentage,
  "value": 5,
  "minimum_amount": 1000,
  "usage_limit": 3,
  "expires_at": "19-06-2026",
  "description": "Premium users coupon",
}
```


#### Redirection


| Response | Redirect To |
| --- | --- |
| success | none |


#### Success Response (200)


```json
{
  "type": "success",
  "success": true,
  "message": "Coupon created successfully!",
  "content": {
    "coupon": {
      "id": 5,
      "code": "PREMIUM",
      "package": "Basic",
      "description": "Premium users coupon",
      "type": "percentage",
      "value": "5",
      "minimum_amount": "1,000.00",
      "usage_limit": "3",
      "used_count": null,
      "is_active": "active",
      "expires_at": "19-06-2026",
      "created_at": "31-05-2026",
      "updated_at": "31-05-2026"
    }
  },
  "code": 200
}
```


#### Validation Error


```json
{
  "type": "error",
  "success": false,
  "message": "Validation Error",
  "errors": ["validation errors"],
  "code": 400
}
```


#### Unauthorized Access


```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


#### Server Error Message


```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while creating coupon",
  "errors": ["error message"],
  "code": 500,
}
```


### Update Coupon

**Endpoint:** `POST /api/v1/superadmin/coupons/1/update`

**Description:** Update a coupon with this endpoint using the coupon id (1).


#### Headers


| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |


#### Request Body


```json
{
  "code": "Premium Plan",
  "package_id": 1,
  "type": percentage,
  "value": 5,
  "minimum_amount": 1000,
  "usage_limit": 3,
  "expires_at": "19-06-2026",
  "description": "Premium users coupon",
}
```


#### Redirection


| Response | Redirect To |
| --- | --- |
| success | none |


#### Success Response (200)


```json
{
  "type": "success",
  "success": true,
  "message": "Coupon created successfully!",
  "content": {
    "coupon": {
      "id": 5,
      "code": "PREMIUM PLAN",
      "package": "Basic",
      "description": "Premium users coupon",
      "type": "percentage",
      "value": "5",
      "minimum_amount": "1,000.00",
      "usage_limit": "3",
      "used_count": null,
      "is_active": "active",
      "expires_at": "19-06-2026",
      "created_at": "31-05-2026",
      "updated_at": "31-05-2026"
    }
  },
  "code": 200
}
```


#### Validation Error


```json
{
  "type": "error",
  "success": false,
  "message": "Validation Error",
  "errors": ["validation errors"],
  "code": 400
}
```


#### Unauthorized Access


```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


#### Server Error Message


```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while updating coupon",
  "errors": ["error message"],
  "code": 500,
}
```


### Delete Coupon

**Endpoint:** `DELETE /api/v1/superadmin/coupons/2/delete`

**Description:** Delete coupon with this endpoint using the coupon id (2).


#### Headers


| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |


#### Redirection


| Response | Redirect To |
| --- | --- |
| success | none |


#### Success Response (200)


```json
{
  "type": "success",
  "success": true,
  "message": "Coupon deleted successfully!",
  "content": null,
  "code": 200
}
}
```


#### Coupon Not Found Error


```json
{
  "type": "error",
  "success": false,
  "message": "Coupon not found!",
  "errors": null,
  "code": 404
}
```


#### Unauthorized Access


```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


#### Server Error Message


```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while deleting coupon",
  "errors": ["error message"],
  "code": 500,
}
```


### Update Coupon Status

**Endpoint:** `POST /api/v1/superadmin/coupons/2/update-status`

**Description:** Update coupon status between active and inactive.


#### Headers


| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |


#### Redirection


| Response | Redirect To |
| --- | --- |
| success | none |


#### Success Response (200)


```json
{
  "type": "success",
  "success": true,
  "message": "Coupon activated successfully!",
  "content": null,
  "code": 200
}
}
```


#### Coupon Not Found Error


```json
{
  "type": "error",
  "success": false,
  "message": "Coupon not found!",
  "errors": null,
  "code": 404
}
```


#### Unauthorized Access


```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


#### Server Error Message


```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while updating coupon status.",
  "errors": ["error message"],
  "code": 500,
}
```


### Coupon Search

**Endpoint:** `POST /api/v1/superadmin/coupons/search`

**Description:** Search for a coupon by name using this endpoint.


#### Headers


| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |


#### Request Body


```json
{
  "search_term": "new",
}
```


#### Redirection


| Response | Redirect To |
| --- | --- |
| success | none |


#### Success Response (200)


```json
{
  "type": "success",
  "success": true,
  "message": "Success",
  "content": [
    {
      "coupons": [
        {
          "id": 1,
          "code": "NEWCOM",
          "package": "Basic",
          "description": "New comers coupon",
          "type": "percentage",
          "value": "15.00",
          "minimum_amount": "1,000.00",
          "usage_limit": 50,
          "used_count": 0,
          "is_active": "active",
          "expires_at": "25-06-2026",
          "created_at": "30-05-2026",
          "updated_at": "30-05-2026"
        }
      ],
      "links": {
        "first": "https://api.fastlearnersapp.com/api/v1/superadmin/coupons/search?page=1",
        "last": "https://api.fastlearnersapp.com/api/v1/superadmin/coupons/search?page=1",
        "prev": null,
        "next": null
      },
      "meta": {
        "current_page": 1,
        "last_page": 1,
        "per_page": 20,
        "total": 1
      }
    }
  ],
  "code": 200
}
}
```


#### Validation Error


```json
{
  "type": "error",
  "success": false,
  "message": "Validation Error",
  "errors": ["validation errors"],
  "code": 400
}
```


#### Unauthorized Access


```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


#### Server Error Message


```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while creating coupon",
  "errors": ["error message"],
  "code": 500,
}
```


## Package Management

**Base Url:** `https://api.fastlearnersapp.com`


### View Packages

**Endpoint:** `GET /api/v1/superadmin/packages`

**Description:** This endpoint returns the list of available packages.


#### Headers


| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |


#### Redirection


| Response | Redirect To |
| --- | --- |
| success | none |


#### Success Response (200)


```json
{
  "type": "success",
  "success": true,
  "message": "Subscription packages",
  "content": {
    "packages": [
      {
        "id": 2,
        "name": "Terminal",
        "slug": "terminal",
        "amount": "1,500.00",
        "original_amount": null,
        "billing_cycle": "monthly",
        "duration_days": 30,
        "description": null,
        "is_active": true,
        "created_at": "30-05-2026",
        "updated_at": "30-05-2026"
      },
      {
        "id": 1,
        "name": "Basic",
        "slug": "basic",
        "amount": "4,000.00",
        "original_amount": null,
        "billing_cycle": "monthly",
        "duration_days": 30,
        "description": null,
        "is_active": true,
        "created_at": "30-05-2026",
        "updated_at": "30-05-2026"
      }
    ]
  },
  "code": 200
}
```


#### Package Not Found Error


```json
{
  "type": "error",
  "success": false,
  "message": "No package was found!",
  "errors": null,
  "code": 404,
}
```


#### Unauthorized Access


```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


#### Server Error Message


```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving packages!",
  "errors": ["error message"],
  "code": 500,
}
```


### Get Package Detail


**Endpoint:** `GET /api/v1/superadmin/packages/1/view`

**Description:** Get a specific package detail with this endpoint using the id (1)


#### Headers


| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |


#### Redirection


| Response | Redirect To |
| --- | --- |
| success | none |


#### Success Response (200)


```json
{
  "type": "success",
  "success": true,
  "message": "Success",
  "content": {
    "package": {
      "id": 1,
      "name": "Basic",
      "slug": "basic",
      "amount": "4,000.00",
      "original_amount": null,
      "billing_cycle": "monthly",
      "duration_days": 30,
      "description": null,
      "is_active": true,
      "created_at": "30-05-2026",
      "updated_at": "30-05-2026"
    }
  },
  "code": 200
}
```


#### Package Not Found Error


```json
{
  "type": "error",
  "success": false,
  "message": "Package not found!",
  "errors": null,
  "code": 404
}
```


#### Unauthorized Access


```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


#### Server Error Message


```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving package!",
  "errors": ["error message"],
  "code": 500,
}
```


### Create Package

**Endpoint:** `POST /api/v1/superadmin/packages/create`

**Description:** Create a package using this endpoint.

**Note:** => The values for `billing_cycle` will be `select` options of `monthly` and `yearly`


#### Headers


| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |


#### Request Body


```json
{
  "name": "Basic",
  "amount": "2500",
  "original_amount": 4000,
  "billing_cycle": "monthly",
  "duration_days": 30,
  "description": "Basic subscription for students",
}
```


#### Redirection


| Response | Redirect To |
| --- | --- |
| success | none |


#### Success Response (200)


```json
{
  "type": "success",
  "success": true,
  "message": "Package created successfully!",
  "content": {
    "package": {
      "id": 3,
      "name": "Basic",
      "slug": "basic",
      "amount": "2,500.00",
      "original_amount": null,
      "billing_cycle": "monthly",
      "duration_days": "30",
      "description": "Basic subscription for students",
      "is_active": true,
      "created_at": "02-06-2026",
      "updated_at": "02-06-2026"
    }
  },
  "code": 200
}
```


#### Validation Error


```json
{
  "type": "error",
  "success": false,
  "message": "Validation Error",
  "errors": ["validation errors"],
  "code": 400
}
```


#### Unauthorized Access


```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


#### Server Error Message


```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while creating package",
  "errors": ["error message"],
  "code": 500,
}
```


### Update Package

**Endpoint:** `POST /api/v1/superadmin/packages/1/update`

**Description:** Update a package using this endpoint using the package id (1).


#### Headers


| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |


#### Request Body


```json
{
  "name": "Basic Package",
  "amount": "2500",
  "original_amount": 4000,
  "billing_cycle": "monthly",
  "duration_days": 30,
  "description": Basic package subscription for students,
}
```


#### Redirection


| Response | Redirect To |
| --- | --- |
| success | none |


#### Success Response (200)


```json
{
  "type": "success",
  "success": true,
  "message": "Package created successfully!",
  "content": {
    "package": {
      "id": 3,
      "name": "Basic Package",
      "slug": "basic plan",
      "amount": "2,500.00",
      "original_amount": null,
      "billing_cycle": "monthly",
      "duration_days": "30",
      "description": "Basic package subscription for students",
      "is_active": true,
      "created_at": "02-06-2026",
      "updated_at": "02-06-2026"
    }
  },
  "code": 200
}
```


#### Validation Error


```json
{
  "type": "error",
  "success": false,
  "message": "Validation Error",
  "errors": ["validation errors"],
  "code": 400
}
```


#### Unauthorized Access


```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


#### Server Error Message


```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while updating package",
  "errors": ["error message"],
  "code": 500,
}
```


### Delete Package

**Endpoint:** `DELETE /api/v1/superadmin/packages/2/delete`

**Description:** Delete package with this endpoint using the package id (2).


#### Headers


| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |


#### Redirection


| Response | Redirect To |
| --- | --- |
| success | none |


#### Success Response (200)


```json
{
  "type": "success",
  "success": true,
  "message": "Package deleted successfully!",
  "content": null,
  "code": 200
}
}
```


#### Package Not Found Error


```json
{
  "type": "error",
  "success": false,
  "message": "Package not found!",
  "errors": null,
  "code": 404
}
```


#### Package Can Not Be Deleted Error


```json
{
  "type": "error",
  "success": false,
  "message": "Package has subscriptions and can't be deleted!",
  "errors": null,
  "code": 400
}
```


#### Unauthorized Access


```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


#### Server Error Message


```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while deleting package",
  "errors": ["error message"],
  "code": 500,
}
```


### Update Package Status

**Endpoint:** `POST /api/v1/superadmin/packages/2/update-status`

**Description:** Update package status between active and inactive.


#### Headers


| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |


#### Redirection


| Response | Redirect To |
| --- | --- |
| success | none |


#### Success Response (200)


```json
{
  "type": "success",
  "success": true,
  "message": "Package activated successfully!",
  "content": null,
  "code": 200
}
}
```


#### Package Not Found Error


```json
{
  "type": "error",
  "success": false,
  "message": "Package not found!",
  "errors": null,
  "code": 404
}
```


#### Unauthorized Access


```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


#### Server Error Message


```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while updating package status.",
  "errors": ["error message"],
  "code": 500,
}
```


## Transaction Management

**Base Url:** `https://api.fastlearnersapp.com`


### View Transactions

**Endpoint:** `GET /api/v1/superadmin/transactions`

**Description:** This endpoint returns the list of available transactions.


#### Headers


| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |


#### Redirection


| Response | Redirect To |
| --- | --- |
| success | none |


#### Success Response (200)


```json
{
  "type": "success",
  "success": true,
  "message": "Success",
  "content": [
    {
      "transactions": [
        {
          "id": 1,
          "user_name": "Student User",
          "user_email": "student@fastlearnersapp.com",
          "package": "Basic",
          "coupon_code": null,
          "reference": "fl-eb7b64d6-18b7-40cf-8198-f7fc7e09ef6b",
          "amount": "4,000.00",
          "discount_amount": "0.00",
          "final_amount": "4,000.00",
          "gateway": "paystack",
          "status": "pending",
          "created_at": "30-05-2026 13:48:11",
          "updated_at": "30-05-2026 13:48:11"
        },
        {
          "id": 2,
          "user_name": "Student User",
          "user_email": "student@fastlearnersapp.com",
          "package": "Basic",
          "coupon_code": "NEWCOM",
          "reference": "fl-751bdfa8-aaaa-4058-acc0-2e819d08a51f",
          "amount": "4,000.00",
          "discount_amount": "600.00",
          "final_amount": "3,400.00",
          "gateway": "paystack",
          "status": "pending",
          "created_at": "31-05-2026 14:20:05",
          "updated_at": "31-05-2026 14:20:05"
        },
        {
          "id": 3,
          "user_name": "Student User",
          "user_email": "student@fastlearnersapp.com",
          "package": "Basic",
          "coupon_code": "NEWCOM",
          "reference": "fl-ff8a6ec8-ab22-42e8-a93e-c07569f56f88",
          "amount": "4,000.00",
          "discount_amount": "600.00",
          "final_amount": "3,400.00",
          "gateway": "paystack",
          "status": "pending",
          "created_at": "31-05-2026 14:43:54",
          "updated_at": "31-05-2026 14:43:54"
        },
        {
          "id": 10,
          "user_name": "Student User",
          "user_email": "student@fastlearnersapp.com",
          "package": "Basic",
          "coupon_code": "QUIZWIN",
          "reference": "fl-1ae979f6-1048-4958-8a26-504d3aedfacb",
          "amount": "4,000.00",
          "discount_amount": "700.00",
          "final_amount": "3,300.00",
          "gateway": "paystack",
          "status": "pending",
          "created_at": "01-06-2026 07:05:01",
          "updated_at": "01-06-2026 07:05:01"
        }
      ],
      "links": {
        "first": "https://api.fastlearnersapp.com/api/v1/superadmin/transactions?page=1",
        "last": "https://api.fastlearnersapp.com/api/v1/superadmin/transactions?page=2",
        "prev": null,
        "next": "https://api.fastlearnersapp.com/api/v1/superadmin/transactions?page=2"
      },
      "meta": {
        "current_page": 1,
        "last_page": 2,
        "per_page": 10,
        "total": 16
      }
    }
  ],
  "code": 200
}
```


#### Transaction Not Found Error


```json
{
  "type": "error",
  "success": false,
  "message": "No transaction was found!",
  "errors": null,
  "code": 404,
}
```


#### Unauthorized Access


```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


#### Server Error Message


```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving transactions!",
  "errors": ["error message"],
  "code": 500,
}
```


### View Transaction Detail


**Endpoint:** `GET /api/v1/superadmin/transactions/1/view`

**Description:** Get a specific transaction detail with this endpoint using the id (1)


#### Headers


| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |


#### Redirection


| Response | Redirect To |
| --- | --- |
| success | none |


#### Success Response (200)


```json
{
  "type": "success",
  "success": true,
  "message": "Success",
  "content": [
    {
      "id": 1,
      "user_name": "Student User",
      "user_email": "student@fastlearnersapp.com",
      "package": "Basic",
      "coupon_code": null,
      "reference": "fl-eb7b64d6-18b7-40cf-8198-f7fc7e09ef6b",
      "amount": "4,000.00",
      "discount_amount": "0.00",
      "final_amount": "4,000.00",
      "gateway": "paystack",
      "status": "pending",
      "created_at": "30-05-2026 13:48:11",
      "updated_at": "30-05-2026 13:48:11"
    }
  ],
  "code": 200
}
```


#### Transaction Not Found Error


```json
{
  "type": "error",
  "success": false,
  "message": "Transaction not found!",
  "errors": null,
  "code": 404
}
```


#### Unauthorized Access


```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```


#### Server Error Message


```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving transaction!",
  "errors": ["error message"],
  "code": 500,
}
```


## Ticket Management

**Base Url:** `https://api.fastlearnersapp.com`

### View Tickets

**Endpoint:** `GET /api/v1/superadmin/tickets`

**Description:** This endpoint retrieves the list of user's tickets.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |
| validation error | none |

#### Success Response (200)

```json
{
  "type": "success",
  "success": true,
  "message": "Tickets retrieved successfully!",
  "content": [
    {
      "tickets": [
        {
          "id": 5,
          "category": "Billing",
          "priority": "High",
          "status": "Open",
          "assigned_to": [
            {
              "id": 4,
              "ticket_id": 5,
              "ticket_subject": "Invoice",
              "assigned_by": "Super Admin",
              "assigned_to": "Super Admin",
              "created_at": "07-06-2026",
              "updated_at": "07-06-2026"
            },
            {
              "id": 5,
              "ticket_id": 5,
              "ticket_subject": "Invoice",
              "assigned_by": "Super Admin",
              "assigned_to": "Admin User",
              "created_at": "07-06-2026",
              "updated_at": "07-06-2026"
            }
          ],
          "closed_by": [],
          "subject": "Invoice",
          "description": "Will I get an invoice after payment?",
          "created_at": "05-06-2026",
          "updated_at": "07-06-2026"
        },
        {
          "id": 4,
          "category": "Billing",
          "priority": "High",
          "status": "Open",
          "assigned_to": [],
          "closed_by": [],
          "subject": "Invoice",
          "description": "Will I get an invoice after payment?",
          "created_at": "05-06-2026",
          "updated_at": "05-06-2026"
        },
        {
          "id": 3,
          "category": "Billing",
          "priority": "High",
          "status": "Closed",
          "assigned_to": [],
          "closed_by": [],
          "subject": "Invoice",
          "description": "Will I get an invoice after payment?",
          "created_at": "05-06-2026",
          "updated_at": "06-06-2026"
        },
        {
          "id": 2,
          "category": "Billing",
          "priority": "High",
          "status": "Open",
          "assigned_to": [],
          "closed_by": {
            "name": "Student User",
            "email": "student@fastlearnersapp.com"
          },
          "subject": "Invoice",
          "description": "Will I get an invoice after payment?",
          "created_at": "05-06-2026",
          "updated_at": "07-06-2026"
        },
        {
          "id": 1,
          "category": "Account",
          "priority": "High",
          "status": "Open",
          "assigned_to": [
            {
              "id": 6,
              "ticket_id": 1,
              "ticket_subject": "Account creation issue",
              "assigned_by": "Super Admin",
              "assigned_to": "Admin User",
              "created_at": "07-06-2026",
              "updated_at": "07-06-2026"
            }
          ],
          "closed_by": [],
          "subject": "Account creation issue",
          "description": "I'm having issue create my account successfully",
          "created_at": "05-06-2026",
          "updated_at": "07-06-2026"
        }
      ],
      "links": {
        "first": "https://api.fastlearnersapp.com/api/v1/superadmin/tickets?page=1",
        "last": "https://api.fastlearnersapp.com/api/v1/superadmin/tickets?page=1",
        "prev": null,
        "next": null
      },
      "meta": {
        "current_page": 1,
        "last_page": 1,
        "per_page": 10,
        "total": 5
      }
    }
  ],
  "code": 200
}
```

#### Ticket Not Found Error

```json
{
  "type": "error",
  "success": false,
  "message": "No ticket created yet!",
  "errors": null,
  "code": 400,
}
```

#### Unauthorized Access

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving tickets!",
  "errors": ["error message"],
  "code": 500,
}
```

### View Ticket

**Endpoint:** `GET /api/v1/superadmin/tickets/2/view`

**Description:** This endpoint retrieves a specific ticket.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |
| validation error | none |

#### Success Response (200)

```json
{
  "type": "success",
  "success": true,
  "message": "Ticket retrieved successfully!",
  "content": {
    "ticket": {
      "id": 2,
      "category": "Billing",
      "priority": "High",
      "status": "Open",
      "assigned_to": null,
      "subject": "Invoice",
      "description": "Will I get an invoice after payment?",
      "replies": [],
      "ticket_attachments": [
        {
          "id": 1,
          "ticket_id": 2,
          "ticket_message_id": null,
          "path": "https://api.fastlearnerapp.com/storage/tickets/6a221a5e8f561_student.png",
          "original_file_name": "time.png",
          "file_type": "image/png",
          "file_size": 7048,
          "created_at": "05-06-2026",
          "updated_at": "05-06-2026"
        },
        {
          "id": 2,
          "ticket_id": 2,
          "ticket_message_id": null,
          "path": "https://api.fastlearnerapp.com/storage/tickets/6a221a5e9c4a3_student.png",
          "original_file_name": "Training Exercise.png",
          "file_type": "image/png",
          "file_size": 72954,
          "created_at": "05-06-2026",
          "updated_at": "05-06-2026"
        },
        {
          "id": 3,
          "ticket_id": 2,
          "ticket_message_id": null,
          "path": "https://api.fastlearnerapp.com/storage/tickets/6a221a5e9dc1c_student.png",
          "original_file_name": "logo-n-01.png",
          "file_type": "image/png",
          "file_size": 37529,
          "created_at": "05-06-2026",
          "updated_at": "05-06-2026"
        }
      ],
      "created_at": "05-06-2026",
      "updated_at": "07-06-2026"
    }
  },
  "code": 200
}
```

#### Ticket Not Found Error

```json
{
  "type": "error",
  "success": false,
  "message": "Ticket not found!",
  "errors": null,
  "code": 400,
}
```

#### Unauthorized Access

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving ticket!",
  "errors": ["error message"],
  "code": 500,
}
```

### Reply Ticket

**Endpoint:** `POST /api/v1/superadmin/tickets/5/reply`

**Description:** With this endpoint admin can reply to tickets .

**Note:**

=> Users can add maximum of 3 attachments (file or image) of mime type doc, docx, pdf jpg, jpeg, png, pdf, doc, docx and max file size of 200kb.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "message": "We will notify you once an update is made.",
  "attachments[]": (the attachment),
  "attachments[]": (the attachment),
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | view ticket |
| validation error | none |

#### Success Response (200)

```json
{
  "type": "success",
  "success": true,
  "message": "Ticket created successfully!",
  "content": [
    {
      "id": 5,
      "category": "Billing",
      "priority": "High",
      "status": "Open",
      "assigned_to": null,
      "subject": "Invoice",
      "description": "Will I get an invoice after payment?",
      "attachments": [
        {
          "id": 10,
          "ticket_id": 5,
          "ticket": "Invoice",
          "ticket_message_id": null,
          "path": "https://api.fastlearnersapp.com/storage/tickets/6a22228eee662_175476309546.png",
          "original_file_name": "time.png",
          "file_type": "image/png",
          "file_size": 7048,
          "created_at": "05-06-2026",
          "updated_at": "05-06-2026"
        },
        {
          "id": 11,
          "ticket_id": 5,
          "ticket": "Invoice",
          "ticket_message_id": null,
          "path": "https://api.fastlearnersapp.com/storage/tickets/6a22228ef3e3b_175476309546.png",
          "original_file_name": "Training Exercise.png",
          "file_type": "image/png",
          "file_size": 72954,
          "created_at": "05-06-2026",
          "updated_at": "05-06-2026"
        },
      ],
      "created_at": "05-06-2026",
      "updated_at": "05-06-2026"
    }
  ],
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "success": false,
  "message": "An error occurred while creating your ticket, try again!",
  "errors": ["error message"],
  "code": 500,
}
```

### Get Assignment History

**Endpoint:** `GET /api/v1/tickets/5/assignment-history`

**Description:** This endpoint retrieves the list of support agents assigned to a ticket.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |
| validation error | none |

#### Success Response (200)

```json
{
  "type": "success",
  "success": true,
  "message": "Success",
  "content": {
    "assignment_history": [
      {
        "id": 5,
        "ticket_id": 5,
        "ticket_subject": "Invoice",
        "assigned_by": "Super Admin",
        "assigned_to": "Admin User",
        "created_at": "07-06-2026",
        "updated_at": "07-06-2026"
      },
      {
        "id": 4,
        "ticket_id": 5,
        "ticket_subject": "Invoice",
        "assigned_by": "Super Admin",
        "assigned_to": "Super Admin",
        "created_at": "07-06-2026",
        "updated_at": "07-06-2026"
      }
    ]
  },
  "code": 200
}
```

#### History Not Found Error

```json
{
  "type": "error",
  "success": false,
  "message": "No assignment history found!",
  "errors": null,
  "code": 400,
}
```

#### Unauthorized Access

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while ticket assignment history!",
  "errors": ["error message"],
  "code": 500,
}
```

### Get Support Agent

**Endpoint:** `GET /api/v1/tickets/support-agents`

**Description:** This endpoint retrieves the list of support agents.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |
| validation error | none |

#### Success Response (200)

```json
{
  "type": "success",
  "success": true,
  "message": "Support agents retrieved successfully!",
  "content": {
    "support_agents": [
      {
        "id": 5,
        "name": "Admin User"
      },
      {
        "id": 6,
        "name": "Super Admin"
      }
    ]
  },
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving support agents!",
  "errors": ["error message"],
  "code": 500,
}
```

### Assign Support Agent

**Endpoint:** `POST /api/v1/tickets/assign-support-agent`

**Description:** This endpoint assigns support agent to a ticket.

**Note:**

=> `assign_to` value is the `id` of the support agent.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "ticket_id": 2,
  "assign_to": 5
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |
| validation error | none |

#### Success Response (200)

```json
{
  "type": "success",
  "success": true,
  "message": "Ticket assigned successfully!",
  "content": null,
  "code": 200
}
```

#### Ticket Category Not Found Error

```json
{
  "type": "error",
  "success": false,
  "message": "No ticket category found!",
  "errors": null,
  "code": 400,
}
```

#### Unauthorized Access

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving ticket categories!",
  "errors": ["error message"],
  "code": 500,
}
```

### Delete Ticket

**Endpoint:** `DELETE /api/v1/tickets/3/delete-assignment`

**Description:** Unassign/delete tickets assignment.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | view ticket |
| validation error | none |

#### Success Response (200)

```json
{
  "type": "success",
  "success": true,
  "message": "Ticket assignment deleted successfully!",
  "content": null,
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "success": false,
  "message": "An error occurred while deleting ticket assignment, try again!",
  "errors": ["error message"],
  "code": 500,
}
```

### View Ticket Statuses

**Endpoint:** `GET /api/v1/tickets/statuses`

**Description:** This endpoint retrieves the list of ticket statuses.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | none |
| validation error | none |

#### Success Response (200)

```json
{
  "type": "success",
  "success": true,
  "message": "Success",
  "content": {
    "statuses": [
      {
        "id": 1,
        "name": "Open",
        "is_active": "active",
        "created_at": "30-05-2026",
        "updated_at": "30-05-2026"
      },
      {
        "id": 2,
        "name": "Processing",
        "is_active": "active",
        "created_at": "30-05-2026",
        "updated_at": "30-05-2026"
      },
      {
        "id": 3,
        "name": "Resolved",
        "is_active": "active",
        "created_at": "30-05-2026",
        "updated_at": "30-05-2026"
      },
      {
        "id": 4,
        "name": "Closed",
        "is_active": "active",
        "created_at": "30-05-2026",
        "updated_at": "30-05-2026"
      }
    ]
  },
  "code": 200
}
```

#### Ticket Status Not Found Error

```json
{
  "type": "error",
  "success": false,
  "message": "No ticket category found!",
  "errors": null,
  "code": 400,
}
```

#### Unauthorized Access

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving ticket statuses!",
  "errors": ["error message"],
  "code": 500,
}
```

### Update Ticket Status

**Endpoint:** `POST /api/v1/tickets/2/update-status`

**Description:** Update ticket status with this endpoint.

**Note:**

=> The `2` in the url is the ticket `id`.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "status_id": 3,
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | view tickets |
| validation error | none |

#### Success Response (200)

```json
{
  "type": "success",
  "success": true,
  "message": "Ticket status updated successfully!",
  "content": null,
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "success": false,
  "message": "An error occurred while updating ticket, try again!",
  "errors": ["error message"],
  "code": 500,
}
```

### Delete Ticket

**Endpoint:** `DELETE /api/v1/tickets/3/delete-ticket`

**Description:** Delete tickets with this endpoint.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | view ticket |
| validation error | none |

#### Success Response (200)

```json
{
  "type": "success",
  "success": true,
  "message": "Ticket assignment deleted successfully!",
  "content": null,
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Message

```json
{
  "success": false,
  "message": "An error occurred while deleting ticket assignment, try again!",
  "errors": ["error message"],
  "code": 500,
}
```


## User Management

**Base Url:** `https://api.fastlearnersapp.com`

### Profile Details

**Endpoint:** `Get /api/v1/profile`

**Description:** User's profile displays user's (all users i.e guest, student, guardian, admin etc) information.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Your dashboard.",
  "content": {
    "user": {
      "id": 1,
      "name": null,
      "username": null,
      "email": "john@example.com",
      "phone": null,
      "school": null,
      "class": null,
      "discipline": null,
      "date_of_birth": null,
      "age": null,
      "parent_email": null,
      "parent_phone": null,
      "country": null,
      "state": null,
      "city": null,
      "gender": null,
      "status": "active",
      "created_at": "2025-06-21",
      "role": [
        "guest"
      ]
    },
    "account_delete_info": {
      "days_left": 0,
      "request_status": false
    },
    "subscription": {
      "status": "active",
      "expires_at": "14-06-2026",
      "days_remaining": 7
    }
  },
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

### Profile Page Data

**Endpoint:** `Get /api/v1/profile/data`

**Description:** Get user's profile data.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Profile page data",
  "content": {
    "classes": [
      {
        "name": "JSS1"
      },
      {
        "name": "JSS2"
      },
      {
        "name": "JSS3"
      },
      {
        "name": "SSS1"
      },
      {
        "name": "SSS2"
      },
      {
        "name": "SSS3"
      }
    ],
    "roles": [
      "guest",
      "student",
      "guardian"
    ],
    "discipline": [
      {
        "name": "Art"
      },
      {
        "name": "Commercial"
      },
      {
        "name": "Science"
      }
    ]
  },
  "code": 200
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Error Response

```json
{
  "success": false,
  "message": "An error occurred while fetching profile page data, try again!",
  "errors": null,
  "code": 400,
}
```

### Check Username Availability

**Endpoint:** `Get /api/v1/check-username-availability/{username}`

**Description:** Check if username is available.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Username is available!",
  "content": {
    "is_available": true,
    "username": "Username is available!"
  },
  "code": 200
}
```

#### Not Available Response

```json
{
  "success": false,
  "message": "Username is not available!",
  "errors": {
    "is_available": false,
    "username": "Username is already taken!"
  },
  "code": 400
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Server Error Response

```json
{
  "success": false,
  "message": "An error occurred while checking username availability!",
  "errors": null,
  "code": 400,
}
```

### Profile Edit

**Endpoint:** `Post /api/v1/profile/edit`

**Description:** Edit user profile information.

**Notes:**

=> Show the role input field if user's `role === "guest"` else show a disabled input field. Users are to set their role to either `student or guardian` once.

=> Show the username input field if user's `username == null` else show a disabled input field. Users are to set their username once.

=> Show an enabled input field for date of birth input field if user's `date_of_birth == null` else show a disabled input field. Users are to set their date of birth once.

=> Show an enabled input field for class input field if user's `class == null` else show a disabled input field. Users are to set their class once.

=> Show an enabled input field for discipline input field if user's `discipline == null` **WHEN:** user's `class == SSS1 || SSS2 || SSS3` else show a disabled input field. Users are to set their discipline once.

=> Discipline `(discipline)` must be a select option of `Art, Commercial` and `Science`.

=> Show an enabled input field for gender input field if user's `gender == null` else show a disabled input field. Users are to set their gender once.

=> Show an enabled input field for date of birth input field if user's `date of birth == null` else show a disabled input field. Users are to set their date of birth once.

**=> Note:** Except for students, `school, class and discipline` are not required during profile edit for other roles (`guest, guardian, teacher, admin, and superadmin`)

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "name": "Linus Thompson",
  "username": "linus",
  "phone": "08012345678",
  "school": "Uyo High School",
  "class": "SS1",
  "discipline": "Science",,
  "date_of_birth": "03/11/2018",
  "gender": male,
  "age": 22,
  "parent_email": parent.email@email.com,
  "parent_phone": 09036745284,
  "country": Nigeria,
  "state": Akwa Ibom,
  "city": Uyo,
  "address": "123 Oron Road",

  "role": ["student"],
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | profile |
| validation error | none |
| unauthorized | login |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Your profile has been updated successfully.",
  "content": {
    "user": {
      "id": 1,
      "name": "Linus Thompson",
      "username": "linus",
      "email": "john@example.com",
      "phone": "08012345678",
      "school": "Uyo High School",
      "class": "SS1",
      "discipline": "Science",
      "date_of_birth": "03/11/2018",
      "gender": male,
      "age": 22,
      "parent_email": parent.email@email.com,
      "parent_phone": 09036745284,
      "country": Nigeria,
      "state": Akwa Ibom,
      "city": Uyo,
      "address": "123 Oron Road"
      "status": "active",
      "created_at": "2025-06-21",
      "role": [
        "student"
      ]
    }
  },
  "code": 200,
}
```

#### Validation Error

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors":{
    "name": [
      "The name field is required."
    ],
    "username": [
      "The username field is required."
    ],
    "phone": [
      "The phone field is required."
    ],
    "school": [
      "The school field is required."
    ],
    "class": [
      "The class field is required."
    ],
    "discipline": [
      "The discipline field is required."
    ],
    "date_of_birth": [
      "The date of birth field is required."
    ],
    "gender": [
      "The gender is required."
    ],
    "parent_email": [
      "The parent email is required."
    ],
    "country": [
      "The country is required for guardians."
    ],
    "state": [
      "The state field is required."
    ],
    "city": [
      "The city field is required."
    ],
    "address": [
      "The address field is required."
    ],
    "role": [
      "The role field is required."
    ],
    "child_email": [
      "Child Email is required for guardians."
    ],
    "child_phone": [
      "Child Phone is required for guardians."
    ]
  },
  "code": 422
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

#### Username Already Set Error

```json
{
  "success": false,
  "message": "Username already updated and cannot be changed.",
  "errors": null,
  "code": 401,
}
```

#### Role Already Set Error

```json
{
  "success": false,
  "message": "Role already updated and cannot be changed. For further enquiries, please contact our support team.",
  "errors": null,
  "code": 401,
}
```

#### Class Already Set Error

```json
{
  "success": false,
  "message": "Class already updated. Make a request for class upgrade.",
  "errors": null,
  "code": 400,
}
```

#### Discipline Error if user class is JSS

```json
{
  "success": false,
  "message": "You have to be in SSS class to choose a discipline!",
  "errors": null,
  "code": 400,
}
```

#### Discipline Already Set Error

```json
{
  "success": false,
  "message": "Discipline already updated. For further enquiries, please contact our support team.",
  "errors": null,
  "code": 401,
}
```

#### Gender Already Set Error

```json
{
  "success": false,
  "message": "Gender already updated. For further enquiries, please contact our support team.",
  "errors": null,
  "code": 401,
}
```

#### Date of birth Already Set Error

```json
{
  "success": false,
  "message": "Date of birth already updated. For further enquiries, please contact our support team.",
  "errors": null,
  "code": 401,
}
```

### Profile Picture Upload

**Endpoint:** `Post /api/v1/profile/edit/profile-picture`

**Description:** Upload user's profile picture.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "profile_picture": "form-data",
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | profile |
| validation error | none |
| unauthorized | login |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Your profile picture has been uploaded successfully",
  "content": null,
  "code": 200,
}
```

#### Validation Error (422)

```json
{
  "success": false,
  "message": "validation failed!",
  "errors":{
    "profile_picture": [
      "The profile picture field is required.",
      "Profile picture must be of type, png, jpg, jpeg,webp.",
      "Profile picture size must not be larger than 1MB."
    ]
  },
  "code": 422
}
```

#### Current Password Error (422)

```json
{
  "success": false,
  "message": "Your current password is incorrect!",
  "errors": null,
  "code": 422
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

### Change Password

**Endpoint:** `Get /api/v1/profile/edit/password`

**Description:** Change user's password.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Request Body

```json
{
  "current_password": "password",
  "new_password": "newpassword",
  "new_password_confirmation": "newpassword",
}
```

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | profile |
| validation error | none |
| current password error | none |
| unauthorized | login |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Your password has been changed successfully!",
  "content": null,
  "code": 200,
}
```

#### Validation Error (422)

```json
{
  "success": false,
  "message": "validation failed!",
  "errors":{
    "current_password": [
      "The current_password field is required."
    ],
    "new_password": [
      "The new_password field is required."
    ],
    "new_password_confirmation": [
      "The new_password_confirmation field is required."
    ],
  },
  "code": 422
}
```

#### Current Password Error (422)

```json
{
  "success": false,
  "message": "Your current password is incorrect!",
  "errors": null,
  "code": 422
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

### Delete Account Request

**Endpoint:** `Delete /api/v1/profile/delete`

**Description:** Delete account request by user. Account delete request can be cancelled as well by this endpoint.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | profile |
| unauthorized | login |

#### Success Response (200)

```json
{
  "success": true,
  "message": "Account delete request has been sent successfully. Your account will be deleted in 7 days, but you can cancel the request anytime.",
  "content": null,
  "code": 200,
}
```

#### Server Error (422)

```json
{
  "success": false,
  "message": "An error occurred while sending account delete request, try again",
  "errors": null,
  "code": 500
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```

### Delete Account Now

**Endpoint:** `Delete /api/v1/profile/delete-now`

**Description:** Delete user account instantly.

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {access_token} |
| Accept | application/json |

#### Redirection

| Response | Redirect To |
| --- | --- |
| success | login |
| unauthorized | login |

#### Success Response

```json
{
  "success": true,
  "message": "Your account has been deleted successfully!",
  "content": null,
  "code": 200,
}
```

#### Failed Error

```json
{
  "success": false,
  "message": "An error occurred while deleting your account, try again!",
  "errors": null,
  "code": 400
}
```

#### Server Error

```json
{
  "success": false,
  "message": "An error occurred while deleting your account, try again!",
  "errors": null,
  "code": 500
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401,
}
```



