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
exports.get_problem_by_sub_id = exports.submissionDetails = exports.submitACode = void 0;
const problem_1 = __importDefault(require("../models/problem"));
const utils_1 = require("../utils/utils");
const enum_1 = require("../utils/enum");
const submission_1 = __importDefault(require("../models/submission"));
const contestSubmission_1 = __importDefault(require("../models/contestSubmission"));
const testcase_1 = __importDefault(require("../models/testcase"));
const submitACode = (code, language, problemSlug, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let time = (0, utils_1.get_current_time)();
        let problem = yield problem_1.default.findOne({ slug: problemSlug });
        if (!problem)
            throw "Problem doesn't exists - " + problemSlug;
        let testcases = yield testcase_1.default.find({ slug: problem.slug });
        let submission = new submission_1.default({
            code,
            language,
            problemSlug,
            user: email,
            submission_time: time,
            status: enum_1.SubmittedStatus.Pending,
            testcases: testcases.map(item => (Object.assign(Object.assign({}, enum_1.SubmittedStatus.Pending), { tcid: item._id, time: 0, memory: 0 })))
        });
        yield submission.save();
        return submission.id;
    }
    catch (err) {
        return null;
    }
});
exports.submitACode = submitACode;
const submissionDetails = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let submission = yield submission_1.default.findById(id);
        if (!submission || submission.user !== email)
            throw "submission not found";
        let problem = yield problem_1.default.findOne({ slug: submission.problemSlug });
        if (!problem)
            throw "problem not found";
        return { status: true, problem, submission };
    }
    catch (errs) {
        return { status: false };
    }
});
exports.submissionDetails = submissionDetails;
const get_problem_by_sub_id = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let submission = yield submission_1.default.findById(id);
        if (!submission)
            throw "Submission not found";
        let contest = yield contestSubmission_1.default.findOne({ submission_id: id });
        if (!contest)
            throw "";
        return { position: contest.position, slug: contest.contsetSlug };
    }
    catch (err) {
        return null;
    }
});
exports.get_problem_by_sub_id = get_problem_by_sub_id;
