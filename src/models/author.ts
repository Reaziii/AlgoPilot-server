import mongoose from "mongoose";
import { IContestAuthors } from "../types/main";
const schema = new mongoose.Schema<IContestAuthors & mongoose.Document>({
    slug: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true

    }
});
const AuthorModel: mongoose.Model<IContestAuthors & mongoose.Document> = mongoose.models.authors || mongoose.model("authors", schema);
export default AuthorModel