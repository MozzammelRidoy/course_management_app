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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = exports.user_findByID_fromDB_or_Cache = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const client_1 = require("../../../generated/prisma/client");
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = require("../../shared/prisma");
const commonUtils_1 = require("../../utils/commonUtils");
const node_cache_1 = require("../../utils/node_cache");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_findByID_fromDB_or_Cache = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    let value = (0, node_cache_1.get_cache_from_RAM)(userId);
    if (value === undefined) {
        const user = yield prisma_1.prisma.users.findUnique({
            where: { id: userId, isDeleted: false }
        });
        if (!user) {
            throw new AppError_1.default(404, 'not-found', 'This user is not found!');
        }
        if (!user.isActive) {
            throw new AppError_1.default(403, '', 'This user is already blocked!');
        }
        value = user;
        (0, node_cache_1.create_cache_into_RAM)(userId, value, 604800);
    }
    return value;
});
exports.user_findByID_fromDB_or_Cache = user_findByID_fromDB_or_Cache;
// signup a student into db.
const signup_student_intoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, instituteId, email, phone, password } = payload;
    const { bcrypt_salt_rounds, jwt_access_token_secret, jwt_access_token_expires_in, jwt_refresh_token_secret, jwt_refresh_token_expires_in } = config_1.default;
    // Check if User Already Exists
    const existingUser = yield prisma_1.prisma.users.findFirst({
        where: {
            OR: [{ email }, { phone }]
        }
    });
    if (existingUser) {
        const field = existingUser.email === email ? 'email' : 'phone';
        throw new AppError_1.default(409, field, `This ${field} is already registered!`);
    }
    // Check Institute Validity
    const institute = yield prisma_1.prisma.institutes.findUnique({
        where: { id: instituteId, isActive: true, isDeleted: false }
    });
    if (!institute) {
        throw new AppError_1.default(404, 'instituteId', 'Institute not found or is currently unavailable.');
    }
    // Hash Password
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(bcrypt_salt_rounds));
    try {
        // Create User & Profile & Student in a Transaction
        const createdUser = yield prisma_1.prisma.users.create({
            data: {
                email,
                password: hashedPassword,
                phone,
                isActive: true,
                isDeleted: false,
                role: 'STUDENT',
                profile: {
                    create: { name }
                },
                student: {
                    create: { instituteId }
                }
            }
        });
        // Prepare JWT Payload
        const jwtPayload = {
            user_id: createdUser.id,
            role: createdUser.role
        };
        // Generate Tokens
        const accessToken = (0, commonUtils_1.createToken)(jwtPayload, jwt_access_token_secret, jwt_access_token_expires_in);
        const refreshToken = (0, commonUtils_1.createToken)(jwtPayload, jwt_refresh_token_secret, jwt_refresh_token_expires_in);
        (0, node_cache_1.create_cache_into_RAM)(createdUser.id, createdUser, 604800);
        return {
            accessToken,
            refreshToken
        };
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new AppError_1.default(409, 'user', `Failed Sign-Up! This user already Registered!`);
            }
        }
        // Re-throw other errors
        throw error;
    }
});
// create teacher into db by Admin.
const create_Teacher_byAmin_intoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, instituteId, email, phone, password, courseId } = payload;
    const { bcrypt_salt_rounds } = config_1.default;
    // Hash Password
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(bcrypt_salt_rounds));
    try {
        // Create Transaction
        yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Check if User Already Exists
            const existingUser = yield tx.users.findFirst({
                where: {
                    OR: [{ email }, { phone }]
                }
            });
            if (existingUser) {
                const field = existingUser.email === email ? 'email' : 'phone';
                throw new AppError_1.default(409, field, `This ${field} is already registered!`);
            }
            // Check Institute Validity
            const institute = yield tx.institutes.findUnique({
                where: { id: instituteId, isActive: true, isDeleted: false }
            });
            if (!institute) {
                throw new AppError_1.default(404, 'instituteId', 'Institute not found or is currently unavailable.');
            }
            // Check Course Validity
            const course = yield tx.courses.findFirst({
                where: {
                    id: courseId,
                    instituteId: instituteId,
                    isDeleted: false,
                    status: { in: ['ONGOING', 'PENDING'] }
                }
            });
            if (!course) {
                throw new AppError_1.default(404, 'courseId', 'Course not found, unavailable, or does not belong to this institute.');
            }
            // Create Teacher Profile
            const createdTeacher = yield tx.users.create({
                data: {
                    email,
                    phone,
                    password: hashedPassword,
                    role: 'TEACHER',
                    isActive: true,
                    isDeleted: false,
                    profile: {
                        create: {
                            name
                        }
                    },
                    teacher: {
                        create: {
                            instituteId,
                            courseLinks: {
                                create: {
                                    courseId
                                }
                            }
                        }
                    }
                },
                select: {
                    id: true,
                    email: true,
                    phone: true,
                    role: true,
                    isActive: true,
                    createdAt: true
                }
            });
            return createdTeacher;
        }));
        return {
            message: 'Teacher Profile Created Successfully'
        };
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new AppError_1.default(409, 'user', `Failed to create Techer Profile! This user already Registered!`);
            }
        }
        // Re-throw AppErrors thrown manually inside transaction
        if (error instanceof AppError_1.default)
            throw error;
        // Generic fallback
        throw new AppError_1.default(400, '', 'Failed to create teacher profile.');
    }
});
exports.UserServices = {
    signup_student_intoDB,
    create_Teacher_byAmin_intoDB
};
