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
exports.CourseServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const client_1 = require("../../../generated/prisma/client");
const PrismaQueryBuilder_1 = __importDefault(require("../../builder/PrismaQueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = require("../../shared/prisma");
const date_Time_Validation_1 = require("../../utils/date_Time_Validation");
// course create by admin
const create_course_byAdmin_intoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { instituteId, name, code, description, startDate, endDate, credits, duration, level, category, status, isAvailable } = payload;
    const { start, end } = (0, date_Time_Validation_1.Start_End_DateTime_Validation)(startDate, endDate);
    // Check Institute Validity
    const institute = yield prisma_1.prisma.institutes.findUnique({
        where: { id: instituteId, isActive: true, isDeleted: false }
    });
    if (!institute) {
        throw new AppError_1.default(404, 'instituteId', 'Institute not found or is currently unavailable.');
    }
    // create Course
    try {
        const createdCourse = yield prisma_1.prisma.courses.create({
            data: {
                name,
                code,
                description,
                instituteId,
                startDate: start,
                endDate: end,
                credits,
                duration,
                level,
                category,
                status,
                isAvailable,
                isDeleted: false
            }
        });
        if (!createdCourse || !createdCourse.id) {
            throw new AppError_1.default(400, 'course', 'Failed to create course');
        }
        return createdCourse;
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new AppError_1.default(409, 'course', `Failed to Course Create! This Course Code already Created!`);
            }
        }
        // Re-throw other errors
        throw error;
    }
});
// fetch all courses for admin
const fetch_all_courses_byAdmin_fromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isDeleted } = query, rest = __rest(query, ["isDeleted"]);
    if (rest.isAvailable)
        rest.isAvailable = rest.isAvailable === 'true' ? true : false;
    if (rest.credit)
        rest.credit = Number(rest.credit);
    if (rest.duration)
        rest.duration = Number(rest.duration);
    // build query
    const courseQuery = new PrismaQueryBuilder_1.default(prisma_1.prisma.courses, rest)
        .setBaseQuery({ isDeleted: false })
        .setSecretFields(['isDeleted'])
        .search(['code', 'name'])
        .filter()
        .fields()
        .sort()
        .paginate()
        .include({
        institute: {
            select: {
                name: true,
                code: true
            }
        }
    });
    const data = yield courseQuery.execute();
    const meta = yield courseQuery.countTotal();
    return { data, meta };
});
// fetch all courses for students
const fetch_all_courses_byStudent_fromDB = (user, query) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isDeleted, isAvailable } = query, rest = __rest(query, ["isDeleted", "isAvailable"]);
    if (rest.credit)
        rest.credit = Number(rest.credit);
    if (rest.duration)
        rest.duration = Number(rest.duration);
    // build query
    const courseQuery = new PrismaQueryBuilder_1.default(prisma_1.prisma.courses, rest)
        .setBaseQuery({
        isAvailable: true,
        isDeleted: false,
        status: { in: [client_1.CourseStatus.PENDING, client_1.CourseStatus.ONGOING] },
        // Courses based on Institute
        institute: {
            students: {
                some: { userId: user.user_id }
            }
        },
        // avoid already enrolled courses
        studentLinks: {
            none: {
                student: {
                    userId: user.user_id
                }
            }
        }
    })
        .setSecretFields(['isDeleted', 'isAvailable', 'instituteId'])
        .search(['code', 'name'])
        .filter()
        .fields()
        .sort()
        .paginate()
        .include({
        institute: {
            select: {
                name: true,
                code: true
            }
        }
    });
    const data = yield courseQuery.execute();
    const meta = yield courseQuery.countTotal();
    return { data, meta };
});
// course enrollment by student.
const enroll_course_byStudent_intoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // check course is available or not.
    const courseData = yield prisma_1.prisma.courses.findFirst({
        where: {
            id: payload.courserId,
            isAvailable: true,
            isDeleted: false,
            status: { in: [client_1.CourseStatus.PENDING, client_1.CourseStatus.ONGOING] },
            // Courses based on Institute
            institute: {
                students: {
                    some: { userId: user.user_id }
                }
            },
            // avoid already enrolled courses
            studentLinks: {
                none: {
                    student: {
                        userId: user.user_id
                    }
                }
            }
        },
        select: {
            id: true,
            institute: {
                select: {
                    students: {
                        where: {
                            userId: user.user_id
                        },
                        select: {
                            id: true
                        }
                    }
                }
            }
        }
    });
    if (!courseData || !courseData.id) {
        throw new AppError_1.default(404, 'courseId', 'This course is not available or Not Found!');
    }
    const studentId = (_a = courseData.institute.students[0]) === null || _a === void 0 ? void 0 : _a.id;
    yield prisma_1.prisma.studentsCourses.create({
        data: {
            studentId,
            courseId: courseData.id
        }
    });
    return { message: 'Course Enrolled Successfully' };
});
exports.CourseServices = {
    create_course_byAdmin_intoDB,
    fetch_all_courses_byAdmin_fromDB,
    fetch_all_courses_byStudent_fromDB,
    enroll_course_byStudent_intoDB
};
