# API Documentation

The following endpoints power authentication, user profiles, lessons, and uploads. Base URL: https://fastlearnersapp.com

> This document is converted from the original `api-docs.txt`.

```
START OF ORIGINAL CONTENT
```

```text
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
...
```

```
END OF ORIGINAL CONTENT
```

Note: Consider migrating this reference to OpenAPI/Swagger for better tooling and validation.

