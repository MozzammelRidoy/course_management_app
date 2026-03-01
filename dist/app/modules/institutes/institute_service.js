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
exports.InstituteServices = void 0;
const client_1 = require("../../../generated/prisma/client");
const PrismaQueryBuilder_1 = __importDefault(require("../../builder/PrismaQueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = require("../../shared/prisma");
const date_Time_Validation_1 = require("../../utils/date_Time_Validation");
// create institute into database
const create_institute_intoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let establishedAt = null;
    if (payload.establishedAt) {
        if (!(0, date_Time_Validation_1.isValidDate)(payload.establishedAt)) {
            throw new AppError_1.default(400, 'establishedAt', 'Established date must be a valid date string!');
        }
        establishedAt = new Date(payload.establishedAt);
    }
    const { name, code, description, address, contact, email, website, isActive } = payload;
    try {
        const createdData = yield prisma_1.prisma.institutes.create({
            data: {
                name,
                email,
                code,
                description,
                address,
                contact,
                website,
                establishedAt,
                isActive
            }
        });
        return createdData;
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new AppError_1.default(409, 'code', `Institute with code '${payload.code}' already exists!`);
            }
        }
        // Throw other errors
        throw error;
    }
});
// fetch all institutes from database for Admin
const fetch_all_institutes_forAdmin_fromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isDeleted } = query, rest = __rest(query, ["isDeleted"]);
    if (query.isActive)
        query.isActive = query.isActive === 'true' ? true : false;
    // Pass 'prisma.institutes', NOT 'prisma.institutes.findMany()'
    const instituteQuery = new PrismaQueryBuilder_1.default(prisma_1.prisma.institutes, rest)
        .setBaseQuery({ isDeleted: false })
        .setSecretFields(['isDeleted'])
        .search(['name', 'code'])
        .fields()
        .filter()
        .sort()
        .paginate();
    const result = yield instituteQuery.execute();
    const meta = yield instituteQuery.countTotal();
    return {
        result,
        meta
    };
});
// fetch all institutes from database for All global
const fetch_all_institutes_forGlobal_fromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const instituteQuery = new PrismaQueryBuilder_1.default(prisma_1.prisma.institutes, query)
        .setBaseQuery({ isDeleted: false, isActive: true })
        .setSecretFields(['isDeleted', 'isActive'])
        .search(['name', 'code'])
        .fields()
        .filter()
        .sort()
        .paginate();
    const result = yield instituteQuery.execute();
    const meta = yield instituteQuery.countTotal();
    return {
        result,
        meta
    };
});
exports.InstituteServices = {
    create_institute_intoDB,
    fetch_all_institutes_forAdmin_fromDB,
    fetch_all_institutes_forGlobal_fromDB
};
