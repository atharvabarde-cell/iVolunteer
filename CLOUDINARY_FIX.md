# Cloudinary Upload Preset Error Fix

## Problem
The error "Upload preset not found" occurs when Cloudinary is trying to use an upload preset that doesn't exist in your account.

## Solution Applied

1. **Removed upload_preset requirement** from server-side configurations
2. **Fixed import statements** in middleware files
3. **Added proper public_id generation** for unique file names

## Changes Made:

### 1. Updated `cloudinary.js` configuration:
- Removed `upload_preset` parameter
- Added `public_id` function for unique file naming
- Server-side uploads don't need upload presets

### 2. Updated `upload.middleware.js`:
- Fixed cloudinary import
- Added proper public_id generation

### 3. Updated `multer.middleware.js`:
- Fixed cloudinary import
- Added proper public_id generation

## Environment Variables Required:
Make sure these are set in your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Optional: If you want to use upload presets

If you prefer to use upload presets (for unsigned uploads), you need to:

1. Go to your Cloudinary Dashboard
2. Navigate to Settings > Upload
3. Create an upload preset
4. Set it as unsigned if needed
5. Add the preset name to your environment variables:
   ```env
   CLOUDINARY_UPLOAD_PRESET=your_preset_name
   ```

## Testing
After these changes, restart your server and test the post upload functionality. The uploads should work without the preset error.