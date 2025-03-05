# Construction Company Web Application - API Documentation

## Overview

This document outlines the API endpoints for the 3XBANG construction company web application. The API provides functionality for both the internal management system and the public-facing website.

## Authentication

### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Parameters**:
  - `email`: User email
  - `password`: User password
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": 1,
        "firstName": "Admin",
        "lastName": "User",
        "email": "admin@example.com",
        "role": "admin"
      },
      "token": "jwt_token_here"
    }
  }
  ```

### Logout
- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Authentication**: Required
- **Response**:
  ```json
  {
    "success": true
  }
  ```

## Projects

### Get All Projects
- **URL**: `/api/projects`
- **Method**: `GET`
- **Authentication**: Optional (returns limited data for unauthenticated users)
- **Query Parameters**:
  - `status`: Filter by project status (`in-progress`, `completed`, `planned`)
  - `page`: Page number for pagination
  - `limit`: Number of results per page
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "projects": [
        {
          "id": 1,
          "title": "Modern Office Building",
          "description": "A 10-story modern office building with glass facade and sustainable features.",
          "location": "Downtown Business District",
          "client": "TechCorp Inc.",
          "startDate": "2023-01-15",
          "endDate": "2024-06-30",
          "status": "in-progress",
          "budget": 15000000,
          "imageUrl": "/project1.jpg",
          "features": ["LEED Certified", "Smart Building Systems", "Rooftop Garden"]
        },
        // More projects...
      ],
      "pagination": {
        "total": 15,
        "page": 1,
        "limit": 10,
        "pages": 2
      }
    }
  }
  ```

### Get Project by ID
- **URL**: `/api/projects/:id`
- **Method**: `GET`
- **Authentication**: Optional (returns limited data for unauthenticated users)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "project": {
        "id": 1,
        "title": "Modern Office Building",
        "description": "A 10-story modern office building with glass facade and sustainable features.",
        "location": "Downtown Business District",
        "client": "TechCorp Inc.",
        "startDate": "2023-01-15",
        "endDate": "2024-06-30",
        "status": "in-progress",
        "budget": 15000000,
        "imageUrl": "/project1.jpg",
        "features": ["LEED Certified", "Smart Building Systems", "Rooftop Garden"],
        "tasks": [
          {
            "id": 1,
            "title": "Foundation Work",
            "status": "completed",
            "dueDate": "2023-03-15"
          },
          // More tasks...
        ],
        "gallery": [
          {
            "id": 1,
            "url": "/project1-image1.jpg",
            "caption": "Building foundation"
          },
          // More images...
        ]
      }
    }
  }
  ```

### Create Project
- **URL**: `/api/projects`
- **Method**: `POST`
- **Authentication**: Required (Admin only)
- **Request Body**:
  ```json
  {
    "title": "New Shopping Center",
    "description": "A modern shopping center with 50 retail spaces",
    "location": "East Side Commercial District",
    "client": "Retail Developers LLC",
    "startDate": "2023-09-01",
    "endDate": "2024-12-31",
    "budget": 20000000,
    "features": ["Underground Parking", "Food Court", "Cinema"]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "project": {
        "id": 4,
        "title": "New Shopping Center",
        // Other project details...
      }
    }
  }
  ```

### Update Project
- **URL**: `/api/projects/:id`
- **Method**: `PUT`
- **Authentication**: Required (Admin only)
- **Request Body**: Same as Create Project (partial updates allowed)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "project": {
        "id": 4,
        // Updated project details...
      }
    }
  }
  ```

### Delete Project
- **URL**: `/api/projects/:id`
- **Method**: `DELETE`
- **Authentication**: Required (Admin only)
- **Response**:
  ```json
  {
    "success": true
  }
  ```

## Clients

### Get All Clients
- **URL**: `/api/clients`
- **Method**: `GET`
- **Authentication**: Required (Admin only)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "clients": [
        {
          "id": 1,
          "name": "TechCorp Inc.",
          "contactPerson": "John Smith",
          "email": "john.smith@techcorp.example",
          "phone": "555-123-4567",
          "projects": [1]
        },
        // More clients...
      ]
    }
  }
  ```

### CRUD operations for Clients
Additional endpoints include:
- `GET /api/clients/:id`
- `POST /api/clients`
- `PUT /api/clients/:id`
- `DELETE /api/clients/:id`

## Employees

### Get All Employees
- **URL**: `/api/employees`
- **Method**: `GET`
- **Authentication**: Required (Admin only)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "employees": [
        {
          "id": 1,
          "firstName": "Sarah",
          "lastName": "Johnson",
          "position": "Project Manager",
          "email": "sarah.johnson@buildcraft.example",
          "phone": "555-987-6543",
          "projects": [1, 2]
        },
        // More employees...
      ]
    }
  }
  ```

### CRUD operations for Employees
Additional endpoints include:
- `GET /api/employees/:id`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`

## Salary System

### Get Salary Data
- **URL**: `/api/salary`
- **Method**: `GET`
- **Authentication**: Required
- **Query Parameters**:
  - `month`: Salary month in format YYYYMM (e.g., 202310)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "baseSalary": 15000,
      "overtime": 1200,
      "bonus": 800,
      "attendance": 500,
      "deductions": 450,
      "tax": 1500,
      "insurance": 750,
      "actualSalary": 14800,
      "estimatedSalary": 16400,
      "salaryTrend": "up",
      "trendReason": "High overtime with no absences",
      "dailyRecords": [
        {
          "date": "2023-10-01",
          "workHours": 10,
          "overtime": 2,
          "overtimePay": 100
        },
        // More daily records...
      ]
    }
  }
  ```

### Get Salary History
- **URL**: `/api/salary/history`
- **Method**: `GET`
- **Authentication**: Required
- **Query Parameters**:
  - `limit`: Number of months to return (default: 6)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "history": [
        {
          "month": "202310",
          "totalSalary": 14800,
          "baseSalary": 15000,
          "overtime": 1200,
          "bonus": 800
        },
        // More monthly records...
      ]
    }
  }
  ```

## Attendance System

### Get Attendance Data
- **URL**: `/api/attendance`
- **Method**: `GET`
- **Authentication**: Required
- **Query Parameters**:
  - `month`: Attendance month in format YYYYMM (e.g., 202310)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "stats": {
        "normalDays": 18,
        "lateDays": 2,
        "earlyDays": 1,
        "absentDays": 1,
        "overtimeDays": 5
      },
      "records": [
        {
          "date": "2023-10-01",
          "weekday": "周一",
          "clockIn": "08:05",
          "clockOut": "17:30",
          "workHours": 8,
          "status": "normal",
          "note": "正常出勤"
        },
        // More daily records...
      ],
      "calendarDays": [
        // Calendar data for UI rendering
      ]
    }
  }
  ```

### Submit Attendance Correction
- **URL**: `/api/attendance/correction`
- **Method**: `POST`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "date": "2023-10-05",
    "type": "clockIn",
    "reason": "门禁卡失效，实际到岗时间为8:00"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "更正申请已提交，请等待审核"
  }
  ```

## Leave Application System

### Get Leave History
- **URL**: `/api/leave/history`
- **Method**: `GET`
- **Authentication**: Required
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "leaveHistory": [
        {
          "id": 1,
          "type": "sick",
          "startDateTime": "2023-10-05 09:00",
          "endDateTime": "2023-10-06 18:00",
          "hours": 16,
          "reason": "感冒发烧",
          "status": "已批准",
          "appliedAt": "2023-10-04 16:30"
        },
        // More leave records...
      ]
    }
  }
  ```

### Submit Leave Application
- **URL**: `/api/leave/apply`
- **Method**: `POST`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "type": "personal",
    "startDate": "2023-11-10",
    "startTime": "09:00",
    "endDate": "2023-11-10",
    "endTime": "18:00",
    "reason": "个人事务"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "leaveId": 5,
      "status": "已批准",
      "message": "请假申请已自动批准"
    }
  }
  ```

### Cancel Leave Application
- **URL**: `/api/leave/:id/cancel`
- **Method**: `POST`
- **Authentication**: Required
- **Response**:
  ```json
  {
    "success": true,
    "message": "请假申请已取消"
  }
  ```

## Contact Form

### Submit Contact Form
- **URL**: `/api/contact`
- **Method**: `POST`
- **Authentication**: Not required
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "555-789-0123",
    "message": "I'd like to discuss a potential office building project.",
    "projectType": "Commercial"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Your message has been sent. We'll get back to you soon."
  }
  ```

## Error Handling

All API endpoints return error responses in the following format:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "The email or password provided is incorrect."
  }
}
```

Common error codes:
- `UNAUTHORIZED`: User is not authenticated
- `FORBIDDEN`: User does not have permission
- `NOT_FOUND`: Requested resource not found
- `VALIDATION_ERROR`: Invalid input data
- `SERVER_ERROR`: Internal server error 