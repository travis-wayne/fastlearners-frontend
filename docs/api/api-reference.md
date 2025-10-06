# Fastlearners API Reference

This document consolidates and cleans up the API surface described in `api-docs.txt` and presents it as Markdown with a table of contents. It preserves the response envelope and clarifies HTTP verbs, status codes, and JSON formatting.

- All responses use: `{ success: boolean, message: string, content?: any, errors?: object|null, code: number }`
- Authenticated endpoints require `Authorization: Bearer {access_token}` unless using a cookie-based session via your app’s server proxy.

## Table of Contents
- [Authentication](#authentication)
  - [Register](#register)
  - [Verify Email](#verify-email)
  - [Create Password](#create-password)
  - [Set Role](#set-role)
  - [Resend Verification Code](#resend-verification-code)
  - [Login](#login)
  - [Login with Google](#login-with-google)
  - [Logout](#logout)
- [Password Reset](#password-reset)
  - [Forgot Password](#forgot-password)
  - [Verify Reset Code](#verify-reset-code)
  - [Resend Reset Code](#resend-reset-code)
  - [Reset Password](#reset-password)
- [User Management](#user-management)
  - [Profile (Get)](#profile-get)
  - [Profile Edit (Post)](#profile-edit-post)
  - [Change Password (Post)](#change-password-post)
- [Role Dashboards](#role-dashboards)
  - [Guest Dashboard](#guest-dashboard)
  - [Student Dashboard](#student-dashboard)
  - [Guardian Dashboard](#guardian-dashboard)
- [Superadmin: Lesson Uploads](#superadmin-lesson-uploads)
  - [All-in-One Upload](#all-in-one-upload)
  - [Lessons Upload](#lessons-upload)
  - [Concepts Upload](#concepts-upload)
  - [Examples Upload](#examples-upload)
  - [Exercises Upload](#exercises-upload)
  - [General Exercises Upload](#general-exercises-upload)
  - [Check Markers Upload](#check-markers-upload)
  - [Scheme of Work Upload](#scheme-of-work-upload)
- [Superadmin: Retrieve Lessons](#superadmin-retrieve-lessons)
  - [Enumerate Classes/Subjects/Terms/Weeks](#enumerate-classessubjectstermsweeks)
  - [Query Lessons](#query-lessons)
  - [Get Specific Lesson](#get-specific-lesson)
  - [Get Lesson Content](#get-lesson-content)

---

## Authentication

### Register
- POST `/api/v1/register`
- Body:
```json
{ "email": "john@example.com" }
```
- 200: code sent; UI navigates to verify-email
- 422: validation errors; email may already exist

### Verify Email
- POST `/api/v1/verify-email`
- Body:
```json
{ "email": "john@example.com", "code": "849201" }
```
- 200: returns `{ access_token, user }`; UI navigates to create-password
- 422, 404 (request not found), 400 (invalid/expired code)

### Create Password
- POST `/api/v1/create-password`
- Headers: `Authorization: Bearer {access_token}`
- Body:
```json
{ "password": "Pass123!", "password_confirmation": "Pass123!" }
```
- 200: created; UI navigates to set-role
- 422: validation
- 400: generic error

### Set Role
- POST `/api/v1/set-role`
- Headers: Bearer token
- Body:
```json
{ "user_role": "student" }
```
- 200: role set; UI navigates to dashboard by role
- 422: validation (or 400 if treating invalid role as bad request; keep consistent)

### Resend Verification Code
- POST `/api/v1/resend-verification-code`
- Body:
```json
{ "email": "john@example.com" }
```
- 200: resent
- 422: validation, 404: not found, 500: sending error

### Login
- POST `/api/v1/login`
- Body:
```json
{ "email_phone": "john@example.com", "password": "password" }
```
- 200: `{ access_token, user }`; UI redirects by role
- 422: validation, 401: invalid credentials or inactive (prompt verification), 400: suspended

### Login with Google
- POST `/api/v1/google/redirect`
- 200: UI redirects to dashboard or create-password (depending on state)

### Logout
- POST `/api/v1/logout`
- Headers: Bearer token
- 200: logged out; UI navigates to login
- 401: unauthorized

## Password Reset

### Forgot Password
- POST `/api/v1/forgot-password`
- Body: `{ "email": "john@example.com" }`
- 200: code sent
- 422: validation, 404: email not found, 500: sending error

### Verify Reset Code
- POST `/api/v1/verify-reset-code`
- Body: `{ "email": "john@example.com", "code": "849201" }`
- 200: proceed to reset password
- 422, 404, 400 (invalid or expired)

### Resend Reset Code
- POST `/api/v1/resend-reset-code`
- Body: `{ "email": "john@example.com" }`
- 200, 422, 404

### Reset Password
- POST `/api/v1/reset-password`
- Body:
```json
{ "email": "john@example.com", "password": "NewPass123", "password_confirmation": "NewPass123" }
```
- 200: password reset; UI navigates to login
- 422, 404, 400

## User Management

### Profile (Get)
- GET `/api/v1/profile`
- 200: `{ user: {...} }`
- 401: unauthorized

### Profile Edit (Post)
- POST `/api/v1/profile/edit`
- Body: standard profile fields; guardian requires `child_email`, `child_phone`
- One-time fields enforced: `username`, `role`, `class`, `discipline`, `gender`, `date_of_birth`
- 200: `{ user: {...} }`
- 422: validation (or 400 for specific business rules)
- 401: unauthorized

### Change Password (Post)
- POST `/api/v1/profile/edit/password`
- Body:
```json
{ "current_password": "password", "new_password": "newpassword", "new_password_confirmation": "newpassword" }
```
- 200, 422 (validation/current password), 401

## Role Dashboards
- Guest: GET `/api/v1/guest`
- Student: GET `/api/v1/dashboard`
- Guardian: GET `/api/v1/guardian`
- Each returns dashboard data; 401 if unauthorized; 500 for generic errors.

## Superadmin: Lesson Uploads
- CSV/txt only; structured JSON fields must be valid
- Common errors: 422 (missing file), 400 (missing columns/invalid JSON), 404 (not found entities), 500 (upload error), 401 (unauthorized)
- Endpoints:
  - POST `/api/v1/superadmin/lessons/uploads/all-lesson-files`
  - POST `/api/v1/superadmin/lessons/uploads/lessons`
  - POST `/api/v1/superadmin/lessons/uploads/concepts`
  - POST `/api/v1/superadmin/lessons/uploads/examples`
  - POST `/api/v1/superadmin/lessons/uploads/exercises`
  - POST `/api/v1/superadmin/lessons/uploads/general-exercises`
  - POST `/api/v1/superadmin/lessons/uploads/check-markers`
  - POST `/api/v1/superadmin/lessons/uploads/scheme-of-work`

## Superadmin: Retrieve Lessons

### Enumerate Classes/Subjects/Terms/Weeks
- GET `/api/v1/superadmin/lessons`
- 200: returns arrays of classes/subjects/terms/weeks
- 404 if any category is empty (as documented), 401 unauthorized

### Query Lessons
- POST `/api/v1/superadmin/lessons/lessons`
- Body: `{ "class": "4", "subject": "1", "term": "1", "week": "1" }`
- 200: list with `links` and `meta`, or 200 with message if none found
- 422, 500, 401

### Get Specific Lesson
- GET `/api/v1/superadmin/lessons/lesson/{id}`
- 200, 404, 500, 401

### Get Lesson Content
- GET `/api/v1/superadmin/lessons/lesson/{id}/content`
- 200, 404, 500, 401