# FastLearners API Documentation

**Base URL:** `https://api.fastlearnersapp.com`

---

## Table of Contents

1. [Authentication System](#authentication-system)
2. [User Management](#user-management)
3. [Guest Management](#guest-management)
4. [Student Management](#student-management)
5. [Parental Consent Management](#parental-consent-management)
6. [Guardian Management](#guardian-management)
7. [Subscription](#subscription)
8. [Superadmin Management](#superadmin-management)

---

## Response `type` Field

Every API response includes a `type` field that indicates the nature of the response. Use this field to determine how to style alerts, notifications, and toast messages in the UI.

| `type` value | Meaning | Suggested UI Color |
|---|---|---|
| `success` | The request completed successfully | 🟢 Green |
| `error` | The request failed (validation, not found, server error, etc.) | 🔴 Red |
| `info` | Informational response (neutral status) | 🔵 Blue |
| `warning` | A warning that requires attention but is not a hard failure | 🟡 Yellow/Amber |

**Example:**
```json
{
  "type": "success",
  "success": true,
  "message": "Your profile has been updated successfully.",
  "content": {},
  "code": 200
}
```

> **Note:** The `type` field is present in all API responses. Earlier endpoint examples in this document may not show `type` explicitly, but it is always returned. Always read `type` alongside `success` for accurate UI feedback.

---

## Authentication System

**Base URL:** `https://api.fastlearnersapp.com`

### 1. Registration

**Endpoint:** `POST /api/v1/register`

**Description:** Register a new user with their email address and an optional referral code.

**Notes:**

- The referral code input field is optional.
- The referral code is 8 characters.
- Users can verify their referral code before continuing with registration.

**Headers:**
| Key | Value |
|-----|-------|
| Accept | application/json |

**Request Body:**

```json
{
  "email": "john@example.com",
  "referral_code": "ABC1DEF2"
}
```

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | verify-email |
| validation error | none |
| user not found error | none |

**Success Response (200):**

```json
{
  "success": true,
  "message": "A verification code has been sent to your registered email address.",
  "content": {},
  "code": 200
}
```

**Validation Error (422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."]
  },
  "code": 422
}
```

**User Exist Error (422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email has already been taken."]
  },
  "code": 422
}
```

---

### 2. Verify Referral Code

**Endpoint:** `POST /api/v1/verify-referral-code`

**Description:** Verify referral code before proceeding with user registration.

**Headers:**
| Key | Value |
|-----|-------|
| Accept | application/json |

**Request Body:**

```json
{
  "referral_code": "ABC1DEF2"
}
```

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |
| validation error | none |
| code not found error | none |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Agent Ceetny was verified successfully !",
  "content": null,
  "code": 200
}
```

**Validation Error (422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "referral_code": [
      "The referral code field is required.",
      "The referral code field must be 8 characters."
    ]
  },
  "code": 422
}
```

**Code Not Found Error (404):**

```json
{
  "success": false,
  "message": "Referral code does not exist, try again!",
  "errors": null,
  "code": 404
}
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "An error occurred while verifying your referral code, try again!",
  "errors": ["error message"],
  "code": 500
}
```

---

### 3. Verify Email After Registration

**Endpoint:** `POST /api/v1/verify-email`

**Description:** Verify email address after registration with a 6-digit code sent to the registered email. Code expires after 15 minutes.

**Headers:**
| Key | Value |
|-----|-------|
| Accept | application/json |

**Request Body:**

```json
{
  "email": "john@example.com",
  "code": "849201"
}
```

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | create-password |
| validation error | none |
| code not found error | none |
| code expired error | none |

**Success Response (200):**

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
      "role": ["student"]
    }
  },
  "code": 200
}
```

**Validation Error (422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."],
    "code": ["The code field is required."]
  },
  "code": 422
}
```

**Code Not Found Error (404):**

```json
{
  "success": false,
  "message": "Registration request not found!",
  "errors": null,
  "code": 404
}
```

**Invalid Code Error (400):**

```json
{
  "success": false,
  "message": "Invalid verification code!",
  "errors": null,
  "code": 400
}
```

**Code Expired Error (400):**

```json
{
  "success": false,
  "message": "Registration code has expired, try again!",
  "errors": null,
  "code": 400
}
```

---

### 4. Create Password

**Endpoint:** `POST /api/v1/create-password`

**Description:** Create password after successfully verifying email address.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**

```json
{
  "password": "password",
  "password_confirmation": "password"
}
```

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | set-role |
| validation error | none |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Your password has been created successfully!",
  "content": {},
  "code": 200
}
```

**Validation Error (422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "password": [
      "The password field is required.",
      "The password confirmation field is required.",
      "The password field confirmation does not match."
    ]
  },
  "code": 422
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "An error occurred while creating your password, try again",
  "errors": null,
  "code": 400
}
```

---

### 5. Set Role

**Endpoint:** `POST /api/v1/set-role`

**Description:** Set role after successfully creating password.

**Notes:**

- Users are to select from `['guest', 'student', 'guardian']`.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**

```json
{
  "user_role": "student"
}
```

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | dashboard (redirect according to user's role) |
| validation error | none |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Your role has been set successfully!",
  "content": {},
  "code": 200
}
```

**Validation Error (422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "user_role": ["The user role field is required."]
  },
  "code": 422
}
```

**Invalid Role Error (400):**

```json
{
  "success": false,
  "message": "Invalid role selected!",
  "errors": null,
  "code": 400
}
```

**Error Response (500):**

```json
{
  "success": false,
  "message": "An error occurred while assigning role, try again",
  "errors": null,
  "code": 500
}
```

---

### 6. Resend Verification Code

**Endpoint:** `POST /api/v1/resend-verification-code`

**Description:** Resend registration verification code in case of delay or if not received.

**Headers:**
| Key | Value |
|-----|-------|
| Accept | application/json |

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |
| validation error | none |
| user not found error | none |
| error sending code | none |

**Success Response (200):**

```json
{
  "success": true,
  "message": "A verification code has been sent to your register email address.",
  "content": null,
  "code": 200
}
```

**Validation Error (422):**

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "email": ["The email field is required."]
  },
  "code": 422
}
```

**User Not Found Error (404):**

```json
{
  "success": false,
  "message": "User not found.",
  "errors": null,
  "code": 404
}
```

**Error Sending Code (500):**

```json
{
  "success": false,
  "message": "There was an error sending verification code, try again.",
  "errors": null,
  "code": 500
}
```

---

### 7. Login

**Endpoint:** `POST /api/v1/login`

**Description:** Login using email or phone and password. If user is inactive, a verification code will be sent to their email; otherwise they'll be logged in and redirected to the dashboard.

**Headers:**
| Key | Value |
|-----|-------|
| Accept | application/json |

**Request Body:**

```json
{
  "email_phone": "john@example.com",
  "password": "password"
}
```

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | dashboard (redirect according to user's role) |
| validation error | none |
| invalid login details error | none |
| inactive user error | verify-email |
| user suspended error | none |

**Success Response (200):**

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
      "role": ["student"]
    }
  },
  "code": 200
}
```

**Validation Error (422):**

```json
{
  "success": false,
  "message": "Validation failed!",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password field is required."]
  },
  "code": 422
}
```

**Invalid Login Details Error (401):**

```json
{
  "success": false,
  "message": "Valid login details!",
  "error": null,
  "code": 401
}
```

**Inactive User Response (401):**

```json
{
  "success": false,
  "message": "Your account is not active. Please verify your account with the verification code sent to your email address",
  "error": null,
  "code": 401
}
```

**User Suspended Response (400):**

```json
{
  "success": false,
  "message": "Your account has been suspended, please contact support!",
  "error": null,
  "code": 400
}
```

---

### 8. Login/Register With Google

**Endpoint:** `POST /api/v1/google/redirect`

**Description:** Login with a Google account.

**Headers:**
| Key | Value |
|-----|-------|
| Accept | application/json |

**Request Body:**

```json
{}
```

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | dashboard or create-password |
| validation error | none |

---

### 9. Logout

**Endpoint:** `POST /api/v1/logout`

**Description:** Logs out an authenticated user.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | login |
| unauthorized error | none |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully.",
  "content": null,
  "code": 200
}
```

**Unauthorized (401):**

```json
{
  "success": false,
  "message": "Unauthorized.",
  "errors": null,
  "code": 401
}
```

---

### 10. Forgot Password

**Endpoint:** `POST /api/v1/forgot-password`

**Description:** Sends a 6-digit reset code to the user's email.

**Headers:**
| Key | Value |
|-----|-------|
| Accept | application/json |

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | verify reset code |
| validation error | none |
| email not found error | none |
| email sending error | none |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Password reset code sent to your email!",
  "content": null,
  "code": 200
}
```

**Validation Error (422):**

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "email": ["The email field is required."]
  },
  "code": 422
}
```

**Email Not Found Error (404):**

```json
{
  "success": false,
  "message": "Email not found.",
  "errors": {
    "email": ["This email address was not found on our record!"]
  },
  "code": 404
}
```

---

### 11. Verify Password Reset Code

**Endpoint:** `POST /api/v1/verify-reset-code`

**Description:** Verify a 6-digit reset code that was sent to a user's email.

**Headers:**
| Key | Value |
|-----|-------|
| Accept | application/json |

**Request Body:**

```json
{
  "email": "john@example.com",
  "code": "849201"
}
```

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | reset password |
| validation error | none |
| code not found error | none |
| invalid code error | none |
| code expired error | none |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Your code was verified, Create new password.",
  "content": null,
  "code": 200
}
```

**Validation Error (422):**

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "email": ["The email field is required."],
    "code": ["The code field is required."],
    "password": ["The password field is required."],
    "password_confirmation": ["The password_confirmation field is required."]
  },
  "code": 422
}
```

**Code Not Found Error (404):**

```json
{
  "success": false,
  "message": "Reset request was not found!",
  "errors": null,
  "code": 404
}
```

**Invalid Code Error (400):**

```json
{
  "success": false,
  "message": "Invalid reset code!",
  "errors": null,
  "code": 400
}
```

**Code Expired Error (400):**

```json
{
  "success": false,
  "message": "Reset request has expired, try again!",
  "errors": null,
  "code": 400
}
```

---

### 12. Resend Password Reset Code

**Endpoint:** `POST /api/v1/resend-reset-code`

**Description:** Resends a 6-digit reset code to the user's email.

**Headers:**
| Key | Value |
|-----|-------|
| Accept | application/json |

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |
| validation error | none |
| email not found error | none |
| email sending error | none |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Password reset code sent to your email!",
  "content": null,
  "code": 200
}
```

**Validation Error (422):**

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "email": ["The email field is required."]
  },
  "code": 422
}
```

**Email Not Found Error (404):**

```json
{
  "success": false,
  "message": "Email not found.",
  "errors": {
    "email": ["This email address was not found on our record!"]
  },
  "code": 404
}
```

---

### 13. Reset Password

**Endpoint:** `POST /api/v1/reset-password`

**Description:** Reset a user's password.

**Headers:**
| Key | Value |
|-----|-------|
| Accept | application/json |

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "NewPass123",
  "password_confirmation": "NewPass123"
}
```

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | login |
| validation error | none |
| email not found error | none |
| email sending error | none |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Your password has been reset successfully. You may now log in.",
  "content": null,
  "code": 200
}
```

**Validation Error (422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password field is required."],
    "password_confirmation": ["The password_confirmation field is required."]
  },
  "code": 422
}
```

**Code Not Found Error (404):**

```json
{
  "success": false,
  "message": "Reset code was not found!",
  "errors": null,
  "code": 404
}
```

**Invalid Code Error (400):**

```json
{
  "success": false,
  "message": "Invalid reset code!",
  "errors": null,
  "code": 400
}
```

**Code Expired Error (400):**

```json
{
  "success": false,
  "message": "Reset code has expired!",
  "error": null,
  "code": 400
}
```

---

## User Management

**Base URL:** `https://api.fastlearnersapp.com`

### 1. Profile Details

**Endpoint:** `GET /api/v1/profile`

**Description:** Displays user information for all user types (guest, student, guardian, admin, etc.).

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

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
      "role": ["guest"]
    }
  },
  "code": 200
}
```

**Unauthorized Access (401):**

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

---

### 2. Profile Page Data

**Endpoint:** `GET /api/v1/profile/data`

**Description:** Get user's profile page data (classes, roles, disciplines).

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Profile page data",
  "content": {
    "classes": [
      { "name": "JSS1" },
      { "name": "JSS2" },
      { "name": "JSS3" },
      { "name": "SSS1" },
      { "name": "SSS2" },
      { "name": "SSS3" }
    ],
    "roles": ["guest", "student", "guardian"],
    "discipline": [
      { "name": "Art" },
      { "name": "Commercial" },
      { "name": "Science" }
    ]
  },
  "code": 200
}
```

**Unauthorized Access (401):**

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "An error occurred while fetching profile page data, try again!",
  "errors": null,
  "code": 400
}
```

---

### 3. Check Username Availability

**Endpoint:** `GET /api/v1/check-username-availability/{username}`

**Description:** Check if a username is available.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

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

**Not Available Response (400):**

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

**Unauthorized Access (401):**

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error Response (400):**

```json
{
  "success": false,
  "message": "An error occurred while checking username availability!",
  "errors": null,
  "code": 400
}
```

---

### 4. Profile Edit

**Endpoint:** `POST /api/v1/profile/edit`

**Description:** Edit user profile information.

**Notes:**

- Show the role input field if `user.role === 'guest'` else show a disabled input field. Users set their role once.
- Show the username input field if `user.username == null` else show a disabled input field. Users set their username once.
- Show an enabled date of birth input if `user.date_of_birth == null` else disabled. Users set DOB once.
- Show an enabled class input if `user.class == null` else disabled. Users set their class once.
- Show an enabled discipline input if `user.discipline == null` AND `user.class` is SSS1/SSS2/SSS3 else disabled. Users set discipline once.
- Discipline must be a select option of Art, Commercial, and Science.
- Show an enabled gender input if `user.gender == null` else disabled. Users set gender once.
- School, class, and discipline are not required for non-student roles (guest, guardian, teacher, admin, superadmin).

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**

```json
{
  "name": "Linus Thompson",
  "username": "linus",
  "phone": "08012345678",
  "school": "Uyo High School",
  "class": "SS1",
  "discipline": "Science",
  "date_of_birth": "03/11/2018",
  "gender": "male",
  "age": 22,
  "parent_email": "parent.email@email.com",
  "parent_phone": "09036745284",
  "country": "Nigeria",
  "state": "Akwa Ibom",
  "city": "Uyo",
  "address": "123 Oron Road",
  "role": ["student"]
}
```

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | profile |
| validation error | none |
| unauthorized | login |

**Success Response (200):**

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
      "gender": "male",
      "age": 22,
      "parent_email": "parent.email@email.com",
      "parent_phone": "09036745284",
      "country": "Nigeria",
      "state": "Akwa Ibom",
      "city": "Uyo",
      "address": "123 Oron Road",
      "status": "active",
      "created_at": "2025-06-21",
      "role": ["student"]
    }
  },
  "code": 200
}
```

**Validation Error (422):**

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "name": ["The name field is required."],
    "username": ["The username field is required."],
    "phone": ["The phone field is required."],
    "school": ["The school field is required."],
    "class": ["The class field is required."],
    "discipline": ["The discipline field is required."],
    "date_of_birth": ["The date of birth field is required."],
    "gender": ["The gender is required."],
    "parent_email": ["The parent email is required."],
    "country": ["The country is required for guardians."],
    "state": ["The state field is required."],
    "city": ["The city field is required."],
    "address": ["The address field is required."],
    "role": ["The role field is required."],
    "child_email": ["Child Email is required for guardians."],
    "child_phone": ["Child Phone is required for guardians."]
  },
  "code": 422
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Username Already Set Error (401):**

```json
{
  "success": false,
  "message": "Username already updated and cannot be changed.",
  "errors": null,
  "code": 401
}
```

**Role Already Set Error (401):**

```json
{
  "success": false,
  "message": "Role already updated and cannot be changed. For further enquiries, please contact our support team.",
  "errors": null,
  "code": 401
}
```

**Class Already Set Error (400):**

```json
{
  "success": false,
  "message": "Class already updated. Make a request for class upgrade.",
  "errors": null,
  "code": 400
}
```

**Discipline Error (JSS class) (400):**

```json
{
  "success": false,
  "message": "You have to be in SSS class to choose a discipline!",
  "errors": null,
  "code": 400
}
```

**Discipline Already Set Error (401):**

```json
{
  "success": false,
  "message": "Discipline already updated. For further enquiries, please contact our support team.",
  "errors": null,
  "code": 401
}
```

**Gender Already Set Error (401):**

```json
{
  "success": false,
  "message": "Gender already updated. For further enquiries, please contact our support team.",
  "errors": null,
  "code": 401
}
```

**Date of Birth Already Set Error (401):**

```json
{
  "success": false,
  "message": "Date of birth already updated. For further enquiries, please contact our support team.",
  "errors": null,
  "code": 401
}
```

---

### 5. Profile Picture Upload

**Endpoint:** `POST /api/v1/profile/edit/profile-picture`

**Description:** Upload user's profile picture.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**

```json
{
  "profile_picture": "form-data"
}
```

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | profile |
| validation error | none |
| unauthorized | login |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Your profile picture has been uploaded successfully",
  "content": null,
  "code": 200
}
```

**Validation Error (422):**

```json
{
  "success": false,
  "message": "validation failed!",
  "errors": {
    "profile_picture": [
      "The profile picture field is required.",
      "Profile picture must be of type, png, jpg, jpeg, webp.",
      "Profile picture size must not be larger than 1MB."
    ]
  },
  "code": 422
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

---

### 6. Change Password

**Endpoint:** `POST /api/v1/profile/edit/password`

**Description:** Change user's password.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**

```json
{
  "current_password": "password",
  "new_password": "newpassword",
  "new_password_confirmation": "newpassword"
}
```

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | profile |
| validation error | none |
| current password error | none |
| unauthorized | login |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Your password has been changed successfully!",
  "content": null,
  "code": 200
}
```

**Validation Error (422):**

```json
{
  "success": false,
  "message": "validation failed!",
  "errors": {
    "current_password": ["The current_password field is required."],
    "new_password": ["The new_password field is required."],
    "new_password_confirmation": [
      "The new_password_confirmation field is required."
    ]
  },
  "code": 422
}
```

**Current Password Error (422):**

```json
{
  "success": false,
  "message": "Your current password is incorrect!",
  "errors": null,
  "code": 422
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

---

### 7. Delete Account Request

**Endpoint:** `DELETE /api/v1/profile/delete`

**Description:** Delete account request. The request can also be cancelled using this endpoint.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | profile |
| unauthorized | login |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Account delete request has been sent successfully. Your account will be deleted in 7 days, but you can cancel the request anytime.",
  "content": null,
  "code": 200
}
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "An error occurred while sending account delete request, try again",
  "errors": null,
  "code": 500
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

---

### 8. Delete Account Now

**Endpoint:** `DELETE /api/v1/profile/delete-now`

**Description:** Delete user account instantly.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | login |
| unauthorized | login |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Your account has been deleted successfully!",
  "content": null,
  "code": 200
}
```

**Failed Error (400):**

```json
{
  "success": false,
  "message": "An error occurred while deleting your account, try again!",
  "errors": null,
  "code": 400
}
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "An error occurred while deleting your account, try again!",
  "errors": null,
  "code": 500
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

---

## Guest Management

**Base URL:** `https://api.fastlearnersapp.com`

### 1. Dashboard

**Endpoint:** `GET /api/v1/guest`

**Description:** Guest's dashboard overview.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Your dashboard!",
  "content": { "data": "" },
  "code": 200
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Error Message (500):**

```json
{ "success": false, "message": "Server error", "errors": null, "code": 500 }
```

---

## Student Management

**Base URL:** `https://api.fastlearnersapp.com`

### 1. Dashboard

**Endpoint:** `GET /api/v1/dashboard`

**Description:** User's dashboard overview and reports.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Student information",
  "content": {
    "name": "Student User",
    "subjects": "",
    "lessons": "",
    "progress": {
      "subject": "Mathematics",
      "covered": 22,
      "left": 120
    },
    "quizzes": "",
    "subscription_status": "trial"
  },
  "code": 200
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Error Message (500):**

```json
{ "success": false, "message": "Server error", "errors": null, "code": 500 }
```

---

### 2. List Student's Subjects

**Endpoint:** `GET /api/v1/subjects`

**Description:** Get the list of a student's subjects including compulsory, compulsory selective, and selective subjects. Compulsory selective and selective data is returned only if the student is in a JSS class.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "subjects": [
      { "id": 1, "name": "General Mathematics" },
      { "id": 2, "name": "English Language" },
      { "id": 18, "name": "Civic Education" },
      { "id": 4, "name": "Biology" },
      { "id": 5, "name": "Physics" },
      { "id": 6, "name": "Chemistry" },
      { "id": 22, "name": "Christian Religious Studies" },
      { "id": 31, "name": "Efik" },
      { "id": 7, "name": "Further Mathematics" },
      { "id": 8, "name": "Economics" },
      { "id": 36, "name": "Computer Studies" }
    ],
    "compulsory_selective_status": "selected",
    "compulsory_selective": [
      { "id": 22, "name": "Christian Religious Studies" },
      { "id": 23, "name": "Islamic Religious Studies" },
      { "id": 24, "name": "Religious and Moral Education" }
    ],
    "selective_status": "selected",
    "selective": [
      { "id": 3, "name": "Agricultural Science" },
      { "id": 7, "name": "Further Mathematics" },
      { "id": 8, "name": "Economics" },
      { "id": 9, "name": "Geography" },
      { "id": 27, "name": "Yoruba" },
      { "id": 28, "name": "Hausa" },
      { "id": 29, "name": "Igbo" },
      { "id": 30, "name": "Ibibio" },
      { "id": 31, "name": "Efik" },
      { "id": 32, "name": "Obolo" },
      { "id": 35, "name": "Technical Drawing" },
      { "id": 36, "name": "Computer Studies" }
    ]
  },
  "code": 200
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

---

### 3. Update Compulsory Selective Subject

**Endpoint:** `POST /api/v1/subjects/update-compulsory-selective`

**Description:** Update compulsory selective subject (only applicable to JSS classes). Student selects one (1) religious studies subject.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**

```json
{
  "subject": 22
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Compulsory Selective subject Updated successfully!",
  "content": null,
  "code": 200
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Error updating compulsory selective subject, try again!",
  "errors": null,
  "code": 400
}
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "An error occurred while updating compulsory selective subject!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 4. Update Selective Subject

**Endpoint:** `POST /api/v1/subjects/update-selective`

**Description:** Update a student's selective/discipline selective subjects. Students select four (4) subjects.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**

```json
{
  "subjects[]": [31, 7, 8, 36]
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Selective subjects Updated successfully!",
  "content": null,
  "code": 200
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "An error occurred while updating selective subjects!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 5. Get Student's Class

**Endpoint:** `GET /api/v1/student/class`

**Description:** Get a student's current class.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "content": { "class_id": 4, "class_name": "SSS1" },
  "code": 200
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "An error occurred while getting student class",
  "errors": ["error message"],
  "code": 500
}
```

---

### 6. Get All Classes

**Endpoint:** `GET /api/v1/student/classes`

**Description:** Get all classes.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "classes": [
      { "id": 1, "name": "JSS1" },
      { "id": 2, "name": "JSS2" },
      { "id": 3, "name": "JSS3" },
      { "id": 4, "name": "SSS1" },
      { "id": 5, "name": "SSS2" },
      { "id": 6, "name": "SSS3" }
    ]
  },
  "code": 200
}
```

**Not Found Error (404):**

```json
{
  "success": false,
  "message": "No class was found!",
  "errors": null,
  "code": 404
}
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "An error occurred while getting classes",
  "errors": ["error message"],
  "code": 500
}
```

---

### 7. Get Terms

**Endpoint:** `GET /api/v1/student/terms`

**Description:** Get all Terms.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "terms": [
      { "id": 1, "name": "First" },
      { "id": 2, "name": "Second" },
      { "id": 3, "name": "Third" }
    ]
  },
  "code": 200
}
```

**Not Found Error (404):**

```json
{
  "success": false,
  "message": "No term was found!",
  "errors": null,
  "code": 404
}
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "An error occurred while getting terms",
  "errors": ["error message"],
  "code": 500
}
```

---

### 8. Get Weeks

**Endpoint:** `GET /api/v1/student/weeks`

**Description:** Get all weeks (1–12).

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "weeks": [
      { "id": 1, "name": 1 },
      { "id": 2, "name": 2 },
      { "id": 3, "name": 3 },
      { "id": 4, "name": 4 },
      { "id": 5, "name": 5 },
      { "id": 6, "name": 6 },
      { "id": 7, "name": 7 },
      { "id": 8, "name": 8 },
      { "id": 9, "name": 9 },
      { "id": 10, "name": 10 },
      { "id": 11, "name": 11 },
      { "id": 12, "name": 12 }
    ]
  },
  "code": 200
}
```

**Not Found Error (404):**

```json
{
  "success": false,
  "message": "No week was found!",
  "errors": null,
  "code": 404
}
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "An error occurred while getting weeks",
  "errors": ["error message"],
  "code": 500
}
```

---

### 9. List Student's Subjects (Lessons)

**Endpoint:** `GET /api/v1/lessons/`

**Description:** Get the list of a student's subjects (compulsory, compulsory selective, selective) with slugs for lesson navigation.

**Note:** The subject `slug` should be appended to the topics URL to get topics.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "subjects": [
      { "id": 1, "name": "General Mathematics", "slug": "general-mathematics" },
      { "id": 2, "name": "English Language", "slug": "english-language" },
      { "id": 18, "name": "Civic Education", "slug": "civic-education" },
      { "id": 4, "name": "Biology", "slug": "biology" },
      { "id": 5, "name": "Physics", "slug": "physics" },
      { "id": 6, "name": "Chemistry", "slug": "chemistry" },
      {
        "id": 22,
        "name": "Christian Religious Studies",
        "slug": "christian-religious-studies"
      },
      { "id": 31, "name": "Efik", "slug": "efik" },
      { "id": 7, "name": "Further Mathematics", "slug": "further-mathematics" },
      { "id": 8, "name": "Economics", "slug": "economics" },
      { "id": 36, "name": "Computer Studies", "slug": "computer-studies" }
    ]
  },
  "code": 200
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**User Class Not Found Error (404):**

```json
{
  "success": false,
  "message": "User class not found!",
  "errors": null,
  "code": 404
}
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "There was an error fetching your subjects!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 10. Get Topics

**Endpoint:** `GET /api/v1/lessons/{subject-slug}`

**Example:** `GET /api/v1/lessons/general-mathematics`

**Description:** Get the list of topics for a subject organized by term.

**Note:** The subject `slug` should be appended to the overview URL to get the topic overview.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

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

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Subject Not Found Error (404):**

```json
{
  "success": false,
  "message": "Subject not found!",
  "errors": null,
  "code": 404
}
```

**Class Not Found Error (404):**

```json
{
  "success": false,
  "message": "Error getting your class!",
  "errors": null,
  "code": 404
}
```

**Term Not Found Error (404):**

```json
{
  "success": false,
  "message": "Error getting your term!",
  "errors": null,
  "code": 404
}
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "An error occurred while getting lesson topics!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 11. Get Topic Overview

**Endpoint:** `GET /api/v1/lessons/{subject-slug}/{topic-slug}/overview`

**Example:** `GET /api/v1/lessons/general-mathematics/number-bases-system/overview`

**Description:** Get the overview of a topic (Introduction, Concepts count, Application, Summary, General Exercises).

**Note:** The concepts count is the total number of concepts in a lesson. Loop through the count and append the number to the concept URL, e.g. `lessons/economics/meaning-of-economics/concepts/1` for concept 1.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

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

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Subject Not Found Error (404):**

```json
{
  "success": false,
  "message": "Subject not found!",
  "errors": null,
  "code": 404
}
```

**Topic Not Found Error (404):**

```json
{
  "success": false,
  "message": "Lesson topic not found!",
  "errors": null,
  "code": 404
}
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "An error occurred while getting lesson content: ",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 12. Get Lesson Content

**Endpoint:** `GET /api/v1/lessons/{subject-slug}/{topic-slug}/content`

**Example:** `GET /api/v1/lessons/general-mathematics/number-bases-system/content`

**Description:** Get the full lesson content including Introduction, Concepts, Application, Summary, General Exercises, and Check Markers.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

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
              "description": "For conversion from base 10 to other bases: Divide the given number repeatedly by the required base, write down the remainders, divide till quotient becomes 0, read remainders from bottom to top.",
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
              "answers": ["1110011₂", "1001011₂", "0101011₂", "1000011₂"],
              "correct_answer": "1000011₂",
              "correct_answer_option": "D",
              "created_at": "22-08-2025",
              "updated_at": "22-08-2025"
            }
          ]
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
            "16 ÷ 2 = 8 R0"
          ],
          "answers": ["1110011₂", "1001011₂", "0101011₂", "1000011₂"],
          "correct_answer": "1000011₂",
          "correct_answer_option": "D",
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

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Class Not Found Error (404):**

```json
{ "success": false, "message": "Class not found!", "errors": null, "code": 404 }
```

**Lesson Not Found Error (404):**

```json
{
  "success": false,
  "message": "Lesson not found!",
  "errors": null,
  "code": 404
}
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "An error occurred while getting lesson content: ",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 13. Handle Concept Exercise Answers

**Endpoint:** `POST /api/v1/lessons/check-exercise-answer`

**Description:** Verify student's answers to concept exercises.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**

```json
{
  "exercise_id": 5,
  "answer": "B"
}
```

**Success Response (200):**

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

**Validation Error (422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "answer": ["The answer field is required."],
    "exercise_id": ["The exercise id field is required."]
  },
  "code": 422
}
```

**Exercise Already Answered (200):**

```json
{
  "success": true,
  "message": "Exercise already answered, continue learning!",
  "content": { "score": "50", "attempt": "1st" },
  "code": 200
}
```

**Wrong Answer Response (400):**

```json
{
  "success": false,
  "message": "Wrong answer. Try again!",
  "errors": null,
  "code": 400
}
```

**Exercise Not Found Error (422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": { "exercise_id": ["The selected exercise was not found!!"] },
  "code": 422
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "There was an error checking your answer!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 14. Handle General Exercise Answers

**Endpoint:** `POST /api/v1/lessons/check-general-exercise-answer`

**Description:** Verify student's general exercise answers.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**

```json
{
  "general_exercise_id": 3,
  "answer": "C"
}
```

**Success Response (200):**

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

**Validation Error (422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "answer": ["The answer field is required."],
    "general_exercise_id": ["The general exercise id field is required."]
  },
  "code": 422
}
```

**General Exercise Already Answered (200):**

```json
{
  "success": true,
  "message": "General Exercise already answered, continue learning!",
  "content": { "score": "5", "attempt": "1st" },
  "code": 200
}
```

**Wrong Answer Response (400):**

```json
{
  "success": false,
  "message": "Wrong answer. Try again!",
  "errors": null,
  "code": 400
}
```

**General Exercise Not Found Error (422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": { "exercise_id": ["The selected general exercise was not found!"] },
  "code": 422
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "There was an error checking your answer!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 15. Lesson Overview Completion Check

**Endpoint Format:** `GET /api/v1/lessons/check/{type}/{lesson_id}`

**Example:** `GET /api/v1/lessons/check/overview/2`

**Description:** Check if a student has completed the lesson overview section before continuing to Concepts.

**Note:** `{type}` is the section type: `overview`, `concept`, `summary-and-application`, or `general-exercises`.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Overview completed successfully.",
  "content": {
    "check": { "is_completed": true, "score": "100%" }
  },
  "code": 200
}
```

**Lesson Check Marker Not Found (400):**

```json
{
  "success": false,
  "message": "No lesson check marker found, contact support with this error message code: 1001-2",
  "errors": null,
  "code": 400
}
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "There was an error verifying overview completion!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 16. Lesson Concepts Completion Check

**Endpoint Format:** `GET /api/v1/lessons/check/{type}/{lesson_id}/{concept_id}`

**Example:** `GET /api/v1/lessons/check/concept/2/1`

**Description:** Check if a student has completed a lesson concept section before continuing to the next section.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Concept completed successfully.",
  "content": {
    "check": { "is_completed": true, "score": "20%" }
  },
  "code": 200
}
```

**Lesson Check Marker Not Found (400):**

```json
{
  "success": false,
  "message": "No lesson check marker found, contact support with this error message code: 1001-2",
  "errors": null,
  "code": 400
}
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "There was an error verifying summary and application completion!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 17. Lesson Summary & Application Completion Check

**Endpoint Format:** `GET /api/v1/lessons/check/{type}/{lesson_id}`

**Example:** `GET /api/v1/lessons/check/summary-and-application/2`

**Description:** Check if a student has completed the lesson summary and application section before continuing to General Exercises.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Summary and Application completed successfully.",
  "content": {
    "check": { "is_completed": true, "score": "100%" }
  },
  "code": 200
}
```

**Lesson Check Marker Not Found (400):**

```json
{
  "success": false,
  "message": "No lesson check marker found, contact support with this error message code: 1001-2",
  "errors": null,
  "code": 400
}
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "There was an error verifying summary and application completion!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 18. Lesson General Exercises Completion Check

**Endpoint Format:** `GET /api/v1/lessons/check/{type}/{lesson_id}`

**Example:** `GET /api/v1/lessons/check/general-exercises/2`

**Description:** Check if a student has completed the lesson general exercises section before continuing to the next lesson topic.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

```json
{
  "success": true,
  "message": "General exercises completed successfully.",
  "content": {
    "check": { "is_completed": true, "score": "65%" }
  },
  "code": 200
}
```

**Not Completed Error (400):**

```json
{
  "success": false,
  "message": "Complete your lesson general exercises to continue learning!",
  "errors": null,
  "code": 400
}
```

**Lesson Check Marker Not Found (400):**

```json
{
  "success": false,
  "message": "No lesson check marker found, contact support with this error message code: 1001-2",
  "errors": null,
  "code": 400
}
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "There was an error verifying general exercises completion!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 19. Concepts Total Scores

**Endpoint Format:** `GET /api/v1/lessons/scores/concepts/{concept_id}`

**Example:** `GET /api/v1/lessons/scores/concepts/1`

**Description:** Get a lesson's concept total score using the concept_id.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "content": { "concept_id": 1, "total_score": "10.00", "weight": "10.00" },
  "code": 200
}
```

**Concept Total Score Not Found (400):**

```json
{
  "success": false,
  "message": "Concept total score not found!",
  "errors": null,
  "code": 400
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "An error occurred while getting the concept total score!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 20. General Exercises Total Scores

**Endpoint Format:** `GET /api/v1/lessons/scores/general-exercises/{lesson_id}`

**Example:** `GET /api/v1/lessons/scores/general-exercises/1`

**Description:** Get a lesson's general exercise total score using the lesson_id.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "content": { "total_score": "4.50", "weight": "30.00" },
  "code": 200
}
```

**General Exercise Total Score Not Found (400):**

```json
{
  "success": false,
  "message": "General Exercise total score not found!",
  "errors": null,
  "code": 400
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "An error occurred while getting the general exercise total score!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 21. Lesson Total Score

**Endpoint Format:** `GET /api/v1/lessons/scores/lessons/{lesson_id}`

**Example:** `GET /api/v1/lessons/scores/lessons/1`

**Description:** Get a lesson's total score using the lesson_id.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "content": { "lesson_total_score": "32.50", "weight": 100.0 },
  "code": 200
}
```

**Lesson Total Score Not Found (400):**

```json
{
  "success": false,
  "message": "Lesson total score not found!",
  "errors": null,
  "code": 400
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "An error occurred while getting the lesson total score!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 22. Lesson Total Scores Summary

**Endpoint Format:** `GET /api/v1/lessons/scores/lessons/summary/{lesson_id}`

**Example:** `GET /api/v1/lessons/scores/lessons/summary/1`

**Description:** Get a lesson's total score summary using the lesson_id.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

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

**Lesson Check Marker Not Found (400):**

```json
{
  "success": false,
  "message": "Lesson check marker not found!",
  "errors": null,
  "code": 400
}
```

**Lesson Total Score Not Found (400):**

```json
{
  "success": false,
  "message": "Lesson total score not found!",
  "errors": null,
  "code": 400
}
```

**Concept Total Scores Not Found (400):**

```json
{
  "success": false,
  "message": "No concepts total scores found!",
  "errors": null,
  "code": 400
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "An error occurred while getting lesson's total scores summary!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 23. Subject Total Score

**Endpoint Format:** `GET /api/v1/lessons/scores/subjects/{subject_id}/{term_id}`

**Example:** `GET /api/v1/lessons/scores/subjects/4/1`

**Description:** Get a subject's total score using the subject_id and term_id.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "content": { "subject_total_score": "3.25", "weight": 100.0 },
  "code": 200
}
```

**Subject Total Score Not Found (400):**

```json
{
  "success": false,
  "message": "Subject total score not found!",
  "errors": null,
  "code": 400
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "An error occurred while getting the subject total score!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 24. All Lessons Total Scores

**Endpoint Format:** `GET /api/v1/lessons/scores/lessons/total/{subject_id}/{term_id}`

**Example:** `GET /api/v1/lessons/scores/lessons/total/4/1`

**Description:** Get all lesson total scores for a specific subject using subject_id and term_id.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "total_scores": {
      "Introduction to Biology": [{ "total_score": "32.50" }]
    }
  },
  "code": 200
}
```

**Lessons Total Score Not Found (400):**

```json
{
  "success": false,
  "message": "No lessons total score found!",
  "errors": null,
  "code": 400
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "An error occurred while getting all lesson's total scores!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 25. All Subjects Total Scores

**Endpoint Format:** `GET /api/v1/lessons/scores/subjects/total/{term_id}`

**Example:** `GET /api/v1/lessons/scores/subjects/total/1`

**Description:** Get all subject total scores for the student's current class.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "content": {
    "total_scores": {
      "Biology": [{ "total_score": "3.25" }]
    }
  },
  "code": 200
}
```

**Subject Total Score Not Found (400):**

```json
{
  "success": false,
  "message": "No subjects total score found!",
  "errors": null,
  "code": 400
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "An error occurred while getting all subject's total scores!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 26. Guardian Request — Accept Request

**Endpoint:** `GET /api/v1/student/guardian/request/accept/{id}`

**Description:** Accept a guardian request using the request id.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | request-history |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Guardian request accepted successfully!",
  "content": null,
  "code": 200
}
```

**Request Not Found Error (404):**

```json
{
  "success": false,
  "message": "This request was not found, try again!",
  "errors": null,
  "code": 404
}
```

**Guardian Not Found Error (404):**

```json
{
  "success": false,
  "message": "This guardian was not found, try again!",
  "errors": null,
  "code": 404
}
```

**Acceptance Error (400):**

```json
{
  "success": false,
  "message": "Request already accepted!",
  "errors": null,
  "code": 400
}
```

**Request Already Rejected Error (400):**

```json
{
  "success": false,
  "message": "Request already rejected!",
  "errors": null,
  "code": 400
}
```

**Mail Sending Error (400):**

```json
{
  "success": false,
  "message": "An error occurred while sending rejection mail, but the request was rejected successfully!",
  "errors": null,
  "code": 400
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "Server error",
  "errors": ["error message"],
  "code": 500
}
```

---

### 27. Guardian Request — Reject Request

**Endpoint:** `GET /api/v1/student/guardian/request/reject/{id}`

**Description:** Reject a guardian request using the request id.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | request-history |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Guardian request rejected successfully!",
  "content": null,
  "code": 200
}
```

**Request Not Found Error (404):**

```json
{
  "success": false,
  "message": "This request was not found, try again",
  "errors": null,
  "code": 404
}
```

**Guardian Not Found Error (404):**

```json
{
  "success": false,
  "message": "This guardian was not found, try again!",
  "errors": null,
  "code": 404
}
```

**Only Pending Requests Error (400):**

```json
{
  "success": false,
  "message": "Only pending requests can be accepted!",
  "errors": null,
  "code": 400
}
```

**Request Already Accepted Error (400):**

```json
{
  "success": false,
  "message": "Request already accepted!",
  "errors": null,
  "code": 400
}
```

**Mail Sending Error (400):**

```json
{
  "success": false,
  "message": "An error occurred while sending acceptance mail, but the request was accepted successfully!",
  "errors": null,
  "code": 400
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "Server error",
  "errors": ["error message"],
  "code": 500
}
```

---

### 28. Guardian Request — Request History

**Endpoint:** `GET /api/v1/student/guardian/request/history`

**Description:** Get all guardian request history.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

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
      "meta": { "current_page": 1, "last_page": 1, "per_page": 20, "total": 1 }
    }
  },
  "code": 200
}
```

**Not Found Error (404):**

```json
{
  "success": false,
  "message": "No history found!",
  "errors": null,
  "code": 404
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "Server error",
  "errors": ["error message"],
  "code": 500
}
```

---

## Parental Consent Management

### 1. Accept Consent

**Endpoint:** `POST /api/v1/parental-consent/{token}/accept`

**Example:** `POST /api/v1/parental-consent/6d18-1bf5-66d6-03e2-c6cb-19ca/accept`

**Description:** Parent can accept a parental consent request through this endpoint.

**Notes:**

- The `{token}` in the endpoint is obtained from the acceptance URL.
- Acceptance link (e.g. `https://fastlearnersapp.com/6d18-1bf5-66d6-03e2-c6cb-19ca/accept`) is sent to parent's email.
- The `name` in the request body is optional.

**Headers:**
| Key | Value |
|-----|-------|
| Accept | application/json |

**Request Body:**

```json
{
  "name": "John Doe"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Parental consent request accepted successfully!",
  "content": null,
  "code": 200
}
```

**Consent Request Not Found Error (400):**

```json
{
  "success": false,
  "message": "Consent request not found!",
  "errors": null,
  "code": 400
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "Server error",
  "errors": ["error message"],
  "code": 500
}
```

---

### 2. Reject Consent

**Endpoint:** `POST /api/v1/parental-consent/{token}/reject`

**Example:** `POST /api/v1/parental-consent/6d18-1bf5-66d6-03e2-c6cb-19ca/reject`

**Description:** Parent can reject a parental consent request through this endpoint.

**Notes:**

- The `{token}` in the endpoint is obtained from the rejection URL.
- Rejection link (e.g. `https://fastlearnersapp.com/6d18-1bf5-66d6-03e2-c6cb-19ca/reject`) is sent to parent's email.
- The `name` in the request body is optional.

**Headers:**
| Key | Value |
|-----|-------|
| Accept | application/json |

**Request Body:**

```json
{
  "name": "John Doe"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Parental consent request rejected successfully!",
  "content": null,
  "code": 200
}
```

**Consent Request Not Found Error (400):**

```json
{
  "success": false,
  "message": "Consent request not found!",
  "errors": null,
  "code": 400
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "Server error",
  "errors": ["error message"],
  "code": 500
}
```

---

## Guardian Management

### 1. Dashboard

**Endpoint:** `GET /api/v1/guardian`

**Description:** Guardian's dashboard overview and reports.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Your children's report and statistics",
  "content": { "children": 1, "report": null },
  "code": 200
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Error Message (500):**

```json
{ "success": false, "message": "Server error", "errors": null, "code": 500 }
```

---

### 2. Make New Child Request

**Endpoint:** `POST /api/v1/guardian/children/request/new`

**Description:** Guardian can make a new child request.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**

```json
{
  "child_email": "johndoe@email.com"
}
```

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | request-history |
| validation error | none |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Child request sent successfully!",
  "content": null,
  "code": 200
}
```

**Validation Error (422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "child_email": [
      "The child email field is required.",
      "Child email does not exist on our record!"
    ]
  },
  "code": 422
}
```

**Email Does Not Exist Error (400):**

```json
{
  "success": false,
  "message": "Child email does not exist on our record!",
  "errors": null,
  "code": 400
}
```

**User Not A Guardian Error (400):**

```json
{
  "success": false,
  "message": "Only guardians can make this request!",
  "errors": null,
  "code": 400
}
```

**User Not A Student Error (400):**

```json
{
  "success": false,
  "message": "The email you entered does not belong to a student, try again!",
  "errors": null,
  "code": 400
}
```

**Pending Request Error (400):**

```json
{
  "success": false,
  "message": "This child request is still pending!",
  "errors": null,
  "code": 400
}
```

**Accepted Request Error (400):**

```json
{
  "success": false,
  "message": "This child request was accepted and assigned to you as child!",
  "errors": null,
  "code": 400
}
```

**Mail Sending Error (400):**

```json
{
  "success": false,
  "message": "An error occurred while sending request mail to your child, but your request has been sent successfully!",
  "errors": null,
  "code": 400
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "Server error",
  "errors": ["error message"],
  "code": 500
}
```

---

### 3. Cancel Child Request

**Endpoint:** `GET /api/v1/guardian/children/request/cancel/{id}`

**Description:** Cancel a child request using the request id.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | request-history |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Child request cancelled successfully!",
  "content": null,
  "code": 200
}
```

**Request Not Found Error (404):**

```json
{
  "success": false,
  "message": "This child request was not found!",
  "errors": null,
  "code": 404
}
```

**Cancel Error (400):**

```json
{
  "success": false,
  "message": "Sorry, you can only cancel a pending request!",
  "errors": null,
  "code": 400
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "Server error",
  "errors": ["error message"],
  "code": 500
}
```

---

### 4. Children Request History

**Endpoint:** `GET /api/v1/guardian/children/request/history`

**Description:** Get all children request history.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Success Response (200):**

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
      "meta": { "current_page": 1, "last_page": 1, "per_page": 20, "total": 3 }
    }
  },
  "code": 200
}
```

**Not Found Error (404):**

```json
{
  "success": false,
  "message": "No history found!",
  "errors": null,
  "code": 404
}
```

**Unauthorized Access (401):**

```json
{ "success": false, "message": "Unauthorized", "errors": null, "code": 401 }
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "Server error",
  "errors": ["error message"],
  "code": 500
}
```

---

## Subscription

**Base URL:** `https://api.fastlearnersapp.com`

### 1. View Packages

**Endpoint:** `GET /api/v1/packages`

**Description:** Get the list of all subscription packages. No authentication required.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | None |
| Accept | application/json |

**Success Response (200):**

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

**Package Not Found Error (404):**

```json
{
  "success": false,
  "message": "No package was found!",
  "errors": null,
  "code": 404
}
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "An error occurred while retrieving packages",
  "errors": ["error message"],
  "code": 500
}
```

---

### 2. View Single Package

**Endpoint:** `GET /api/v1/packages/{id}/view`

**Example:** `GET /api/v1/packages/1/view`

**Description:** Get the details of a specific subscription package using its id. Use the id obtained from the View Packages list. The package id is required for initiating a subscription.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | None |
| Accept | application/json |

**Success Response (200):**

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

**Package Not Found Error (404):**

```json
{
  "success": false,
  "message": "No package was found!",
  "errors": null,
  "code": 404
}
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "An error occurred while retrieving package",
  "errors": ["error message"],
  "code": 500
}
```

---

### 3. Verify Coupon

**Endpoint:** `POST /api/v1/subscriptions/verify-coupon`

**Description:** This endpoint verifies the coupon of a user and calculate their discount.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**

```json
{
  "package_id": 1,
  "coupon_code": "NEWCOM"
}
```

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |
| validation error | none |

**Success Response (200):**

```json
{
  "type": "success",
  "success": true,
  "message": "Success",
  "content": {
    "amount": "4,000.00",
    "discount_amount": "600.00",
    "final_amount": "3,400.00"
  },
  "code": 200
}
```

**Unauthorized Access (401):**

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error Message (500):**

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while calculating coupon, try again!",
  "errors": ["error message"],
  "code": 500
}
```

---

### 4. Subscribe Package

**Endpoint:** `POST /api/v1/subscriptions/subscribe`

**Description:** This endpoint generates the paystack payment link (authorization_url) for student to make payment. It returns the payment link where you'll open the link for payment to be made on the paystack payment page.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**

```json
{
  "package_id": 1,
  "coupon_code": "NEWCOM"
}
```

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | payment link (authorization_url) |
| validation error | none |

**Success Response (200):**

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

**Unauthorized Access (401):**

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error Message (500):**

```json
{
  "success": false,
  "message": "An error occurred while processing payment, try again!",
  "errors": ["error message"],
  "code": 500
}
```

---

### 5. Get Payment Status

**Frontend Url:** `https://fastlearnersapp.com/subscriptions/payment-status`

**Endpoint:** `GET /api/v1/subscriptions/payment-status/:reference`

**Description:** Get the payment status after a payment has been made with this endpoint using the reference that will be added to the frontend url by paystack after payment.

**Note:**
=> Make your frontend url exactly as stated above.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |

**Success Response (200):**

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
      "final_amount": "3,400.00",
      "status": "pending",
      "created_at": "01-06-2026"
    }
  },
  "code": 200
}
```

**Payment Failed Error (400):**

```json
{
  "success": false,
  "message": "Payment Failed",
  "errors": null,
  "code": 400
}
```

**Unauthorized Access (401):**

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error Message (500):**

```json
{
  "success": false,
  "message": "An error occurred while processing payment, try again!",
  "errors": ["error message"],
  "code": 500
}
```

---

### 6. Get Transaction History

**Endpoint:** `GET /api/v1/transactions`

**Description:** Get user transaction history.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |

**Success Response (200):**

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
          "final_amount": "4,000.00",
          "status": "pending",
          "created_at": "30-05-2026"
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
```

**Transaction Not Found Error (400):**

```json
{
  "success": false,
  "message": "No transaction found!",
  "errors": null,
  "code": 400
}
```

**Unauthorized Access (401):**

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error Message (500):**

```json
{
  "success": false,
  "message": "An error occurred while verifying your payment, try again!",
  "errors": ["error message"],
  "code": 500
}
```

---

### 7. Get Subscription History

**Endpoint:** `GET /api/v1/subscriptions`

**Description:** Get user subscription history.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |

**Success Response (200):**

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
          "transaction_reference": "fl-9cfe4d2c-6c71-4490-995d-1000f8107d6f",
          "start_at": null,
          "expires_at": "2026-06-14T10:40:59.000000Z",
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
```

**Transaction Not Found Error (400):**

```json
{
  "success": false,
  "message": "No transaction found!",
  "errors": null,
  "code": 400
}
```

**Unauthorized Access (401):**

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error Message (500):**

```json
{
  "success": false,
  "message": "An error occurred while verifying your payment, try again!",
  "errors": ["error message"],
  "code": 500
}
```

---


## Superadmin Management

**Base URL:** `https://api.fastlearnersapp.com`

---

### Package Management

#### 1. View Packages

**Endpoint:** `GET /api/v1/superadmin/packages`

**Description:** Returns the list of all available subscription packages.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |

**Success Response (200):**

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

**Package Not Found Error (404):**

```json
{
  "type": "error",
  "success": false,
  "message": "No package was found!",
  "errors": null,
  "code": 404
}
```

**Unauthorized Access (401):**

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error (500):**

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving packages!",
  "errors": ["error message"],
  "code": 500
}
```

---

#### 2. Get Package Detail

**Endpoint:** `GET /api/v1/superadmin/packages/{id}/view`

**Example:** `GET /api/v1/superadmin/packages/1/view`

**Description:** Get a specific package's detail using its id.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |

**Success Response (200):**

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

**Package Not Found Error (404):**

```json
{
  "type": "error",
  "success": false,
  "message": "Package not found!",
  "errors": null,
  "code": 404
}
```

**Unauthorized Access (401):**

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error (500):**

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving package!",
  "errors": ["error message"],
  "code": 500
}
```

---

#### 3. Create Package

**Endpoint:** `POST /api/v1/superadmin/packages/create`

**Description:** Create a new subscription package.

**Notes:**
- The `billing_cycle` field accepts select options: `monthly` or `yearly`.
- **Required fields:** `name`, `amount`, `billing_cycle`, `duration_days`.
- **Optional fields:** `description`, `original_amount` (both nullable — can be omitted or `null`).
- `original_amount` vs `amount`: When `original_amount` is provided, display it with a strikethrough as the original price. `amount` is always the current/actual price. When `original_amount` is `null`, display only `amount` with no strikethrough.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**

```json
{
  "name": "Basic",
  "amount": "2500",
  "original_amount": 4000,
  "billing_cycle": "monthly",
  "duration_days": 30,
  "description": "Basic subscription for students"
}
```

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |

**Success Response (200):**

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

**Validation Error (400):**

```json
{
  "type": "error",
  "success": false,
  "message": "Validation Error",
  "errors": ["validation errors"],
  "code": 400
}
```

**Unauthorized Access (401):**

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error (500):**

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while creating package",
  "errors": ["error message"],
  "code": 500
}
```

---

#### 4. Update Package

**Endpoint:** `POST /api/v1/superadmin/packages/{id}/update`

**Example:** `POST /api/v1/superadmin/packages/1/update`

**Description:** Update an existing subscription package using its id.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**

```json
{
  "name": "Basic Package",
  "amount": "2500",
  "original_amount": 4000,
  "billing_cycle": "monthly",
  "duration_days": 30,
  "description": "Basic package subscription for students"
}
```

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |

**Success Response (200):**

```json
{
  "type": "success",
  "success": true,
  "message": "Package updated successfully!",
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

**Validation Error (400):**

```json
{
  "type": "error",
  "success": false,
  "message": "Validation Error",
  "errors": ["validation errors"],
  "code": 400
}
```

**Unauthorized Access (401):**

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error (500):**

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while updating package",
  "errors": ["error message"],
  "code": 500
}
```

---

#### 5. Delete Package

**Endpoint:** `DELETE /api/v1/superadmin/packages/{id}/delete`

**Example:** `DELETE /api/v1/superadmin/packages/2/delete`

**Description:** Delete a package using its id. Packages with active subscriptions cannot be deleted.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |

**Success Response (200):**

```json
{
  "type": "success",
  "success": true,
  "message": "Package deleted successfully!",
  "content": null,
  "code": 200
}
```

**Package Not Found Error (404):**

```json
{
  "type": "error",
  "success": false,
  "message": "Package not found!",
  "errors": null,
  "code": 404
}
```

**Package Cannot Be Deleted Error (400):**

```json
{
  "type": "error",
  "success": false,
  "message": "Package has subscriptions and can't be deleted!",
  "errors": null,
  "code": 400
}
```

**Unauthorized Access (401):**

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error (500):**

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while deleting package",
  "errors": ["error message"],
  "code": 500
}
```

---

#### 6. Update Package Status

**Endpoint:** `POST /api/v1/superadmin/packages/{id}/update-status`

**Example:** `POST /api/v1/superadmin/packages/2/update-status`

**Description:** Toggle a package's status between active and inactive.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |

**Success Response (200):**

```json
{
  "type": "success",
  "success": true,
  "message": "Package activated successfully!",
  "content": null,
  "code": 200
}
```

**Package Not Found Error (404):**

```json
{
  "type": "error",
  "success": false,
  "message": "Package not found!",
  "errors": null,
  "code": 404
}
```

**Unauthorized Access (401):**

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error (500):**

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while updating package status.",
  "errors": ["error message"],
  "code": 500
}
```

---

### Coupon Management

#### 1. View Coupons

**Endpoint:** `GET /api/v1/superadmin/coupons`

**Description:** Returns the list of all available coupons with pagination.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |

**Success Response (200):**

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

**Coupon Not Found Error (404):**

```json
{
  "type": "error",
  "success": false,
  "message": "No coupon was found!",
  "errors": null,
  "code": 404
}
```

**Unauthorized Access (401):**

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error (500):**

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving coupons!",
  "errors": ["error message"],
  "code": 500
}
```

---

#### 2. Get Coupon Detail

**Endpoint:** `GET /api/v1/superadmin/coupons/{id}/view`

**Example:** `GET /api/v1/superadmin/coupons/1/view`

**Description:** Get a specific coupon's detail using its id.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |

**Success Response (200):**

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

**Coupon Not Found Error (404):**

```json
{
  "type": "error",
  "success": false,
  "message": "Coupon not found!",
  "errors": null,
  "code": 404
}
```

**Unauthorized Access (401):**

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error (500):**

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving coupon!",
  "errors": ["error message"],
  "code": 500
}
```

---

#### 3. Create Coupon

**Endpoint:** `POST /api/v1/superadmin/coupons/create`

**Description:** Create a new coupon.

**Notes:**
- The `type` field accepts select options: `percentage` or `fixed`.
- For `package_id`, call the View Packages endpoint and load the ids as select option values with package names as labels.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**

```json
{
  "code": "Premium",
  "package_id": 1,
  "type": "percentage",
  "value": 5,
  "minimum_amount": 1000,
  "usage_limit": 3,
  "expires_at": "19-06-2026",
  "description": "Premium users coupon"
}
```

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |

**Success Response (200):**

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

**Validation Error (400):**

```json
{
  "type": "error",
  "success": false,
  "message": "Validation Error",
  "errors": ["validation errors"],
  "code": 400
}
```

**Unauthorized Access (401):**

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error (500):**

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while creating coupon",
  "errors": ["error message"],
  "code": 500
}
```

---

#### 4. Update Coupon

**Endpoint:** `POST /api/v1/superadmin/coupons/{id}/update`

**Example:** `POST /api/v1/superadmin/coupons/1/update`

**Description:** Update an existing coupon using its id.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**

```json
{
  "code": "Premium Plan",
  "package_id": 1,
  "type": "percentage",
  "value": 5,
  "minimum_amount": 1000,
  "usage_limit": 3,
  "expires_at": "19-06-2026",
  "description": "Premium users coupon"
}
```

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |

**Success Response (200):**

```json
{
  "type": "success",
  "success": true,
  "message": "Coupon updated successfully!",
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

**Validation Error (400):**

```json
{
  "type": "error",
  "success": false,
  "message": "Validation Error",
  "errors": ["validation errors"],
  "code": 400
}
```

**Unauthorized Access (401):**

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error (500):**

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while updating coupon",
  "errors": ["error message"],
  "code": 500
}
```

---

#### 5. Delete Coupon

**Endpoint:** `DELETE /api/v1/superadmin/coupons/{id}/delete`

**Example:** `DELETE /api/v1/superadmin/coupons/2/delete`

**Description:** Delete a coupon using its id.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |

**Success Response (200):**

```json
{
  "type": "success",
  "success": true,
  "message": "Coupon deleted successfully!",
  "content": null,
  "code": 200
}
```

**Coupon Not Found Error (404):**

```json
{
  "type": "error",
  "success": false,
  "message": "Coupon not found!",
  "errors": null,
  "code": 404
}
```

**Unauthorized Access (401):**

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error (500):**

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while deleting coupon",
  "errors": ["error message"],
  "code": 500
}
```

---

#### 6. Update Coupon Status

**Endpoint:** `POST /api/v1/superadmin/coupons/{id}/update-status`

**Example:** `POST /api/v1/superadmin/coupons/2/update-status`

**Description:** Toggle a coupon's status between active and inactive.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |

**Success Response (200):**

```json
{
  "type": "success",
  "success": true,
  "message": "Coupon activated successfully!",
  "content": null,
  "code": 200
}
```

**Coupon Not Found Error (404):**

```json
{
  "type": "error",
  "success": false,
  "message": "Coupon not found!",
  "errors": null,
  "code": 404
}
```

**Unauthorized Access (401):**

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error (500):**

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while updating coupon status.",
  "errors": ["error message"],
  "code": 500
}
```

---

#### 7. Coupon Search

**Endpoint:** `POST /api/v1/superadmin/coupons/search`

**Description:** Search for coupons by name/code using a search term.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**

```json
{
  "search_term": "new"
}
```

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |

**Success Response (200):**

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
```

**Validation Error (400):**

```json
{
  "type": "error",
  "success": false,
  "message": "Validation Error",
  "errors": ["validation errors"],
  "code": 400
}
```

**Unauthorized Access (401):**

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error (500):**

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while creating coupon",
  "errors": ["error message"],
  "code": 500
}
```

---

### Subscription Management

#### 1. View Subscriptions

**Endpoint:** `GET /api/v1/superadmin/subscriptions`

**Description:** Returns the list of all subscriptions with pagination.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |

**Success Response (200):**

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

**Subscription Not Found Error (404):**

```json
{
  "type": "error",
  "success": false,
  "message": "No subscription was found!",
  "errors": null,
  "code": 404
}
```

**Unauthorized Access (401):**

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error (500):**

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving subscriptions!",
  "errors": ["error message"],
  "code": 500
}
```

---

#### 2. View Subscription Detail

**Endpoint:** `GET /api/v1/superadmin/subscriptions/{id}/view`

**Example:** `GET /api/v1/superadmin/subscriptions/1/view`

**Description:** Get a specific subscription's detail using its id.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |

**Success Response (200):**

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

**Subscription Not Found Error (404):**

```json
{
  "type": "error",
  "success": false,
  "message": "Subscription not found!",
  "errors": null,
  "code": 404
}
```

**Unauthorized Access (401):**

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error (500):**

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving subscription!",
  "errors": ["error message"],
  "code": 500
}
```

---

### Transaction Management

#### 1. View Transactions

**Endpoint:** `GET /api/v1/superadmin/transactions`

**Description:** Returns the list of all transactions with pagination.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |

**Success Response (200):**

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

**Transaction Not Found Error (404):**

```json
{
  "type": "error",
  "success": false,
  "message": "No transaction was found!",
  "errors": null,
  "code": 404
}
```

**Unauthorized Access (401):**

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error (500):**

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving transactions!",
  "errors": ["error message"],
  "code": 500
}
```

---

#### 2. View Transaction Detail

**Endpoint:** `GET /api/v1/superadmin/transactions/{id}/view`

**Example:** `GET /api/v1/superadmin/transactions/1/view`

**Description:** Get a specific transaction's detail using its id.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Redirection:**
| Response | Redirect To |
|----------|-------------|
| success | none |

**Success Response (200):**

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

**Transaction Not Found Error (404):**

```json
{
  "type": "error",
  "success": false,
  "message": "Transaction not found!",
  "errors": null,
  "code": 404
}
```

**Unauthorized Access (401):**

```json
{
  "type": "error",
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error (500):**

```json
{
  "type": "error",
  "success": false,
  "message": "An error occurred while retrieving transaction!",
  "errors": ["error message"],
  "code": 500
}
```

---

_© Copyright FastLearners App. All Rights Reserved._
