# Construction Company Web Application - Data Models

## Overview

This document outlines the data models used in the 3XBANG construction company web application.

## User Model

- `id`: Unique identifier (Number)
- `firstName`: User's first name (String)
- `lastName`: User's last name (String)
- `email`: User's email address (String, unique)
- `password`: Hashed password (String, not returned in API responses)
- `role`: User role (String: 'admin', 'manager', 'employee', 'client')
- `phone`: Phone number (String, optional)
- `createdAt`: Account creation timestamp (Date)
- `updatedAt`: Last update timestamp (Date)

## Project Model

- `id`: Unique identifier (Number)
- `title`: Project title (String)
- `description`: Detailed project description (String)
- `location`: Project location/address (String)
- `client`: Client name or reference to Client model (String/Reference)
- `startDate`: Project start date (Date)
- `endDate`: Expected or actual completion date (Date)
- `status`: Current project status (String: 'planned', 'in-progress', 'completed', 'on-hold', 'cancelled')
- `budget`: Total project budget (Number)
- `actualCost`: Current or final cost (Number)
- `imageUrl`: Main project image URL (String)
- `features`: List of project features (Array of Strings)
- `tasks`: Associated tasks/milestones (Array of Task references)
- `team`: Team members assigned to the project (Array of User references)
- `gallery`: Project images (Array of Image objects)
- `documents`: Project documents (Array of Document objects)
- `createdAt`: Creation timestamp (Date)
- `updatedAt`: Last update timestamp (Date)

## Client Model

- `id`: Unique identifier (Number)
- `name`: Company or individual name (String)
- `contactPerson`: Primary contact name (String)
- `email`: Contact email (String)
- `phone`: Contact phone number (String)
- `address`: Physical address (String)
- `projects`: Associated projects (Array of Project references)
- `notes`: Additional client information (String)
- `createdAt`: Creation timestamp (Date)
- `updatedAt`: Last update timestamp (Date)

## Employee Model

- `id`: Unique identifier (Number)
- `userId`: Reference to User model (Reference)
- `firstName`: Employee's first name (String)
- `lastName`: Employee's last name (String)
- `position`: Job title/position (String)
- `department`: Department (String)
- `email`: Work email (String)
- `phone`: Work phone (String)
- `hireDate`: Date of hiring (Date)
- `projects`: Assigned projects (Array of Project references)
- `skills`: Professional skills (Array of Strings)
- `certifications`: Professional certifications (Array of Strings)
- `createdAt`: Creation timestamp (Date)
- `updatedAt`: Last update timestamp (Date)

## Salary Model

- `id`: Unique identifier (Number)
- `employeeId`: Reference to Employee model (Reference)
- `month`: Salary month (String, format: YYYYMM)
- `baseSalary`: Base salary amount (Number)
- `overtime`: Overtime payment (Number)
- `bonus`: Bonus payment (Number)
- `attendance`: Attendance bonus (Number)
- `deductions`: Total deductions (Number)
- `tax`: Tax amount (Number)
- `insurance`: Insurance amount (Number)
- `actualSalary`: Final salary after all calculations (Number)
- `estimatedSalary`: Projected salary based on current performance (Number)
- `salaryTrend`: Indicator of salary trend (String: 'up', 'down', 'stable')
- `trendReason`: Description of reasons for trend (String)
- `paymentDate`: Date when salary was/will be paid (Date)
- `paymentStatus`: Status of payment (String: 'pending', 'processed', 'completed')
- `createdAt`: Creation timestamp (Date)
- `updatedAt`: Last update timestamp (Date)

## Daily Work Record Model

- `id`: Unique identifier (Number)
- `employeeId`: Reference to Employee model (Reference)
- `date`: Work date (Date)
- `weekday`: Day of the week (String)
- `clockIn`: Clock in time (String, format: HH:MM)
- `clockOut`: Clock out time (String, format: HH:MM)
- `workHours`: Total work hours (Number)
- `overtime`: Overtime hours (Number)
- `overtimePay`: Calculated overtime pay (Number)
- `status`: Attendance status (String: 'normal', 'late', 'early', 'absent', 'overtime')
- `note`: Additional notes or comments (String)
- `createdAt`: Creation timestamp (Date)
- `updatedAt`: Last update timestamp (Date)

## Attendance Model

- `id`: Unique identifier (Number)
- `employeeId`: Reference to Employee model (Reference)
- `month`: Attendance month (String, format: YYYYMM)
- `stats`: Attendance statistics (Object)
  - `normalDays`: Number of days with normal attendance (Number)
  - `lateDays`: Number of days with late arrival (Number)
  - `earlyDays`: Number of days with early departure (Number)
  - `absentDays`: Number of days absent (Number)
  - `overtimeDays`: Number of days with overtime (Number)
- `records`: Daily attendance records (Array of Daily Work Record references)
- `createdAt`: Creation timestamp (Date)
- `updatedAt`: Last update timestamp (Date)

## Attendance Correction Model

- `id`: Unique identifier (Number)
- `employeeId`: Reference to Employee model (Reference)
- `date`: Date to correct (Date)
- `type`: Type of correction (String: 'clockIn', 'clockOut', 'absent')
- `reason`: Reason for correction request (String)
- `status`: Status of correction request (String: 'pending', 'approved', 'rejected')
- `approvedBy`: Reference to User who approved/rejected (Reference)
- `actionDate`: Date of approval/rejection (Date)
- `createdAt`: Creation timestamp (Date)
- `updatedAt`: Last update timestamp (Date)

## Leave Application Model

- `id`: Unique identifier (Number)
- `employeeId`: Reference to Employee model (Reference)
- `type`: Type of leave (String: 'sick', 'personal', 'annual', 'marriage', 'maternity', 'funeral')
- `startDateTime`: Start date and time (Date)
- `endDateTime`: End date and time (Date)
- `hours`: Total leave hours (Number)
- `reason`: Reason for leave (String)
- `status`: Status of application (String: 'pending', 'approved', 'rejected', 'cancelled')
- `statusClass`: CSS class for styling (String: 'status-pending', 'status-approved', 'status-rejected')
- `approvedBy`: Reference to User who approved/rejected (Reference)
- `actionDate`: Date of approval/rejection (Date)
- `createdAt`: Creation timestamp (Date)
- `updatedAt`: Last update timestamp (Date)

## Task Model

- `id`: Unique identifier (Number)
- `projectId`: Reference to Project model (Reference)
- `title`: Task title (String)
- `description`: Task description (String)
- `assignedTo`: Assigned employee/team (Reference or Array of References)
- `startDate`: Task start date (Date)
- `dueDate`: Task due date (Date)
- `completedDate`: Actual completion date (Date)
- `status`: Task status (String: 'pending', 'in-progress', 'completed', 'delayed')
- `priority`: Task priority (String: 'low', 'medium', 'high', 'critical')
- `dependencies`: Tasks that must be completed before this one (Array of Task references)
- `attachments`: Related documents/files (Array of Document references)
- `createdAt`: Creation timestamp (Date)
- `updatedAt`: Last update timestamp (Date)

## Document Model

- `id`: Unique identifier (Number)
- `projectId`: Associated project (Reference)
- `name`: Document name/title (String)
- `description`: Document description (String)
- `fileUrl`: URL to the stored file (String)
- `fileType`: Type of document (String: 'contract', 'blueprint', 'permit', 'invoice', etc.)
- `uploadedBy`: User who uploaded the document (Reference)
- `uploadedAt`: Upload timestamp (Date)
- `version`: Document version (Number)
- `tags`: Document tags for categorization (Array of Strings)

## Image Model

- `id`: Unique identifier (Number)
- `projectId`: Associated project (Reference)
- `url`: Image URL (String)
- `thumbnail`: Thumbnail URL (String)
- `caption`: Image description/caption (String)
- `uploadedBy`: User who uploaded the image (Reference)
- `uploadedAt`: Upload timestamp (Date)
- `order`: Display order in gallery (Number)
- `tags`: Image tags for categorization (Array of Strings)

## Contact Submission Model

- `id`: Unique identifier (Number)
- `name`: Sender's name (String)
- `email`: Sender's email address (String)
- `phone`: Sender's phone number (String)
- `message`: Contact message content (String)
- `projectType`: Type of project interested in (String)
- `status`: Submission status (String: 'new', 'in-review', 'contacted', 'closed')
- `assignedTo`: Employee assigned to follow up (Reference)
- `createdAt`: Submission timestamp (Date)
- `updatedAt`: Last update timestamp (Date)

## Relationships

- A User can be associated with multiple Projects (one-to-many)
- A Project belongs to one Client (many-to-one)
- A Project can have multiple Tasks (one-to-many)
- A Project can have multiple Team members/Employees (many-to-many)
- A Project can have multiple Documents and Images (one-to-many)
- An Employee can be assigned to multiple Projects (many-to-many)
- A Task belongs to one Project (many-to-one)
- A Task can be assigned to multiple Employees (many-to-many)
- A Document belongs to one Project (many-to-one)
- An Image belongs to one Project (many-to-one)
- An Employee has multiple Salary records (one-to-many)
- An Employee has multiple Daily Work Records (one-to-many)
- An Employee has multiple Attendance records (one-to-many)
- An Employee can submit multiple Attendance Corrections (one-to-many)
- An Employee can submit multiple Leave Applications (one-to-many)