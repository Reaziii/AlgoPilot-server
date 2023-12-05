"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    slug: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});
const AuthorModel = mongoose_1.default.models.authors || mongoose_1.default.model("authors", schema);
exports.default = AuthorModel;
