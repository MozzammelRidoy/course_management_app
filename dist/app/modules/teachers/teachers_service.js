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
const prisma_1 = require("../../shared/prisma");
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
    // Global search (name OR email)
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
        .setSecretFields(['studentId', 'courseId', 'createdAt', 'updatedAt'])
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
                }
            }
        }
    });
    const data = yield studentQuery.execute();
    const meta = yield studentQuery.countTotal();
    const formatted = data.map(item => {
        var _a;
        return ({
            studentId: item.student.id,
            email: item.student.user.email,
            phone: item.student.user.phone,
            name: (_a = item.student.user.profile) === null || _a === void 0 ? void 0 : _a.name,
            enrolledAt: item.enrolledAt,
            enrollmentStatus: item.status
        });
    });
    return { data: formatted, meta };
});
exports.TeacherServices = {
    fetch_my_Assigned_Courses_byTeacher_fromDB,
    fetch_courseStudents_byTeacher_fromDB
};
