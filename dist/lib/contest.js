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
exports.submit_contest_problem_solution = exports.get_contest_problem_details = exports.getContestSatus = exports.get_authors = exports.handleDeleteContest = exports.changePublishMoode = exports.my_contests = exports.all_published_contest = exports.get_problems = exports.hasContestPermission = exports.add_problem = exports.checkImAuthor = exports.getContestDetails = exports.update_contest = exports.create_contest = void 0;
const contest_1 = __importDefault(require("../models/contest"));
const slug_1 = __importDefault(require("../utils/slug"));
const author_1 = __importDefault(require("../models/author"));
const user_1 = __importDefault(require("../models/user"));
const problem_1 = __importDefault(require("../models/problem"));
const contestProblem_1 = __importDefault(require("../models/contestProblem"));
const utils_1 = require("./../utils/utils");
const contestSubmission_1 = __importDefault(require("../models/contestSubmission"));
const judgeserver_1 = require("./judgeserver");
const testcase_1 = require("./testcase");
const submission_1 = require("./submission");
const judgeservers_1 = __importDefault(require("../sockets/judgeservers"));
const submissionQueue_1 = require("./submissionQueue");
// import { submitacode } from "./socket";
const create_contest = (name, date, time, length, announcement, description, authors, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let _creator = email;
        if (!name || !name.length || !date || !date.length || !time || !time.length || !length || !length.length) {
            return { status: false, message: "Some fields are empty" };
        }
        let slug = (0, slug_1.default)(name);
        for (let i = 0;; i++) {
            let newslug = slug + (i === 0 ? "" : String(i));
            let check = yield contest_1.default.findOne({ slug: newslug });
            if (!check) {
                slug = newslug;
                break;
            }
        }
        let newContest = new contest_1.default({
            name,
            slug,
            len: length,
            date,
            time,
            announcement,
            description,
            createdBy: _creator,
        });
        yield newContest.save();
        let _authors = (authors === null || authors === void 0 ? void 0 : authors.split(',')) || [];
        _authors.push(newContest.createdBy);
        for (let i = 0; i < _authors.length; i++) {
            let Author = yield user_1.default.findOne({ email: _authors[i] });
            if (!Author)
                continue;
            let __ = yield author_1.default.findOne({ email: _authors[i], slug: slug });
            if (__)
                continue;
            let newAuthor = new author_1.default({
                slug,
                email: _authors[i],
            });
            yield newAuthor.save();
        }
        return { status: true, message: "Contest created Successfully", slug };
    }
    catch (err) {
        return { status: false, message: "Unknown error" };
    }
});
exports.create_contest = create_contest;
const update_contest = (slug, name, date, time, length, announcement, description, authors, email) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let ret = yield (0, exports.checkImAuthor)(slug, email);
        if (ret.status === false) {
            return { status: false, message: "Unauthorized" };
        }
        if (!name || !name.length || !date || !date.length || !time || !time.length || !length || !length.length) {
            return { status: false, message: "Some fields are empty" };
        }
        let contest = yield contest_1.default.findOne({ slug });
        if (!contest)
            throw "";
        contest.name = name;
        contest.slug = slug;
        contest.len = length;
        contest.date = date;
        contest.time = time;
        contest.announcement = announcement !== null && announcement !== void 0 ? announcement : "";
        contest.description = description !== null && description !== void 0 ? description : "";
        yield contest.save();
        let prevauthors = yield (0, exports.get_authors)(slug);
        for (let i = 0; i < prevauthors.length; i++) {
            yield ((_a = (yield author_1.default.findOne({ slug, email: prevauthors[i].email }))) === null || _a === void 0 ? void 0 : _a.deleteOne());
        }
        let _authors = (authors === null || authors === void 0 ? void 0 : authors.replace(new RegExp(" ", 'g'), "").split(',')) || [];
        _authors.push(contest.createdBy);
        for (let i = 0; i < _authors.length; i++) {
            let Author = yield user_1.default.findOne({ email: _authors[i] });
            if (!Author)
                continue;
            let __ = yield author_1.default.findOne({ email: _authors[i], slug: slug });
            if (__)
                continue;
            let newAuthor = new author_1.default({
                slug,
                email: _authors[i],
            });
            yield newAuthor.save();
        }
        return { status: true, message: "Contest created Successfully", slug };
    }
    catch (err) {
        return { status: false, message: "Unknown error" };
    }
});
exports.update_contest = update_contest;
const getContestDetails = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let details = yield contest_1.default.findOne({ slug });
        if (!details) {
            return { status: false };
        }
        return { status: true, details };
    }
    catch (err) {
        return { status: false };
    }
});
exports.getContestDetails = getContestDetails;
const checkImAuthor = (slug, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let _ = yield author_1.default.findOne({ slug: slug, email: email });
        if (!_)
            return { status: false };
        return { status: true };
    }
    catch (err) {
        return { status: false };
    }
});
exports.checkImAuthor = checkImAuthor;
const add_problem = (contest, email, problems) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield contestProblem_1.default.deleteMany({ contestSlug: contest });
        let Contest = yield contest_1.default.findOne({ slug: contest });
        if (!Contest)
            throw "";
        let author = yield author_1.default.findOne({ email: email, slug: Contest.slug });
        if (!author)
            throw "";
        let pos = 1;
        for (let i = 0; i < problems.length; i++) {
            let Problem = yield problem_1.default.findOne({ slug: problems[i].slug, createdBy: email });
            if (!Problem)
                continue;
            let __contestProblem = yield contestProblem_1.default.findOne({ contestSlug: contest, problemSlug: Problem.slug });
            if (__contestProblem)
                yield __contestProblem.deleteOne();
            let newContestProblem = new contestProblem_1.default({
                contestSlug: Contest.slug,
                problemSlug: Problem.slug,
                position: problems[i].position,
            });
            yield newContestProblem.save();
            ++pos;
        }
        return true;
    }
    catch (err) {
        return false;
    }
});
exports.add_problem = add_problem;
const hasContestPermission = (email, slug) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let author = yield author_1.default.findOne({ email, slug });
        if (!author)
            throw "";
        return ({ status: true, permission: true });
    }
    catch (err) {
        return ({ status: false, permission: false });
    }
});
exports.hasContestPermission = hasContestPermission;
const get_problems = (contest, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let Contest = yield contest_1.default.findOne({ slug: contest });
        if (!Contest)
            throw "";
        let contestStarted = (0, utils_1.addDateAndTime)(Contest.date, Contest.time).getTime() <= (0, utils_1.get_current_time)().getTime();
        if (!contestStarted) {
            let checkAuthor = yield (0, exports.hasContestPermission)(email, contest);
            if (!checkAuthor.status)
                throw "";
        }
        let __problems = yield contestProblem_1.default.find({ contestSlug: contest });
        let ret = [];
        for (let i = 0; i < __problems.length; i++) {
            let temp = yield problem_1.default.findOne({ slug: __problems[i].problemSlug });
            if (temp) {
                temp.position = __problems[i].position;
                ret.push({
                    name: temp.name,
                    statement: "",
                    position: temp.position,
                    enableCustomChecker: false,
                    customChecker: "",
                    inputFormat: "",
                    outputFormat: "",
                    slug: temp.slug,
                    createdBy: temp.createdBy,
                    timelimit: "",
                    memorylimit: ""
                });
            }
        }
        ret = ret.map(item => (Object.assign(Object.assign({}, item), { customChecker: "", enableCustomChecker: false, position: item.position, statement: "", inputFormat: "", outputFormat: "" })));
        return { problems: ret };
    }
    catch (err) {
        return { problems: [] };
    }
});
exports.get_problems = get_problems;
const all_published_contest = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let contest = yield contest_1.default.find({ published: true });
        contest = contest.sort((a, b) => {
            if ((0, utils_1.addDateAndTime)(a.date, a.time).getTime() > (0, utils_1.addDateAndTime)(b.date, b.time).getTime()) {
                return 1;
            }
            return 0;
        });
        return { contests: contest };
    }
    catch (err) {
        return { contests: [] };
    }
});
exports.all_published_contest = all_published_contest;
const my_contests = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let __contest = yield author_1.default.find({ email: email });
        let _slugs = __contest.map(item => item.slug);
        let contest = yield contest_1.default.find({ slug: { $in: _slugs } });
        contest = contest.sort((a, b) => {
            if ((0, utils_1.addDateAndTime)(a.date, a.time).getTime() < (0, utils_1.addDateAndTime)(b.date, b.time).getTime()) {
                return 1;
            }
            return -1;
        });
        return { contests: contest };
    }
    catch (err) {
        return { contests: [] };
    }
});
exports.my_contests = my_contests;
// // const get_contest_details = async (slug: string): Promise<{ status: boolean, details?: IContest, started?: Boolean, problems?: {[] }> => {
// //     try {
// //         let conn = await connectDB();
// //         if (!conn.connected) throw "db failed";
// //         let contest = await ContestModel.findOne({ slug: slug });
// //         if(!contest) throw "";
// //         let problems = await ContestProblemModel.find({contestSlug : slug});
// //         let __problems:
// //     } catch (err) {
// //         return { status: false }
// //     }
// // }
const changePublishMoode = (slug, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let author = yield author_1.default.findOne({ slug, email: email });
        if (!author)
            throw "";
        let contest = yield contest_1.default.findOne({ slug });
        if (!contest)
            throw "";
        contest.published = !contest.published;
        yield contest.save();
        return true;
    }
    catch (err) {
        return false;
    }
});
exports.changePublishMoode = changePublishMoode;
const handleDeleteContest = (slug, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let author = yield author_1.default.findOne({ email: email, slug });
        if (!author)
            throw "";
        let contest = yield contest_1.default.findOne({ slug });
        if (!contest)
            throw "";
        yield contest.deleteOne();
        let authors = yield author_1.default.find({ slug });
        for (let i = 0; i < authors.length; i++) {
            yield authors[i].deleteOne();
        }
        let problems = yield contestProblem_1.default.find({ contestSlug: slug });
        for (let i = 0; i < problems.length; i++) {
            yield problems[i].deleteOne();
        }
        return true;
    }
    catch (err) {
        return false;
    }
});
exports.handleDeleteContest = handleDeleteContest;
const get_authors = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let authors = yield author_1.default.find({ slug });
        return authors;
    }
    catch (err) {
        return [];
    }
});
exports.get_authors = get_authors;
const getContestSatus = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let contest = yield contest_1.default.findOne({ slug });
        if (!contest)
            throw "";
        let nowTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
        let contestTime = (0, utils_1.addDateAndTime)(contest.date, contest.time);
        if (contestTime.getTime() > nowTime.getTime()) {
            return "upcoming";
        }
        let endTime = new Date(contestTime.getTime() + (parseInt(contest.len) * 60 * 1000));
        if (nowTime.getTime() > endTime.getTime())
            return "finished";
        return "running";
    }
    catch (err) {
        return "error";
    }
});
exports.getContestSatus = getContestSatus;
const get_contest_problem_details = (slug, position) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let problem = yield contestProblem_1.default.findOne({ position, contestSlug: slug });
        if (!problem)
            throw "";
        let _problem = yield problem_1.default.findOne({ slug: problem.problemSlug });
        if (!_problem)
            throw "";
        _problem.customChecker = "";
        _problem.enableCustomChecker = false;
        let testcases = (yield (0, testcase_1.get_sample_test_case)(_problem.slug)).test_cases;
        return { problem: _problem, status: true, test_cases: testcases };
    }
    catch (err) {
        return { status: false };
    }
});
exports.get_contest_problem_details = get_contest_problem_details;
const submit_contest_problem_solution = (slug, position, code, language, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!code || !language)
            throw "code | language didn't found";
        let contest = yield contest_1.default.findOne({ slug });
        if (!contest)
            throw "";
        let status = yield (0, exports.getContestSatus)(slug);
        if (status !== "running" && status !== "finished")
            throw "not started";
        let temp = yield contestProblem_1.default.findOne({ contestSlug: slug, position: position });
        if (!temp)
            throw "";
        let problem = yield problem_1.default.findOne({ slug: temp === null || temp === void 0 ? void 0 : temp.problemSlug });
        if (!problem)
            throw "prblem not found";
        let __problem = yield contestProblem_1.default.findOne({ contestSlug: slug, problemSlug: temp.problemSlug, position });
        if (!__problem)
            throw "problem is not in contest";
        let submission = yield (0, submission_1.submitACode)(code, language, problem.slug, email);
        if (!submission) {
            throw "submission failed";
        }
        let _submission = new contestSubmission_1.default({
            contsetSlug: slug,
            position: position,
            submission_id: submission,
            user: email
        });
        yield _submission.save();
        judgeserver_1.JudgeServers.addNewSubmission(submission, slug);
        yield (0, submissionQueue_1.addNewSubmissionToQueue)(slug, submission);
        judgeservers_1.default.requestFromFreeServer(slug);
        return { status: true, id: submission };
    }
    catch (err) {
        return { status: false };
    }
});
exports.submit_contest_problem_solution = submit_contest_problem_solution;
