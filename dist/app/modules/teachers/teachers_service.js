"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const PrismaQueryBuilder_1 = __importDefault(require("../../builder/PrismaQueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = require("../../shared/prisma");
const date_Time_Validation_1 = require("../../utils/date_Time_Validation");
// get my all Assigned courses from db by Student
const fetch_my_Assigned_Courses_byTeacher_fromDB = (user, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, status } = query, rest = __rest(query, ["search", "status"]);
    const whereCondition = {
        teacher: {
            userId: user.user_id
        }
    };
    if (search) {
        whereCondition.course = {
            OR: [
                {
                    name: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    code: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ]
        };
    }
    if (status) {
        whereCondition.course = Object.assign(Object.assign({}, whereCondition.course), { status: status });
    }
    const coursesQuery = new PrismaQueryBuilder_1.default(prisma_1.prisma.teacherCourses, rest)
        .setBaseQuery(Object.assign({}, whereCondition))
        .include({
        course: {
            select: {
                name: true,
                description: true,
                category: true,
                level: true,
                credits: true,
                duration: true,
                code: true,
                startDate: true,
                endDate: true,
                status: true
            }
        }
    })
        .filter()
        .fields()
        .sort()
        .paginate();
    const data = yield coursesQuery.execute();
    const meta = yield coursesQuery.countTotal();
    return { data, meta };
});
// fetch all students under the course by teacher
const fetch_courseStudents_byTeacher_fromDB = (user, courseId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, studentId } = query;
    const whereCondition = {
        courseId,
        // Teacher security
        course: {
            teacherLinks: {
                some: {
                    teacher: {
                        userId: user.user_id
                    }
                }
            }
        }
    };
    // Filter by studentId
    if (studentId) {
        whereCondition.studentId = String(studentId);
    }
    // Global search (name OR email OR phone)
    if (search) {
        whereCondition.student = {
            user: {
                OR: [
                    {
                        email: {
                            contains: String(search),
                            mode: 'insensitive'
                        }
                    },
                    {
                        phone: {
                            contains: String(search),
                            mode: 'insensitive'
                        }
                    },
                    {
                        profile: {
                            name: {
                                contains: String(search),
                                mode: 'insensitive'
                            }
                        }
                    }
                ]
            }
        };
    }
    const studentQuery = new PrismaQueryBuilder_1.default(prisma_1.prisma.studentsCourses, {})
        .setBaseQuery(Object.assign({}, whereCondition))
        .setSecretFields(['studentId', 'createdAt', 'updatedAt'])
        .include({
        student: {
            select: {
                id: true,
                user: {
                    select: {
                        email: true,
                        phone: true,
                        profile: {
                            select: { name: true }
                        }
                    }
                },
                results: {
                    select: {
                        grade: true,
                        status: true,
                        score: true,
                        feedback: true,
                        academicYear: true,
                        semester: true,
                        completedAt: true
                    }
                }
            }
        }
    });
    const data = yield studentQuery.execute();
    const meta = yield studentQuery.countTotal();
    const formatted = data.map(item => {
        var _a;
        return ({
            courseId: item.courseId,
            studentId: item.student.id,
            email: item.student.user.email,
            phone: item.student.user.phone,
            name: (_a = item.student.user.profile) === null || _a === void 0 ? void 0 : _a.name,
            enrolledAt: item.enrolledAt,
            enrollmentStatus: item.status,
            result: item.student.results
        });
    });
    return { data: formatted, meta };
});
const calculateGrade = (marks) => {
    if (marks >= 80)
        return 'A+';
    if (marks >= 75)
        return 'A';
    if (marks >= 70)
        return 'A-';
    if (marks >= 65)
        return 'B+';
    if (marks >= 60)
        return 'B';
    if (marks >= 55)
        return 'B-';
    if (marks >= 50)
        return 'C+';
    if (marks >= 45)
        return 'C';
    if (marks >= 40)
        return 'D';
    return 'F';
};
// update student result byTeacher into DB
const update_student_result_byTeacher_intoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { courseId, studentId, result, feedback, status, academicYear, semester: sem, completedAt } = payload;
    const semester = sem.toLowerCase();
    // Verify teacher assigned + student enrolled
    const assignedCourse = yield prisma_1.prisma.studentsCourses.findFirst({
        where: {
            courseId,
            studentId,
            course: {
                teacherLinks: {
                    some: {
                        teacher: {
                            userId: user.user_id
                        }
                    }
                }
            }
        },
        select: {
            id: true,
            studentId: true,
            courseId: true,
            course: {
                select: {
                    teacherLinks: {
                        where: {
                            teacher: {
                                userId: user.user_id
                            }
                        },
                        select: {
                            teacherId: true
                        }
                    }
                }
            }
        }
    });
    if (!assignedCourse) {
        throw new AppError_1.default(404, 'course', 'This course is not found or not assigned to you or this student');
    }
    const teacherId = (_a = assignedCourse.course.teacherLinks[0]) === null || _a === void 0 ? void 0 : _a.teacherId;
    if (!teacherId) {
        throw new AppError_1.default(403, 'teacher', 'Unauthorized');
    }
    const grade = calculateGrade(result);
    const { start: completedTime } = (0, date_Time_Validation_1.Start_End_DateTime_Validation)(completedAt, completedAt);
    // Transaction (atomic operation)
    yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Create result (or use upsert if needed)
        yield tx.results.upsert({
            where: {
                studentId_courseId_academicYear_semester: {
                    studentId,
                    courseId,
                    academicYear,
                    semester
                }
            },
            update: {
                grade,
                score: result,
                teacherId,
                completedAt: completedTime,
                feedback,
                status
            },
            create: {
                studentId,
                courseId,
                teacherId,
                grade,
                score: result,
                completedAt: completedTime,
                academicYear,
                semester,
                feedback,
                status
            }
        });
        // Update enrollment status
        yield tx.studentsCourses.update({
            where: {
                id: assignedCourse.id
            },
            data: {
                status
            }
        });
    }));
    return {
        message: `Student Result Updated Successfully. The Grade is : ${grade}`
    };
});
exports.TeacherServices = {
    fetch_my_Assigned_Courses_byTeacher_fromDB,
    fetch_courseStudents_byTeacher_fromDB,
    update_student_result_byTeacher_intoDB
};
