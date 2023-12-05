"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let schema = new mongoose_1.default.Schema({
    cid: { type: String, required: true },
    position: { type: Number, required: true },
    status: { type: Boolean, required: true },
    delay: { type: Number, required: true },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});
const StandingsModel = mongoose_1.default.models.standings || mongoose_1.default.model("standings", schema);
exports.default = StandingsModel;
