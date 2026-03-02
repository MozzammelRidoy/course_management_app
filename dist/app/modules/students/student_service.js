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
exports.StudentServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const PrismaQueryBuilder_1 = __importDefault(require("../../builder/PrismaQueryBuilder"));
const prisma_1 = require("../../shared/prisma");
// get my all courses from db by Student
const fetch_my_courses_by_student_fromDB = (user, query) => __awaiter(void 0, void 0, void 0, function* () {
    const rest = __rest(query, []);
    const coursesQuery = new PrismaQueryBuilder_1.default(prisma_1.prisma.studentsCourses, rest)
        .setBaseQuery({
        student: {
            userId: user.user_id
        }
    })
        .include({
        course: {
            select: {
                name: true,
                duration: true,
                credits: true,
                endDate: true,
                startDate: true,
                code: true,
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
// fetch my all result by Student.
const fetch_myResults_byStudent_fromDB = (user, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = query, rest = __rest(query, ["search"]);
    if (rest.score)
        rest.score = Number(rest.score);
    const whereCondition = {
        isDeleted: false,
        student: {
            userId: user.user_id
        }
    };
    // Search by course name OR course code OR semester OR Academic Year
    if (search) {
        whereCondition.AND = [
            {
                OR: [
                    {
                        course: {
                            name: {
                                contains: String(search),
                                mode: 'insensitive'
                            }
                        }
                    },
                    {
                        course: {
                            code: {
                                contains: String(search),
                                mode: 'insensitive'
                            }
                        }
                    },
                    {
                        academicYear: {
                            contains: String(search),
                            mode: 'insensitive'
                        }
                    },
                    {
                        semester: {
                            contains: String(search),
                            mode: 'insensitive'
                        }
                    }
                ]
            }
        ];
    }
    const resultQuery = new PrismaQueryBuilder_1.default(prisma_1.prisma.results, rest)
        .setBaseQuery(whereCondition)
        .setSecretFields([
        'studentId',
        'courseId',
        'teacherId',
        'isDeleted',
        'createdAt',
        'updatedAt'
    ])
        .sort()
        .filter()
        .fields()
        .paginate()
        .include({
        course: {
            select: {
                id: true,
                code: true,
                name: true,
                credits: true,
                duration: true,
                level: true,
                category: true,
                startDate: true,
                endDate: true,
                status: true
            }
        }
    });
    const data = yield resultQuery.execute();
    const meta = yield resultQuery.countTotal();
    return { data, meta };
});
exports.StudentServices = {
    fetch_my_courses_by_student_fromDB,
    fetch_myResults_byStudent_fromDB
};
