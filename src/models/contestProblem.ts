import mongoose from "mongoose";
import { IContestProblem } from "../types/main";
const schema = new mongoose.Schema<IContestProblem & mongoose.Document>({
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
const ContestProblemModel: mongoose.Model<IContestProblem & mongoose.Document> = mongoose.models.contestproblem || mongoose.model("contestproblem", schema);
export default ContestProblemModel