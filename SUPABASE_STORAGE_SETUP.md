# Supabase Storage Setup for Profile Pictures

This document outlines how to set up Supabase Storage for the professional profile picture upload feature.

## Prerequisites

1. A Supabase project set up
2. Environment variables configured in your `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
   ```

## Storage Setup

### 1. Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the sidebar
3. Click **Create a new bucket**
4. Name it: `profile-pictures`
5. Set it to **Public** (for easy access to profile pictures)
6. Click **Create bucket**

### 2. Set Up Storage Policies (Optional but Recommended)

For better security, you can create Row Level Security (RLS) policies:

```sql
-- Allow authenticated users to upload their own profile pictures
CREATE POLICY "Users can upload their own profile pictures" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own profile pictures
CREATE POLICY "Users can update their own profile pictures" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own profile pictures
CREATE POLICY "Users can delete their own profile pictures" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public access to view profile pictures
CREATE POLICY "Profile pictures are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-pictures');
```

### 3. File Structure

The upload system creates files with the following structure:
```
profile-pictures/
├── avatars/
│   ├── user-id-1-timestamp.jpg
│   ├── user-id-2-timestamp.png
│   └── user-id-3-timestamp.webp
```

## Features

### ✅ File Validation
- **Supported formats**: JPEG, JPG, PNG, WebP
- **Maximum file size**: 5MB
- **Automatic file naming**: `{userId}-{timestamp}.{extension}`

### ✅ Professional UI
- **Drag & drop** file upload
- **Click to browse** functionality
- **Real-time preview** with loading states
- **Professional animations** and transitions
- **Error handling** with user-friendly messages

### ✅ Storage Management
- **Automatic cleanup**: Previous uploads are deleted when new ones are uploaded
- **Unique file names**: Prevents conflicts and overwrites
- **Public URLs**: Direct access to uploaded images

## Usage

The `ProfilePictureUpload` component is integrated into the user registration flow (`step-three.tsx`) and provides:

1. **Quick Select**: Choose from pre-designed professional avatars
2. **Custom Upload**: Upload your own professional photo

## Error Handling

The system handles various error scenarios:
- Invalid file types
- Files too large (>5MB)
- Network errors during upload
- Supabase storage errors

All errors are displayed to users with clear, actionable messages.

## Testing

To test the upload functionality:

1. Navigate to the user registration step 3
2. Switch to "Upload Photo" tab
3. Try uploading different file types and sizes
4. Verify files appear in your Supabase Storage bucket
5. Check that public URLs are accessible

## Security Considerations

- Files are stored with user ID prefixes for organization
- RLS policies ensure users can only manage their own files
- File type and size validation prevents malicious uploads
- Public access is limited to read-only for profile pictures
