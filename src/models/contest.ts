
import mongoose, { Schema, model, Document, Model } from "mongoose";
import { IContest } from "../types/main";
const schema = new Schema<IContest & Document>({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    len: {
        type: String,
        required: true,
    },
    announcement: String,
    description: String,
    createdBy: {
        type: String,
        required: true
    },
    published: {
        type: Boolean,
        default: false
    }
})

const ContestModel: Model<IContest & Document> = mongoose.models.contest || mongoose.model<IContest & Document>('contest', schema);
export default ContestModel