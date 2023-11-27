
import mongoose, { Schema, model, Document, Model } from "mongoose";
import { IContestSubmission } from "../types/main";
const schema = new Schema<IContestSubmission & Document>({
    contsetSlug: {
        type: String,
        required: true,
    },
    submission_id: {
        type: String,
        required: true,
    },
    position: {
        type: Number,
        required: true,
    },
    user: {
        type: "String",
        required: true,
    }
})

const ContestSubmissionModel: Model<IContestSubmission & Document> = mongoose.models.contestsubmission || model<IContestSubmission & Document>('contestsubmission', schema);
export default ContestSubmissionModel