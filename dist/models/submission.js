"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let schema = new mongoose_1.default.Schema({
    code: {
        type: String,
        required: true
    },
    submission_time: {
        type: Date,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    problemSlug: {
        type: String,
        required: true,
    },
    status: {
        type: { status: Number, text: String, color: String, time: Number, memory: Number },
        required: true
    },
    testcases: {
        type: [{ status: Number, text: String, color: String, tcid: String, time: Number, memory: Number }],
        default: [],
        required: true
    },
    memory: {
        type: Number,
        default: 0,
        required: true,
    },
    time: {
        type: Number,
        default: 0,
        required: true,
    },
});
const SubmissionModel = mongoose_1.default.models.submission || mongoose_1.default.model("submission", schema);
exports.default = SubmissionModel;
