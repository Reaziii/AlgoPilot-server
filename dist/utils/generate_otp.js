"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateOTP(otpLength) {
    const otp = Math.floor(Math.pow(10, otpLength - 1) + Math.random() * 9 * Math.pow(10, otpLength - 1));
    return otp.toString();
}
exports.default = generateOTP;
