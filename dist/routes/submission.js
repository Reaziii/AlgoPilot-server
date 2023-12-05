"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authcheck_1 = __importDefault(require("../middlewares/authcheck"));
const submission_1 = require("../lib/submission");
const router = (0, express_1.default)();
router.post("/", authcheck_1.default, (req, res) => {
    var _a, _b;
    (0, submission_1.submitACode)(req.body.code, req.body.language, req.body.problemSlug, (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email) !== null && _b !== void 0 ? _b : "").then(result => res.send(result));
});
router.get("/getproblem/:id", (req, res) => {
    (0, submission_1.get_problem_by_sub_id)(req.params.id).then(result => res.send(result));
});
router.get("/details/:id", authcheck_1.default, (req, res) => {
    var _a, _b;
    (0, submission_1.submissionDetails)(req.params.id, (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email) !== null && _b !== void 0 ? _b : "").then(result => res.send(result));
});
exports.default = router;
