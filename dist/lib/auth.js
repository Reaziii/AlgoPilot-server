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
exports.handleLogin = exports.verifyEmail = exports.handleRegistration = void 0;
const user_1 = __importDefault(require("../models/user"));
const verifications_1 = __importDefault(require("../models/verifications"));
const generate_otp_1 = __importDefault(require("../utils/generate_otp"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendmail_1 = require("./sendmail");
const handleRegistration = (email, password, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (email === undefined || password === undefined || name === undefined) {
            return { status: false, message: "All the files should be filled" };
        }
        let users = yield user_1.default.findOne({ email });
        if (users !== null) {
            return { status: false, message: "Email already exists!" };
        }
        let hash = yield bcrypt_1.default.hash(password, 10);
        let otp = (0, generate_otp_1.default)(6);
        let newVerfication = new verifications_1.default({
            name,
            email,
            password: hash,
            otp
        });
        yield newVerfication.save();
        yield (0, sendmail_1.sendVerficationCode)(email, otp, name);
        return { status: true, message: "Otp has been sended!" };
    }
    catch (err) {
        return { status: false, message: "something went wrong" };
    }
});
exports.handleRegistration = handleRegistration;
const verifyEmail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    if (email === undefined || otp === undefined) {
        return { status: false, message: "Fill all the fields" };
    }
    try {
        const _user = yield verifications_1.default.findOne({ otp, email });
        if (!_user) {
            return { status: false, message: "Email not found!" };
        }
        const newUser = new user_1.default({
            name: _user.name,
            email: _user.email,
            password: _user.password
        });
        yield newUser.save();
        yield verifications_1.default.deleteMany({ email });
        return { status: true, message: "Verified" };
    }
    catch (err) {
        return { status: false, message: "Unknown error" };
    }
});
exports.verifyEmail = verifyEmail;
const handleLogin = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!email || !password)
        return { status: false, message: "Email and password are required" };
    try {
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return { status: false, message: "Email not found!" };
        }
        let _matched = yield bcrypt_1.default.compare(password, user.password);
        if (!_matched) {
            return { status: false, message: "Invalid password" };
        }
        let token = jsonwebtoken_1.default.sign({
            email,
            name: user.name,
            permission: user.permission
        }, (_a = process.env.TOKENSECRET) !== null && _a !== void 0 ? _a : "HELLO");
        return { status: true, message: "Login successfull", token };
    }
    catch (err) {
        return { status: false, message: "Unknown error" };
    }
});
exports.handleLogin = handleLogin;
