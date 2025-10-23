# API Endpoints Documentation

Base URL: `https://fastlearnersapp.com`

## Authentication Headers
All authenticated endpoints require:
```
Authorization: Bearer {access_token}
Accept: application/json
```

## Common Response Codes
- `200` - Success
- `401` - Unauthorized
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

---

## Lessons Management (Superadmin)

### Get Classes, Subjects, Terms and Weeks
**Endpoint:** `GET /api/v1/superadmin/lessons/get-classes-subjects-terms-weeks`

**Description:** Get metadata required to query lessons by class, subject, term, and week.

**Response:**
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
      { "id": 3, "name": "Agricultural Science" },
      { "id": 4, "name": "Biology" },
      { "id": 5, "name": "Physics" },
      { "id": 6, "name": "Chemistry" },
      { "id": 7, "name": "Further Mathematics" },
      { "id": 8, "name": "Economics" },
      { "id": 9, "name": "Geography" },
      { "id": 10, "name": "Literature in English" },
      { "id": 11, "name": "History" },
      { "id": 12, "name": "Commerce" },
      { "id": 13, "name": "Government" },
      { "id": 14, "name": "Social Studies" },
      { "id": 15, "name": "Business Studies" },
      { "id": 16, "name": "Basic Science" },
      { "id": 17, "name": "Basic Technology" },
      { "id": 18, "name": "Civic Education" },
      { "id": 19, "name": "Information and Communication Technology (ICT)" },
      { "id": 20, "name": "Physical and Health Education" },
      { "id": 21, "name": "Home Economics" },
      { "id": 22, "name": "Christian Religious Studies" },
      { "id": 23, "name": "Islamic Religious Studies" },
      { "id": 24, "name": "Religious and Moral Education" },
      { "id": 25, "name": "Visual/Fine Arts" },
      { "id": 26, "name": "Music" },
      { "id": 27, "name": "Yoruba" },
      { "id": 28, "name": "Hausa" },
      { "id": 29, "name": "Igbo" },
      { "id": 30, "name": "Ibibio" },
      { "id": 31, "name": "Efik" },
      { "id": 32, "name": "Obolo" },
      { "id": 33, "name": "French" },
      { "id": 34, "name": "Arabic" },
      { "id": 35, "name": "Technical Drawing" },
      { "id": 36, "name": "Computer Studies" },
      { "id": 37, "name": "Financial Accounting" },
      { "id": 38, "name": "Marketing" },
      { "id": 39, "name": "Office Practice" }
    ],
    "terms": [
      { "id": 1, "name": "First" },
      { "id": 2, "name": "Second" },
      { "id": 3, "name": "Third" }
    ],
    "weeks": [
      { "id": 1, "name": 1 },
      { "id": 2, "name": 2 }
    ]
  },
  "code": 200
}
```

### Get Lessons
**Endpoint:** `POST /api/v1/superadmin/lessons/lessons/`

**Description:** Get lessons filtered by class, subject, term, and week.

**Request Body:**
```json
{
  "class": "4",
  "subject": "1",
  "term": "1",
  "week": "1"
}
```

**Response:**
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

### Get Specific Lesson
**Endpoint:** `GET /api/v1/superadmin/lessons/lesson/{id}`

**Description:** Get specific lesson details by ID.

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "content": {
    "id": 2,
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
      "Conversion of number bases": "Changing numbers between different base systems using division or expansion methods.",
      "Operations in number bases": "Performing arithmetic such as addition, subtraction, multiplication, and division under specific base rules."
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

### Get Specific Lesson Content
**Endpoint:** `GET /api/v1/superadmin/lessons/lesson/{id}/content`

**Description:** Get complete lesson content including concepts, examples, exercises, and check markers.

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "content": {
    "id": 2,
    "class": "SSS1",
    "subject": "General Mathematics",
    "term": "First",
    "week": 1,
    "topic": "Number Bases System",
    "overview": "A number base system is a way of representing numbers using a set of digits or symbols.",
    "objectives": [...],
    "key_concepts": {...},
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
            "description": "The Modal Arithmetic that you will learn later in the session is useful in this problem.",
            "image_path": null,
            "points": [
              "Divide the given number repeatedly by the required base",
              "Write down the remainders by the right side."
            ]
          }
        ],
        "examples": [...],
        "exercises": [...]
      }
    ],
    "general_exercises": [...],
    "check_markers": [...]
  },
  "code": 200
}
```

---

## Student Management

### Student Dashboard
**Endpoint:** `GET /api/v1/dashboard`

**Description:** Get student dashboard overview and reports.

**Response:**
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

### List Student's Subjects
**Endpoint:** `GET /api/v1/subjects`

**Description:** Get the list of student's subjects, compulsory selective subjects, and selective subjects.

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "content": {
    "subjects": [
      { "id": 1, "name": "General Mathematics" },
      { "id": 2, "name": "English Language" }
    ],
    "compulsory_selective_status": "selected",
    "compulsory_selective": [
      { "id": 22, "name": "Christian Religious Studies" },
      { "id": 23, "name": "Islamic Religious Studies" }
    ],
    "selective_status": "selected",
    "selective": [
      { "id": 3, "name": "Agricultural Science" },
      { "id": 7, "name": "Further Mathematics" }
    ]
  },
  "code": 200
}
```

### Update Compulsory Selective Subject
**Endpoint:** `POST /api/v1/subjects/update-compulsory-selective`

**Description:** Update student's compulsory selective subject (one religious studies subject).

**Request Body:**
```json
{
  "subject": 22
}
```

**Response:**
```json
{
  "success": true,
  "message": "Compulsory Selective subject Updated successfully!",
  "content": null,
  "code": 200
}
```

### Update Selective Subjects
**Endpoint:** `POST /api/v1/subjects/update-selective`

**Description:** Update student's selective/discipline selective subjects (four subjects).

**Request Body:**
```json
{
  "subjects[]": 31,
  "subjects[]": 7,
  "subjects[]": 8,
  "subjects[]": 36
}
```

**Response:**
```json
{
  "success": true,
  "message": "Selective subjects Updated successfully!",
  "content": null,
  "code": 200
}
```

---

## Guardian Management

### Guardian Dashboard
**Endpoint:** `GET /api/v1/guardian`

**Description:** Guardian's dashboard overview and children's reports.

**Response:**
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

---

## Guest Management

### Guest Dashboard
**Endpoint:** `GET /api/v1/guest`

**Description:** Guest's dashboard overview.

**Response:**
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

---

## Error Responses

### Unauthorized Access (401)
```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": null,
  "code": 401
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Lesson not found!",
  "errors": null,
  "code": 404
}
```

### Validation Error (422)
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "class": ["The class field is required."],
    "subject": ["The subject field is required."]
  },
  "code": 422
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "An error occurred while fetching lessons: (error message)",
  "errors": null,
  "code": 500
}
```

---

## Notes

1. **Authentication**: All endpoints require Bearer token authentication except guest endpoints.
2. **Content-Type**: Use `application/json` for request bodies.
3. **Pagination**: Lesson lists include pagination metadata with `links` and `meta` objects.
4. **Subject Selection**: 
   - Compulsory selective: Choose 1 religious studies subject
   - Selective: Choose 4 subjects from available options
5. **Lesson Filtering**: All four parameters (class, subject, term, week) are required to fetch lessons.