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
const authcheck_1 = __importDefault(require("../middlewares/authcheck"));
const contest_1 = require("../lib/contest");
const addauthtorequest_1 = __importDefault(require("../middlewares/addauthtorequest"));
const judgeserver_1 = require("../lib/judgeserver");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const standings_1 = require("../lib/standings");
const router = express_1.default.Router();
router.post("/create", authcheck_1.default, (req, res) => {
    var _a;
    const { name, date, time, length, announcement, description, authors } = req.body;
    (0, contest_1.create_contest)(name, date, time, length, announcement, description, authors, (_a = req.user) === null || _a === void 0 ? void 0 : _a.email).then(result => res.send(result));
});
router.post("/checkpermission/:slug", authcheck_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const slug = req.params.slug;
    const email = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) || "";
    (0, contest_1.hasContestPermission)(email, slug).then(result => res.send(result));
}));
router.get("/getdetails/:slug", (req, res) => {
    let slug = req.params.slug;
    (0, contest_1.getContestDetails)(slug).then(result => res.send(result));
});
router.get("/getproblems/:slug", addauthtorequest_1.default, (req, res) => {
    var _a, _b;
    (0, contest_1.get_problems)(req.params.slug, (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email) !== null && _b !== void 0 ? _b : "").then(result => res.send(result));
});
router.post("/addproblems/:slug", authcheck_1.default, (req, res) => {
    var _a, _b;
    (0, contest_1.add_problem)(req.params.slug, (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email) !== null && _b !== void 0 ? _b : "", req.body.problems).then(result => res.send({ status: result }));
});
router.get("/published", (req, res) => {
    (0, contest_1.all_published_contest)().then(result => res.send(result));
});
router.get("/my", authcheck_1.default, (req, res) => {
    var _a, _b;
    (0, contest_1.my_contests)((_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email) !== null && _b !== void 0 ? _b : "").then(result => res.send(result));
});
router.get("/checkiamauthor/:slug", authcheck_1.default, (req, res) => {
    var _a, _b;
    (0, contest_1.checkImAuthor)(req.params.slug, (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email) !== null && _b !== void 0 ? _b : "..").then(result => res.send(result));
});
router.get("/conteststatus/:slug", (req, res) => {
    (0, contest_1.getContestSatus)(req.params.slug).then(result => res.send(result));
});
router.get("/changepublish/:slug", authcheck_1.default, (req, res) => {
    var _a, _b;
    (0, contest_1.changePublishMoode)(req.params.slug, (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email) !== null && _b !== void 0 ? _b : "..").then(result => res.send(result));
});
router.delete("/:slug", authcheck_1.default, (req, res) => {
    var _a, _b;
    (0, contest_1.handleDeleteContest)(req.params.slug, (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email) !== null && _b !== void 0 ? _b : "..").then(result => res.send(result));
});
router.get("/getauthors/:slug", (req, res) => {
    (0, contest_1.get_authors)(req.params.slug).then(result => res.send(result));
});
router.put("/:slug", authcheck_1.default, (req, res) => {
    var _a, _b;
    (0, contest_1.update_contest)(req.params.slug, req.body.name, req.body.date, req.body.time, req.body.length, req.body.announcement, req.body.description, req.body.authors, (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email) !== null && _b !== void 0 ? _b : "").then(result => {
        res.send(result);
    });
});
router.get("/problemdetails/:slug/:position", (req, res) => {
    (0, contest_1.get_contest_problem_details)(req.params.slug, parseInt(req.params.position)).then(result => res.send(result));
});
router.post("/submit/:slug/:position", authcheck_1.default, (req, res) => {
    var _a, _b;
    (0, contest_1.submit_contest_problem_solution)(req.params.slug, parseInt(req.params.position), req.body.code, req.body.language, (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email) !== null && _b !== void 0 ? _b : "").then(result => res.send(result));
});
router.post("/judgeserver/:slug", authcheck_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    let check = yield (0, contest_1.checkImAuthor)(req.params.slug, (_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b.email) !== null && _c !== void 0 ? _c : "");
    if (!check.status) {
        return res.status(404).send({ status: false });
    }
    let token = jsonwebtoken_1.default.sign({ slug: req.params.slug, name: req.body.pcname }, (_d = process.env.TOKENSECRET) !== null && _d !== void 0 ? _d : "HELLO");
    let xxx = yield (0, judgeserver_1.addNewServerTokens)([{
            name: req.body.pcname,
            token,
            slug: req.params.slug,
            status: false
        }]);
    if (xxx.length !== 0) {
        xxx[0].id = String(xxx[0].id);
        return res.send({ data: xxx[0], status: true });
    }
    res.send({ status: false });
}));
router.get("/judgeserver/:slug", authcheck_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    let check = yield (0, contest_1.checkImAuthor)(req.params.slug, (_f = (_e = req.user) === null || _e === void 0 ? void 0 : _e.email) !== null && _f !== void 0 ? _f : "");
    if (!check.status) {
        return res.status(404).send(null);
    }
    (0, judgeserver_1.getAllServerOfAContest)(req.params.slug).then(result => res.send(result));
}));
router.delete("/judgeserver/:slug/:id", authcheck_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h;
    let check = yield (0, contest_1.checkImAuthor)(req.params.slug, (_h = (_g = req.user) === null || _g === void 0 ? void 0 : _g.email) !== null && _h !== void 0 ? _h : "");
    if (!check.status) {
        return res.status(404).send(null);
    }
    (0, judgeserver_1.deleteAServer)(req.params.id).then(result => res.send(result));
}));
router.get("/standings/:slug", (req, res) => {
    (0, standings_1.getStandings)(req.params.slug).then(result => res.send(result));
});
exports.default = router;
