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
exports.AdminServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const client_1 = require("../../../generated/prisma/client");
const PrismaQueryBuilder_1 = __importDefault(require("../../builder/PrismaQueryBuilder"));
const prisma_1 = require("../../shared/prisma");
const report_student_result_per_institue_byAdmin_fromDB = (instituteId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = query, rest = __rest(query, ["search"]);
    const whereCondition = {
        isDeleted: false,
        student: {
            instituteId: String(instituteId)
        }
    };
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
    const resultQuery = new PrismaQueryBuilder_1.default(prisma_1.prisma.results, rest)
        .setBaseQuery(whereCondition)
        .setSecretFields(['studentId', 'courseId', 'teacherId', 'isDeleted'])
        .sort()
        .fields()
        .filter()
        .paginate()
        .include({
        student: {
            select: {
                institute: {
                    select: {
                        name: true,
                        code: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        phone: true,
                        profile: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        },
        course: {
            select: {
                id: true,
                name: true,
                code: true,
                credits: true
            }
        },
        teacher: {
            select: {
                user: {
                    select: {
                        id: true,
                        profile: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        }
    });
    const data = yield resultQuery.execute();
    const meta = yield resultQuery.countTotal();
    return { data, meta };
});
// report top courses per year fetch by Admin.
const report_top_courses_perYear_byAdmin_fromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { year, limit = 5 } = query;
    const conditions = [];
    if (year) {
        conditions.push(client_1.Prisma.sql `EXTRACT(YEAR FROM sc."enrolledAt") = ${Number(year)}`);
    }
    const whereClause = conditions.length > 0
        ? client_1.Prisma.sql `WHERE ${client_1.Prisma.join(conditions, ' AND ')}`
        : client_1.Prisma.empty;
    const data = yield prisma_1.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT 
        c.id AS "courseId",
        c.name AS "courseName",
        c.code AS "courseCode",
        c.credits AS "courseCredits",
        c.duration AS "courseDuration",
        c.level AS "courseLevel",
        c.status AS "courseStatus",
        EXTRACT(YEAR FROM sc."enrolledAt") AS "year",
        COUNT(sc."studentId") AS "totalStudents"
      FROM students_courses sc
      JOIN courses c ON c.id = sc."courseId"
      ${whereClause}
      GROUP BY 
        c.id, c.name, c.code,
        c.credits, c.duration, c.level, c.status, "year"
      ORDER BY "totalStudents" DESC
      LIMIT ${Number(limit)}
    `);
    return data;
});
// report Top Ranking student based on higest marks by Amdin
const report_Top_ranking_Student_byAdmin_fromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10 } = query;
    const data = yield prisma_1.prisma.$queryRaw `
    SELECT *
    FROM (
      SELECT 
        s.id AS "studentId",
        p.name AS "studentName",
        SUM(r.score) AS "totalMarks",
        RANK() OVER (ORDER BY SUM(r.score) DESC) AS "rank"
      FROM results r
      JOIN students s ON s.id = r."studentId"
      JOIN users u ON u.id = s."userId"
      JOIN profiles p ON p."userId" = u.id
      GROUP BY s.id, p.name
    ) ranked_students
    WHERE "rank" <= ${Number(limit)};
  `;
    return data;
});
exports.AdminServices = {
    report_student_result_per_institue_byAdmin_fromDB,
    report_top_courses_perYear_byAdmin_fromDB,
    report_Top_ranking_Student_byAdmin_fromDB
};
