import re

def main():
    with open("c:\\Users\\TRAVIS WAYNE\\Documents\\GitHub\\fast-leaner-frontend\\fastlearners-api-docs.md", "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Insert Delete Account endpoints
    delete_account_docs = """
---

### 7. Delete Account Request

**Endpoint:** `DELETE /api/v1/profile/delete`

**Description:** Delete account request by user. Account delete request can be cancelled as well by this endpoint.

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer {access_token} |
| Accept | application/json |

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
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
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
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```
"""

    if "Delete Account Request" not in content:
        content = content.replace("## Guest Management", delete_account_docs + "\n## Guest Management")

    # 2. Update Answering System Exercise Content & Error block
    content = content.replace(
        '"message": "Great job! You scored 50% on your 1st attempt.",\n  "content": null,',
        '"message": "Great job! You scored 50% on your 1st attempt.",\n  "content": {\n    "score": "50",\n    "attempt": "1st",\n    "concept_total_score": "5.00",\n    "concept_weight": "10.00"\n  },'
    )

    exercise_error_old = """**Exercise Already Answered Error (400):**
```json
{
  "success": false,
  "message": "Exercise already answered, continue learning!",
  "errors": null,
  "code": 400
}
```"""
    exercise_error_new = """**Exercise Already Answered Error (200):**
```json
{
  "success": true,
  "message": "Exercise already answered, continue learning!",
  "content": {
    "score": "50",
    "attempt": "1st"
  },
  "code": 200
}
```"""
    content = content.replace(exercise_error_old, exercise_error_new)

    content = content.replace(
        '"message": "Great job! You scored 5% on your 1st attempt.",\n  "content": null,',
        '"message": "Great job! You scored 5% on your 1st attempt.",\n  "content": {\n    "score": "5",\n    "attempt": "1st",\n    "general_exercise_total_score": "1.50",\n    "general_exercise_weight": "30.00"\n  },'
    )

    general_error_old = """**Exercise Already Answered Error (400):**
```json
{
  "success": false,
  "message": "General exercise already answered, continue learning!",
  "errors": null,
  "code": 400
}
```"""
    general_error_new = """**General Exercise Already Answered Error (200):**
```json
{
  "success": true,
  "message": "General Exercise already answered, continue learning!",
  "content": {
    "score": "5",
    "attempt": "1st"
  },
  "code": 200
}
```"""
    content = content.replace(general_error_old, general_error_new)

    # 3. Update Lesson Completion Check System Endpoint text
    content = content.replace(
        "**Endpoint:** `GET /api/v1/lessons/check/overview/{lesson_id}`",
        "**Endpoint Format:** `GET /api/v1/lessons/check/{type}/{lesson_id}`\n\n**Endpoint:** `GET /api/v1/lessons/check/overview/2`"
    )
    content = content.replace(
        "**Endpoint:** `GET /api/v1/lessons/check/concept/{lesson_id}/{concept_id}`",
        "**Endpoint Format:** `GET /api/v1/lessons/check/{type}/{lesson_id}/{concept_id}`\n\n**Endpoint:** `GET /api/v1/lessons/check/summary-and-application/2/1`"
    )
    content = content.replace(
        "**Endpoint:** `GET /api/v1/lessons/check/summary-and-application/{lesson_id}`",
        "**Endpoint Format:** `GET /api/v1/lessons/check/{type}/{lesson_id}`\n\n**Endpoint:** `GET /api/v1/lessons/check/summary-and-application/2`"
    )
    content = content.replace(
        "**Endpoint:** `GET /api/v1/lessons/check/general-exercises/{lesson_id}`",
        "**Endpoint Format:** `GET /api/v1/lessons/check/{type}/{lesson_id}`\n\n**Endpoint:** `GET /api/v1/lessons/check/general-exercises/2`"
    )

    # 4. Insert Total Scores API Request
    total_scores_docs = """
## Total Scores API Request

### 1. Concepts Total Scores API Request

**Endpoint Format:** `GET /api/v1/lessons/scores/concepts/{concept_id}`

**Endpoint:** `GET /api/v1/lessons/scores/concepts/1`

**Description:** Use this endpoint to get a lesson's concept total score using the concept_id.

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
    "concept_id": 1,
    "total_score": "10.00",
    "weight": "10.00"
  },
  "code": 200
}
```

**Concept Total Score Not Found Error (400):**
```json
{
  "success": false,
  "message": "Concept total score not found!",
  "errors": null,
  "code": 400
}
```

**Server Error Response (500):**
```json
{
  "success": false,
  "message": "An error occurred while getting the concept total score!",
  "errors": ["error messages"],
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

### 2. General Exercises Total Scores API Request

**Endpoint Format:** `GET /api/v1/lessons/scores/general-exercises/{lesson_id}`

**Endpoint:** `GET /api/v1/lessons/scores/general-exercises/1`

**Description:** Use this endpoint to get a lesson's general exercise total score using the lesson_id.

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
    "total_score": "4.50",
    "weight": "30.00"
  },
  "code": 200
}
```

**General Exercise Total Score Not Found Error (400):**
```json
{
  "success": false,
  "message": "General Exercise total score not found!",
  "errors": null,
  "code": 400
}
```

**Server Error Response (500):**
```json
{
  "success": false,
  "message": "An error occurred while getting the general exercise total score!",
  "errors": ["error messages"],
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

### 3. Lessons Total Scores API Request

**Endpoint Format:** `GET /api/v1/lessons/scores/lessons/{lesson_id}`

**Endpoint:** `GET /api/v1/lessons/scores/lesson/1`

**Description:** Use this endpoint to get a lesson's total score using the lesson_id.

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
    "lesson_total_score": "32.50",
    "weight": "100.00"
  },
  "code": 200
}
```

**Lesson Total Score Not Found Error (400):**
```json
{
  "success": false,
  "message": "Lesson total score not found!",
  "errors": null,
  "code": 400
}
```

**Server Error Response (500):**
```json
{
  "success": false,
  "message": "An error occurred while getting the lesson total score!",
  "errors": ["error messages"],
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

### 4. All Lessons Total Scores API Request

**Endpoint Format:** `GET /api/v1/lessons/scores/lessons/total/{subject_id}`

**Endpoint:** `GET /api/v1/lessons/scores/lessons/total/4`

**Description:** Use this endpoint to get all the lesson's total scores of a specific subject using the subject_id.

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

**Lessons Total Score Not Found Error (400):**
```json
{
  "success": false,
  "message": "No lessons total score found!",
  "errors": null,
  "code": 400
}
```

**Server Error Response (500):**
```json
{
  "success": false,
  "message": "An error occurred while getting all lesson's total scores!",
  "errors": ["error messages"],
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

### 5. Subjects Total Scores API Request

**Endpoint Format:** `GET /api/v1/lessons/scores/subjects/{subject_id}`

**Endpoint:** `GET /api/v1/lessons/scores/subjects/4`

**Description:** Use this endpoint to get a subject's total score using the subject_id.

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
    "subject_total_score": "3.25",
    "weight": "100.00"
  },
  "code": 200
}
```

**Subject Total Score Not Found Error (400):**
```json
{
  "success": false,
  "message": "Subject total score not found!",
  "errors": null,
  "code": 400
}
```

**Server Error Response (500):**
```json
{
  "success": false,
  "message": "An error occurred while getting the subject total score!",
  "errors": ["error messages"],
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

### 6. All Subjects Total Scores API Request

**Endpoint Format:** `GET /api/v1/lessons/scores/subjects/total`

**Endpoint:** `GET /api/v1/lessons/scores/subjects/total`

**Description:** Use this endpoint to get all the subject's total score of the student current class.

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

**Subject Total Score Not Found Error (400):**
```json
{
  "success": false,
  "message": "No subjects total score found!",
  "errors": null,
  "code": 400
}
```

**Server Error Response (500):**
```json
{
  "success": false,
  "message": "An error occurred while getting all subject's total scores!",
  "errors": ["error messages"],
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
"""
    if "Total Scores API Request" not in content:
        content = content.replace("## Guardian Management", total_scores_docs + "\n## Guardian Management")
        
    # Update TOC
    if "[Total Scores API Request]" not in content:
        content = content.replace(
            "8. [Lesson Completion Check System](#lesson-completion-check-system)\n9. [Admin & SuperAdmin Endpoints](#admin--superadmin-endpoints)",
            "8. [Lesson Completion Check System](#lesson-completion-check-system)\n9. [Total Scores API Request](#total-scores-api-request)\n10. [Admin & SuperAdmin Endpoints](#admin--superadmin-endpoints)"
        )

    with open("c:\\Users\\TRAVIS WAYNE\\Documents\\GitHub\\fast-leaner-frontend\\fastlearners-api-docs.md", "w", encoding="utf-8") as f:
        f.write(content)

    print("Successfully updated fastlearners-api-docs.md")

if __name__ == "__main__":
    main()
