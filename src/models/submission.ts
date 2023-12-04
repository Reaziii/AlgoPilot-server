
import mongoose from "mongoose";
import { ISubmission } from "../types/main";
let schema = new mongoose.Schema<ISubmission & mongoose.Document>({
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
        type: { status: Number, text: String, color: String, time:Number, memory:Number },
        required: true
    },
    testcases: {
        type: [{ status: Number, text: String, color: String, tcid: String, time:Number, memory:Number }],
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
})

const SubmissionModel: mongoose.Model<ISubmission & mongoose.Document> = mongoose.models.submission || mongoose.model("submission", schema);
export default SubmissionModel