# Event Image Upload and Time Display Fix

## Overview
This document describes the implementation of event image upload functionality with Cloudinary integration and the fix for AM/PM time display in event details.

## Changes Made

### 1. Time Display Fix (AM/PM)

#### File: `frontend/app/volunteer/[eventId]/page.tsx`

**Issue**: Time was displayed without AM/PM indicator.

**Fix**: Updated time formatting to include AM/PM:

```typescript
// Before
{event.time || (event.date ? new Date(event.date).toLocaleTimeString([], {
  hour: '2-digit',
  minute: '2-digit'
}) : "Time not specified")}

// After
{event.time || (event.date ? new Date(event.date).toLocaleTimeString('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
}) : "Time not specified")}
```

**Changes**:
- Added `'en-US'` locale specification
- Changed `hour: '2-digit'` to `hour: 'numeric'` (removes leading zero)
- Added `hour12: true` to force 12-hour format with AM/PM

**Result**: Times now display as "2:30 PM" instead of "14:30"

---

### 2. Event Image Upload Functionality

#### A. Frontend Changes

##### File: `frontend/app/add-event/page.tsx`

###### 1. Import Updates

Added necessary icons and axios:

```typescript
import {
  Calendar,
  MapPin,
  Users,
  FileText,
  PlusCircle,
  DollarSign,
  Tag,
  AlertCircle,
  Clock,
  Activity,
  Image as ImageIcon,  // Added
  X,                   // Added
  Upload,              // Added
} from "lucide-react";
import axios from "axios";  // Added
```

###### 2. State Management

Added image-related state variables:

```typescript
const [eventImage, setEventImage] = useState<File | null>(null);
const [eventImagePreview, setEventImagePreview] = useState<string | null>(null);
const [isUploadingImage, setIsUploadingImage] = useState(false);
const [uploadedImageData, setUploadedImageData] = useState<{ url: string; publicId: string } | null>(null);
```

###### 3. Image Handling Functions

**Image Selection Handler**:
```typescript
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setEventImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setEventImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
};
```

**Remove Image Handler**:
```typescript
const removeImage = () => {
  setEventImage(null);
  setEventImagePreview(null);
  setUploadedImageData(null);
};
```

**Upload to Cloudinary**:
```typescript
const uploadEventImage = async () => {
  if (!eventImage) return null;

  setIsUploadingImage(true);
  try {
    const token = localStorage.getItem("auth-token");
    const formData = new FormData();
    formData.append("eventImage", eventImage);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/event/upload-event-image`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const imageData = (response.data as any).data;
    setUploadedImageData(imageData);
    return imageData;
  } catch (error: any) {
    console.error("Error uploading event image:", error);
    throw new Error(error.response?.data?.message || "Failed to upload event image");
  } finally {
    setIsUploadingImage(false);
  }
};
```

###### 4. Form Submission Update

Modified to upload image before creating event:

```typescript
const onSubmit = async (data: EventFormData) => {
  try {
    // Upload image first if one is selected
    let imageData = uploadedImageData;
    if (eventImage && !uploadedImageData) {
      imageData = await uploadEventImage();
    }

    const formattedData = {
      // ... other fields
      image: imageData ? {
        url: imageData.url,
        caption: data.imageCaption || "Event Image",
        publicId: imageData.publicId,
      } : undefined,
      // ... rest of fields
    };

    await createEvent(formattedData);
    // ... success handling
    removeImage(); // Reset image after successful creation
  } catch (err) {
    console.error("Error in form submission:", err);
  }
};
```

###### 5. Image Upload UI Component

Replaced simple file input with a feature-rich image upload interface:

```tsx
<motion.div variants={itemVariants} className="md:col-span-3">
  <label className="block text-xs font-medium text-gray-700 mb-1.5">
    Event Image
  </label>
  
  {!eventImagePreview ? (
    // Upload area
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        id="event-image-upload"
      />
      <label
        htmlFor="event-image-upload"
        className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition cursor-pointer bg-gray-50 hover:bg-blue-50/50"
      >
        <Upload className="w-10 h-10 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 font-medium">
          Click to upload event image
        </p>
        <p className="text-xs text-gray-500 mt-1">
          PNG, JPG, GIF up to 10MB
        </p>
      </label>
    </div>
  ) : (
    // Image preview
    <div className="relative rounded-xl overflow-hidden border border-gray-200">
      <img
        src={eventImagePreview}
        alt="Event preview"
        className="w-full h-60 object-cover"
      />
      <button
        type="button"
        onClick={removeImage}
        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
      >
        <X className="w-4 h-4" />
      </button>
      {uploadedImageData && (
        <div className="absolute bottom-2 left-2 px-3 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
          ✓ Uploaded
        </div>
      )}
    </div>
  )}
  
  {/* Upload button - shown when image is selected but not uploaded */}
  {eventImagePreview && !uploadedImageData && (
    <button
      type="button"
      onClick={uploadEventImage}
      disabled={isUploadingImage}
      className="mt-2 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
    >
      {isUploadingImage ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Uploading...
        </>
      ) : (
        <>
          <Upload className="w-4 h-4" />
          Upload Image
        </>
      )}
    </button>
  )}

  {/* Image caption - shown when image is selected */}
  {eventImagePreview && (
    <div className="mt-3">
      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        Image Caption (Optional)
      </label>
      <input
        type="text"
        {...register("imageCaption")}
        className="w-full rounded-xl border-gray-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-400 focus:!outline-none px-4 py-2.5 shadow-sm"
        placeholder="Add a caption for this image"
      />
    </div>
  )}
</motion.div>
```

#### B. Backend Changes

##### File: `backend/src/models/Event.js`

Added single `image` field with Cloudinary public ID:

```javascript
image: {
  url: String,
  caption: String,
  publicId: String,  // For Cloudinary management
},
```

##### File: `backend/src/controllers/ngoEvent.controller.js`

###### 1. Import Updates

```javascript
import { cloudinary } from "../config/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
```

###### 2. Upload Event Image Controller

```javascript
const uploadEventImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'iVolunteer_events',
      transformation: [
        { width: 1200, height: 630, crop: "fill" }
      ],
      public_id: `event_${req.user._id}_${Date.now()}`
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { 
        url: result.secure_url, 
        publicId: result.public_id 
      }, "Event image uploaded successfully"));
  } catch (error) {
    console.error("Error uploading event image:", error);
    throw new ApiError(500, "Failed to upload event image");
  }
});
```

###### 3. Export Update

```javascript
export const ngoEventController = {
  // ... existing exports
  uploadEventImage,  // Added
};
```

##### File: `backend/src/routes/event.routes.js`

###### 1. Import Multer Upload

```javascript
import { upload } from "../config/cloudinary.js";
```

###### 2. Add Upload Route

```javascript
eventRouter.post(
  "/upload-event-image",
  authMiddleware,
  upload.single('eventImage'),
  ngoEventController.uploadEventImage
);
```

## Features

### Event Image Upload

1. **Drag & Drop Interface**
   - Visual upload area with icons
   - Hover effects for better UX
   - File type restrictions (PNG, JPG, GIF)
   - Size limit information displayed

2. **Image Preview**
   - Immediate preview after selection
   - Full-width display in form
   - Remove button to clear selection
   - Upload status indicator

3. **Separate Upload Step**
   - Two-step process: Select → Upload
   - Upload button appears after image selection
   - Progress indicator during upload
   - Success confirmation badge

4. **Image Caption**
   - Optional caption field
   - Shows only when image is selected
   - Stored with image metadata

5. **Cloudinary Integration**
   - Images uploaded to `iVolunteer_events` folder
   - Automatic image optimization (1200x630px)
   - Public ID generated with user ID and timestamp
   - Secure URL returned

### Time Display

1. **12-Hour Format with AM/PM**
   - Clear indication of morning/afternoon
   - Follows common US time format
   - No leading zeros for single-digit hours

## API Endpoint

### POST `/v1/event/upload-event-image`

**Authentication**: Required

**Request**:
- Content-Type: `multipart/form-data`
- Field name: `eventImage`
- File types: image/*

**Response**:
```json
{
  "statusCode": 200,
  "data": {
    "url": "https://res.cloudinary.com/.../event_...",
    "publicId": "iVolunteer_events/event_..."
  },
  "message": "Event image uploaded successfully",
  "success": true
}
```

**Error Responses**:
- 400: No file uploaded
- 500: Upload failed

## Workflow

### Creating Event with Image

1. **User selects image**
   - Clicks upload area
   - Selects image file
   - Preview appears immediately

2. **User uploads image** (optional before form submission)
   - Clicks "Upload Image" button
   - Image uploads to Cloudinary
   - Success badge appears
   - URL and publicId stored in state

3. **User fills out event form**
   - All other event details
   - Optional image caption

4. **Form submission**
   - If image selected but not uploaded: Upload happens automatically
   - If already uploaded: Uses existing URL
   - Image data included in event creation payload
   - Event created with image reference

5. **Event created**
   - Image stored in database with URL, caption, and publicId
   - Form resets including image preview
   - Ready for next event

## Display

### Event Details Page

The uploaded image is displayed at the top of the event details page:

```tsx
{event.image?.url ? (
  <div className="h-64 md:h-80 relative">
    <img
      src={event.image.url}
      alt={event.image.caption || event.title}
      className="w-full h-full object-cover"
    />
    {/* ... overlay and title */}
  </div>
) : (
  // Fallback gradient background
)}
```

## Benefits

1. **Visual Appeal**: Events have attractive images
2. **Better Engagement**: Images attract more volunteers
3. **Professional Look**: High-quality event presentation
4. **Easy Management**: Simple upload and preview process
5. **Optimized Storage**: Cloudinary handles image optimization
6. **Scalable**: Cloud-based image hosting
7. **Secure**: Images tied to authenticated users
8. **Clear Timing**: AM/PM makes event times unambiguous

## Technical Details

### Image Specifications
- **Format**: PNG, JPG, GIF
- **Max Size**: 10MB (configurable)
- **Optimized Dimensions**: 1200x630px (16:9 aspect ratio)
- **Folder**: `iVolunteer_events`
- **Naming**: `event_{userId}_{timestamp}`

### Time Format
- **Locale**: en-US
- **Hour**: Numeric (no leading zero)
- **Minute**: 2-digit
- **Format**: 12-hour with AM/PM

## Security

1. **Authentication Required**: Only authenticated users can upload
2. **File Type Validation**: Only images accepted
3. **Cloudinary Validation**: Additional server-side checks
4. **User-Specific Naming**: Public IDs include user ID
5. **Token-Based Auth**: Bearer token required for API calls

## Error Handling

1. **No File Selected**: User-friendly message
2. **Upload Failed**: Error toast with message
3. **Network Issues**: Proper error catching and display
4. **Invalid File Type**: Browser validation + server validation

## Future Enhancements

1. **Multiple Images**: Support image galleries
2. **Image Cropping**: Allow users to crop before upload
3. **Image Filters**: Apply filters to images
4. **Delete Old Images**: Cleanup when updating event
5. **Progress Bar**: Detailed upload progress
6. **Image Compression**: Client-side compression before upload
