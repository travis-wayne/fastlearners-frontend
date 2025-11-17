# Superadmin Lessons Endpoints Verification

This document verifies that all internal API routes correctly map to the upstream API endpoints according to the API documentation.

## Endpoint Mappings

### 1. Get Classes, Subjects, Terms and Weeks
- **Internal Route**: `GET /api/superadmin/lessons/metadata`
- **File**: `app/api/superadmin/lessons/metadata/route.ts`
- **Upstream API**: `GET /api/v1/superadmin/lessons/get-classes-subjects-terms-weeks`
- **Status**: ✅ Correct - GET method matches

### 2. Get Lessons (with filters)
- **Internal Route**: `POST /api/superadmin/lessons/list`
- **File**: `app/api/superadmin/lessons/list/route.ts`
- **Upstream API**: `POST /api/v1/superadmin/lessons/lessons/`
- **Status**: ✅ Correct - POST method matches
- **Note**: This endpoint requires POST method (not GET) as per API docs

### 3. Get Specific Lesson
- **Internal Route**: `GET /api/superadmin/lessons/[id]`
- **File**: `app/api/superadmin/lessons/[id]/route.ts`
- **Upstream API**: `GET /api/v1/superadmin/lessons/lesson/{id}`
- **Status**: ✅ Correct - GET method matches

### 4. Get Lesson Content
- **Internal Route**: `GET /api/superadmin/lessons/[id]/content`
- **File**: `app/api/superadmin/lessons/[id]/content/route.ts`
- **Upstream API**: `GET /api/v1/superadmin/lessons/lesson/{id}/content`
- **Status**: ✅ Correct - GET method matches

## Upload Endpoints

All upload endpoints use POST method and are correctly mapped:

1. **Lessons Upload**: `POST /api/uploads/lessons` → `POST /api/v1/superadmin/lessons/uploads/lessons`
2. **Concepts Upload**: `POST /api/uploads/concepts` → `POST /api/v1/superadmin/lessons/uploads/concepts`
3. **Examples Upload**: `POST /api/uploads/examples` → `POST /api/v1/superadmin/lessons/uploads/examples`
4. **Exercises Upload**: `POST /api/uploads/exercises` → `POST /api/v1/superadmin/lessons/uploads/exercises`
5. **General Exercises Upload**: `POST /api/uploads/general-exercises` → `POST /api/v1/superadmin/lessons/uploads/general-exercises`
6. **Check Markers Upload**: `POST /api/uploads/check-markers` → `POST /api/v1/superadmin/lessons/uploads/check-markers`
7. **Scheme of Work Upload**: `POST /api/uploads/scheme-of-work` → `POST /api/v1/superadmin/lessons/uploads/scheme-of-work`
8. **All Lesson Files Upload**: `POST /api/uploads/all-lesson-files` → `POST /api/v1/superadmin/lessons/uploads/all-lesson-files`

## Important Notes

- The "Get Lessons" endpoint (`/api/v1/superadmin/lessons/lessons/`) **requires POST method**, not GET
- All routes use HttpOnly cookies for authentication via `parseAuthCookiesServer`
- All routes forward requests to the upstream API at `https://fastlearnersapp.com/api/v1`
- Error handling is consistent across all routes

## Troubleshooting

If you see an error like "The GET method is not supported for route api/v1/superadmin/lessons/lessons":
- This means a GET request is being made to the upstream API
- Check that the frontend is calling `/api/superadmin/lessons/list` with POST method
- Verify that no direct calls are being made to the upstream API endpoint
- Check browser network tab to see what method is actually being used

