# FastLearners Backend API Documentation

**Base URL:** `https://api.fastlearnersapp.com`

---

## Table of Contents

1. [Authentication System](#authentication-system)
2. [User Management](#user-management)
3. [Guest Management](#guest-management)
4. [Student Management](#student-management)
5. [Guardian Management](#guardian-management)
6. [Lesson Management & Content](#lesson-management--content)
7. [Answering System](#answering-system)
8. [Lesson Completion Check System](#lesson-completion-check-system)
9. [Admin & SuperAdmin Endpoints](#admin--superadmin-endpoints)

---

## Authentication System

### 1. Registration

**Endpoint:** `POST /api/v1/register`

**Description:** Register a new user with their email address.

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
    "email": [
      "The email field is required."
    ]
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
    "email": [
      "The email has already been taken."
    ]
  },
  "code": 422
}
```

**Redirection:** On success → `verify-email`

---

### 2. Verify Email After Registration

**Endpoint:** `POST /api/v1/verify-email`

**Description:** Verify email address after registration with a 6-digit code sent to the registered email address. Code expires after 15 minutes.

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

**Redirection:** On success → `create-password`

---

### 3. Create Password

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
    "password": ["The password field is required."],
    "password_confirmation": ["The password_confirmation field is required.", "The password field confirmation does not match."]
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

**Redirection:** On success → `set-role`

---

### 4. Set Role

**Endpoint:** `POST /api/v1/set-role`

**Description:** Set role after successfully creating password.

**Notes:**
- Users must select from `['guest', 'student', 'guardian']`
- If the user role selected is `guardian`, add extra input for `child_email` and `child_phone`

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body (Student):**
```json
{
  "user_role": "student"
}
```

**Request Body (Guardian):**
```json
{
  "user_role": "guardian",
  "child_email": "child@example.com",
  "child_phone": "08098765432"
}
```

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

**Redirection:** On success → `dashboard` (redirect according to user's role)

---

### 5. Resend Verification Code

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

### 6. Login

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
    "email_phone": ["The email field is required."],
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

**Redirection:** On success → `dashboard` (redirect according to user's role) | Inactive user → `verify-email`

---

### 7. Login/Register With Google

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

**Redirection:** On success → `dashboard` or `create-password` (depending on account status)

---

### 8. Logout

**Endpoint:** `POST /api/v1/logout`

**Description:** Logs out an authenticated user.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

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

**Redirection:** On success → `login`

---

### 9. Forgot Password

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

### 10. Verify Password Reset Code

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

**Redirection:** On success → `reset password`

---

### 11. Resend Password Reset Code

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

### 12. Reset Password

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

**Redirection:** On success → `login`

---

## User Management

### 1. Profile Details

**Endpoint:** `GET /api/v1/profile`

**Description:** User's profile displays user's information (all users i.e., guest, student, guardian, admin, etc.).

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

**Description:** Get user's profile data including classes, roles, and disciplines.

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

**Description:** Check if username is available.

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

**Important Notes:**
- If role is `guardian`, `child_email` and `child_phone` are required
- Show the role input field only if user's role === "guest", else show disabled
- Show username input field if `username == null`, else show disabled
- Show date of birth input field if `date_of_birth == null`, else show disabled
- Show class input field if `class == null`, else show disabled
- Show discipline input field if `discipline == null` AND `class == SSS1 || SSS2 || SSS3`, else show disabled
- Discipline must be a select option of: Art, Commercial, Science
- Show gender input field if `gender == null`, else show disabled
- Except for students, school, class, and discipline are NOT required for other roles (guest, guardian, teacher, admin, superadmin)

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body (Student):**
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
  "country": "Nigeria",
  "state": "Akwa Ibom",
  "city": "Uyo",
  "address": "123 Oron Road",
  "role": "student"
}
```

**Request Body (Guardian):**
```json
{
  "name": "Linus Thompson",
  "username": "linus",
  "phone": "08012345678",
  "date_of_birth": "03/11/2018",
  "gender": "male",
  "country": "Nigeria",
  "state": "Akwa Ibom",
  "city": "Uyo",
  "address": "123 Oron Road",
  "role": "guardian",
  "child_email": "child@example.com",
  "child_phone": "08098765432"
}
```

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
    "gender": ["The gender is required for guardians."],
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
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
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

**Discipline Error (400):**
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
      "Profile picture must be of type, png, jpg, jpeg,webp.",
      "Profile picture size must not be larger than 1MB."
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
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Redirection:** On success → `profile`

---

### 6. Check Username Availability

**Endpoint:** `GET /api/v1/check-username-availability/{username}`

**Description:** Check if username is available.

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
    "new_password_confirmation": ["The new_password_confirmation field is required."]
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
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

---

## Guest Management

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
  "content": {
    "data": ""
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

**Error Message (500):**
```json
{
  "success": false,
  "message": "Server error",
  "errors": null,
  "code": 500
}
```

---

## Student Management

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
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Error Message (500):**
```json
{
  "success": false,
  "message": "Server error",
  "errors": null,
  "code": 500
}
```

---

### 2. List Student's Subjects

**Endpoint:** `GET /api/v1/subjects`

**Description:** Get the list of a student's subjects, compulsory selective subjects status, selective subjects and selective subject status.

**Note:** The compulsory selective subject status and selective subjects data is returned if the student is in a JSS class.

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

### 3. Update Compulsory Selective Subject

**Endpoint:** `POST /api/v1/subjects/update-compulsory-selective`

**Description:** Update compulsory selective subject. Only applicable to JSS classes.

**Notes:**
- A student must select one (1) subject from the list of religious studies
- Post the subject ID in the request body

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
  "message": "Error updating compulsory selective subject, try again!",
  "errors": null,
  "code": 400
}
```

**Server Error Response (500):**
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

**Description:** Update a student's selective/discipline selective subjects.

**Notes:**
- For JSS classes: students select four (4) subjects from the list of subjects
- For SSS classes: students select four (4) subjects from discipline selective subjects
- Post the subject IDs in the request body

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**
```json
{
  "subjects[]": 31,
  "subjects[]": 7,
  "subjects[]": 8,
  "subjects[]": 36
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
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Server Error Response (500):**
```json
{
  "success": false,
  "message": "An error occurred while updating selective subjects!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 5. Get Student's Subjects (Lessons)

**Endpoint:** `GET /api/v1/lessons/`

**Description:** Get the list of a student's subjects (compulsory subjects, compulsory selective, selective subjects).

**Note:** The subject "slug" should be appended to the topics URL to get the topics.

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
      {
        "id": 1,
        "name": "General Mathematics",
        "slug": "general-mathematics"
      },
      {
        "id": 2,
        "name": "English Language",
        "slug": "english-language"
      }
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

**User Class Not Found Error (404):**
```json
{
  "success": false,
  "message": "User class not found!",
  "errors": null,
  "code": 404
}
```

**Server Error Response (500):**
```json
{
  "success": false,
  "message": "There was an error fetching your subjects!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 6. Get Topics

**Endpoint:** `GET /api/v1/lessons/{subject_slug}`

**Description:** Get the list of topics of a subject.

**Note:** The subject "slug" should be appended to the URL to get the lesson topic overview.

**Example:** `GET /api/v1/lessons/general-mathematics`

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
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
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

**Server Error Response (500):**
```json
{
  "success": false,
  "message": "An error occurred while getting lesson topics!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 7. Get Topics Overview

**Endpoint:** `GET /api/v1/lessons/{subject_slug}/{topic_slug}/overview`

**Description:** Get the overview of a topic which comprises Introduction, Concepts, Application, Summary, and General Exercises.

**Note:** For concepts, it returns a count of the total number of concepts a lesson topic has. Loop through the count and append the count number to the concept URL to display specific content (e.g., `lessons/economics/meaning-of-economics-and-related-concepts/concepts/1` for concept 1).

**Example:** `GET /api/v1/lessons/general-mathematics/number-bases-system/overview`

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
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
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

**Server Error Response (500):**
```json
{
  "success": false,
  "message": "An error occurred while getting lesson content: ",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 8. Get Lesson Content

**Endpoint:** `GET /api/v1/lessons/{subject_slug}/{topic_slug}/content`

**Description:** Get the lesson content which includes Introduction, Concepts, Application, Summary, and General Exercises.

**Example:** `GET /api/v1/lessons/general-mathematics/number-bases-system/content`

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
            }
          ],
          "exercises": [
            {
              "id": 5,
              "order_index": 1,
              "concept_title": "Conversion from Base 10 to Other Bases",
              "title": "Exercise 1",
              "problem": "Convert 97₁₀ to base 2",
              "solution_steps": ["..."],
              "answers": [
                "1110011₂",
                "1001011₂",
                "0101011₂",
                "1000011₂"
              ],
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
          "solution_steps": ["..."],
          "answers": [
            "1110011₂",
            "1001011₂",
            "0101011₂",
            "1000011₂"
          ],
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
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

**Class Not Found Error (404):**
```json
{
  "success": false,
  "message": "Class not found!",
  "errors": null,
  "code": 404
}
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

**Server Error Response (500):**
```json
{
  "success": false,
  "message": "An error occurred while getting lesson content: ",
  "errors": ["error messages"],
  "code": 500
}
```

---

## Answering System

### 1. Handle Concept Exercise Answers

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
    "answer": ["The answer field is required."],
    "exercise_id": ["The exercise id field is required."]
  },
  "code": 422
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

**Exercise Already Answered Error (400):**
```json
{
  "success": false,
  "message": "Exercise already answered, continue learning!",
  "errors": null,
  "code": 400
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
  "errors": {
    "exercise_id": ["The selected exercise was not found!!"]
  },
  "code": 422
}
```

**Server Error Response (500):**
```json
{
  "success": false,
  "message": "There was an error checking your answer!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 2. Handle General Exercise Answers

**Endpoint:** `POST /api/v1/lessons/check-general-exercise-answer`

**Description:** Verify student's general exercises answers.

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
    "answer": ["The answer field is required."],
    "general_exercise_id": ["The general exercise id field is required."]
  },
  "code": 422
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

**Exercise Already Answered Error (400):**
```json
{
  "success": false,
  "message": "General exercise already answered, continue learning!",
  "errors": null,
  "code": 400
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
  "errors": {
    "exercise_id": ["The selected general exercise was not found!"]
  },
  "code": 422
}
```

**Server Error Response (500):**
```json
{
  "success": false,
  "message": "There was an error checking your answer!",
  "errors": ["error messages"],
  "code": 500
}
```

---

## Lesson Completion Check System

### 1. Lesson Overview Completion Check

**Endpoint:** `GET /api/v1/lessons/check/overview/{lesson_id}`

**Description:** Check if a student has completed the lesson overview section before continuing to the next section (Concepts).

**Note:** The `{type}` is the section type (overview, concept, summary-and-application, general-exercises).

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
    "check": [
      "is_completed": true,
      "score": "100%"
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

**Lesson Check Marker Not Found Error (400):**
```json
{
  "success": false,
  "message": "No lesson check marker found, contact support with this error message code: 1001-2",
  "errors": null,
  "code": 400
}
```

**Server Error Response (500):**
```json
{
  "success": false,
  "message": "There was an error verifying overview completion!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 2. Lesson Concepts Completion Check

**Endpoint:** `GET /api/v1/lessons/check/concept/{lesson_id}/{concept_id}`

**Description:** Check if a student has completed the lesson concepts section before continuing to the next section.

**Note:** The `{type}` is the section type, `{lesson_id}` is the lesson ID, and `{concept_id}` is the concept ID.

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
    "check": [
      "is_completed": true,
      "score": "20%"
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

**Lesson Check Marker Not Found Error (400):**
```json
{
  "success": false,
  "message": "No lesson check marker found, contact support with this error message code: 1001-2",
  "errors": null,
  "code": 400
}
```

**Server Error Response (500):**
```json
{
  "success": false,
  "message": "There was an error verifying summary and application completion!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 3. Lesson Summary & Application Completion Check

**Endpoint:** `GET /api/v1/lessons/check/summary-and-application/{lesson_id}`

**Description:** Check if a student has completed the lesson summary and application section before continuing to the next section (General Exercises).

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
    "check": [
      "is_completed": true,
      "score": "100%"
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

**Lesson Check Marker Not Found Error (400):**
```json
{
  "success": false,
  "message": "No lesson check marker found, contact support with this error message code: 1001-2",
  "errors": null,
  "code": 400
}
```

**Server Error Response (500):**
```json
{
  "success": false,
  "message": "There was an error verifying summary and application completion!",
  "errors": ["error messages"],
  "code": 500
}
```

---

### 4. Lesson General Exercises Completion Check

**Endpoint:** `GET /api/v1/lessons/check/general-exercises/{lesson_id}`

**Description:** Check if a student has completed the lesson general exercise section before continuing to the next lesson topic.

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
    "check": [
      "is_completed": true,
      "score": "65%"
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

**Lesson Check Marker Not Found Error (400):**
```json
{
  "success": false,
  "message": "No lesson check marker found, contact support with this error message code: 1001-2",
  "errors": null,
  "code": 400
}
```

**Not Completed Error Response (400):**
```json
{
  "success": false,
  "message": "Complete your lesson general exercises to continue learning!",
  "errors": null,
  "code": 400
}
```

**Server Error Response (500):**
```json
{
  "success": false,
  "message": "There was an error verifying general exercises completion!",
  "errors": ["error messages"],
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
  "content": {
    "children": 1,
    "report": null
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

**Error Message (500):**
```json
{
  "success": false,
  "message": "Server error",
  "errors": null,
  "code": 500
}
```

---

## Admin & SuperAdmin Endpoints

### All Lessons Upload

**Endpoint:** `POST /api/v1/superadmin/lessons/uploads/all-lesson-files`

**Description:** All lesson files (lesson, concepts, examples, exercises, general-exercises, check-markers) upload.

**Notes:**
- Uploaded file type should only be CSV or TXT

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**
```json
{
  "lessons_file": "(binary-file)",
  "concepts_file": "(binary-file)",
  "examples_file": "(binary-file)",
  "exercises_file": "(binary-file)",
  "general_exercises_file": "(binary-file)",
  "check_markers_file": "(binary-file)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "All CSV files uploaded successfully.",
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
    "lessons_file": ["The lessons file field is required."],
    "concepts_file": ["The concepts file field is required."],
    "examples_file": ["The school examples file is required."],
    "exercises_file": ["The exercises file field is required."],
    "general_exercises_file": ["The general exercises file field is required."],
    "check_markers_file": ["The check markers file field is required."]
  },
  "code": 422
}
```

**Missing Column Error (400):**
```json
{
  "success": false,
  "message": "Invalid (filename) CSV format. Missing column: (column name)",
  "errors": null,
  "code": 400
}
```

**Class Not Found Error (404):**
```json
{
  "success": false,
  "message": "Class (class name) not found",
  "errors": null,
  "code": 404
}
```

**Subject Not Found Error (404):**
```json
{
  "success": false,
  "message": "Subject (subject name) not found",
  "errors": null,
  "code": 404
}
```

**Term Not Found Error (404):**
```json
{
  "success": false,
  "message": "Term (term name) not found",
  "errors": null,
  "code": 404
}
```

**Week Not Found Error (404):**
```json
{
  "success": false,
  "message": "Week (week name) not found",
  "errors": null,
  "code": 404
}
```

**Lesson Not Found Error (404):**
```json
{
  "success": false,
  "message": "Lesson (lesson topic) not found",
  "errors": null,
  "code": 404
}
```

**Concept Not Found Error (404):**
```json
{
  "success": false,
  "message": "Concept (concept title) not found",
  "errors": null,
  "code": 404
}
```

**Upload Error (500):**
```json
{
  "success": false,
  "message": "Error processing CSV files: (error message)",
  "errors": null,
  "code": 500
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

### Lessons Upload

**Endpoint:** `POST /api/v1/superadmin/lessons/uploads/lessons`

**Description:** Lessons files upload.

**Notes:**
- Lessons file type should be CSV or TXT

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**
```json
{
  "lessons_file": "(binary-file)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Lessons uploaded successfully.",
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
    "lessons_file": ["The lessons file field is required."]
  },
  "code": 422
}
```

**Missing Column Error (400):**
```json
{
  "success": false,
  "message": "Invalid lesson CSV format. All columns are required.",
  "errors": null,
  "code": 400
}
```

**Lesson Already Exist Error (400):**
```json
{
  "success": false,
  "message": "Lesson (topic) already exist.",
  "errors": null,
  "code": 400
}
```

**Class Not Found Error (404):**
```json
{
  "success": false,
  "message": "Class (class name) not found",
  "errors": null,
  "code": 404
}
```

**Subject Not Found Error (404):**
```json
{
  "success": false,
  "message": "Subject (subject name) not found",
  "errors": null,
  "code": 404
}
```

**Term Not Found Error (404):**
```json
{
  "success": false,
  "message": "Term (term name) not found",
  "errors": null,
  "code": 404
}
```

**Week Not Found Error (404):**
```json
{
  "success": false,
  "message": "Week (week name) not found",
  "errors": null,
  "code": 404
}
```

**Invalid JSON Format Error (400):**
```json
{
  "success": false,
  "message": "Invalid JSON format in objectives or key_concepts",
  "errors": null,
  "code": 400
}
```

**Upload Error (500):**
```json
{
  "success": false,
  "message": "Error uploading lessons: (error message)",
  "errors": null,
  "code": 500
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

### Concepts Upload

**Endpoint:** `POST /api/v1/superadmin/lessons/uploads/concepts`

**Description:** Concepts files upload.

**Notes:**
- Concepts file type should be CSV or TXT

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**
```json
{
  "concepts_file": "(binary-file)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Lesson's concepts uploaded successfully.",
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
    "concepts_file": ["The concepts file field is required."]
  },
  "code": 422
}
```

**Missing Column Error (400):**
```json
{
  "success": false,
  "message": "Invalid concepts CSV format. All columns are required.",
  "errors": null,
  "code": 400
}
```

**Lesson Not Found Error (404):**
```json
{
  "success": false,
  "message": "Lesson (lesson topic) not found",
  "errors": null,
  "code": 404
}
```

**Concept Already Exist Error (400):**
```json
{
  "success": false,
  "message": "Concept (title) already exist.",
  "errors": null,
  "code": 400
}
```

**Invalid JSON Format Error (400):**
```json
{
  "success": false,
  "message": "Invalid JSON format in description",
  "errors": null,
  "code": 400
}
```

**Upload Error (500):**
```json
{
  "success": false,
  "message": "Error uploading lesson's concept: (error message)",
  "errors": null,
  "code": 500
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

### Examples Upload

**Endpoint:** `POST /api/v1/superadmin/lessons/uploads/examples`

**Description:** Examples files upload.

**Notes:**
- Examples file type should be CSV or TXT

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**
```json
{
  "examples_file": "(binary-file)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Lesson's concepts examples uploaded successfully.",
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
    "examples_file": ["The examples file field is required."]
  },
  "code": 422
}
```

**Missing Column Error (400):**
```json
{
  "success": false,
  "message": "Invalid examples CSV format. All columns are required.",
  "errors": null,
  "code": 400
}
```

**Concept Not Found Error (404):**
```json
{
  "success": false,
  "message": "Concept (concept title) not found",
  "errors": null,
  "code": 404
}
```

**Example Already Exist Error (400):**
```json
{
  "success": false,
  "message": "Example problem (problem) already exist.",
  "errors": null,
  "code": 400
}
```

**Invalid JSON Format Error (400):**
```json
{
  "success": false,
  "message": "Invalid JSON format in solution_steps",
  "errors": null,
  "code": 400
}
```

**Upload Error (500):**
```json
{
  "success": false,
  "message": "Error uploading lesson's concepts examples: (error message)",
  "errors": null,
  "code": 500
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

### Exercises Upload

**Endpoint:** `POST /api/v1/superadmin/lessons/uploads/exercises`

**Description:** Exercises files upload.

**Notes:**
- Exercises file type should be CSV or TXT

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**
```json
{
  "exercises_file": "(binary-file)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Lesson's concepts exercises uploaded successfully.",
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
    "exercises_file": ["The exercises file field is required."]
  },
  "code": 422
}
```

**Missing Column Error (400):**
```json
{
  "success": false,
  "message": "Invalid exercises CSV format. All columns are required.",
  "errors": null,
  "code": 400
}
```

**Concept Not Found Error (404):**
```json
{
  "success": false,
  "message": "Concept (concept title) not found",
  "errors": null,
  "code": 404
}
```

**Exercise Already Exist Error (400):**
```json
{
  "success": false,
  "message": "Exercise problem (problem) already exist.",
  "errors": null,
  "code": 400
}
```

**Invalid JSON Format Error (400):**
```json
{
  "success": false,
  "message": "Invalid JSON format in solution_steps or answers",
  "errors": null,
  "code": 400
}
```

**Upload Error (500):**
```json
{
  "success": false,
  "message": "Error uploading lesson's concepts exercises: (error message)",
  "errors": null,
  "code": 500
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

### General Exercises Upload

**Endpoint:** `POST /api/v1/superadmin/lessons/uploads/general-exercises`

**Description:** General exercises files upload.

**Notes:**
- General exercises file type should be CSV or TXT

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**
```json
{
  "general_exercises_file": "(binary-file)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "General exercises uploaded successfully.",
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
    "general_exercises_file": ["The general exercises file field is required."]
  },
  "code": 422
}
```

**Missing Column Error (400):**
```json
{
  "success": false,
  "message": "Invalid general exercises CSV format. All columns are required.",
  "errors": null,
  "code": 400
}
```

**Lesson Not Found Error (404):**
```json
{
  "success": false,
  "message": "Lesson (lesson topic) not found",
  "errors": null,
  "code": 404
}
```

**General Exercise Already Exist Error (400):**
```json
{
  "success": false,
  "message": "General exercise problem (problem) already exist.",
  "errors": null,
  "code": 400
}
```

**Invalid JSON Format Error (400):**
```json
{
  "success": false,
  "message": "Invalid JSON format in solution_steps or answers",
  "errors": null,
  "code": 400
}
```

**Upload Error (500):**
```json
{
  "success": false,
  "message": "Error uploading general exercises: (error message)",
  "errors": null,
  "code": 500
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

### Check Markers Upload

**Endpoint:** `POST /api/v1/superadmin/lessons/uploads/check-markers`

**Description:** Check markers files upload.

**Notes:**
- Check markers file type should be CSV or TXT

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**
```json
{
  "check_marker_file": "(binary-file)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Check markers uploaded successfully.",
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
    "check_markers_file": ["The check markers file field is required."]
  },
  "code": 422
}
```

**Missing Column Error (400):**
```json
{
  "success": false,
  "message": "Invalid check markers CSV format. All columns are required.",
  "errors": null,
  "code": 400
}
```

**Lesson Not Found Error (404):**
```json
{
  "success": false,
  "message": "Lesson (lesson topic) not found",
  "errors": null,
  "code": 404
}
```

**Check Marker Exist Error (400):**
```json
{
  "success": false,
  "message": "Check marker already exist.",
  "errors": null,
  "code": 400
}
```

**Upload Error (500):**
```json
{
  "success": false,
  "message": "Error uploading check markers: (error message)",
  "errors": null,
  "code": 500
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

### Scheme Of Work Upload

**Endpoint:** `POST /api/v1/superadmin/lessons/uploads/scheme-of-work`

**Description:** Scheme of work files upload.

**Notes:**
- Scheme of work file type should be CSV or TXT

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

**Request Body:**
```json
{
  "scheme_of_work_file": "(binary-file)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Scheme of work uploaded successfully.",
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
    "scheme_of_work_file": ["The scheme of work file field is required."]
  },
  "code": 422
}
```

**Missing Column Error (400):**
```json
{
  "success": false,
  "message": "Invalid scheme of work CSV format. All columns are required.",
  "errors": null,
  "code": 400
}
```

**Class Not Found Error (404):**
```json
{
  "success": false,
  "message": "Class (class name) not found",
  "errors": null,
  "code": 404
}
```

**Subject Not Found Error (404):**
```json
{
  "success": false,
  "message": "Subject (subject name) not found",
  "errors": null,
  "code": 404
}
```

**Term Not Found Error (404):**
```json
{
  "success": false,
  "message": "Term (term name) not found",
  "errors": null,
  "code": 404
}
```

**Week Not Found Error (404):**
```json
{
  "success": false,
  "message": "Week (week name) not found",
  "errors": null,
  "code": 404
}
```

**Scheme Of Work Exist Error (400):**
```json
{
  "success": false,
  "message": "Scheme of work already exist.",
  "errors": null,
  "code": 400
}
```

**Invalid JSON Format Error (400):**
```json
{
  "success": false,
  "message": "Invalid JSON format in breakdown",
  "errors": null,
  "code": 400
}
```

**Upload Error (500):**
```json
{
  "success": false,
  "message": "Error uploading scheme of work: (error message)",
  "errors": null,
  "code": 500
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

### Get Classes, Subjects, Terms And Weeks

**Endpoint:** `GET /api/v1/superadmin/lessons/get-classes-subjects-terms-weeks`

**Description:** Get classes, subjects, terms, and weeks to query lessons according to class, subject, term, and week.

**Note:** To get lessons you have to select classes, subjects, terms, and week.

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
    ],
    "subjects": [
      { "id": 1, "name": "General Mathematics" },
      { "id": 2, "name": "English Language" },
      { "id": 3, "name": "Agricultural Science" }
    ],
    "terms": [
      { "id": 1, "name": "First" },
      { "id": 2, "name": "Second" },
      { "id": 3, "name": "Third" }
    ],
    "weeks": [
      { "id": 1, "name": 1 },
      { "id": 2, "name": 2 },
      { "id": 3, "name": 3 },
      { "id": 4, "name": 4 },
      { "id": 5, "name": 5 }
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

---

### Get Lessons

**Endpoint:** `POST /api/v1/superadmin/lessons/lessons`

**Description:** Get lessons queried by class ID, subject ID, term ID, and week ID.

**Note:** To get lessons you'll have to query it by class ID, subject ID, term ID, and week ID through the request body. Field names must include the `_id` suffix.

**Important:** Do not include a trailing slash in the URL - it will cause a redirect that converts POST to GET.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |
| Content-Type | application/json |

**Request Body:**
```json
{
  "class_id": "4",
  "subject_id": "1",
  "term_id": "1",
  "week_id": "1"
}
```

**Success Response (200):**
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

**No Lesson Found Response (200):**
```json
{
  "success": true,
  "message": "No lesson found, add lessons",
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
    "class_id": ["The class id field is required."],
    "subject_id": ["The subject id field is required."],
    "term_id": ["The term id field is required."],
    "week_id": ["The week id field is required."]
  },
  "code": 422
}
```

**Fetch Error (500):**
```json
{
  "success": false,
  "message": "An error occurred while fetching lessons: (error message)",
  "errors": null,
  "code": 500
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

### Get Specific Lesson

**Endpoint:** `GET /api/v1/superadmin/lessons/lesson/{lesson_id}`

**Description:** Get specific lesson details.

**Note:** To get a specific lesson, the lesson ID must be passed as a URL parameter.

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
          "Convert from other bases to base 10"
        ]
      }
    ],
    "key_concepts": {
      "Conversion of number bases": "Changing numbers between different base systems using division or expansion methods."
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

**Lesson Not Found Error (404):**
```json
{
  "success": false,
  "message": "Lesson not found!",
  "errors": null,
  "code": 404
}
```

**Fetch Error (500):**
```json
{
  "success": false,
  "message": "An error occurred while fetching lessons: (error message)",
  "errors": null,
  "code": 500
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

### Get Specific Lesson Content

**Endpoint:** `GET /api/v1/superadmin/lessons/lesson/{lesson_id}/content`

**Description:** Get specific lesson content including all concepts, examples, exercises, and general exercises.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

This endpoint returns detailed lesson content similar to the student endpoint but with admin/superadmin access controls.

---

## Authentication & Authorization

### Access Token

All endpoints require a Bearer token in the `Authorization` header, except for public endpoints like registration and login.

**Format:**
```
Authorization: Bearer {access_token}
```

### Token Expiration

Access tokens are issued upon successful registration or login and should be stored securely on the client-side.

### User Roles

The API supports the following user roles:

| Role | Description |
|------|-------------|
| guest | Trial user with limited access |
| student | Full student with all learning features |
| guardian | Parent/guardian who can monitor child's progress |
| teacher | Educator with content management access |
| admin | Administrative user |
| superadmin | Super administrator with full system access |

---

## Common Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized / Authentication Error |
| 404 | Not Found |
| 422 | Validation Failed |
| 500 | Server Error |

---

## Notes & Best Practices

1. **Rate Limiting:** The API may have rate limiting in place. Please implement exponential backoff for retries.
2. **Error Handling:** Always check the `success` field in responses to determine request outcome.
3. **Token Refresh:** Implement token refresh logic to handle token expiration.
4. **Data Validation:** Validate all user input before sending requests.
5. **File Uploads:** Ensure file types match the specified formats (CSV/TXT for lesson uploads, PNG/JPG/JPEG/WEBP for profile pictures).
6. **Profile Completion:** Some fields (role, username, date of birth, class, discipline, gender) can only be set once.
7. **Guardian Setup:** When setting role as guardian, child_email and child_phone are required.
8. **Class Constraints:** Discipline selection is only available for SSS students (SSS1, SSS2, SSS3).
9. **Subject Selection:** JSS students select compulsory and selective subjects; SSS students select discipline-based subjects.

---

End of Documentation