# Database Schema Documentation

## Overview
This database schema is designed for a course management system with user approval, teacher management, and Supabase storage integration.

## Database Structure

### 1. **Users Table**
Stores all users with role-based access and admin approval system.

**Fields:**
- `id`: UUID (Primary Key)
- `email`: Unique email address
- `name`: User's full name
- `phone`: Contact number (optional)
- `role`: Enum ('admin', 'teacher', 'student')
- `approvalStatus`: Enum ('pending', 'approved', 'rejected')
- `approvedBy`: UUID (Foreign Key to users.id)
- `approvedAt`: Timestamp
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

**Key Features:**
- New users start with `approvalStatus: 'pending'`
- Admin must approve users before they can access the system
- Self-referencing foreign key for tracking which admin approved a user

### 2. **Teachers Table**
Extended profile for users with 'teacher' role.

**Fields:**
- `id`: UUID (Primary Key)
- `userId`: UUID (Foreign Key to users.id, unique)
- `bio`: Teacher biography
- `expertise`: JSONB array of expertise areas
- `experience`: Years of experience (integer)
- `qualifications`: JSONB array of qualifications
- `profileImageUrl`: Supabase storage URL
- `socialLinks`: JSONB object (LinkedIn, Twitter, etc.)
- `isActive`: Boolean
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### 3. **Categories Table**
Independent category management.

**Fields:**
- `id`: UUID (Primary Key)
- `name`: Category name (unique)
- `slug`: URL-friendly slug (unique)
- `description`: Category description
- `icon`: Icon identifier
- `imageUrl`: Supabase storage URL from 'course' bucket
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### 4. **Durations Table**
Independent duration options for courses.

**Fields:**
- `id`: UUID (Primary Key)
- `name`: Display name (e.g., "1 Month", "3 Months")
- `value`: Numeric value
- `unit`: Unit type ('days', 'weeks', 'months')
- `createdAt`: Timestamp

**Examples:**
```javascript
{ name: "1 Month", value: 30, unit: "days" }
{ name: "3 Months", value: 90, unit: "days" }
{ name: "6 Months", value: 180, unit: "days" }
```

### 5. **Timings Table**
Independent timing slots for courses.

**Fields:**
- `id`: UUID (Primary Key)
- `name`: Display name (e.g., "Morning Batch")
- `startTime`: Start time (e.g., "09:00 AM")
- `endTime`: End time (e.g., "11:00 AM")
- `days`: JSONB array of days (e.g., ["Monday", "Wednesday", "Friday"])
- `createdAt`: Timestamp

**Examples:**
```javascript
{
  name: "Morning Batch (Mon/Wed/Fri)",
  startTime: "06:00 AM",
  endTime: "08:00 AM",
  days: ["Monday", "Wednesday", "Friday"]
}
```

### 6. **Courses Table**
Main course information.

**Fields:**
- `id`: UUID (Primary Key)
- `slug`: URL-friendly slug (unique)
- `title`: Course title
- `description`: Short description
- `longDescription`: Detailed description
- `price`: Decimal (10,2)
- `pricing`: JSONB for additional pricing info
- `categoryId`: UUID (Foreign Key to categories.id, required)
- `durationId`: UUID (Foreign Key to durations.id)
- `teacherId`: UUID (Foreign Key to teachers.id)
- `imageUrl`: Supabase storage URL (required)
- `galleryImages`: JSONB array of Supabase storage URLs
- `subcategory`: Subcategory name
- `features`: JSONB array of features
- `level`: Difficulty level (Beginner/Intermediate/Advanced)
- `maxStudents`: Maximum students allowed
- `isActive`: Boolean
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### 7. **Course Timings (Junction Table)**
Many-to-many relationship between courses and timings.

**Fields:**
- `id`: UUID (Primary Key)
- `courseId`: UUID (Foreign Key to courses.id)
- `timingId`: UUID (Foreign Key to timings.id)
- `createdAt`: Timestamp

### 8. **Orders Table**
Payment and enrollment tracking.

**Fields:**
- `id`: UUID (Primary Key)
- `userId`: UUID (Foreign Key to users.id)
- `courseId`: UUID (Foreign Key to courses.id)
- `amount`: Decimal (10,2)
- `status`: Enum ('pending', 'completed', 'failed')
- `razorpayOrderId`: Razorpay order ID
- `razorpayPaymentId`: Razorpay payment ID
- `createdAt`: Timestamp

## Supabase Storage Integration

### Bucket Name: `course`

All images (categories, courses, teacher profiles) are stored in the Supabase storage bucket named `course`.

**Folder Structure:**
```
course/
├── categories/
│   ├── fitness.jpg
│   ├── dance.jpg
│   └── finance.jpg
├── courses/
│   ├── yoga-basics.jpg
│   └── advanced-zumba.jpg
└── teachers/
    ├── john-doe.jpg
    └── jane-smith.jpg
```

**Helper Functions** (in `lib/supabase-storage.ts`):
- `uploadImage(file, path)` - Upload image and get URL
- `deleteImage(path)` - Delete image from storage
- `getPublicUrl(path)` - Get public URL for a file
- `listFiles(folderPath)` - List all files in a folder
- `extractPathFromUrl(url)` - Extract path from URL

## Setup Instructions

### Step 1: Clear Database
```bash
npx tsx clear-database.ts
```
This will:
- Drop all existing tables
- Recreate enums

### Step 2: Push New Schema
```bash
npm run db:push
```
This will create all new tables based on the updated schema.

### Step 3: Create Admin User
```bash
npx tsx create-admin.ts
```
This creates an admin user with:
- Email: gv855719@gmail.com
- Name: Admin User
- Role: admin
- Status: approved

### Step 4: Seed Basic Data
```bash
npx tsx seed-basic-data.ts
```
This adds:
- 5 default durations (1 month to 1 year)
- 5 default timing options

### Step 5: Create Supabase Storage Bucket
1. Go to your Supabase dashboard
2. Navigate to Storage
3. Create a new bucket named `course`
4. Set it as **Public** (or handle authentication separately)
5. Create folders: `categories`, `courses`, `teachers`

### Step 6: Insert Your Data
Now you can manually insert:
- Categories (with images from Supabase storage)
- Teachers
- Courses

## API Endpoints

### Users API (`/api/users`)
- `GET` - Fetch all users (with optional filters: `?status=pending&role=teacher`)
- `POST` - Create new user (starts with pending status)
- `PATCH` - Update user (approve/reject, update role)
- `DELETE` - Delete user

### Teachers API (`/api/teachers`)
- `GET` - Fetch all teachers with user details
- `POST` - Create teacher profile
- `PATCH` - Update teacher profile
- `DELETE` - Delete teacher profile

### Durations API (`/api/durations`)
- `GET` - Fetch all durations
- `POST` - Create duration
- `PATCH` - Update duration
- `DELETE` - Delete duration

### Timings API (`/api/timings`)
- `GET` - Fetch all timings
- `POST` - Create timing
- `PATCH` - Update timing
- `DELETE` - Delete timing

### Categories API (`/api/categories`)
- Existing endpoints (already implemented)

### Courses API (`/api/courses`)
- Existing endpoints (need to update for new schema)

## User Approval Flow

1. **New User Registration**
   - User signs up with email and name
   - `approvalStatus` is set to 'pending'
   - User cannot access system yet

2. **Admin Approval**
   - Admin views pending users in dashboard
   - Admin can approve or reject
   - On approval:
     - `approvalStatus` = 'approved'
     - `approvedBy` = admin user ID
     - `approvedAt` = current timestamp
   - User can now access the system

3. **Teacher Profile Creation**
   - User must be approved first
   - Admin or user creates teacher profile
   - User role is automatically updated to 'teacher'

## Relations Overview

```
users (1) ----< (many) orders
users (1) ---- (1) teachers
users (1) ----< (many) users (approver relation)

teachers (1) ----< (many) courses

categories (1) ----< (many) courses

durations (1) ----< (many) courses

courses (1) ----< (many) orders
courses (1) ----< (many) course_timings

timings (1) ----< (many) course_timings
```

## Example Course Creation

```typescript
// 1. Upload image to Supabase
const file = // ... get file from form
const { url } = await uploadImage(file, 'courses/yoga-basics.jpg');

// 2. Create course
await db.insert(courses).values({
  title: "Yoga Basics",
  slug: "yoga-basics",
  description: "Learn yoga fundamentals",
  longDescription: "Detailed course description...",
  price: "999.00",
  categoryId: "uuid-of-fitness-category",
  durationId: "uuid-of-3-months-duration",
  teacherId: "uuid-of-teacher",
  imageUrl: url, // Supabase storage URL
  level: "Beginner",
  isActive: true,
});

// 3. Assign timings
await db.insert(courseTimings).values({
  courseId: newCourse.id,
  timingId: "uuid-of-morning-batch",
});
```

## Migration Notes

- All existing `profiles` table data will be lost
- You need to manually re-insert category and course data
- Images must be uploaded to Supabase storage
- The `instructor` field is replaced with `teacherId` (foreign key)
- The `duration` field (text) is replaced with `durationId` (foreign key)
- The `timings` field (JSONB) is replaced with many-to-many relation

## Security Considerations

1. **Admin Approval**: Implement middleware to check user approval status
2. **Role-Based Access**: Create middleware for admin/teacher/student routes
3. **Storage Security**: Configure Supabase storage policies
4. **API Authentication**: Add authentication to all API routes
