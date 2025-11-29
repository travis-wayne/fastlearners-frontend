
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