# Modular File Upload System

This directory contains a modular file upload system for the Fast Learners platform. The system is designed to easily add/remove file upload APIs without breaking existing functionality.

## 🏗️ Architecture

### Configuration-Driven System
The file upload system uses a central configuration object to manage available endpoints:

```typescript
// src/lib/api/files.ts
export const FILE_UPLOAD_ENDPOINTS = {
  avatar: {
    upload: '/api/v1/profile/avatar',
    get: '/api/v1/profile/avatar', 
    delete: '/api/v1/profile/avatar',
    enabled: false, // ← Set to true when backend implements
  },
  documents: {
    upload: '/api/v1/documents',
    list: '/api/v1/documents',
    delete: '/api/v1/documents/:id',
    enabled: false, // ← Set to true when backend implements
  }
}
```

## 📁 File Structure

```
src/lib/api/
├── files.ts           # Modular file upload API client
├── client.ts          # Enhanced axios client with FormData support
└── auth.ts            # Existing auth API client

src/lib/hooks/
└── useFileUpload.ts   # React hook for file uploads

src/components/shared/
├── AvatarUpload.tsx   # Profile picture upload component
└── ApiTester.tsx      # Enhanced with file upload testing
```

## 🚀 Quick Start

### 1. Enable File Upload APIs

When the backend implements file upload endpoints:

```typescript
// src/lib/api/files.ts
export const FILE_UPLOAD_ENDPOINTS = {
  avatar: {
    upload: '/api/v1/profile/avatar',
    get: '/api/v1/profile/avatar',
    delete: '/api/v1/profile/avatar',
    enabled: true, // ← Enable avatar endpoints
  },
  documents: {
    upload: '/api/v1/documents',
    list: '/api/v1/documents',
    delete: '/api/v1/documents/:id',
    enabled: true, // ← Enable document endpoints
  }
}
```

### 2. Use Components

```typescript
// Profile page example
import { AvatarUpload } from '@/components/shared/AvatarUpload';

function ProfilePage() {
  return (
    <AvatarUpload 
      currentAvatarUrl={user?.avatar}
      onAvatarUploaded={(url) => updateUserAvatar(url)}
      onAvatarRemoved={() => removeUserAvatar()}
    />
  );
}
```

### 3. Use Hooks

```typescript
import { useFileUpload } from '@/lib/hooks/useFileUpload';

function CustomUploadComponent() {
  const { uploadAvatar, isUploading } = useFileUpload({
    onSuccess: (response) => console.log('Upload successful!'),
    onError: (error) => console.error('Upload failed:', error)
  });

  return (
    <input 
      type="file" 
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) uploadAvatar(file);
      }}
      disabled={isUploading}
    />
  );
}
```

## 🔧 Adding New File Upload Types

To add a new file upload feature:

### 1. Add to Configuration

```typescript
export const FILE_UPLOAD_ENDPOINTS = {
  // Existing endpoints...
  
  certificates: {
    upload: '/api/v1/certificates',
    list: '/api/v1/certificates',
    delete: '/api/v1/certificates/:id',
    enabled: false, // Enable when backend is ready
  }
}
```

### 2. Extend API Client

```typescript
// In createFileApi() function
if (FILE_UPLOAD_ENDPOINTS.certificates.enabled) {
  fileApi.certificates = {
    upload: async (file: File, data?: any) => {
      const formData = new FormData();
      formData.append('certificate', file);
      // Add additional data...
      
      const response = await api.post(
        FILE_UPLOAD_ENDPOINTS.certificates.upload, 
        formData
      );
      return response.data;
    },
    // Add other methods...
  };
}
```

### 3. Update Hook (if needed)

```typescript
// Add to useFileUpload hook
const uploadCertificate = useCallback(async (file: File) => {
  if (!isFileUploadEnabled('certificates')) {
    options.onError?.(new Error('Certificate upload not available'));
    return;
  }
  
  // Implementation...
}, []);
```

## 🎨 Available Components

### AvatarUpload
- Drag & drop file upload
- Image validation (JPEG, PNG, WebP, max 5MB)
- Progress tracking
- Preview functionality
- Error handling

**Props:**
- `currentAvatarUrl?: string`
- `onAvatarUploaded?: (url: string) => void`
- `onAvatarRemoved?: () => void`
- `className?: string`
- `size?: 'sm' | 'md' | 'lg'`

### useFileUpload Hook

**Options:**
- `onSuccess?: (response) => void`
- `onError?: (error) => void`
- `validateFile?: (file: File) => validation`
- `maxFiles?: number`

**Returns:**
- `uploads: FileUploadProgress[]`
- `isUploading: boolean`
- `uploadFile(file, endpoint, data?)`
- `uploadAvatar(file)`
- `uploadDocument(file, category?, description?)`
- `removeFile(fileName, fileSize)`
- `clearUploads()`
- `retryUpload(...)`

## 🧪 Testing

The API Tester includes a "File Upload" tab that shows:
- Current status of file upload endpoints
- Instructions for enabling APIs
- Ready-to-use component previews
- Usage examples

Access at: `http://localhost:3000` → File Upload tab

## 🔒 Security & Validation

### Built-in Validations
- **Images**: JPEG, PNG, WebP only, max 5MB
- **Documents**: PDF, DOC, DOCX, images, max 10MB
- **Custom**: Define your own validation rules

### Security Features
- File type validation
- File size limits
- Progress tracking
- Error handling
- Automatic FormData content-type handling

## 📋 Backend Implementation Requirements

For the system to work, the backend needs to implement these endpoints:

### Avatar Endpoints
- `POST /api/v1/profile/avatar` - Upload profile picture
- `GET /api/v1/profile/avatar` - Get current avatar URL
- `DELETE /api/v1/profile/avatar` - Remove avatar

### Document Endpoints  
- `POST /api/v1/documents` - Upload document
- `GET /api/v1/documents` - List user documents
- `GET /api/v1/documents/:id` - Get specific document
- `DELETE /api/v1/documents/:id` - Delete document
- `PATCH /api/v1/documents/:id` - Update document metadata

### Expected Response Format
All endpoints should return the standard API response format:

```typescript
{
  success: boolean;
  message: string;
  content: {
    // File data (for uploads)
    id: string;
    filename: string;
    original_name: string;
    mime_type: string;
    size: number;
    url: string;
    created_at: string;
  } | null;
  code: number;
  errors?: Record<string, string[]>;
}
```

## ✨ Benefits of This System

1. **Modular**: Easy to add/remove file upload features
2. **Future-proof**: Components automatically adapt to available APIs
3. **Error-resilient**: Clear error messages when APIs are unavailable
4. **Reusable**: Generic components and hooks for any file upload need
5. **Type-safe**: Full TypeScript support with proper types
6. **Testing-ready**: Built-in testing interface in API Tester

## 🚧 Current Status

**Ready for Backend Implementation:**
- ✅ Frontend components and hooks built
- ✅ API client structure ready  
- ✅ Validation and error handling
- ✅ Testing interface available
- ❌ Backend endpoints not implemented yet
- ❌ File upload APIs disabled (waiting for backend)

**To Enable:** Contact backend team → Implement endpoints → Set `enabled: true`
