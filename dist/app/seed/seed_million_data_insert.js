"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed_millon_default_data_insert_intoDB = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const prisma_1 = require("../shared/prisma");
const uuid_1 = require("uuid");
const bcrypt = __importStar(require("bcryptjs"));
const enums_1 = require("../../generated/prisma/enums");
// =====================================================
// CONFIGURATION
// =====================================================
const CHUNK_SIZE = 2000; // Smaller chunk size to manage memory
const DEFAULT_PASSWORD = 'password123';
// Realistic data pools (same as before)
const FIRST_NAMES = [
    'John',
    'Jane',
    'Michael',
    'Sarah',
    'David',
    'Emily',
    'Robert',
    'Lisa',
    'James',
    'Mary',
    'William',
    'Jennifer',
    'Richard',
    'Linda',
    'Joseph',
    'Patricia',
    'Thomas',
    'Barbara',
    'Christopher',
    'Elizabeth',
    'Daniel',
    'Jessica',
    'Matthew',
    'Ashley',
    'Anthony',
    'Kimberly',
    'Mark',
    'Amanda'
];
const LAST_NAMES = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez',
    'Hernandez',
    'Lopez',
    'Gonzalez',
    'Wilson',
    'Anderson',
    'Thomas',
    'Taylor',
    'Moore',
    'Jackson',
    'Martin'
];
const DEPARTMENTS = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History',
    'Economics',
    'Psychology',
    'Engineering',
    'Business Administration',
    'Fine Arts',
    'Music',
    'Philosophy'
];
const DESIGNATIONS = [
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Senior Lecturer',
    'Lecturer',
    'Teaching Assistant'
];
const COURSE_CATEGORIES = [
    'Programming',
    'Data Science',
    'Web Development',
    'Mobile Development',
    'AI/ML',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Business',
    'Design',
    'Literature',
    'Social Sciences',
    'Engineering',
    'Healthcare'
];
const COURSE_PREFIXES = [
    'Introduction to',
    'Advanced',
    'Fundamentals of',
    'Applied',
    'Modern',
    'Practical',
    'Theoretical',
    'Professional',
    'Contemporary'
];
const SEMESTERS = ['Spring', 'Summer', 'Fall', 'Winter'];
const ACADEMIC_YEARS = ['2023', '2024', '2025'];
// =====================================================
// HELPER FUNCTIONS
// =====================================================
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};
const generatePhone = (index) => {
    const base = 1700000000 + index;
    return `+880${String(base).padStart(10, '0')}`;
};
const generateRealisticName = () => {
    return `${randomElement(FIRST_NAMES)} ${randomElement(LAST_NAMES)}`;
};
const calculateGrade = (score) => {
    if (score >= 90)
        return 'A+';
    if (score >= 85)
        return 'A';
    if (score >= 80)
        return 'A-';
    if (score >= 75)
        return 'B+';
    if (score >= 70)
        return 'B';
    if (score >= 65)
        return 'B-';
    if (score >= 60)
        return 'C+';
    if (score >= 55)
        return 'C';
    if (score >= 50)
        return 'C-';
    if (score >= 40)
        return 'D';
    return 'F';
};
// =====================================================
// MAIN SEED FUNCTION WITH CHUNK PROCESSING
// =====================================================
const seed_millon_default_data_insert_intoDB = (start_number, end_number) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate and normalize range
    const startNumber = Math.max(1, start_number || 1);
    const lastNumber = Math.max(startNumber, end_number || 100000);
    const totalRecords = lastNumber - startNumber + 1;
    const totalChunks = Math.ceil(totalRecords / CHUNK_SIZE);
    console.log('\n' + '='.repeat(70));
    console.log('🚀 SEED PROCESS STARTED');
    console.log('='.repeat(70));
    console.log(`📊 Range: ${startNumber.toLocaleString()} to ${lastNumber.toLocaleString()}`);
    console.log(`📈 Total base records: ${totalRecords.toLocaleString()}`);
    console.log(`📦 Chunk size: ${CHUNK_SIZE.toLocaleString()}`);
    console.log(`🔄 Total chunks: ${totalChunks}`);
    console.log(`🔐 Default password: ${DEFAULT_PASSWORD}`);
    console.log('='.repeat(70) + '\n');
    const startTime = Date.now();
    // Global counters for summary
    const totalCounts = {
        institutes: 0,
        users: 0,
        profiles: 0,
        students: 0,
        teachers: 0,
        courses: 0,
        studentEnrollments: 0,
        teacherAssignments: 0,
        results: 0
    };
    const usersByRole = {
        [enums_1.Role.STUDENT]: 0,
        [enums_1.Role.TEACHER]: 0,
        [enums_1.Role.ADMIN]: 0,
        [enums_1.Role.SUPER_ADMIN]: 0
    };
    try {
        // Hash password once
        console.log('🔐 Hashing password...');
        const hashedPassword = yield bcrypt.hash(DEFAULT_PASSWORD, 10);
        console.log('✅ Password hashed\n');
        // Process data in chunks
        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            const chunkStart = startNumber + chunkIndex * CHUNK_SIZE;
            const chunkEnd = Math.min(chunkStart + CHUNK_SIZE - 1, lastNumber);
            console.log(`\n📦 Processing Chunk ${chunkIndex + 1}/${totalChunks} (Records ${chunkStart.toLocaleString()} - ${chunkEnd.toLocaleString()})`);
            console.log('-'.repeat(50));
            // Generate IDs for this chunk
            const chunkInstituteIds = [];
            const chunkUserIds = [];
            const chunkStudentIds = [];
            const chunkTeacherIds = [];
            const chunkCourseIds = [];
            // Data arrays for this chunk (will be cleared after each chunk)
            const chunkData = {
                institutes: [],
                users: [],
                profiles: [],
                students: [],
                teachers: [],
                courses: []
            };
            // STEP 1: Generate base data for this chunk
            console.log('  Generating base data...');
            for (let i = chunkStart; i <= chunkEnd; i++) {
                const instId = (0, uuid_1.v4)();
                const uId = (0, uuid_1.v4)();
                chunkInstituteIds.push(instId);
                chunkUserIds.push(uId);
                // Institute
                chunkData.institutes.push({
                    id: instId,
                    name: `Institute of Technology ${i}`,
                    code: `INST${String(i).padStart(6, '0')}`,
                    description: `Premier educational institution established in ${1950 + (i % 70)}`,
                    address: `${i} Academic Avenue, Education City`,
                    contact: generatePhone(i),
                    email: `info${i}@institute.edu`,
                    website: `https://institute${i}.edu`,
                    establishedAt: new Date(1950 + (i % 70), i % 12, (i % 28) + 1),
                    isActive: i % 20 !== 0,
                    isDeleted: false
                });
                // User with role distribution
                const rand = Math.random();
                let role;
                if (rand < 0.7) {
                    role = enums_1.Role.STUDENT;
                }
                else if (rand < 0.9) {
                    role = enums_1.Role.TEACHER;
                }
                else if (rand < 0.98) {
                    role = enums_1.Role.ADMIN;
                }
                else {
                    role = enums_1.Role.SUPER_ADMIN;
                }
                usersByRole[role]++;
                chunkData.users.push({
                    id: uId,
                    email: `user${i}@mail.com`,
                    phone: generatePhone(i),
                    password: hashedPassword,
                    role: role,
                    passwordChangedAt: i % 5 === 0 ? randomDate(new Date(2023, 0, 1), new Date()) : null,
                    isActive: i % 30 !== 0,
                    isDeleted: false
                });
                // Profile
                chunkData.profiles.push({
                    id: (0, uuid_1.v4)(),
                    userId: uId,
                    name: generateRealisticName(),
                    bio: i % 2 === 0
                        ? `Passionate about learning and education. Member since ${2020 + (i % 5)}.`
                        : null,
                    image: i % 3 === 0
                        ? {
                            secure_url: `https://cloudinary.com/images/user${i}.jpg`,
                            publicId: `user_${i}`
                        }
                        : null,
                    gender: randomElement([enums_1.Gender.MALE, enums_1.Gender.FEMALE, enums_1.Gender.OTHER]),
                    dateOfBirth: randomDate(new Date(1970, 0, 1), new Date(2005, 11, 31)),
                    location: `City ${i % 100}, Country ${i % 50}`
                });
                // Student (only for STUDENT role)
                if (role === enums_1.Role.STUDENT) {
                    const sId = (0, uuid_1.v4)();
                    chunkStudentIds.push(sId);
                    chunkData.students.push({
                        id: sId,
                        userId: uId,
                        instituteId: instId
                    });
                }
                // Teacher (only for TEACHER role)
                if (role === enums_1.Role.TEACHER) {
                    const tId = (0, uuid_1.v4)();
                    chunkTeacherIds.push(tId);
                    chunkData.teachers.push({
                        id: tId,
                        userId: uId,
                        instituteId: instId,
                        designation: randomElement(DESIGNATIONS),
                        department: randomElement(DEPARTMENTS)
                    });
                }
                // Course
                const cId = (0, uuid_1.v4)();
                chunkCourseIds.push(cId);
                chunkData.courses.push({
                    id: cId,
                    instituteId: instId,
                    code: `CS${String(i).padStart(6, '0')}`,
                    name: `${randomElement(COURSE_PREFIXES)} ${randomElement(COURSE_CATEGORIES)}`,
                    description: `Comprehensive course covering various concepts and practical applications`,
                    credits: 3 + (i % 3),
                    duration: 12 + (i % 12),
                    category: randomElement(COURSE_CATEGORIES),
                    level: randomElement([
                        enums_1.CourseLevel.BEGINNER,
                        enums_1.CourseLevel.INTERMEDIATE,
                        enums_1.CourseLevel.ADVANCED
                    ]),
                    startDate: randomDate(new Date(2023, 0, 1), new Date(2025, 0, 1)),
                    endDate: (() => {
                        const date = randomDate(new Date(2023, 0, 1), new Date(2025, 0, 1));
                        date.setMonth(date.getMonth() + 3 + (i % 9));
                        return date;
                    })(),
                    status: randomElement([
                        enums_1.CourseStatus.PENDING,
                        enums_1.CourseStatus.ONGOING,
                        enums_1.CourseStatus.ENDED
                    ]),
                    isAvailable: i % 15 !== 0,
                    isDeleted: false
                });
            }
            // STEP 2: Insert base data for this chunk
            console.log('  Inserting base data...');
            yield prisma_1.prisma.$transaction([
                prisma_1.prisma.institutes.createMany({
                    data: chunkData.institutes,
                    skipDuplicates: true
                }),
                prisma_1.prisma.users.createMany({
                    data: chunkData.users,
                    skipDuplicates: true
                }),
                prisma_1.prisma.profiles.createMany({
                    data: chunkData.profiles,
                    skipDuplicates: true
                })
            ]);
            if (chunkData.students.length > 0) {
                yield prisma_1.prisma.students.createMany({
                    data: chunkData.students,
                    skipDuplicates: true
                });
            }
            if (chunkData.teachers.length > 0) {
                yield prisma_1.prisma.teachers.createMany({
                    data: chunkData.teachers,
                    skipDuplicates: true
                });
            }
            yield prisma_1.prisma.courses.createMany({
                data: chunkData.courses,
                skipDuplicates: true
            });
            // Update counters
            totalCounts.institutes += chunkData.institutes.length;
            totalCounts.users += chunkData.users.length;
            totalCounts.profiles += chunkData.profiles.length;
            totalCounts.students += chunkData.students.length;
            totalCounts.teachers += chunkData.teachers.length;
            totalCounts.courses += chunkData.courses.length;
            // Clear chunk data to free memory
            chunkData.institutes = [];
            chunkData.users = [];
            chunkData.profiles = [];
            chunkData.students = [];
            chunkData.teachers = [];
            chunkData.courses = [];
            // STEP 3: Generate and insert relationships for this chunk
            console.log('  Generating relationships...');
            // Student-Course enrollments
            if (chunkStudentIds.length > 0 && chunkCourseIds.length > 0) {
                const studentCoursesData = [];
                for (const studentId of chunkStudentIds) {
                    const numCourses = 2 + Math.floor(Math.random() * 3);
                    const shuffledCourses = [...chunkCourseIds].sort(() => 0.5 - Math.random());
                    for (let j = 0; j < Math.min(numCourses, shuffledCourses.length); j++) {
                        studentCoursesData.push({
                            id: (0, uuid_1.v4)(),
                            studentId: studentId,
                            courseId: shuffledCourses[j],
                            enrolledAt: randomDate(new Date(2022, 0, 1), new Date(2026, 11, 31)),
                            status: randomElement([
                                enums_1.ResultStatus.ENROLLED,
                                enums_1.ResultStatus.IN_PROGRESS,
                                enums_1.ResultStatus.COMPLETED
                            ])
                        });
                    }
                }
                if (studentCoursesData.length > 0) {
                    yield prisma_1.prisma.studentsCourses.createMany({
                        data: studentCoursesData,
                        skipDuplicates: true
                    });
                    totalCounts.studentEnrollments += studentCoursesData.length;
                    // STEP 4: Generate results from enrollments
                    const resultsData = [];
                    for (const enrollment of studentCoursesData) {
                        const teacherId = chunkTeacherIds.length > 0 ? randomElement(chunkTeacherIds) : null;
                        const score = 40 + Math.random() * 60;
                        const status = randomElement([
                            enums_1.ResultStatus.IN_PROGRESS,
                            enums_1.ResultStatus.COMPLETED,
                            enums_1.ResultStatus.FAILED
                        ]);
                        resultsData.push({
                            id: (0, uuid_1.v4)(),
                            studentId: enrollment.studentId,
                            courseId: enrollment.courseId,
                            teacherId: teacherId,
                            score: parseFloat(score.toFixed(2)),
                            grade: calculateGrade(score),
                            status: status,
                            semester: randomElement(SEMESTERS),
                            academicYear: randomElement(ACADEMIC_YEARS),
                            completedAt: status === enums_1.ResultStatus.COMPLETED
                                ? randomDate(new Date(2024, 0, 1), new Date())
                                : null,
                            feedback: Math.random() > 0.7 ? `Good performance` : null,
                            isDeleted: false
                        });
                    }
                    // Insert results in smaller batches
                    for (let k = 0; k < resultsData.length; k += 1000) {
                        const batch = resultsData.slice(k, k + 1000);
                        yield prisma_1.prisma.results.createMany({
                            data: batch,
                            skipDuplicates: true
                        });
                    }
                    totalCounts.results += resultsData.length;
                }
            }
            // Teacher-Course assignments
            if (chunkTeacherIds.length > 0 && chunkCourseIds.length > 0) {
                const teacherCoursesData = [];
                for (const teacherId of chunkTeacherIds) {
                    const numCourses = 2 + Math.floor(Math.random() * 4);
                    const shuffledCourses = [...chunkCourseIds].sort(() => 0.5 - Math.random());
                    for (let j = 0; j < Math.min(numCourses, shuffledCourses.length); j++) {
                        teacherCoursesData.push({
                            id: (0, uuid_1.v4)(),
                            teacherId: teacherId,
                            courseId: shuffledCourses[j],
                            assignedAt: randomDate(new Date(2023, 0, 1), new Date())
                        });
                    }
                }
                if (teacherCoursesData.length > 0) {
                    yield prisma_1.prisma.teacherCourses.createMany({
                        data: teacherCoursesData,
                        skipDuplicates: true
                    });
                    totalCounts.teacherAssignments += teacherCoursesData.length;
                }
            }
            // Force garbage collection if available (Node.js with --expose-gc flag)
            if (global.gc) {
                global.gc();
            }
            console.log(`  ✅ Chunk ${chunkIndex + 1} completed`);
            console.log(`  Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`);
        }
        // Final summary
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        const totalInserted = Object.values(totalCounts).reduce((a, b) => a + b, 0);
        console.log('\n' + '='.repeat(70));
        console.log('✅ SEED COMPLETED SUCCESSFULLY!');
        console.log('='.repeat(70));
        console.log(`⏱️  Duration: ${duration}s`);
        console.log(`📦 Total records inserted: ${totalInserted.toLocaleString()}`);
        console.log('\n📊 Breakdown:');
        console.log(`   Institutes:           ${totalCounts.institutes.toLocaleString()}`);
        console.log(`   Users:                ${totalCounts.users.toLocaleString()}`);
        console.log(`     ├─ Students:        ${usersByRole[enums_1.Role.STUDENT].toLocaleString()}`);
        console.log(`     ├─ Teachers:        ${usersByRole[enums_1.Role.TEACHER].toLocaleString()}`);
        console.log(`     ├─ Admins:          ${usersByRole[enums_1.Role.ADMIN].toLocaleString()}`);
        console.log(`     └─ Super Admins:    ${usersByRole[enums_1.Role.SUPER_ADMIN].toLocaleString()}`);
        console.log(`   Profiles:             ${totalCounts.profiles.toLocaleString()}`);
        console.log(`   Student Records:      ${totalCounts.students.toLocaleString()}`);
        console.log(`   Teacher Records:      ${totalCounts.teachers.toLocaleString()}`);
        console.log(`   Courses:              ${totalCounts.courses.toLocaleString()}`);
        console.log(`   Student Enrollments:  ${totalCounts.studentEnrollments.toLocaleString()}`);
        console.log(`   Teacher Assignments:  ${totalCounts.teacherAssignments.toLocaleString()}`);
        console.log(`   Results:              ${totalCounts.results.toLocaleString()}`);
        console.log('='.repeat(70));
        console.log(`🔐 Default password: ${DEFAULT_PASSWORD}`);
        console.log('='.repeat(70) + '\n');
        return {
            success: true,
            duration: `${duration}s`,
            totalRecords: totalInserted,
            breakdown: totalCounts,
            usersByRole
        };
    }
    catch (error) {
        console.error('\n❌ ERROR DURING SEEDING:');
        console.error(error);
        throw error;
    }
});
exports.seed_millon_default_data_insert_intoDB = seed_millon_default_data_insert_intoDB;
