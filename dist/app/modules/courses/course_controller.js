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
exports.CourseControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const course_service_1 = require("./course_service");
// Create Course
const create_Course_byAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_service_1.CourseServices.create_course_byAdmin_intoDB(req.body);
    (0, sendResponse_1.default)(res, {
        status: 201,
        success: true,
        message: 'Course Created Successfully',
        data: result
    });
}));
// fetch all courses by admin
const get_Courses_byAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_service_1.CourseServices.fetch_all_courses_byAdmin_fromDB(req.query);
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: 'Courses Fetched Successfully',
        data: result.data,
        meta: result.meta
    });
}));
// fetch all courses by admin
const get_Courses_byStudent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_service_1.CourseServices.fetch_all_courses_byStudent_fromDB(req.user, req.query);
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: 'Courses Fetched Successfully',
        data: result.data,
        meta: result.meta
    });
}));
// course enrollment by stuent.
const create_enrollment_course_byStudent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_service_1.CourseServices.enroll_course_byStudent_intoDB(req.user, req.body);
    (0, sendResponse_1.default)(res, {
        status: 201,
        success: true,
        message: 'Course Enrolled Successfully',
        data: result
    });
}));
exports.CourseControllers = {
    create_Course_byAdmin,
    get_Courses_byAdmin,
    get_Courses_byStudent,
    create_enrollment_course_byStudent
};
