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
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authcheck_1 = __importDefault(require("../middlewares/authcheck"));
const admincheck_1 = __importDefault(require("../middlewares/admincheck"));
const user_2 = require("../lib/user");
const router = express_1.default.Router();
router.post("/check", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = req.body.token;
        if (!token)
            throw "";
        const user = jsonwebtoken_1.default.verify(token, (_a = process.env.TOKENSECRET) !== null && _a !== void 0 ? _a : "HELLO");
        let _user = yield user_1.default.findOne({ email: user.email });
        if (!_user)
            throw "";
        res.send({ isLoogedIn: true, name: user.name, email: user.email, token, permissions: _user.permission });
    }
    catch (err) {
        res.send({ isLoogedIn: false, name: "", email: "", token: "", permissions: { admin: false, create_contest: false, create_problem: false } });
    }
}));
router.post("/checkforauthors", authcheck_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let authors = req.body.authors;
        if (authors === undefined || !authors) {
            return res.send({ status: false, message: "Item can't be empty" });
        }
        let __authors = authors.replace(new RegExp(" ", 'g'), "");
        let _authors = __authors.split(',');
        let _final = [];
        for (let i = 0; i < _authors.length; i++) {
            let user = yield user_1.default.findOne({ email: _authors[i] });
            if (!user) {
                _final.push({
                    found: false,
                    email: _authors[i],
                    name: "",
                });
            }
            else {
                _final.push({
                    found: true,
                    email: _authors[i],
                    name: user.name,
                });
            }
        }
        return res.send({ status: true, message: "", result: _final });
    }
    catch (err) {
        return res.send({ status: false, message: "Unknown error" });
    }
}));
router.post("/getallusers", admincheck_1.default, (req, res) => {
    (0, user_2.get_all_users)(req.body.limit, req.body.start, req.body.email).then(result => res.send(result));
});
router.put("/updatepermission", admincheck_1.default, (req, res) => {
    (0, user_2.updateUsersPermission)(req.body.item, req.body.email).then(result => res.send(result));
});
router.delete("/:email", admincheck_1.default, (req, res) => {
    (0, user_2.DeleteUser)(req.params.email).then(result => res.send(result));
});
exports.default = router;
