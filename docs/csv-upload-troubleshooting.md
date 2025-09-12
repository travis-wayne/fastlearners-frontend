# CSV Upload Troubleshooting Guide

## Overview

This guide helps diagnose and fix CSV upload validation issues in the Fast Learners app. We've enhanced the error handling and debugging capabilities to provide detailed information about upload failures.

## Recent Enhancements

### 1. Enhanced Error Logging

- **Detailed API Response Logging**: Full error details including status, headers, and response data
- **File Content Logging**: Preview of file content being sent to the API
- **Format Conversion Tracking**: Shows what formats were attempted
- **Validation Error Parsing**: Extracts specific field validation errors

### 2. API Format Auto-Conversion

- **Automatic Row Numbering**: Converts standard CSV to API's expected format (1|, 2|, etc.)
- **BOM Character Handling**: Adds Byte Order Mark (﻿) to header row as expected by API
- **Multiple Format Fallbacks**: Tries API format, then original, then alternative formats

### 3. User-Friendly Error Messages

- **Generic Error Translation**: Converts technical errors to user-friendly messages
- **Detailed Technical Logs**: Provides full error context in console for developers

## Common Validation Issues & Solutions

### 1. "Invalid scheme of work CSV format" Error

**Problem**: API expects specific row-numbered format
**Solution**: Our system now auto-converts to the expected format:

```
Original:  subject,class,term,week,topic,breakdown
Converted: 1|﻿subject,class,term,week,topic,breakdown
```

### 2. "422 Unprocessable Content" Error

**Problem**: File structure is correct but data validation fails
**Troubleshooting**:

1. Check console for specific validation errors
2. Verify data types (numbers vs strings)
3. Ensure required fields are not empty
4. Validate JSON fields format

### 3. "400 Bad Request" Error

**Problem**: File format or structure issues
**Troubleshooting**:

1. Verify column headers match exactly
2. Check for extra/missing columns
3. Ensure proper CSV encoding (UTF-8)

## Debugging Tools

### Console Logging

Enhanced logging now provides:

- File content preview (first 1000 characters)
- API format conversion details
- Response status and headers
- Parsed validation errors

### CSV Debug Viewer Component

A new debug component shows:

- Original vs API-formatted content
- Format analysis (row numbers, BOM, line endings)
- Downloadable API-formatted file for testing

## Expected API Format

Based on sample files, the API expects:

```
1|﻿header1,header2,header3
2|data1,data2,data3
3|data1,data2,data3
```

Key requirements:

- Row numbers as prefixes (1|, 2|, 3|, etc.)
- BOM character (﻿) at start of header row
- Comma-separated values after row number
- Proper escaping for JSON fields

## Troubleshooting Steps

### 1. Check Browser Console

Look for detailed logs starting with:

- `=== UPLOAD API ERROR DETAILS ===`
- `=== CSV UPLOAD ERROR HANDLER ===`

### 2. Verify File Format

- Ensure all required columns are present
- Check for proper CSV structure
- Validate data types in each column

### 3. Test API Format

- Download the auto-converted file from logs
- Manually inspect the format
- Compare with working template files

### 4. Check Authentication

- Verify user has proper permissions
- Check if token is valid
- Ensure RBAC allows upload actions

## File Templates

Template files are available at `/lesson-csv-files/`:

- `check-markers-structure.csv`
- `concept-structure.csv`
- `examples-structure.csv`
- `exercises-structure.csv`
- `general-exercises-structure.csv`
- `lesson-structure.csv`
- `scheme-civic-education.csv`

## Development Notes

### Error Handling Flow

1. Frontend validates CSV structure
2. File converted to API format automatically
3. Upload attempted with multiple format fallbacks
4. Detailed error logging captures all response data
5. User-friendly error messages displayed

### Log Analysis

When debugging, look for:

```
File content being uploaded (first 1000 chars): 1|﻿subject,class,term,week,topic,breakdown...
Response status: 422
Full response data: {"message": "Validation failed", "errors": {...}}
```

### Testing Recommendations

1. Use template files as baseline
2. Test with minimal data first
3. Gradually add complexity
4. Check each file type individually before bulk upload

## Support

If validation issues persist after following this guide:

1. Share console logs starting with `=== UPLOAD API ERROR DETAILS ===`
2. Provide the specific error message from API response
3. Include sample of the CSV content being uploaded
4. Specify which file type (lessons, concepts, etc.) is failing
