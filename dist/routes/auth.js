"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../lib/auth");
const router = express_1.default.Router();
router.post("/login", (req, res) => {
    (0, auth_1.handleLogin)(req.body.email, req.body.password).then(result => res.send(result));
});
router.post("/registration", (req, res) => {
    (0, auth_1.handleRegistration)(req.body.email, req.body.password, req.body.name).then(result => {
        res.send(result);
    });
});
router.post("/verify", (req, res) => {
    (0, auth_1.verifyEmail)(req.body.email, req.body.otp).then(result => res.send(result));
});
exports.default = router;
