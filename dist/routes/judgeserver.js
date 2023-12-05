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
const judgecheck_1 = __importDefault(require("../middlewares/judgecheck"));
const submissionQueue_1 = require("../lib/submissionQueue");
const router = (0, express_1.default)();
router.post("/", judgecheck_1.default, (req, res) => {
    var _a, _b;
    (0, submissionQueue_1.getLastSubmissionFromQueue)((_b = (_a = req.judge) === null || _a === void 0 ? void 0 : _a.slug) !== null && _b !== void 0 ? _b : "").then(result => {
        res.send(result);
    });
});
router.post("/verdict/:subid/:tcid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, submissionQueue_1.get_submission)(req.params.subid, req.params.tcid, req.body);
    return res.status(200).send({ success: true });
}));
exports.default = router;
