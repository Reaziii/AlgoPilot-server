import mongoose from "mongoose";
import { IJudgeServerToken } from "../types/main";
const schema = new mongoose.Schema<IJudgeServerToken & mongoose.Document>({
    slug: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }

});
const JudgeTokenModel: mongoose.Model<IJudgeServerToken & mongoose.Document> = mongoose.models.judgetokens || mongoose.model("judgetokens", schema);
export default JudgeTokenModel