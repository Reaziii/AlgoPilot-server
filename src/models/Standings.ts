
import mongoose from "mongoose";
import { IStandings } from "../types/main";
let schema = new mongoose.Schema<IStandings & mongoose.Document>({
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

})

const StandingsModel: mongoose.Model<IStandings & mongoose.Document> = mongoose.models.standings || mongoose.model("standings", schema);
export default StandingsModel