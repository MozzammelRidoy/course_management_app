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
exports.AdminServices = {
    report_student_result_per_institue_byAdmin_fromDB
};
