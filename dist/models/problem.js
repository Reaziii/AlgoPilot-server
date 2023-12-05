"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    statement: {
        type: String,
        required: true
    },
    inputFormat: {
        type: String,
        required: true,
    },
    outputFormat: {
        type: String,
        required: true,
    },
    customChecker: {
        type: String,
    },
    createdBy: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        required: true
    },
    enableCustomChecker: {
        type: Boolean,
        default: false
    },
    timelimit: {
        type: String,
        default: "1",
    },
    memorylimit: {
        type: String,
        default: "1000000"
    }
});
const ProblemModel = mongoose_1.default.models.problem || (0, mongoose_1.model)('problem', schema);
exports.default = ProblemModel;
