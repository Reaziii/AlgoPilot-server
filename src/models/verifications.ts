
import mongoose, { Schema, model, Document } from "mongoose";

import { IVerifications } from "../types/main";


const schema = new Schema<IVerifications & Document>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true
    }
})

const VerificationModel = mongoose.models.verfications || model<IVerifications>('verfications', schema);
export default VerificationModel