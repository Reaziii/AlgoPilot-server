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
exports.DeleteUser = exports.updateUsersPermission = exports.checkAddProblemToContestPermission = exports.checkProblemAdminPermission = exports.checkProblemCreationPermission = exports.checkContestCreationPermission = exports.get_all_users = void 0;
const user_1 = __importDefault(require("../models/user"));
const author_1 = __importDefault(require("../models/author"));
const get_all_users = (limit, start, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let users = [];
        if (email)
            users = yield user_1.default.find({ email: email });
        else
            users = yield user_1.default.find().limit(limit).skip(limit * start);
        return { users: users };
    }
    catch (err) {
        return { users: [] };
    }
});
exports.get_all_users = get_all_users;
const checkContestCreationPermission = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield user_1.default.findOne({ email: email });
        if (!user)
            return false;
        if (user.permission.admin || user.permission.create_contest)
            return true;
        return false;
    }
    catch (err) {
        return false;
    }
});
exports.checkContestCreationPermission = checkContestCreationPermission;
const checkProblemCreationPermission = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield user_1.default.findOne({ email: email });
        if (!user)
            return false;
        if (user.permission.admin || user.permission.create_problem)
            return true;
        return false;
    }
    catch (err) {
        return false;
    }
});
exports.checkProblemCreationPermission = checkProblemCreationPermission;
const checkProblemAdminPermission = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield user_1.default.findOne({ email: email });
        if (!user)
            return false;
        if (user.permission.admin)
            return true;
        return false;
    }
    catch (err) {
        return false;
    }
});
exports.checkProblemAdminPermission = checkProblemAdminPermission;
const checkAddProblemToContestPermission = (email, slug) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let author = yield author_1.default.findOne({ email, slug });
        if (!author)
            return false;
        return true;
    }
    catch (err) {
        return false;
    }
});
exports.checkAddProblemToContestPermission = checkAddProblemToContestPermission;
const updateUsersPermission = (item, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let User = yield user_1.default.findOne({ email });
        if (!User)
            return false;
        if (item === 'admin')
            User.permission.admin = !User.permission.admin;
        if (item === 'contest')
            User.permission.create_contest = !User.permission.create_contest;
        if (item === 'problem')
            User.permission.create_problem = !User.permission.create_problem;
        yield User.save();
        return true;
    }
    catch (err) {
        return false;
    }
});
exports.updateUsersPermission = updateUsersPermission;
const DeleteUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let User = yield user_1.default.findOne({ email });
        if (!User)
            return false;
        yield User.deleteOne();
        return true;
    }
    catch (err) {
        return false;
    }
});
exports.DeleteUser = DeleteUser;
