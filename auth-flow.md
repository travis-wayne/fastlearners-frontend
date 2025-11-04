Authentication System
Base Url: https://fastlearnersapp.com

Registration
Endpoint: POST /api/v1/register

Description: Register a new user with their email address.

Headers
Key	Value
Accept	application/json
Request Body
{
  "email": "john@example.com",
}
Redirection
Response	Redirect To
success	verify-email
validation error	none
user not found error	none
Success Response (200)
{
  "success" : true,
  "message": "A verification code has been sent to your registered email address.",
  "content":{},
  "code": 200,
}
Validation Error (422)
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
                        
User Exist Error (422)
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
Verify Email After Registration
Endpoint: POST /api/v1/verify-email

Description: Verify email address after registration with a 6 digit code sent to the registered email address of the user which expires after 15 minutes.

Headers
Key	Value
Accept	application/json
Request Body
{
  "email": "john@example.com",
  "code": "849201"
}
Redirection
Response	Redirect To
success	create-password
validation error	none
code not found error	none
code expired error	none
Success Response (200)
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
Validation Error (422)
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
Code Not Found Error (404)
{
  "success": false,
  "message": "Registration request not found!",
  "errors": null,
  "code": 404,
}
Invalid Code Error (400)
{
  "success": false,
  "message": "Invalid verification code!",
  "errors": null,
  "code": 400,
}
Code Expired Error (400)
{
  "success": false,
  "message": "Registration code has expired, try again!",
  "errors": null,
  "code": 400,
}
Create Password
Endpoint: POST /api/v1/create-password

Description: Create password after successfully verifying email address.

Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Request Body
{
  "password": "password",
  "password_confirmation": "password",
}
Redirection
Response	Redirect To
success	set-role
validation error	none
Success Response (200)
{
  "success": true,
  "message": "Your password has been created successfully!",
  "content": {},
  "code": 200
}
Validation Error (422)
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
Error Response (400)
{
  "success": false,
  "message": "An error occurred while creating your password, try again",
  "errors": null,
  "code": 400,
}
Set Role
Endpoint: POST /api/v1/set-role

Description: Set role after successfully creating password.

Note: User's are to select from ['guest','student','guardian']. If the user role selected is guardian, add extra input for child_email and child_phone

Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Request Body
{
  "user_role": "student",
                
  "user_role": "guardian",
  "child_email": "child@example.com",
  "child_phone": "08098765432"  
}
Redirection
Response	Redirect To
success	dashboard (redirect according to user's role)
validation error	none
Success Response (200)
{
  "success": true,
  "message": "Your role has been set successfully!",
  "content": {},
  "code": 200
}
Validation Error (422)
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
Invalid Role Error (422)
{
  "success": false,
  "message": "Invalid role selected!",
  "errors": null,
  "code": 400
}
Error Response (400)
{
  "success": false,
  "message": "An error occurred while assigning role, try again",
  "errors": null,
  "code": 500,
}
Resend Verification Code
Endpoint: POST /api/v1/resend-verification-code

Description: Resend registration verification code in a case of delay or haven't received any.

Key	Value
Accept	application/json
Request Body
{
  "email": "john@example.com"
}
Redirection
Response	Redirect To
success	none
validation error	none
user not found error	none
error sending code	none
Success Response (200)
{
  "success": true,
  "message": "A verification code has been sent to your register email address.",
  "content": null,
  "code": 200,
}
Validation Error (422)
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
User Not Found Error (404)
{
  "success": false,
  "message": "User not found.",
  "errors": null,
  "code": 404
}
Error Sending Code (500)
{
  "success": false,
  "message": "There was an error sending verification code, try again.",
  "errors": null,
  "code": 500
}
Login
Endpoint: POST /api/v1/login

Description: Login using email or phone and password. If user is inactive, a verification code will be sent to their email, else they'll be logged in and redirected to the dashboard.

Key	Value
Accept	application/json
Request Body
{
  "email_phone": "john@example.com",
  "password": "password"
}
Redirection
Response	Redirect To
success	dashboard (redirect according to user's role)
validation error	none
invalid login details error	none
inactive user error	verify-email
user suspended error	none
Success Response (200)
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
Validation Error (422)
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
Invalid Login Details Error (401)
{
  "success": false,
  "message": "Valid login details!",
  "error": null,
  "code": 401,
}
Inactive User Response (401)
{
  "success": false,
  "message": "Your account is not active. Please verify your account with the verification code sent to your email address",
  "error": null,
  "code": 401,
}
User Suspended Response (400)
{
  "success": false,
  "message": "Your account has been suspended, please contact support!",
  "error": null,
  "code": 400,
}
Login/Register With Google
Endpoint: POST /api/v1/google/redirect

Description: Login with a google account.

Headers
Key	Value
Accept	application/json
Request Body
{}
Redirection
Response	Redirect To
success	dashboard or create-password
validation error	none
Logout
Endpoint: POST /api/v1/logout

Description: Logs out an authenticated user.

Headers
Key	Value
Authorization	Bearer {access_token}
Accept	application/json
Redirection
Response	Redirect To
success	login
unauthorized error	none
Success Response (200)
{
  "success": true,
  "message": "Logged out successfully."
  "content": null,
  "code": 200,
}
Unauthorized (401)
{
  "success": false,
  "message": "Unauthorized."
  "errors": null,
  "code": 401,
}
Forgot Password
Endpoint: POST /api/v1/forgot-password

Description: Sends a 6-digit reset code to the user's email.

Key	Value
Accept	application/json
Request Body
{
  "email": "john@example.com"
}
Redirection
Response	Redirect To
success	verify reset code
validation error	none
email not found error	none
email sending error	none
Success Response (200)
{
  "success": true,
  "message": "Password reset code sent to your email!",
  "content": null,
  "code": 200,
}
Validation Error (422)
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
Email Not Found Error (404)
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
Verify Password Reset Code
Endpoint: POST /api/v1/verify-reset-code

Description: Verify a 6-digit reset code that was sent to a user's email.

Key	Value
Accept	application/json
Request Body
{
  "email": "john@example.com",
  "code": "849201",
}
Redirection
Response	Redirect To
success	reset password
validation error	none
code not found error	none
invalid code error	none
code expired error	none
Success Response (200)
{
  "success": true,
  "message": "Your code was verified, Create new password."
  "content": null,
  "code": 200,
}
Validation Error (422)
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
Code Not Found Error (404)
{
  "success": false,
  "message": "Reset request was not found!"
  "errors": null,
  "code": 404,
}
Invalid Code Error (400)
{
  "success": false,
  "message": "Invalid reset code!"
  "errors": null,
  "code": 400,
}
Code Expired Error (400)
{
  "success": false,
  "message": "Reset request has expired, try again!"
  "errors": null,
  "code": 400,
}
Resend Password Reset Code
Endpoint: POST /api/v1/resend-reset-code

Description: resends a 6-digit reset code to the user's email.

Key	Value
Accept	application/json
Request Body
{
  "email": "john@example.com"
}
Redirection
Response	Redirect To
success	none
validation error	none
email not found error	none
email sending error	none
Success Response (200)
{
  "success": true,
  "message": "Password reset code sent to your email!",
  "content": null,
  "code": 200,
}
Validation Error (422)
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
Email Not Found Error (404)
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
Reset Password
Endpoint: POST /api/v1/reset-password

Description: Reset a users password

Key	Value
Accept	application/json
Request Body
{
  "email": "john@example.com",
  "password": "NewPass123",
  "password_confirmation": "NewPass123"
}
Redirection
Response	Redirect To
success	login
validation error	none
email not found error	none
email sending error	none
Success Response (200)
{
  "success": true,
  "message": "Your password has been reset successfully. You may now log in.",
  "content": null,
  "code": 200,
}
Validation Error (422)
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
Code Not Found Error (404)
{
  "success": false,
  "message": "Reset code was not found!",
  "errors": null,
  "code": 404
}
Invalid Code Error (400)
{
  "success": false,
  "message": "Invalid reset code!",
  "errors": null,
  "code": 400
}
Code Expired Error (400)
{
  "success": false,
  "message": "Reset code has expired!",
  "error": null,
  "code": 400,
}
-----------------------------------------


I have the following comments after thorough review of file. Implement the comments by following the instructions verbatim.

---
## Comment 1: Registration endpoint wired and payload matches, but Accept header not enforced and response handling ignores 422 structure.

In `lib/api/auth.ts` keep `register(data)` but handle 422 in `apiClient.interceptors.response`: when status is 422, map backend `{ errors }` into a normalized `ApiResponse` with `success:false` and `errors` object preserved.
Update `components/auth/RegisterForm.tsx` to stop ad-hoc parsing and use `response.errors?.email?.[0]` primarily. Remove debug `console.log` blocks and rely on a single error mapping function.

### Relevant Files
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\lib\api\auth.ts
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\components\auth\RegisterForm.tsx
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\lib\api\client.ts
---
## Comment 2: Verify-email flow implemented but create-password token propagation is via URL param; better to set HttpOnly cookie or use Authorization as spec requires.

In `app/api/auth/login/route.ts`-like server route, add `app/api/auth/verify-email/route.ts` that proxies `POST /verify-email` to the backend and, when success, sets a short-lived HttpOnly cookie (e.g., `reg_token`) with the `access_token` using `setAuthCookiesServer()` or a dedicated setter.
Change `components/auth/CreatePasswordForm.tsx` to no longer read `token` from query. Call a new server route `/api/auth/create-password` that forwards the request to `POST /create-password` including `Authorization: Bearer <reg_token>` from the HttpOnly cookie on the server. Remove `token` from `CreatePasswordData` and from URL.
Purge token query propagation in `app/(auth)/auth/create-password/page.tsx`.

### Relevant Files
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\components\auth\VerifyOtpForm.tsx
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\components\auth\CreatePasswordForm.tsx
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\app\(auth)\auth\create-password\page.tsx
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\app\api\auth\login\route.ts
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\lib\server\auth-cookies.ts
---
## Comment 3: Missing server routes for `verify-email`, `create-password`, `set-role`, `resend-verification-code`, `forgot-password`, `verify-reset-code`, `resend-reset-code`, `reset-password` to hide tokens and normalize errors.

Create the following routes under `app/api/auth/`:
- `verify-email/route.ts`: POST; body `{ email, code }`; on 200, set short-lived HttpOnly `reg_token` and return user.
- `create-password/route.ts`: POST; read `reg_token` from cookies; send to backend with `Authorization` header; clear `reg_token` on success; optionally set main session cookies.
- `set-role/route.ts`: POST; read `Authorization` from main HttpOnly session cookie; forward body `{ user_role, child_email?, child_phone? }` to backend `/set-role`.
- `resend-verification-code/route.ts`: POST; body `{ email }`.
- `forgot-password/route.ts`: POST; body `{ email }`.
- `verify-reset-code/route.ts`: POST; body `{ email, code }`.
- `resend-reset-code/route.ts`: POST; body `{ email }`.
- `reset-password/route.ts`: POST; body `{ email, password, password_confirmation }`.
All routes should set Accept header, pass through backend messages, and normalize 4xx/5xx to your `ApiResponse` shape.

### Relevant Files
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\app\api\auth\session\route.ts
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\app\api\auth\login\route.ts
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\components\auth\*
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\lib\api\auth.ts
---
## Comment 4: Create-password API payload currently includes `email` and `token` in body; backend expects Authorization header per spec.

Change `lib/api/auth.ts` `createPassword(data)` to accept only `{ password, password_confirmation }` and set Authorization header using a stored temporary token (prefer HttpOnly cookie read on the server route). Update `components/auth/CreatePasswordForm.tsx` to no longer include `email` and `token` fields; the server route should handle Authorization based on cookie. Update `lib/validations/auth.ts` schemas accordingly.

### Relevant Files
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\lib\api\auth.ts
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\components\auth\CreatePasswordForm.tsx
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\lib\validations\auth.ts
---
## Comment 5: Set-role endpoint not implemented; UI uses `/profile/update-role` which is non-spec and omits guardian child fields.

Add `authApi.setRole({ user_role, child_email?, child_phone? })` that POSTs to `/set-role` with Authorization Bearer header from current session. Replace `profileApi.updateRole()` call in `components/auth/RoleSelectionForm.tsx` with `authApi.setRole(...)`, building payload based on selected role and prompting for child info when `guardian` is chosen. Update redirects on success to role-based dashboards per RBAC.

### Relevant Files
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\components\auth\RoleSelectionForm.tsx
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\lib\api\auth.ts
---
## Comment 6: Login endpoint wired correctly, but state management and redirection ignore special backend responses (inactive/suspended).

In `app/api/auth/login/route.ts`, return backend code and message in JSON. In `components/auth/LoginForm.tsx`, inspect `data.code` and handle:
- 401 inactive: route to `/auth/verify-email?email=<submitted>` and toast message from backend.
- 400 suspended: show error and block login.
- 422 validation: surface field errors via form.
Only redirect to dashboard on 200 success.

### Relevant Files
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\app\api\auth\login\route.ts
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\components\auth\LoginForm.tsx
---
## Comment 7: Forgot/verify-reset/resend/reset flows are implemented but missing server routes and rely on sessionStorage for tokens, not per spec.

Add server routes for `forgot-password`, `verify-reset-code`, `resend-reset-code`, and `reset-password` under `app/api/auth/*` that POST to backend and surface messages. Update the forms to call these server routes instead of direct axios to backend. Remove storing reset code in `sessionStorage` and do not pass `token` in query; just route `verify-reset-code` to `reset-password?email=...` upon 200. Align form schemas to backend expectations.

### Relevant Files
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\components\auth\forgot-password-form.tsx
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\components\auth\verify-reset-code-form.tsx
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\components\auth\reset-password-form.tsx
---
## Comment 8: Google auth flow calls backend `/google/callback` directly from client and then fakes login via password; should use server route and set cookies.

Create `app/api/auth/google/callback/route.ts` to proxy GET query to backend `/google/callback` and on success set the main session cookie with `access_token` via `setAuthCookiesServer()`. Update `GoogleCallbackContent` to call this server route instead of backend directly. Remove the fake login with hardcoded "google-oauth" password. Then redirect based on `user.role` as usual.

### Relevant Files
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\app\(auth)\auth\google\callback\page.tsx
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\app\api\auth\login\route.ts
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\lib\server\auth-cookies.ts
---
## Comment 9: Axios base URL and OpenAPI client defaults are inconsistent; ensure base is `https://fastlearnersapp.com/api/v1` everywhere.

In `lib/api/openapi-client.ts`, change default `baseURL` to `https://fastlearnersapp.com/api/v1` (or require env). Update `.env.local.example` to include `NEXT_PUBLIC_API_URL=https://fastlearnersapp.com/api/v1` and add `NEXT_PUBLIC_USE_HTTPONLY_AUTH=true`.

### Relevant Files
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\lib\api\openapi-client.ts
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\.env.local.example
---
## Comment 10: Client cookies store full user and token in non-HttpOnly mode; confirm deprecation and remove code paths and helpers.

Delete or hard-disable `lib/auth-cookies.ts` client helpers and remove `tokenManager.set/remove` usages in `lib/api/auth.ts`. Ensure all auth state changes occur via server routes that set/clear HttpOnly cookies and return user-only responses. Update `store/authStore.ts` to assume HttpOnly always and remove env branching.

### Relevant Files
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\lib\auth-cookies.ts
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\lib\api\auth.ts
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\store\authStore.ts
---
## Comment 11: Forms use extensive console logging and expose sensitive values (tokens, emails) in logs and URLs.

Remove console logs from `components/auth/CreatePasswordForm.tsx` and `components/auth/LoginForm.tsx`. Stop putting `token` in the URL for create-password; rely on server-stored cookie and Authorization header as above. Do not store reset codes in sessionStorage; redirect without carrying codes.

### Relevant Files
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\components\auth\CreatePasswordForm.tsx
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\components\auth\LoginForm.tsx
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\components\auth\verify-reset-code-form.tsx
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\app\(auth)\auth\create-password\page.tsx
---
## Comment 12: Auth pages and store hydration need consistent redirections per spec (verify-email, create-password, set-role).

Rename `app/(auth)/auth/role/page.tsx` route to `/auth/set-role` and wire `RoleSelectionForm` to call `POST /api/auth/set-role`. Update `store/authStore.ts` helper `getRoleBasedRoute()` only after successful set-role. Ensure middleware allows unauthenticated access to `/auth/register`, `/auth/verify-email`, `/auth/create-password`, `/auth/set-role`, `/auth/forgot-password`, `/auth/verify-reset-code`, `/auth/reset-password`.

### Relevant Files
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\app\(auth)\auth\role\page.tsx
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\components\auth\RoleSelectionForm.tsx
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\middleware.ts
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\store\authStore.ts
---
## Comment 13: Validation schemas include `email` and `token` for create-password; not aligned with backend which uses Authorization header.

Update `createPasswordSchema` to only include `password` and `password_confirmation`. Adjust `components/auth/CreatePasswordForm.tsx` to not collect or read `email`/`token`. Similarly, ensure `verifyEmailSchema` and `verifyResetCodeSchema` match payloads used by server routes.

### Relevant Files
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\lib\validations\auth.ts
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\components\auth\CreatePasswordForm.tsx
---
## Comment 14: Role-based navigation helper assumes first role as primary; ensure role array conforms to backend and set-role updates user state.

On successful `POST /api/auth/set-role`, update auth store with returned user or call `/profile` to refresh user and set it in `useAuthStore`. Then call `router.push(RBACUtils.getHomeRoute(user.role[0]))`. Avoid static `/dashboard` routes if RBAC home routes differ by role.

### Relevant Files
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\store\authStore.ts
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\components\dashboard\role-dashboards\index.ts
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\lib\rbac\role-config.ts
---
## Comment 15: Middleware currently sets PII headers and logs; remove and align route matcher to auth flow pages.

In `middleware.ts`, remove `X-User-*` headers and console logs. Ensure `config.matcher` includes only routes that need protection and excludes `/auth/*` onboarding pages. Confirm redirect rules: authenticated users away from `/auth/login|register`; unauthenticated users allowed on onboarding pages; RBAC checks only on protected routes.

### Relevant Files
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\middleware.ts
---
## Comment 16: Logout flow clears server cookie but client-side axios may retain Authorization; ensure no lingering headers.

In `store/authStore.ts` `logout()`, after calling `/api/auth/logout`, also cancel in-flight requests if you add an axios cancel token, and reset any client-side auth artifacts. Ensure UI navigates to `/auth/login` and shows a toast. Verify 401 interceptor does not create redirect loops for logout requests.

### Relevant Files
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\store\authStore.ts
- c:\Users\TRAVIS WAYNE\Documents\GitHub\fast-leaner-frontend\lib\api\client.ts
---