
import mongoose, { Schema, model, Document, Model } from "mongoose";
import { ISubmissionQueue } from "../types/main";
const schema = new Schema<ISubmissionQueue & Document>({
    time: {
        type: Number,
        required: true,
    },
    submission: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    running: {
        type: Boolean,
        default: false
    }
})

const SubmissionQueueModel: Model<ISubmissionQueue & Document> = mongoose.models.submissionqueue || model<ISubmissionQueue & Document>('submissionqueue', schema);
export default SubmissionQueueModel