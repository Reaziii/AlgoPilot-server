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
const express_1 = __importDefault(require("express"));
const problem_1 = require("../lib/problem");
const authcheck_1 = __importDefault(require("../middlewares/authcheck"));
const addauthtorequest_1 = __importDefault(require("../middlewares/addauthtorequest"));
const problem_2 = __importDefault(require("../models/problem"));
const testcase_1 = require("../lib/testcase");
const router = express_1.default.Router();
router.post("/create", authcheck_1.default, (req, res) => {
    var _a;
    (0, problem_1.create_problem)(req.body.name, req.body.statement, req.body.inputformat, req.body.outputformat, (_a = req.user) === null || _a === void 0 ? void 0 : _a.email, req.body.timelimit, req.body.memorylimit).then(result => res.send(result));
});
router.get("/details/:contestslug", (req, res) => {
    (0, problem_1.get_problem_details)(req.params.contestslug).then(result => res.send(result));
});
router.get("/testcases/:slug", addauthtorequest_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let problem = yield problem_2.default.findOne({ slug: req.params.slug });
    if (!problem) {
        res.send({ status: false, message: "problem doesn't exists" });
        return;
    }
    if (problem.createdBy === ((_a = req.user) === null || _a === void 0 ? void 0 : _a.email)) {
        (0, testcase_1.get_all_test_case)(problem.slug, req.user.email).then(result => res.send(Object.assign(Object.assign({}, result), { name: problem === null || problem === void 0 ? void 0 : problem.name })));
    }
    else
        (0, testcase_1.get_sample_test_case)(problem.slug).then(result => res.send(Object.assign(Object.assign({}, result), { name: problem === null || problem === void 0 ? void 0 : problem.name })));
}));
router.post("/testcases/:slug", authcheck_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    (0, testcase_1.create_test_case)(req.params.slug, req.body.input, req.body.output, req.body.isSample, req.body.explaination, (_b = req.user) === null || _b === void 0 ? void 0 : _b.email).then(result => res.send(result));
}));
router.get("/checkercode/:slug", authcheck_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    let problem = yield problem_2.default.findOne({ slug: req.params.slug });
    if (!problem) {
        res.send({ status: false, message: "problem doesn't exists" });
        return;
    }
    if (((_c = req.user) === null || _c === void 0 ? void 0 : _c.email) !== problem.createdBy) {
        return res.send({ status: false, message: "Unauthorized" });
    }
    return res.send({ status: true, message: "custom checker for problem - " + problem.slug, checker: problem.customChecker, enable: problem.enableCustomChecker });
}));
router.post("/checkercode/:slug", authcheck_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    let problem = yield problem_2.default.findOne({ slug: req.params.slug });
    if (!problem) {
        res.send({ status: false, message: "problem doesn't exists" });
        return;
    }
    if (((_d = req.user) === null || _d === void 0 ? void 0 : _d.email) !== problem.createdBy) {
        return res.send({ status: false, message: "Unauthorized" });
    }
    let checker = req.body.checker;
    if (!checker) {
        return res.send({ status: false, message: "Checker is empty" });
    }
    problem.customChecker = checker;
    problem.enableCustomChecker = req.body.enable ? true : false;
    yield problem.save();
    res.send({ status: true, message: "Checker updated successfully" });
}));
router.post("/problemname", authcheck_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        let slug = req.body.slug;
        if (!slug) {
            return res.send({ status: false, message: "Problem not found" });
        }
        let problem = yield problem_2.default.findOne({ slug });
        if (!problem || !(problem.createdBy === ((_e = req.user) === null || _e === void 0 ? void 0 : _e.email))) {
            return res.send({ status: false, message: "Problem not found" });
        }
        return res.send({ status: true, message: "Problem not found", name: problem.name });
    }
    catch (err) {
        return res.send({ status: false, message: "Unknown error" });
    }
}));
exports.default = router;
