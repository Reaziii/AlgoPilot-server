"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    contestSlug: {
        type: String,
        required: true
    },
    problemSlug: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true,
    }
});
const ContestProblemModel = mongoose_1.default.models.contestproblem || mongoose_1.default.model("contestproblem", schema);
exports.default = ContestProblemModel;
