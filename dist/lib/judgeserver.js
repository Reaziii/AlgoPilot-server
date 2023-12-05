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
exports.getAllServerOfAContest = exports.deleteAServer = exports.addNewServerTokens = exports.JudgeServers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const judgeservers_1 = __importDefault(require("../models/judgeservers"));
const Queue_1 = __importDefault(require("./Queue"));
class JudgeServers {
}
exports.JudgeServers = JudgeServers;
JudgeServers.queue = {};
JudgeServers.verfiytoken = (token) => {
    var _a;
    try {
        let ret = jsonwebtoken_1.default.verify(token, (_a = process.env.TOKENSECRET) !== null && _a !== void 0 ? _a : "HELLO");
        return ret;
    }
    catch (err) {
        return null;
    }
};
JudgeServers.addNewSubmission = (submission_id, contest_slug) => {
    if (JudgeServers.queue[contest_slug]) {
        JudgeServers.queue[contest_slug].enqueue(submission_id);
    }
    else {
        JudgeServers.queue[contest_slug] = new Queue_1.default;
        JudgeServers.queue[contest_slug].enqueue(submission_id);
    }
};
JudgeServers.getSubmissionIdToRun = (contest_slug) => {
    var _a, _b;
    if ((_a = JudgeServers.queue[contest_slug]) === null || _a === void 0 ? void 0 : _a.isEmpty())
        return null;
    return (_b = JudgeServers.queue[contest_slug].dequeue()) !== null && _b !== void 0 ? _b : "";
};
const addNewServerTokens = (servers) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let ret = [];
        for (let i = 0; i < servers.length; i++) {
            let newServer = new judgeservers_1.default(Object.assign({}, servers[i]));
            try {
                yield newServer.save();
                ret.push(Object.assign(Object.assign({}, servers[i]), { id: newServer._id }));
            }
            catch (err) { }
        }
        return ret;
    }
    catch (err) {
        return [];
    }
});
exports.addNewServerTokens = addNewServerTokens;
const deleteAServer = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (yield judgeservers_1.default.deleteOne({ _id: id }));
        return true;
    }
    catch (err) {
        return false;
    }
});
exports.deleteAServer = deleteAServer;
const getAllServerOfAContest = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let ret = yield judgeservers_1.default.find({ slug });
        let ___ = ret.map((item, key) => ({
            name: item.name,
            slug: item.slug,
            token: item.token,
            status: item.status,
            id: item._id
        }));
        return ___;
    }
    catch (err) {
        return [];
    }
});
exports.getAllServerOfAContest = getAllServerOfAContest;
