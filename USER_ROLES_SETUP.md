# Job Board User Roles & Dashboard System 🎯

## What I've Implemented

### 1. **Role-Based Navigation** 
✅ **Different navbar for different user types**:
- **Companies (HR)**: Post Job, Applications, My Jobs
- **Job Seekers**: Favorites, My Applications
- **Guest Users**: Post Job, Login

### 2. **Company Dashboard Features**
✅ **Job Applications Page** (`/job-applications`):
- View all applications across company's job postings
- See applicant details, resumes, cover letters
- Application status tracking (PENDING, REVIEWED, ACCEPTED, REJECTED)
- Download resumes directly
- Filter by job posting

### 3. **Job Seeker Dashboard Features**
✅ **My Applications Page** (`/my-applications`):
- Track all job applications with status
- View application history
- See cover letters submitted
- Quick access to original job postings

### 4. **Smart Job Detail Pages**
✅ **Different content based on user type**:
- **Companies**: See "Job Applications" button instead of apply form
- **Job Seekers**: See apply form with cover letter option
- **Proper validation**: Only job seekers can apply

## How to Fix Your Current Issue

### **Step 1: Fix Your User Type**
Your error happens because your user profile isn't set up correctly. Choose one:

**Option A - Reset & Redo Onboarding:**
1. Go to: `http://localhost:3000/api/debug/reset-onboarding`
2. Then: `http://localhost:3000/onboarding`
3. **Select "Job Seeker"** when prompted
4. Complete the profile

**Option B - Direct Fix:**
1. Go to: `http://localhost:3000/api/debug/fix-user-type`
2. This automatically sets your user type to JOB_SEEKER

### **Step 2: Test the Features**

**As a Job Seeker:**
1. Apply to jobs with cover letters
2. Check `/my-applications` to see your applications
3. Navigate using "Favorites" and "My Applications" in the navbar

**As a Company (HR):**
1. Post jobs using "Post Job" button
2. View applications at `/job-applications`
3. Navigate using "Applications" and "My Jobs" in the navbar

## Key Features by User Type

### 🏢 **Company/HR Dashboard**
```
Navigation: Post Job | Applications | My Jobs
Job Page: Shows "View Applications" button
Dashboard: /job-applications - see all applicants with:
- Applicant name and bio
- Cover letters
- Resume download links
- Application status
- Application date
```

### 👤 **Job Seeker Dashboard**
```
Navigation: Favorites | My Applications
Job Page: Shows apply form with cover letter
Dashboard: /my-applications - track applications with:
- Job title and company
- Application status
- Cover letter you submitted
- Application date
- Quick link to job posting
```

### 🌐 **Guest Users**
```
Navigation: Post Job | Login
Job Page: Shows "Login to Apply" button
Access: Can view jobs but must login to apply
```

## Database Structure

### New Models Added:
- **JobApplication**: Links users to jobs with status tracking
- **ApplicationStatus**: PENDING, REVIEWED, ACCEPTED, REJECTED

### Relations:
- User → JobApplication (one-to-many)
- JobPost → JobApplication (one-to-many)
- JobPost.applications field auto-increments

## API Endpoints Created

- `GET /api/debug/user` - Check current user status
- `POST /api/debug/fix-user-type` - Fix user type to JOB_SEEKER
- `POST /api/debug/reset-onboarding` - Reset onboarding to redo

## Next Steps After Setup

1. **Complete your profile** using the debug endpoints above
2. **Test job applications** as a job seeker
3. **Create a company account** to test the HR dashboard
4. **Post some jobs** to see the full application flow

The system now properly separates company and job seeker experiences with appropriate dashboards and navigation!