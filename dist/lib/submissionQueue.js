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
exports.get_submission = exports.contest_final_submission = exports.getLastSubmissionFromQueue = exports.addNewSubmissionToQueue = void 0;
const problem_1 = __importDefault(require("../models/problem"));
const submission_1 = __importDefault(require("../models/submission"));
const submissionQueue_1 = __importDefault(require("../models/submissionQueue"));
const testcase_1 = __importDefault(require("../models/testcase"));
const enum_1 = require("../utils/enum");
const utils_1 = require("../utils/utils");
const submission_2 = __importDefault(require("../sockets/submission"));
const contestSubmission_1 = __importDefault(require("../models/contestSubmission"));
const contest_1 = __importDefault(require("../models/contest"));
const Standings_1 = __importDefault(require("../models/Standings"));
const user_1 = __importDefault(require("../models/user"));
const contest_2 = require("./contest");
const addNewSubmissionToQueue = (contsetSlugslug, sub_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sub = new submissionQueue_1.default({
            slug: contsetSlugslug,
            submission: sub_id,
            time: (0, utils_1.get_current_time)().getTime()
        });
        yield sub.save();
        return { status: true };
    }
    catch (err) {
        return { status: false };
    }
});
exports.addNewSubmissionToQueue = addNewSubmissionToQueue;
const getLastSubmissionFromQueue = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let lastsub = yield submissionQueue_1.default.findOne({ slug, running: false }).sort("-time").exec();
        if (!lastsub)
            throw "";
        let submission = yield submission_1.default.findById(lastsub.submission);
        if (!submission)
            throw "";
        let problem = yield problem_1.default.findOne({ slug: submission.problemSlug });
        if (!problem)
            throw "";
        let test_cases = (yield testcase_1.default.find({ slug: submission.problemSlug })).map(item => ({
            input: item.input,
            output: item.output,
            id: item._id
        }));
        lastsub.running = true;
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            let temp = yield submissionQueue_1.default.findById(lastsub === null || lastsub === void 0 ? void 0 : lastsub._id);
            if (!temp)
                return;
            if (temp.running === true)
                temp.running = false;
        }), 600000);
        yield lastsub.save();
        return {
            status: true,
            submission: {
                code: submission.code,
                testcases: test_cases,
                checker: problem.customChecker,
                enable: problem.enableCustomChecker,
                sub_id: submission._id,
                timelimit: problem.timelimit,
                memorylimit: problem.memorylimit,
                language: submission.language
            }
        };
    }
    catch (err) {
        return { status: false };
    }
});
exports.getLastSubmissionFromQueue = getLastSubmissionFromQueue;
const contest_final_submission = (subid, status) => __awaiter(void 0, void 0, void 0, function* () {
    const submission = yield submission_1.default.findById(subid);
    if (!submission)
        return;
    let contest_sub = yield contestSubmission_1.default.findOne({ submission_id: subid });
    if (!contest_sub) {
        return;
    }
    let contest = yield contest_1.default.findOne({ slug: contest_sub.contsetSlug });
    if (!contest)
        return;
    let check = yield (0, contest_2.getContestSatus)(contest.slug);
    if (check !== "running")
        return;
    let user = yield user_1.default.findOne({ email: contest_sub.user });
    if (!user)
        return;
    let delay = new Date(submission.submission_time).getTime() - new Date((0, utils_1.addDateAndTime)(contest.date, contest.time)).getTime();
    delay /= 1000;
    delay /= 60;
    delay = Math.floor(delay);
    let find = yield Standings_1.default.findOne({ cid: contest.slug, status: true, email: contest_sub.user, position: contest_sub.position });
    if (find)
        return;
    let standing = new Standings_1.default({
        email: user === null || user === void 0 ? void 0 : user.email,
        name: user === null || user === void 0 ? void 0 : user.name,
        position: contest_sub.position,
        delay: delay,
        cid: contest.slug,
        status: status
    });
    yield standing.save();
});
exports.contest_final_submission = contest_final_submission;
const get_submission = (sub_id, tcid, status) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
    try {
        let submission = yield submission_1.default.findById(sub_id);
        if (!submission)
            throw "";
        submission.memory = (_b = (_a = status.judge) === null || _a === void 0 ? void 0 : _a.memory) !== null && _b !== void 0 ? _b : 0;
        submission.time = (_d = (_c = status.judge) === null || _c === void 0 ? void 0 : _c.time) !== null && _d !== void 0 ? _d : 0;
        yield submission.save();
        let statuscode = parseInt(status.status);
        let _status = { status: enum_1.SubmittedStatus.Pending.status, color: enum_1.SubmittedStatus.Pending.color, text: enum_1.SubmittedStatus.Pending.text, memory: (_f = (_e = status.judge) === null || _e === void 0 ? void 0 : _e.memory) !== null && _f !== void 0 ? _f : 0, time: (_h = (_g = status.judge) === null || _g === void 0 ? void 0 : _g.time) !== null && _h !== void 0 ? _h : 0 };
        if (statuscode === 1) {
            _status = { status: enum_1.SubmittedStatus.AC.status, color: enum_1.SubmittedStatus.AC.color, text: enum_1.SubmittedStatus.AC.text, memory: (_k = (_j = status.judge) === null || _j === void 0 ? void 0 : _j.memory) !== null && _k !== void 0 ? _k : 0, time: (_m = (_l = status.judge) === null || _l === void 0 ? void 0 : _l.time) !== null && _m !== void 0 ? _m : 0 };
        }
        else if (statuscode === -1 || statuscode === 0) {
            if (((_o = status.judge) === null || _o === void 0 ? void 0 : _o.result) === 0)
                _status = { status: enum_1.SubmittedStatus.WA.status, color: enum_1.SubmittedStatus.WA.color, text: enum_1.SubmittedStatus.WA.text, memory: (_q = (_p = status.judge) === null || _p === void 0 ? void 0 : _p.memory) !== null && _q !== void 0 ? _q : 0, time: (_s = (_r = status.judge) === null || _r === void 0 ? void 0 : _r.time) !== null && _s !== void 0 ? _s : 0 };
            else {
                _status = { status: enum_1.SubmittedStatus.get((_u = (_t = status.judge) === null || _t === void 0 ? void 0 : _t.result) !== null && _u !== void 0 ? _u : 0).status, color: enum_1.SubmittedStatus.get((_w = (_v = status.judge) === null || _v === void 0 ? void 0 : _v.result) !== null && _w !== void 0 ? _w : 0).color, text: enum_1.SubmittedStatus.get((_y = (_x = status.judge) === null || _x === void 0 ? void 0 : _x.result) !== null && _y !== void 0 ? _y : 0).text, memory: (_0 = (_z = status.judge) === null || _z === void 0 ? void 0 : _z.memory) !== null && _0 !== void 0 ? _0 : 0, time: (_2 = (_1 = status.judge) === null || _1 === void 0 ? void 0 : _1.time) !== null && _2 !== void 0 ? _2 : 0 };
            }
        }
        else if (statuscode === 8 || statuscode === 4 || statuscode === 9) {
            _status = { status: enum_1.SubmittedStatus.get(statuscode).status, color: enum_1.SubmittedStatus.get(statuscode).color, text: enum_1.SubmittedStatus.get(statuscode).text, memory: (_4 = (_3 = status.judge) === null || _3 === void 0 ? void 0 : _3.memory) !== null && _4 !== void 0 ? _4 : 0, time: (_6 = (_5 = status.judge) === null || _5 === void 0 ? void 0 : _5.time) !== null && _6 !== void 0 ? _6 : 0 };
        }
        else if (statuscode === 100) {
            let status = submission.status;
            (0, exports.contest_final_submission)(sub_id, status.status === enum_1.SubmittedStatus.AC.status);
            contestSubmission_1.default.deleteOne({ _id: submission._id });
            submission_2.default.tellFinalSubmissionStatus(sub_id, submission.status);
            return;
        }
        if (enum_1.SubmittedStatus.Running.status !== statuscode && statuscode !== enum_1.SubmittedStatus.Skipped.status)
            submission.status = _status;
        for (let i = 0; i < submission.testcases.length; i++) {
            if (submission.testcases[i].tcid === tcid) {
                submission.testcases[i] = Object.assign(Object.assign({}, _status), { tcid: tcid });
            }
        }
        submission_2.default.tellSubmissionStatus(sub_id, Object.assign(Object.assign({}, _status), { tcid: tcid }));
        yield submission.save();
        return;
    }
    catch (err) {
    }
});
exports.get_submission = get_submission;
