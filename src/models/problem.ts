
import mongoose, { Schema, model, Document, Model } from "mongoose";
import { IProblem } from "../types/main";
const schema = new Schema<IProblem & Document>({
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
    }
    ,
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
})

const ProblemModel: Model<IProblem & Document> = mongoose.models.problem || model<IProblem & Document>('problem', schema);
export default ProblemModel