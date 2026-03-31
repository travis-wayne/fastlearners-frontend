# Superadmin Upload CSV Contracts

## 📋 Overview
The Superadmin Upload section is a critical component of the FastLearners platform, designed to allow high-volume content ingestion. It enables administrators to upload hundreds of lessons, concepts, and exercises simultaneously, ensuring content consistency across the platform.

### What it does:
- **Standardization:** Enforces a rigid data structure for all educational content.
- **Efficiency:** Replaces manual form entry with bulk file processing.
- **Validation:** Performs multi-stage integrity checks before data persistence.
- **Relational Integrity:** Ensures that concepts are linked to lessons, and exercises to concepts, preserving the platform's nested content hierarchy.

---

## 🏗️ System Architecture & Workflow

The system uses a **BFF (Backend for Frontend)** proxy pattern to handle uploads securely.

### The Journey of an Upload:
1. **User Interaction:** The admin selects one or more CSV files in the [Uploads Dashboard](/dashboard/superadmin/uploads).
2. **Client-Side Validation:** The UI instantly parses the file headers and detects the delimiter (Pipe or Comma). It warns the user if required columns are missing before any network request is made.
3. **Internal API Route (Next.js):** The file is sent to an internal endpoint (e.g., `/api/uploads/lessons`).
   - This layer validates the User Session.
   - It enforces a **10MB size limit** and checks for valid MIME types.
4. **Upstream Proxying:** The internal route forwards the `multipart/form-data` to the **Main Backend API** (`BASE_API_URL`).
5. **Backend Processing:** The main API receives the file, parses the data, and performs:
   - **Schema Validation:** Data types and mandatory field checks.
   - **Business Logic:** Checks if Topic/Subject/Class exists.
   - **Persistence:** Commits records to the database.
6. **Response Cycle:** The backend returns a detailed JSON response which the UI uses to show success or specific error toast notifications.

---

## ⚙️ Processing Logic & Delimiters

### Flexible Parsing
The system uses a custom parser that:
- **Auto-Detects Delimiters:** It looks for `|` or `,`.
- **Supports Pipe (`|`) Recommendation:** We strongly recommend using pipes. This avoids "CSV breakage" where a comma inside an "Objectives" JSON string is mistaken for a column separator.
- **Handles Empty Rows:** Gracefully skips trailing empty lines.

---

## 📑 Detailed Upload Types & Column Structures

Each upload type has a specific rigid structure. Entities must be uploaded in order of dependency (Lessons → Concepts → Exercises).

### 1. Lessons
**Endpoint:** `/api/uploads/lessons` | **File Key:** `lessons_file`
**Purpose:** Root entity for all learning content.

| Column | Data Type | Description |
|--------|-----------|-------------|
| `class` | String | Academic level. Must be one of: `JSS 1`, `JSS 2`, `JSS 3`, `SSS 1`, `SSS 2`, `SSS 3`. |
| `subject` | String | Subject name. Must match an existing subject in the database. |
| `term` | String | Term period. Must be: `First Term`, `Second Term`, or `Third Term`. |
| `week` | Integer | The week number (e.g., `1`, `2`). |
| `topic` | String | The main lesson title. |
| `overview` | Text | Detailed introduction to the lesson. |
| `objectives` | JSON String | Array of learning goals. Format: `["Understand X", "Calculate Y"]`. |
| `key_concepts`| JSON String | Key terms and definitions. Format: `{"Term": "Definition"}`. |
| `summary` | Text | Comprehensive wrap-up of the lesson. |
| `application` | Text | Real-world use cases or practical examples. |

### 2. Concepts
**Endpoint:** `/api/uploads/concepts` | **File Key:** `concepts_file`
**Purpose:** Sub-modules within a lesson.

| Column | Data Type | Description |
|--------|-----------|-------------|
| `lesson` | String | **Topic** of the parent lesson. Matches the `topic` in the Lessons file. |
| `title` | String | The title of this specific concept. |
| `description` | Text | Detailed explanation of the concept. Supporting markdown-style formatting. |
| `order_index` | Integer | Determines the display sequence (e.g., `1`, `2`, `3`). |

### 3. Examples
**Endpoint:** `/api/uploads/examples` | **File Key:** `examples_file`
**Purpose:** Illustrative problems attached to specific concepts.

| Column | Data Type | Description |
|--------|-----------|-------------|
| `concept` | String | **Title** of the parent concept. |
| `title` | String | Title of the specific example. |
| `problem` | Text | The problem statement or question. |
| `solution_steps`| JSON String | Step-by-step breakdown. Format: `["Step 1...", "Step 2..."]`. |
| `answer` | Text/String | The final solution or result. |
| `order_index` | Integer | Display sequence within the concept. |

### 4. Exercises
**Endpoint:** `/api/uploads/exercises` | **File Key:** `exercises_file`
**Purpose:** Formative assessments for specific concepts.

| Column | Data Type | Description |
|--------|-----------|-------------|
| `concept` | String | **Title** of the parent concept. |
| `title` | String | Identifier for the exercise. |
| `problem` | Text | The question or task. |
| `solution_steps`| JSON String | Detailed solution path. Format: `["Step 1...", "Step 2..."]`. |
| `answers` | JSON String | List of options. Format: `["A", "B", "C", "D"]`. |
| `correct_answer`| String | The identifier of the right answer (e.g., `B`). |
| `order_index` | Integer | Display sequence. |

### 5. General Exercises
**Endpoint:** `/api/uploads/general-exercises` | **File Key:** `general_exercises_file`
**Purpose:** Summative assessment for the entire lesson.

| Column | Data Type | Description |
|--------|-----------|-------------|
| `lesson` | String | **Topic** of the parent lesson. |
| `problem` | Text | The question or task. |
| `solution_steps`| JSON String | Full explanation of the solution. |
| `answers` | JSON String | Options list: `["Option 1", "Option 2"]`. |
| `correct_answer`| String | The correct option text or identifier. |
| `order_index` | Integer | Sequence number. |

### 6. Check Markers
**Endpoint:** `/api/uploads/check-markers` | **File Key:** `check_markers_file`
**Purpose:** Controls the "Lock/Unlock" logic for student progression.

| Column | Data Type | Description |
|--------|-----------|-------------|
| `lesson` | String | **Topic** of the parent lesson. |
| `overview` | Boolean | `1` if overview completion is required, else `0`. |
| `lesson_video`| Boolean | `1` if video viewing is mandatory. |
| `concept_one` | Boolean | Mandatory completion for Concept 1. |
| `concept_two` | Boolean | Mandatory completion for Concept 2. |
| ... | ... | (Repeats up to `concept_seven`) |
| `general_exercises` | Boolean | Mandatory completion for General Exercises. |

### 7. Scheme of Work
**Endpoint:** `/api/uploads/scheme-of-work` | **File Key:** `scheme_of_work_file`
**Purpose:** High-level curriculum timeline.

| Column | Data Type | Description |
|--------|-----------|-------------|
| `subject` | String | Matching subject name. |
| `class` | String | Matching class name. |
| `term` | String | Matching term name. |
| `week` | Integer | Timeline week. |
| `topic` | String | Broad topic category. |
| `breakdown` | JSON String | Detailed sub-topic list or weekly syllabus. |

---

## 🚨 Error Resolution Guide

| Scenario | Symptom | Fix |
|----------|---------|-----|
| **Malformed Header** | Error: "Missing column: topic" | Ensure your CSV header exactly matches the template. Check for extra spaces. |
| **Missing Parent** | Error: "Lesson not found" | Upload the Lessons file *before* the Concepts or Exercises files. |
| **JSON Syntax** | Error: "Invalid JSON format" | Ensure fields like `objectives` are valid strings. Escape quotes if using commas as delimiters. |
| **Size Limit** | Toast: "File size exceeds 10MB" | Split your CSV into smaller batches if necessary. |

---

### Tip for Admins:
Always start with a **Dry Run** (Preview) in the UI. If the preview table looks shifted or columns look merged, you likely have a delimiter mismatch or missing quotes in your data fields.
