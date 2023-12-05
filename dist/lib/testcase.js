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
exports.update_test_case = exports.get_sample_test_case = exports.get_all_test_case = exports.create_test_case = void 0;
const problem_1 = __importDefault(require("../models/problem"));
const testcase_1 = __importDefault(require("../models/testcase"));
const create_test_case = (slug, input, output, isSample, explaination, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (!slug || !input || !output || isSample === undefined || !email) {
        return { status: false, message: "All the fields must be fillup" };
    }
    try {
        let problem = yield problem_1.default.findOne({ slug: slug });
        if (!problem) {
            return { status: false, message: "Problem not found!" };
        }
        if (problem.createdBy !== email && email !== "admin") {
            return { status: false, message: "Unauthorized" };
        }
        let newTestCase = new testcase_1.default({
            slug,
            input,
            output,
            explaination,
            isSample
        });
        yield newTestCase.save();
        return { status: true, message: "Test Case Added", testcase: newTestCase };
    }
    catch (err) {
        return { status: false, message: "Unknown error" };
    }
});
exports.create_test_case = create_test_case;
const get_all_test_case = (slug, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!slug) {
            return { status: false, message: "slug can't be empty", test_cases: [] };
        }
        let problem = yield problem_1.default.findOne({ slug: slug });
        if (!problem) {
            return { status: false, message: "Problem not found", test_cases: [] };
        }
        if (problem.createdBy !== email) {
            return { status: false, message: "Unathorized" };
        }
        let test_cases = yield testcase_1.default.find({ slug: slug });
        return { status: true, message: "Testcases for problem - " + slug, test_cases };
    }
    catch (err) {
        return { status: false, message: "Unknown error" };
    }
});
exports.get_all_test_case = get_all_test_case;
const get_sample_test_case = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!slug) {
            return { status: false, message: "slug can't be empty", test_cases: [] };
        }
        let problem = yield problem_1.default.findOne({ slug: slug });
        if (!problem) {
            return { status: false, message: "Problem not found", test_cases: [] };
        }
        let test_cases = yield testcase_1.default.find({ slug: slug, isSample: true });
        return { status: true, message: "sample testcases for problem - " + slug, test_cases };
    }
    catch (err) {
        return { status: false, message: "Unknown error" };
    }
});
exports.get_sample_test_case = get_sample_test_case;
const update_test_case = (_id) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.update_test_case = update_test_case;
