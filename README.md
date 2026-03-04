# 📚 Simple Course Management System

## 📌 Project Overview

Simple Course Management System is a scalable backend application designed to demonstrate secure authentication, relational database management, optimized query performance, and clean architecture principles.

The system supports role-based access control (Super Admin, Admin, Teacher, Student) and implements advanced PostgreSQL querying techniques including aggregations, joins, pagination, and indexing optimization on large-scale seeded data (100,000+ records per table).

---

## 🛠️ Tech Stack

- Backend: Node.js + Express.js
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JWT (JSON Web Token)
- Password Hashing: bcrypt
- Language: TypeScript
- Validation: Zod
- Package Manager: NPM

---

## 🏗️ System Architecture

The project follows a modular architecture pattern:

- Route Layer → Handles API routing
- Middleware Layer → Authentication, Authorization, Error handling
- Validation Layer → Input validation
- Controller Layer → Handles request/response logic
- Service Layer → Business logic implementation
- Prisma Layer → Database interaction
- Utility Layer → Helpers and shared utilities
- Global Error Handler → Centralized error handling
- Global Response Handler → Centralized response handling

This structure ensures scalability, maintainability, and separation of concerns.

---

## 🔐 Features

- Authentication
- User Sign Up & Sign In
- CRUD operations for Admins, Students, Teachers, Institutes, Courses, Results, and Dashboards
- Dynamic Query Generation and Pagination
- Database Indexing Optimization
- Role-based access control
- Error Handling and Response Formatting

---

## 📝 Documentation

### Setup & Installation

1. Clone the repository:

```bash
git clone https://github.com/MozzammelRidoy/course_management_app
```

2. Install dependencies:

```bash
npm install
```

3. Update `.env` file and add your PostgreSQL database credentials:

```bash
POSTGRESQL_DATABASE_URL="postgres://138bfa0553135823ee6b42a2c7ad5b970d5fb6d6e38c9a91f0dd0f5870c22faf:sk_KoBC7BNHRAaL-ORT0PaUX@db.prisma.io:5432/Courier_Management_DB?sslmode=require&pool=true"
```

4. Run the database migrations:

```bash
npx prisma migrate dev --name init
```

5. Run the application:

```bash
npm run dev
```

### 📮 Postman Collection

Import the Postman collection to test all APIs: [Download Postman Collection](https://drive.google.com/file/d/1uuJpgrvV3hZq7Fw1PyAhWypYjOSSqVtv/view?usp=sharing)

---

### 📚 Database Schema

- User Schema

```ts
enum Role {
  SUPER_ADMIN
  ADMIN
  TEACHER
  STUDENT
}

// Users Model Definition
model Users {
  id                String    @id @default(uuid())
  email             String    @unique
  phone             String?   @unique
  password          String
  role              Role      @default(STUDENT)
  passwordChangedAt DateTime?
  isActive          Boolean   @default(true)
  isDeleted         Boolean   @default(false)

  // One-to-One relationships
  profile           Profiles?
  student           Students?
  teacher           Teachers?

  // Timestamps
  createdAt         DateTime?  @default(now())
  updatedAt         DateTime?  @updatedAt

  // Indexes
  @@index([role])              // Filter users by role
  @@index([isActive])          // Filter active users
  @@map("users")
}

```

---

- Profile Schema

```ts
enum Gender {
  MALE
  FEMALE
  OTHER
}

// Profile Model Defination
model Profiles {
  id          String   @id @default(uuid())
  userId      String   @unique
  name        String
  bio         String?
  image       Json?    // { secure_url: string, publicId: string }
  gender      Gender?
  dateOfBirth DateTime?
  location    String?

  // One-to-One relationship with Users
  user        Users    @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Indexes
  @@index([userId])            // FK lookup
  @@map("profiles")
}
```

---

- Student Schema

```ts
// Student Model Definations
model Students {
  id             String        @id @default(uuid())
  userId         String        @unique
  instituteId    String

  // One-to-One: Student belongs to ONE User
  user           Users         @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Many-to-One: Student belongs to ONE Institute
  institute      Institutes    @relation(fields: [instituteId], references: [id], onDelete: Cascade)

  // One-to-Many: Student has MANY Results
  results        Results[]

  // Many-to-Many: Student has MANY Courses
  courseLinks    StudentsCourses[]

  // Timestamps
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  // Indexes
  @@index([instituteId])       // FK - filter by institute
  @@map("students")
}

```

---

- Teacher Schema

```ts
// Teachers model definition
model Teachers {
  id           String        @id @default(uuid())
  userId       String        @unique
  instituteId  String
  designation  String?
  department   String?

  // One-to-One: Teacher belongs to ONE User
  user         Users         @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Many-to-One: Teacher belongs to ONE Institute
  institute    Institutes    @relation(fields: [instituteId], references: [id], onDelete: Cascade)

  // Many-to-Many: Teacher teaches MANY Courses
  courseLinks  TeacherCourses[]

  // One-to-Many: Teacher has MANY Results (graded by)
  results      Results[]

  // Timestamps
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  // Indexes & Constraints
  @@index([instituteId])      // FK - filter by institute
  @@index([department])       // Filter by department
  @@map("teachers")
}
```

---

- Institute Schema

```ts
// Institutes model definition
model Institutes {
  id           String   @id @default(uuid())
  name         String
  code         String   @unique
  description  String?
  address      String?
  contact      String?
  email        String?
  website      String?
  establishedAt DateTime?
  isActive     Boolean  @default(true)
  isDeleted    Boolean  @default(false)

  // One-to-Many: Institute has MANY Courses
  students     Students[]
  teachers     Teachers[]
  courses      Courses[]

  // Timestamps
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

 // Indexes & Constraints
  @@index([code])              // Unique lookups (already unique)
  @@index([isActive])          // Filter active institutes
  @@map("institutes")
}
```

---

- Course Schema

```ts
enum CourseLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT
}

enum CourseStatus {
  PENDING
  ONGOING
  ENDED
}
// Course Model Definitions
model Courses {
  id           String       @id @default(uuid())
  instituteId  String
  code         String
  name         String
  description  String?
  credits      Int          @default(3)
  duration     Int          @default(12)
  category     String?
  level        CourseLevel  @default(BEGINNER)
  startDate    DateTime?
  endDate      DateTime?
  status CourseStatus  @default(ONGOING)
  isAvailable  Boolean      @default(true)
  isDeleted    Boolean      @default(false)

  // Many-to-One: Course belongs to ONE Institute
  institute    Institutes      @relation(fields: [instituteId], references: [id], onDelete: Cascade)

  // Many-to-Many: Course has MANY Students
  studentLinks StudentsCourses[]

  // Many-to-Many: Course has MANY Teachers
  teacherLinks TeacherCourses[]

  // One-to-Many: Course has MANY Results
  results      Results[]

  // Timestamps
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt

  // Indexes & Constraints
  @@index([instituteId])     // FK - filter by institute
  @@index([level])           // Filter by level
  @@index([isAvailable])     // Filter available courses
  @@index([category])        // Filter by category
  @@unique([code, instituteId]) // Same course code can exist in different institutes
  @@map("courses")
}

// Students Courses - Junction Table (M:N)
model StudentsCourses {
  id          String       @id @default(uuid())
  studentId   String
  courseId    String
  enrolledAt  DateTime     @default(now())
  status      ResultStatus @default(ENROLLED)

  // One-to-One: Enrollment belongs to ONE Student
  student     Students     @relation(fields: [studentId], references: [id], onDelete: Cascade)
  course      Courses      @relation(fields: [courseId], references: [id], onDelete: Cascade)

  // Timestamps
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  // Indexes & Constraints
  @@unique([studentId, courseId])  // Prevent duplicate enrollments
  @@index([studentId])       // FK lookup
  @@index([courseId])        // FK lookup
  @@index([status])          // Filter by enrollment status
  @@map("students_courses")
}

// Teachers Courses - Junction Table (M:N)
model TeacherCourses {
  id          String   @id @default(uuid())
  teacherId   String
  courseId    String
  assignedAt  DateTime @default(now())

  // One-to-One: Assignment belongs to ONE Teacher
  teacher     Teachers @relation(fields: [teacherId], references: [id], onDelete: Cascade)
  course      Courses  @relation(fields: [courseId], references: [id], onDelete: Cascade)

  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Indexes & Constraints
  @@unique([teacherId, courseId])  // Prevent duplicate assignments
  @@index([teacherId])       // FK lookup
  @@index([courseId])        // FK lookup
  @@map("teacher_courses")
}

```

---

- Result Schema

```ts
enum ResultStatus {
  ENROLLED
  IN_PROGRESS
  COMPLETED
  FAILED
  WITHDRAWN
}

// Results Model Definitions
model Results {
  id           String       @id @default(uuid())
  studentId    String
  courseId     String
  teacherId    String?

  // Grade Information
  score        Float
  grade        String?
  status       ResultStatus @default(ENROLLED)

  // Academic Period
  semester     String?
  academicYear String?

  // Timestamps
  enrolledAt   DateTime     @default(now())
  completedAt  DateTime?
  feedback     String?
  isDeleted    Boolean      @default(false)

  // Many-to-One: Result belongs to ONE Student
  student      Students     @relation(fields: [studentId], references: [id], onDelete: Cascade)

  // Many-to-One: Result belongs to ONE Course
  course       Courses      @relation(fields: [courseId], references: [id], onDelete: Cascade)

  // Many-to-One: Result graded by ONE Teacher (optional)
  teacher      Teachers?    @relation(fields: [teacherId], references: [id], onDelete: SetNull)

  // Timestamps
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt

  // Indexes & Constraints
  @@unique([studentId, courseId, academicYear, semester]) // One result per student per course per semester
  @@index([studentId])       // FK - student's results
  @@index([courseId])        // FK - course results
  @@index([teacherId])       // FK - teacher's graded results
  @@index([score])           // Ranking queries
  @@index([status])          // Filter by status
  @@index([academicYear])    // Filter by year
  @@index([semester])        // Filter by semester
  @@index([studentId, courseId])  // Composite: lookup specific enrollment
  @@index([score, academicYear])  // Composite: ranking per year
  @@map("results")
}
```

---

### 🚀 Indexing Highlights

```prisma
// ================= USERS =================
@@index([role])                    // Fast filtering by user role
@@index([isActive])                // Quickly fetch active users

// ================= PROFILES =================
@@index([userId])                  // Optimized one-to-one user lookup

// ================= STUDENTS =================
@@index([instituteId])             // Filter students by institute

// ================= TEACHERS =================
@@index([instituteId])             // Filter teachers by institute
@@index([department])              // Filter/search by department

// ================= INSTITUTES =================
@@index([code])                    // Fast lookup by institute code
@@index([isActive])                // Filter active institutes

// ================= COURSES =================
@@index([instituteId])             // Filter courses by institute
@@index([level])                   // Filter by course difficulty level
@@index([isAvailable])             // Filter available courses
@@index([category])                // Filter by course category
@@unique([code, instituteId])      // Unique course code per institute

// ================= STUDENTS_COURSES (Junction) =================
@@unique([studentId, courseId])    // Prevent duplicate enrollments
@@index([studentId])               // Student enrollment lookup
@@index([courseId])                // Course enrollment lookup
@@index([status])                  // Filter by enrollment status

// ================= TEACHER_COURSES (Junction) =================
@@unique([teacherId, courseId])    // Prevent duplicate assignments
@@index([teacherId])               // Teacher-course lookup
@@index([courseId])                // Course-teacher lookup

// ================= RESULTS =================
@@unique([studentId, courseId, academicYear, semester]) // One result per student per course per term
@@index([studentId])               // Fetch all results of a student
@@index([courseId])                // Fetch results of a course
@@index([teacherId])               // Fetch graded results by teacher
@@index([score])                   // Optimize ranking queries
@@index([status])                  // Filter by result status
@@index([academicYear])            // Filter by academic year
@@index([semester])                // Filter by semester
@@index([studentId, courseId])     // Fast enrollment lookup
@@index([score, academicYear])     // Ranking per academic year
```

---

### 👤 Default Admin Credentials

Email: `admin@mail.com`  
Password: `admin123`

---

### 🔑 API Documentation

- Application Domain: `http://localhost:5000`
- API Version: `/api/v1`
- API Base URL : `http://localhost:5000/api/v1`
- Header: `authorization` = `Bearer <token>`

---

<!-- API Documentation   -->

### 📚 API Endpoints

<!-- User Login API  -->

1. User Login : (Admin, SuperAdmin, Student and Teacher)

- POST method

```bash
/auth/login
```

- body

```json
{
  "credential": "admin@mail.com",
  // "credential" : "01580325199",
  "password": "admin123"
}
```

- response

```json
{
  "status": 200,
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1N...",
    "refreshToken": "eyJhbGciOiJIU..."
  }
}
```

---

 <!-- Change Password API -->

2. Change Password : (Admin, SuperAdmin, Student and Teacher)

- POST method

```bash
/auth/change-password
```

- body

```json
{
  "oldPassword": "admin123",
  "newPassword": "admin1234"
}
```

- response

```json
{
  "status": 200,
  "success": true,
  "message": "Password changed successfully",
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGciO..."
  }
}
```

---

 <!-- Change Password API -->

3. Generate Access Token : (Admin, Student and Teacher)

- GET method

```bash
/auth/generate-access-token
```

- headers

```json
{
  "authorization": "Bearer `access<token>` footer `refresh<token>`"
}
```

- response

```json
{
  "status": 200,
  "success": true,
  "message": "Access token generated successfully",
  "data": {
    "accessToken": "eyJhbGci..."
  }
}
```

---

<!-- Create Institute API -->

4. Create Institute : (Admin)

- POST method

```bash
/admin/institute-create
```

- body

```json
{
  "name": "Feni Ideal Polytechnic Institute",
  "code": "FIPI-3851",
  "description": "Feni Ideal Polytechnic Institute is Best Learnig Platform.",
  "address": "Shaheb Bazar Feni",
  "contact": "01878470392",
  "email": "fipi@gmail.com",
  "website": "https://www.fipi.com.bd",
  "establishedAt": "2026-01-01",
  "isActive": true
}
```

- response

```json
{
  "status": 201,
  "success": true,
  "message": "Institute created successfully",
  "data": {
    "id": "6541edc8-6ac9-4290-b33e-9503a05cc92b"
    // ...
  }
}
```

---

<!-- Get Institute API -->

5. View Institute : (Admin)

- GET method

```bash
/admin/institutes
```

- query params (dynamic)

```bash
?search=dhaka // search by name and code
&code=FIPI-1017 // Exact code match
&sort=-createdAt // Sorting by Any Filed : createdAt = asc -createdAt = desc
&page=2 // Pagination page
&limit=20 // Pagination limit
&id=d0304372-9c4b-4910-a312-198e7812a463 // Find single Data
&filelds=email // take select fileds
```

- response

```json
{
  "status": 200,
  "success": true,
  "message": "All institutes fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "totalData": 62701,
    "totalPage": 31351
  },
  "data": [
    {
      "id": "6541edc8-6ac9-4290-b33e-9503a05cc92b",
      "name": "Feni Ideal Polytechnic Institute",
      "code": "FIPI-3851",
      "description": "Feni Ideal Polytechnic Institute is Best Learnig Platform.",
      "address": "Shaheb Bazar Feni",
      "contact": "01878470392",
      "email": "fipi@gmail.com",
      "website": "https://www.fipi.com.bd",
      "establishedAt": "2026-01-01T00:00:00.000Z",
      "createdAt": "2026-03-03T21:42:46.627Z",
      "updatedAt": "2026-03-03T21:42:46.627Z"
    },
    {
      //...
    }
  ]
}
```

---

<!-- Get Institute API -->

6. View Institute : (Public)

- GET method

```bash
/institutes
```

- query params (dynamic)

```bash
?search=dhaka // search by name and code
&code=FIPI-1017 // Exact code match
&sort=-createdAt // Sorting by Any Filed : createdAt = asc -createdAt = desc
&page=2 // Pagination page
&limit=20 // Pagination limit
&id=d0304372-9c4b-4910-a312-198e7812a463 // Find single Data
&filelds=email // take select fileds
```

- response

```json
{
  "status": 200,
  "success": true,
  "message": "All institutes fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "totalData": 62701,
    "totalPage": 31351
  },
  "data": [
    {
      "id": "6541edc8-6ac9-4290-b33e-9503a05cc92b",
      "name": "Feni Ideal Polytechnic Institute",
      "code": "FIPI-3851",
      "description": "Feni Ideal Polytechnic Institute is Best Learnig Platform.",
      "address": "Shaheb Bazar Feni",
      "contact": "01878470392",
      "email": "fipi@gmail.com",
      "website": "https://www.fipi.com.bd",
      "establishedAt": "2026-01-01T00:00:00.000Z",
      "createdAt": "2026-03-03T21:42:46.627Z",
      "updatedAt": "2026-03-03T21:42:46.627Z"
    },
    {
      //...
    }
  ]
}
```

---

<!-- User Signup API  -->

7. Student Signup : (Public)

- POST method

```bash
/users/signup
```

- body

```json
{
  "email": "student1@mail.com",
  "password": "studnet123",
  "phone": "01878470004",
  "name": "Mozzammel Ridoy 4",
  "instituteId": "abc3dee9-0703-43c6-a637-f3722f326e3f"
}
```

- response

```json
{
  "status": 201,
  "success": true,
  "message": "User created successfully",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbG..."
  }
}
```

---

<!-- Course Create API  -->

8. Course Create : (Admin)

- POST method

```bash
/admin/course-create
```

- body

```json
{
  "name": "Node JS Development",
  "code": "NODE-back-001",
  "description": "Backend Development with NODE JS and TypeScript",
  "instituteId": "abc3dee9-0703-43c6-a637-f3722f326e3f",
  "credits": 12,
  "duration": 4,
  "category": "Backend Development",
  "level": "ADVANCED",
  "startDate": "2026-03-05",
  "endDate": "2026-09-30",
  "status": "PENDING",
  "isAvailable": true
}
```

- response

```json
{
  "status": 201,
  "success": true,
  "message": "Course Created Successfully",
  "data": {
    "id": "f09280c6-bd73-4316-876a-851858c5338a"
    ...
  }
}
```

---

<!-- View Coruse API -->

9. View Course : (Admin)

- GET method

```bash
/admin/courses
```

- query params (dynamic)

```bash
?search=dhaka // search by name and code
&limit=2 // pagination limit
&page=2 // pagination page
&id=d0304372-9c4b-4910-a312-198e7812a463 // single data by id
&sort=-credits // sort by any filed (asc or desc)
&fields=name // select filed
&isAvailable=true // filter by any filed
&code=WEB-React-005 // Exact match
&status=PENDING // Exact match
&level=BEGINNER // Exact match
&instituteId=abc3dee9-0703-43c6-a637-f3722f326e3f // filter by institute
```

- response

```json
{
  "status": 200,
  "success": true,
  "message": "Courses Fetched Successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "totalData": 64001,
    "totalPage": 6401
  },
  "data": [
    {
      "id": "f09280c6-bd73-4316-876a-851858c5338a",
      "instituteId": "6541edc8-6ac9-4290-b33e-9503a05cc92b",
      "code": "NODE-back-001",
      "name": "Node JS Development",
      "description": "Backend Development with NODE JS and TypeScript",
      "credits": 12,
      "duration": 4,
      "category": "Backend Development",
      "level": "ADVANCED",
      "startDate": "2026-03-05T00:00:00.000Z",
      "endDate": "2026-09-30T00:00:00.000Z",
      "status": "ONGOING",
      "isAvailable": true,
      "createdAt": "2026-03-03T23:34:51.339Z",
      "updatedAt": "2026-03-03T23:39:12.713Z",
      "institute": {
        "name": "Feni Ideal Polytechnic Institute",
        "code": "FIPI-3851"
      }
    },
    {
      //...
    }
  ]
}
```

---

<!-- Course Update API  -->

10. Course Update : (Admin)

- PUT method

```bash
/admin/course-update/:courseId
```

- body

```json
{
  "status": "ONGOING", // "ENDED"
  "isAvailable": true
}
```

- response

```json
{
    "status": 200,
    "success": true,
    "message": "Course Updated Successfully",
    "data": {
        "id": "f09280c6-bd73-4316-876a-851858c5338a",
        ...
    }
}
```

---

<!-- Create Teacher Profile API  -->

11. Create Teacher Profile : (Admin)

- POST method

```bash
/admin/teacher-create
```

- body

```json
{
  "email": "techer1@mail.com",
  "password": "teacher123",
  "phone": "01580325199",
  "name": "Mozzammel Ridoy",
  "instituteId": "6541edc8-6ac9-4290-b33e-9503a05cc92b",
  "courseId": "f09280c6-bd73-4316-876a-851858c5338a"
}
```

- response

```json
{
  "status": 201,
  "success": true,
  "message": "Teacher created successfully",
  "data": {
    "message": "Teacher Profile Created Successfully"
  }
}
```

---

<!-- View Coruse API -->

12. View Offerd Course avoid Enrolled: (Student)

- GET method

```bash
/courses
```

- query params (dynamic)

```bash
?search=dhaka // search by name and code
&limit=2 // pagination limit
&page=2 // pagination page
&id=d0304372-9c4b-4910-a312-198e7812a463 // single data by id
&sort=-credits // sort by any filed (asc or desc)
&fields=name // select filed
&isAvailable=true // filter by any filed
&code=WEB-React-005 // Exact match
&status=PENDING // Exact match
&level=BEGINNER // Exact match
&instituteId=abc3dee9-0703-43c6-a637-f3722f326e3f // filter by institute
&duration=4 // filter by duration
&level=EXPERT // filter by level
```

- response

```json
{
  "status": 200,
  "success": true,
  "message": "Courses Fetched Successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "totalData": 64001,
    "totalPage": 6401
  },
  "data": [
    {
      "id": "f09280c6-bd73-4316-876a-851858c5338a",
      "code": "NODE-back-001",
      "name": "Node JS Development",
      "description": "Backend Development with NODE JS and TypeScript",
      "credits": 12,
      "duration": 4,
      "category": "Backend Development",
      "level": "ADVANCED",
      "startDate": "2026-03-05T00:00:00.000Z",
      "endDate": "2026-09-30T00:00:00.000Z",
      "status": "ONGOING",
      "createdAt": "2026-03-03T23:34:51.339Z",
      "updatedAt": "2026-03-03T23:39:12.713Z",
      "institute": {
        "name": "Feni Ideal Polytechnic Institute",
        "code": "FIPI-3851"
      }
    },
    {
      //...
    }
  ]
}
```

---

<!-- Enroll Course by Student API  -->

13. Course Enrollment : (Student)

- POST method

```bash
/courses/enroll
```

- body

```json
{
  "courseId": "0b096c39-c94d-4f2c-9e01-ba2f30527acd"
}
```

- response

```json
{
  "status": 201,
  "success": true,
  "message": "Course Enrolled Successfully",
  "data": {
    "message": "Course Enrolled Successfully"
  }
}
```

---

<!-- View Coruse API -->

14. Teacher Assigned in Courses: (Teacher)

- GET method

```bash
/teachers/my-courses
```

- query params (dynamic)

```bash
?search=dhaka // search by name and code
&limit=2 // pagination limit
&page=2 // pagination page
&id=d0304372-9c4b-4910-a312-198e7812a463 // single data by id
&sort=-credits // sort by any filed (asc or desc)
&fields=name // select filed
&isAvailable=true // filter by any filed
&code=WEB-React-005 // Exact match
&status=PENDING // Exact match
&level=BEGINNER // Exact match
&instituteId=abc3dee9-0703-43c6-a637-f3722f326e3f // filter by institute
&duration=4 // filter by duration
```

- response

```json
{
  "status": 200,
  "success": true,
  "message": "Fetched all assigned courses by teacher",
  "meta": {
    "page": 1,
    "limit": 10,
    "totalData": 1,
    "totalPage": 1
  },
  "data": [
    {
      "id": "a675e975-eab5-49ff-853c-3fd1fe288ffc",
      "teacherId": "7a02aa9e-8c8f-4793-bf08-5f6b5a183a4a",
      "courseId": "f09280c6-bd73-4316-876a-851858c5338a",
      "assignedAt": "2026-03-03T23:41:52.433Z",
      "createdAt": "2026-03-03T23:41:52.433Z",
      "updatedAt": "2026-03-03T23:41:52.433Z",
      "course": {
        "name": "Node JS Development",
        "description": "Backend Development with NODE JS and TypeScript",
        "category": "Backend Development",
        "level": "ADVANCED",
        "credits": 12,
        "duration": 4,
        "code": "NODE-back-001",
        "startDate": "2026-03-05T00:00:00.000Z",
        "endDate": "2026-09-30T00:00:00.000Z",
        "status": "ONGOING"
      }
    },
    {
      //...
    }
  ]
}
```

---

<!-- View Student API -->

15. View Student Based on Enroll Course: (Teacher)

- GET method

```bash
/teachers/:courseId/students
```

- query params (dynamic)

```bash
?search=dhaka // search by student name email and phone
&limit=2 // pagination limit
&page=2 // pagination page
&id=d0304372-9c4b-4910-a312-198e7812a463 // single data by id
&sort=-createdAt // sort by any filed (asc or desc)
&fields=name // select filed
&courseId=0b096c39-c94d-4f2c-9e01-ba2f30527acd
```

- response

```json
{
  "status": 200,
  "success": true,
  "message": "Fetched all students under the course by teacher",
  "meta": {
    "page": 1,
    "limit": 10,
    "totalData": 1,
    "totalPage": 1
  },
  "data": [
    {
      "courseId": "f09280c6-bd73-4316-876a-851858c5338a",
      "studentId": "8cbcec35-4139-4c5c-95c2-746afd378bbb",
      "email": "student4@mail.com",
      "phone": "01878470004",
      "name": "Mozzammel Ridoy 4",
      "enrolledAt": "2026-03-04T00:12:10.108Z",
      "enrollmentStatus": "COMPLETED",
      "result": [
        {
          "grade": "A-",
          "status": "COMPLETED",
          "score": 70,
          "feedback": "Teacher feedback",
          "academicYear": "2026",
          "semester": "fall",
          "completedAt": "2026-05-31T00:00:00.000Z"
        }
      ]
    },
    {
      //...
    }
  ]
}
```

---

<!-- Course Result Update API  -->

16. Course Result Update : (Teacher)

- PUT method

```bash
/teachers/result-update
```

- body

```json
{
  "courseId": "f09280c6-bd73-4316-876a-851858c5338a",
  "studentId": "8cbcec35-4139-4c5c-95c2-746afd378bbb",
  "result": 70,
  "feedback": "Teacher feedback",
  "academicYear": "2026",
  "semester": "FALL",
  "status": "COMPLETED",
  "completedAt": "2026-05-31"
}
```

- response

```json
{
  "status": 200,
  "success": true,
  "message": "Student Result Updated Successfully",
  "data": {
    "message": "Student Result Updated Successfully. The Grade is : A-"
  }
}
```

---

<!-- View Coruse API -->

17. Student Enrolled Courses : (Student)

- GET method

```bash
/students/my-courses
```

- query params (dynamic)

```bash
?search=dhaka // search by name and code
&limit=2 // pagination limit
&page=2 // pagination page
&id=d0304372-9c4b-4910-a312-198e7812a463 // single data by id
&sort=-credits // sort by any filed (asc or desc)
&fields=name // select filed
&isAvailable=true // filter by any filed
&code=WEB-React-005 // Exact match
&status=PENDING // Exact match
&level=BEGINNER // Exact match
&duration=4 // filter by duration
```

- response

```json
{
  "status": 200,
  "success": true,
  "message": "Retrived My All Enrolled Courses",
  "meta": {
    "page": 1,
    "limit": 10,
    "totalData": 1,
    "totalPage": 1
  },
  "data": [
    {
      "id": "a12f6369-e19f-4211-826a-b88f7c34c5f9",
      "studentId": "8cbcec35-4139-4c5c-95c2-746afd378bbb",
      "courseId": "f09280c6-bd73-4316-876a-851858c5338a",
      "enrolledAt": "2026-03-04T00:12:10.108Z",
      "status": "COMPLETED",
      "createdAt": "2026-03-04T00:12:10.108Z",
      "updatedAt": "2026-03-04T00:24:39.902Z",
      "course": {
        "name": "Node JS Development",
        "duration": 4,
        "credits": 12,
        "endDate": "2026-09-30T00:00:00.000Z",
        "startDate": "2026-03-05T00:00:00.000Z",
        "code": "NODE-back-001",
        "status": "ONGOING"
      }
    },
    {
      //...
    }
  ]
}
```

---

<!-- View Result API -->

18. View Own Result : (Student)

- GET method

```bash
/students/my-results
```

- query params (dynamic)

```bash
?search=dhaka // search by name and code
&limit=2 // pagination limit
&page=2 // pagination page
&id=d0304372-9c4b-4910-a312-198e7812a463 // single data by id
&sort=-score // sort by any filed (asc or desc)
&fields=name // select filed
&isAvailable=true // filter by any filed
&grade=A // Exact match
&status=COMPLETED // Exact match
&level=BEGINNER // Exact match
&academicYear=2025 // filter by duration
```

- response

```json
{
  "status": 200,
  "success": true,
  "message": "Retrived All Results",
  "meta": {
    "page": 1,
    "limit": 10,
    "totalData": 1,
    "totalPage": 1
  },
  "data": [
    {
      "id": "e2cdb5a6-f648-4d7f-8caf-56ea0cf17599",
      "score": 70,
      "grade": "A-",
      "status": "COMPLETED",
      "semester": "fall",
      "academicYear": "2026",
      "enrolledAt": "2026-03-04T00:24:09.514Z",
      "completedAt": "2026-05-31T00:00:00.000Z",
      "feedback": "Teacher feedback",
      "course": {
        "id": "f09280c6-bd73-4316-876a-851858c5338a",
        "code": "NODE-back-001",
        "name": "Node JS Development",
        "credits": 12,
        "duration": 4,
        "level": "ADVANCED",
        "category": "Backend Development",
        "startDate": "2026-03-05T00:00:00.000Z",
        "endDate": "2026-09-30T00:00:00.000Z",
        "status": "ONGOING"
      }
    },
    {
      //...
    }
  ]
}
```

---

<!-- View Student Result per Institute API -->

19. View Students Results per Institute : (Admin)

- GET method

```bash
/admin/students-result/:instituteId
```

- query params (dynamic)

```bash
?search=dhaka // search by Student name, email and phone
&limit=2 // pagination limit
&page=2 // pagination page
&id=d0304372-9c4b-4910-a312-198e7812a463 // single data by id
&sort=-score // sort by any filed (asc or desc)
&fields=name // select filed
&isAvailable=true // filter by any filed
&grade=A // Exact match
&status=COMPLETED // Exact match
&level=BEGINNER // Exact match
&academicYear=2025 // filter by duration
```

- response

```json
{
  "status": 200,
  "success": true,
  "message": "Student result fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "totalData": 1,
    "totalPage": 1
  },
  "data": [
    {
      "id": "e2cdb5a6-f648-4d7f-8caf-56ea0cf17599",
      "score": 70,
      "grade": "A-",
      "status": "COMPLETED",
      "semester": "fall",
      "academicYear": "2026",
      "enrolledAt": "2026-03-04T00:24:09.514Z",
      "completedAt": "2026-05-31T00:00:00.000Z",
      "feedback": "Teacher feedback",
      "createdAt": "2026-03-04T00:24:09.514Z",
      "updatedAt": "2026-03-04T00:24:39.894Z",
      "student": {
        "institute": {
          "name": "Feni Ideal Polytechnic Institute",
          "code": "FIPI-3851"
        },
        "user": {
          "id": "2247c2b9-d06a-4c1a-8a70-f807fac1ee89",
          "email": "student4@mail.com",
          "phone": "01878470004",
          "profile": {
            "name": "Mozzammel Ridoy 4"
          }
        }
      },
      "course": {
        "id": "f09280c6-bd73-4316-876a-851858c5338a",
        "name": "Node JS Development",
        "code": "NODE-back-001",
        "credits": 12
      },
      "teacher": {
        "user": {
          "id": "4b7e87b3-0f3f-46e4-b2b5-5f72d95f1f99",
          "profile": {
            "name": "Mozzammel Ridoy"
          }
        }
      }
    },
    {
      //...
    }
  ]
}
```

---

<!-- View Top Courses per Year API -->

20. View Top Courses per Year : (Admin)

- GET method

```bash
/admin/top-courses
```

- query params

```bash
?year=2026 // filter by year
&limit=10 // data limit define
```

- response

```json
{
  "status": 200,
  "success": true,
  "message": "Top courses fetched successfully",
  "data": [
    {
      "courseId": "51074c9c-7e1b-48f8-9ff7-a0de7248aa29",
      "courseName": "Practical Mobile Development",
      "courseCode": "CS016001",
      "courseCredits": 5,
      "courseDuration": 17,
      "courseLevel": "BEGINNER",
      "courseStatus": "PENDING",
      "year": "2026",
      "totalStudents": "8"
    },
    {
      //...
    }
  ]
}
```

---

<!-- View Top Ranking Student API -->

21. View Top Ranking Student : (Admin)

- GET method

```bash
/admin/top-ranking-students
```

- query params

```bash
&limit=10 // data limit define
```

- response

```json
{
  "status": 200,
  "success": true,
  "message": "Top ranking student fetched successfully",
  "data": [
    {
      "studentId": "2812555a-ca62-4b08-b63f-a9bc8324c2f2",
      "studentName": "Lisa Rodriguez",
      "totalMarks": 393.34999999999997,
      "rank": "1"
    },
    {
      "studentId": "9bcb8a34-edaf-49f1-b950-4a25d8f2c36e",
      "studentName": "Ashley Johnson",
      "totalMarks": 390.84,
      "rank": "2"
    },
    {
      //...
    }
  ]
}
```

---

<!-- View Onwn Profile -->

22. View Own Profile : (Admin, SuperAdmin, Student, Teacher)

- GET method

```bash
/users/me
```

- response

```json
{
  "status": 200,
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "id": "2247c2b9-d06a-4c1a-8a70-f807fac1ee89",
    "email": "student4@mail.com",
    "phone": "01878470004",
    "isActive": true,
    "role": "STUDENT",
    "createdAt": "2026-03-03T23:31:13.256Z",
    "updatedAt": "2026-03-03T23:31:13.256Z",
    "passwordChangedAt": null,
    "profile": {
      "name": "Mozzammel Ridoy 4",
      "bio": null,
      "image": null,
      "gender": null,
      "location": null,
      "dateOfBirth": null
    }
  }
}
```

---

<!-- Seed Insert Million Data API  -->

23. Seed insert Million Data : (Admin)

- POST method

```bash
/auth/login
```

- body

```json
{
  "startNumber": 1,
  "endNumber": 20000 //⚠️ Recommended 20000. It's performance issue based on PC Memory.
}
```

- response

```json
{
  "status": 201,
  "success": true,
  "message": "Data inserted successfully",
  "data": {
    "success": true,
    "duration": "16.74s",
    "totalRecords": 884,
    "breakdown": {
      "institutes": 96,
      "users": 96,
      "profiles": 96,
      "students": 61,
      "teachers": 25,
      "courses": 96,
      "studentEnrollments": 168,
      "teacherAssignments": 78,
      "results": 168
    },
    "usersByRole": {
      "STUDENT": 61,
      "TEACHER": 25,
      "ADMIN": 7,
      "SUPER_ADMIN": 3
    }
  }
}
```

---
