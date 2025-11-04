# Authentication Flow Implementation Guide

## 🎯 Overview

This document describes the complete authentication flow for Fast Learners, matching the API documentation exactly.

## 📋 Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    REGISTRATION FLOW                             │
└─────────────────────────────────────────────────────────────────┘

1. USER ENTERS EMAIL
   └─> RegisterForm.tsx
       └─> POST /api/auth/register (Next.js server route)
           └─> POST https://fastlearnersapp.com/api/v1/register
               ├─> 200 OK → Redirect to /auth/verify-email?email=xxx
               └─> 422 Validation Error → Show inline error

2. USER ENTERS OTP (6-digit code)
   └─> VerifyOtpForm.tsx
       └─> POST /api/auth/verify-email (Next.js server route)
           └─> POST https://fastlearnersapp.com/api/v1/verify-email
               ├─> 200 OK → Set reg_token cookie (HttpOnly, 15min)
               │           → Redirect to /auth/create-password
               ├─> 404 Not Found → "Registration request not found!"
               ├─> 400 Invalid → "Invalid verification code!"
               └─> 400 Expired → "Registration code has expired!"

3. USER CREATES PASSWORD
   └─> CreatePasswordForm.tsx
       └─> POST /api/auth/create-password (Next.js server route)
           ├─> Reads reg_token from HttpOnly cookie
           └─> POST https://fastlearnersapp.com/api/v1/create-password
               └─> Authorization: Bearer {reg_token}
                   ├─> 200 OK → Redirect to /auth/set-role
                   ├─> 422 Validation Error → Show inline errors
                   └─> 401 Unauthorized → Redirect to /auth/register

4. USER SELECTS ROLE (student or guardian)
   └─> RoleSelectionForm.tsx
       └─> POST /api/auth/set-role (Next.js server route)
           ├─> Reads reg_token from HttpOnly cookie
           └─> POST https://fastlearnersapp.com/api/v1/set-role
               └─> Authorization: Bearer {reg_token}
                   ├─> 200 OK → Promote reg_token to auth_token
                   │           → Clear reg_token
                   │           → Redirect to /dashboard
                   ├─> 422 Validation Error → Show inline errors
                   └─> 400 Invalid Role → Show error message

┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY FEATURES                             │
└─────────────────────────────────────────────────────────────────┘

✅ HttpOnly Cookies
   - reg_token: Used during onboarding (15 minutes)
   - auth_token: Main session token (7 days)
   
✅ No Tokens in URLs
   - Only email passed via query params
   - Tokens only in HttpOnly cookies
   
✅ No localStorage
   - All auth state in secure cookies
   - User data fetched from server
   
✅ Server-Side Proxying
   - Client never calls external API directly
   - All requests go through /api/auth/*
   
✅ Proper Error Handling
   - Backend errors forwarded exactly
   - Validation errors mapped to fields
```

## 🔧 Server Routes Implementation

### 1. POST /api/auth/register
**File:** `app/api/auth/register/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_URL || "https://fastlearnersapp.com/api/v1";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const r = await fetch(`${BASE}/register`, {
      method: "POST",
      headers: { 
        Accept: "application/json", 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(body),
    });

    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Registration failed", code: 500 },
      { status: 500 },
    );
  }
}
```

### 2. POST /api/auth/verify-email
**File:** `app/api/auth/verify-email/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { setRegTokenServer } from "@/lib/server/auth-cookies";

const BASE = process.env.NEXT_PUBLIC_API_URL || "https://fastlearnersapp.com/api/v1";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const r = await fetch(`${BASE}/verify-email`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await r.json();

    if (r.ok && data?.content?.access_token) {
      // Set temporary registration token (15 minutes)
      const res = NextResponse.json(data, { status: r.status });
      setRegTokenServer(res, data.content.access_token, 15 * 60);
      return res;
    }

    return NextResponse.json(data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Verify email failed", code: 500 },
      { status: 500 },
    );
  }
}
```

### 3. POST /api/auth/create-password
**File:** `app/api/auth/create-password/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { AUTH_TOKEN_COOKIE, REG_TOKEN_COOKIE } from "@/lib/server/auth-cookies";

const BASE = process.env.NEXT_PUBLIC_API_URL || "https://fastlearnersapp.com/api/v1";

export async function POST(req: NextRequest) {
  try {
    const cookies = req.cookies;
    const regToken = cookies.get(REG_TOKEN_COOKIE)?.value;
    const mainToken = cookies.get(AUTH_TOKEN_COOKIE)?.value;

    const token = mainToken || regToken;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized", code: 401 },
        { status: 401 },
      );
    }

    const body = await req.json();

    const r = await fetch(`${BASE}/create-password`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Create password failed", code: 500 },
      { status: 500 },
    );
  }
}
```

### 4. POST /api/auth/set-role
**File:** `app/api/auth/set-role/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_TOKEN_COOKIE,
  REG_TOKEN_COOKIE,
  clearRegTokenServer,
  setAuthCookiesServer,
} from "@/lib/server/auth-cookies";

const BASE = process.env.NEXT_PUBLIC_API_URL || "https://fastlearnersapp.com/api/v1";

export async function POST(req: NextRequest) {
  try {
    const cookies = req.cookies;
    const regToken = cookies.get(REG_TOKEN_COOKIE)?.value;
    const mainToken = cookies.get(AUTH_TOKEN_COOKIE)?.value;
    const token = mainToken || regToken;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized", code: 401 }, 
        { status: 401 }
      );
    }

    const body = await req.json();

    const r = await fetch(`${BASE}/set-role`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await r.json();
    if (!r.ok) return NextResponse.json(data, { status: r.status });

    // Fetch profile to obtain user, then set main session cookies
    const prof = await fetch(`${BASE}/profile`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    const profData = await prof.json();

    const res = NextResponse.json(
      { ...data, user: profData?.content?.user }, 
      { status: 200 }
    );
    
    if (profData?.content?.user) {
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
      setAuthCookiesServer(res, { 
        token, 
        user: profData.content.user, 
        expiresAt 
      });
      clearRegTokenServer(res);
    }
    
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Set role failed", code: 500 },
      { status: 500 },
    );
  }
}
```

## 🧪 Testing Checklist

### Registration Tests
- [ ] Valid email → redirects to verify-email
- [ ] Existing email → shows "The email has already been taken."
- [ ] Invalid email → shows validation error
- [ ] Empty email → shows "The email field is required."

### OTP Verification Tests
- [ ] Valid code → sets reg_token, redirects to create-password
- [ ] Invalid code → shows "Invalid verification code!"
- [ ] Expired code → shows "Registration code has expired, try again!"
- [ ] Wrong email → shows "Registration request not found!"
- [ ] Resend code → sends new code, starts 60s countdown

### Create Password Tests
- [ ] Valid password → redirects to set-role
- [ ] Mismatched passwords → shows confirmation error
- [ ] Weak password → shows requirements not met
- [ ] Missing reg_token → shows 401, redirects to register

### Set Role Tests
- [ ] Select student → redirects to /dashboard, clears reg_token
- [ ] Select guardian → redirects to /dashboard
- [ ] Guardian with child info → submits successfully
- [ ] Guardian without child info → submits successfully (optional)
- [ ] Missing reg_token → shows 401 error

### Security Tests
- [ ] No tokens in URL
- [ ] No tokens in localStorage
- [ ] reg_token is HttpOnly
- [ ] auth_token is HttpOnly
- [ ] reg_token cleared after set-role
- [ ] Cannot access /auth/create-password without reg_token
- [ ] Cannot access /auth/set-role without reg_token

## 🚀 Usage Examples

### 1. Register a New User

```typescript
// In RegisterForm.tsx
const response = await authApi.register({ email: "user@example.com" });

if (response.success) {
  router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
}
```

### 2. Verify Email with OTP

```typescript
// In VerifyOtpForm.tsx
const response = await authApi.verifyEmail({
  email: "user@example.com",
  code: "849201"
});

if (response.success) {
  // reg_token is now set in HttpOnly cookie
  router.push("/auth/create-password");
}
```

### 3. Create Password

```typescript
// In CreatePasswordForm.tsx
const response = await fetch("/api/auth/create-password", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    password: "SecurePass123!",
    password_confirmation: "SecurePass123!"
  })
});

if (response.ok) {
  router.push("/auth/set-role");
}
```

### 4. Set Role

```typescript
// In RoleSelectionForm.tsx
const response = await fetch("/api/auth/set-role", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    user_role: "student"
    // For guardian:
    // user_role: "guardian",
    // child_email: "child@example.com",
    // child_phone: "08012345678"
  })
});

if (response.ok) {
  // reg_token cleared, auth_token set
  router.replace("/dashboard");
}
```

## 🔒 Cookie Lifecycle

```
Registration Start:
  - No cookies

After verify-email (200 OK):
  - reg_token: {access_token} (HttpOnly, Secure, 15min)

After create-password (200 OK):
  - reg_token: Still present

After set-role (200 OK):
  - reg_token: Cleared
  - auth_token: {access_token} (HttpOnly, Secure, 7 days)
  - auth_user: {user_json}
  - auth_expires: {timestamp}
```

## ⚠️ Common Issues & Solutions

### Issue 1: "Unauthorized" on create-password
**Cause:** reg_token cookie expired or not set
**Solution:** User must restart registration from /auth/register

### Issue 2: Cannot access /auth/set-role
**Cause:** reg_token missing or middleware blocking
**Solution:** Ensure middleware excludes /auth/* routes

### Issue 3: Redirected to login after set-role
**Cause:** auth_token not set properly
**Solution:** Check server route is calling setAuthCookiesServer()

### Issue 4: User data not available on dashboard
**Cause:** auth store not hydrated
**Solution:** Call hydrate() in app layout or dashboard page

## 📚 Related Files

- `components/auth/RegisterForm.tsx` - Email registration form
- `components/auth/VerifyOtpForm.tsx` - OTP verification form  
- `components/auth/CreatePasswordForm.tsx` - Password creation form
- `components/auth/RoleSelectionForm.tsx` - Role selection form
- `lib/api/auth.ts` - Client API functions
- `lib/server/auth-cookies.ts` - Server cookie utilities
- `app/api/auth/*/route.ts` - Server API routes
- `middleware.ts` - Route protection
- `store/authStore.ts` - Client auth state

## ✅ Implementation Complete

All authentication flows are implemented and match the API documentation exactly. The system uses secure HttpOnly cookies, proper error handling, and follows best practices for web security.
