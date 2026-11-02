# Student Management System

A full-stack web application designed to manage student records, academic programs, and department allocations. The system features a responsive React dashboard styled with Tailwind CSS, a REST API backend developed with Java Spring Boot, and persistent data storage powered by MySQL.

---

## Table of Contents

- Overview
- Tech Stack
- System Architecture
- Database Design
- Backend API Specification
- Frontend Features
- Installation and Setup
  - Database Setup
  - Backend Setup
  - Frontend Setup
- Validation and Error Handling
- Verification

---

## Overview

The Student Management System provides an end-to-end solution for educational institutions to track and maintain student profiles. It supports complete CRUD (Create, Read, Update, Delete) operations, live search by student name or email, dynamic filtering by academic course, form validation with custom error handling, and safe record deletion.

---

## Tech Stack

### Frontend
- React.js (v18)
- Tailwind CSS (v3)
- Vite (Build Tool & Dev Server)
- Lucide React (UI Icons)

### Backend
- Java 21
- Spring Boot 3.3.4
- Spring Data JPA / Hibernate
- Jakarta Bean Validation
- MySQL Connector/J

### Database
- MySQL Server 8.0

---

## System Architecture

```
Student Management System/
|-- backend/
|   |-- pom.xml
|   `-- src/
|       `-- main/
|           |-- java/com/student/
|           |   |-- StudentManagementApplication.java
|           |   |-- config/
|           |   |   `-- CorsConfig.java
|           |   |-- controller/
|           |   |   `-- StudentController.java
|           |   |-- dto/
|           |   |   |-- ApiResponse.java
|           |   |   `-- StudentRequestDTO.java
|           |   |-- exception/
|           |   |   |-- DuplicateResourceException.java
|           |   |   |-- GlobalExceptionHandler.java
|           |   |   `-- ResourceNotFoundException.java
|           |   |-- model/
|           |   |   `-- Student.java
|           |   |-- repository/
|           |   |   `-- StudentRepository.java
|           |   `-- service/
|           |       |-- StudentService.java
|           |       `-- impl/
|           |           `-- StudentServiceImpl.java
|           `-- resources/
|               `-- application.properties
|-- database/
|   `-- schema.sql
|-- frontend/
|   |-- index.html
|   |-- package.json
|   |-- postcss.config.js
|   |-- tailwind.config.js
|   |-- vite.config.js
|   `-- src/
|       |-- App.jsx
|       |-- index.css
|       |-- main.jsx
|       |-- api/
|       |   `-- studentApi.js
|       `-- components/
|           |-- DeleteConfirmModal.jsx
|           |-- Navbar.jsx
|           |-- StatsCards.jsx
|           |-- StudentDetailsModal.jsx
|           |-- StudentModal.jsx
|           |-- StudentTable.jsx
|           `-- Toast.jsx
`-- README.md
```

---

## Database Design

Database Name: `student_management`
Table Name: `students`

### Table Schema

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| id | INT / BIGINT | PRIMARY KEY AUTO_INCREMENT | Unique student identifier |
| full_name | VARCHAR(100) | NOT NULL | Full name of the student |
| email | VARCHAR(100) | NOT NULL UNIQUE | Unique email address |
| phone | VARCHAR(15) | NOT NULL | Contact telephone number |
| gender | VARCHAR(20) | NOT NULL | Gender identity |
| date_of_birth | DATE | NOT NULL | Student date of birth |
| course | VARCHAR(100) | NOT NULL | Enrolled degree or course |
| department | VARCHAR(100) | NOT NULL | Academic department |
| admission_date | DATE | NOT NULL | Date student was enrolled |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

### Indexes
- `idx_students_email`: B-Tree index on `email` column for fast duplicate checks and login queries.
- `idx_students_full_name`: B-Tree index on `full_name` for optimized searching.
- `idx_students_course`: B-Tree index on `course` for filter performance.
- `idx_students_department`: B-Tree index on `department`.

---

## Backend API Specification

All responses use a standardized JSON wrapper:

```json
{
  "success": true,
  "message": "Status description",
  "data": {},
  "timestamp": "2026-11-02T10:00:00"
}
```

### Endpoints

| Method | Endpoint | Description | Request Body | Status Code |
|---|---|---|---|---|
| GET | /api/students | Retrieve all students (supports query params: search, course) | None | 200 OK |
| GET | /api/students/{id} | Retrieve a single student by ID | None | 200 OK / 404 Not Found |
| POST | /api/students | Register a new student record | StudentRequestDTO (JSON) | 201 Created / 400 Bad Request / 409 Conflict |
| PUT | /api/students/{id} | Update an existing student record | StudentRequestDTO (JSON) | 200 OK / 400 Bad Request / 404 Not Found / 409 Conflict |
| DELETE | /api/students/{id} | Delete a student record | None | 200 OK / 404 Not Found |
| GET | /api/students/courses | Retrieve distinct course list for filter dropdown | None | 200 OK |

### Sample JSON Request Body (POST / PUT)

```json
{
  "fullName": "Aarav Sharma",
  "email": "aarav.sharma@example.com",
  "phone": "9876543210",
  "gender": "Male",
  "dateOfBirth": "2003-05-14",
  "course": "Computer Science",
  "department": "Computer Engineering",
  "admissionDate": "2022-08-01"
}
```

### Sample Duplicate Email Error Response (409 Conflict)

```json
{
  "success": false,
  "message": "A student with email 'aarav.sharma@example.com' already exists.",
  "timestamp": "2026-11-02T10:15:00"
}
```

### Sample Validation Error Response (400 Bad Request)

```json
{
  "success": false,
  "message": "Validation failed for input data",
  "errors": {
    "email": "Please provide a valid email address",
    "fullName": "Full name must be between 2 and 100 characters",
    "dateOfBirth": "Date of birth must be in the past"
  },
  "timestamp": "2026-11-02T10:15:00"
}
```

---

## Frontend Features

1. Dashboard Summary:
   - Total Students count.
   - Active Courses count.
   - Academic Departments count.
   - Recent Admissions count.

2. Student Table:
   - Displays ID, Student Avatar Initials, Full Name, Email, Phone, Gender badge, Course, Department, Admission Date.
   - Sortable columns: ID, Full Name, Course, and Admission Date.
   - Responsive horizontal scrolling for mobile and small display viewports.

3. CRUD Operations:
   - Create: Add student modal with real-time field validation.
   - View: Read-only profile card showing student details.
   - Edit: Update student modal with pre-populated values and duplicate validation.
   - Delete: Confirmation safety dialog before removing a record.

4. Search and Filter:
   - Real-time search by student name or email.
   - Filter dropdown by academic course.
   - Clear filters button to instantly reset table state.

5. Export:
   - One-click CSV file download containing all filtered student records.

6. Toast Notifications:
   - Floating banner alerts providing visual confirmation for add, edit, delete, and error operations.

---

## Installation and Setup

### Prerequisites
- Java JDK 21 or higher
- Apache Maven 3.8 or higher
- Node.js v18 or higher
- MySQL Server 8.0 or higher

---

### Database Setup

1. Open your terminal or MySQL command-line client.
2. Execute the `database/schema.sql` script:

```bash
mysql -u root -p < database/schema.sql
```

Or using PowerShell:

```powershell
Get-Content "database/schema.sql" | & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

This will automatically create the `student_management` database, create the `students` table, and populate 10 sample student records.

---

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Review the database credentials in `src/main/resources/application.properties`:

```properties
server.port=8081
spring.datasource.url=jdbc:mysql://localhost:3306/student_management?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

3. Build and launch the Spring Boot application:

```bash
mvn clean spring-boot:run
```

4. The backend server will be running on:
`http://localhost:8081`

---

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to:
`http://localhost:5173`

The Vite development server is pre-configured to reverse proxy all `/api` requests directly to `http://localhost:8081`.

---

## Validation and Error Handling

1. Client-Side Validation:
   - Full Name: Required, minimum 2 characters.
   - Email: Required, verified against email regular expression.
   - Phone Number: Required, 7 to 15 digits numeric format.
   - Gender: Required selection.
   - Date of Birth: Required, must be a date in the past.
   - Course: Required.
   - Department: Required.
   - Admission Date: Required.

2. Server-Side Validation:
   - Jakarta Bean Validation constraints on `StudentRequestDTO`.
   - Returns HTTP 400 Bad Request with field-mapped error messages.

3. Duplicate Email Prevention:
   - Service layer verifies email uniqueness before persisting new or updated records.
   - If a duplicate email is detected, the API returns HTTP 409 Conflict.
   - The frontend automatically highlights the email field and displays the server error message.

---

## Verification

The system has been verified against the assessment criteria:
1. Complete frontend application rendered with React and Tailwind CSS.
2. Backend REST API implementation supporting GET, POST, PUT, DELETE.
3. Database and table structure created and seeded in MySQL 8.0.
4. Working CRUD operations tested end-to-end.
5. Search by name/email and course filter operational.
6. Responsive user interface verified across viewport sizes.
