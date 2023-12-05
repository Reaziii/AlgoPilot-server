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
exports.get_problem_details = exports.create_problem = void 0;
const problem_1 = __importDefault(require("../models/problem"));
const slug_1 = __importDefault(require("../utils/slug"));
const testcase_1 = require("./testcase");
const create_problem = (name, statement, inputFormat, outputFormat, createdBy, timelimit, memorylimit) => __awaiter(void 0, void 0, void 0, function* () {
    const emptyFields = [];
    if (!name || !name.length) {
        emptyFields.push('name');
    }
    if (!statement || !statement.length) {
        emptyFields.push('statement');
    }
    if (!inputFormat || !inputFormat.length) {
        emptyFields.push('inputFormat');
    }
    if (!outputFormat || !outputFormat.length) {
        emptyFields.push('outputFormat');
    }
    if (!createdBy || !createdBy.length) {
        emptyFields.push('createdBy');
    }
    if (!timelimit || !timelimit.length) {
        emptyFields.push('timelimit');
    }
    if (!memorylimit || !memorylimit.length) {
        emptyFields.push('memorylimit');
    }
    if (!name || !name.length || !statement || !statement.length || !inputFormat || !inputFormat.length || !outputFormat || !outputFormat.length || !createdBy || !createdBy.length || !timelimit || !timelimit.length || !memorylimit || !memorylimit.length) {
        return { status: false, message: `${emptyFields.join(", ")} are empty` };
    }
    try {
        let slug = (0, slug_1.default)(name);
        for (let i = 0;; i++) {
            let j = String(i);
            if (i === 0)
                j = "";
            else
                j = "-" + j;
            let problem = yield problem_1.default.findOne({ slug: slug + j });
            if (problem !== null)
                continue;
            slug = slug + j;
            break;
        }
        let newProblem = new problem_1.default({
            name,
            slug,
            statement,
            inputFormat,
            outputFormat,
            createdBy,
            timelimit,
            memorylimit
        });
        yield newProblem.save();
        return { status: true, message: "problem created successfully", problem: newProblem };
    }
    catch (err) {
        return { status: false, message: "Unknown error" };
    }
});
exports.create_problem = create_problem;
const get_problem_details = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        slug = slug.toLowerCase();
        let _problem = yield problem_1.default.findOne({ slug });
        if (!_problem) {
            return ({ status: false, message: "Problem doesn't exists" });
        }
        let problem = {
            details: _problem,
            test_cases: [],
        };
        problem.details.customChecker = "";
        problem.details.enableCustomChecker = false;
        problem.details.createdBy = "";
        let cases = yield (0, testcase_1.get_sample_test_case)(slug);
        problem.test_cases = (_a = cases.test_cases) !== null && _a !== void 0 ? _a : [];
        return (Object.assign({ status: true, message: "retrived problem" }, problem));
    }
    catch (err) {
        return ({ status: false, message: "Unknown error!" });
    }
});
exports.get_problem_details = get_problem_details;
