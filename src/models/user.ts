
import mongoose, { Mongoose, Schema, model, Document, Model } from "mongoose";
import { IUser } from "../types/main";


const schema = new Schema<IUser & Document>({
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
    permission: {
        type: { create_contest: Boolean, create_problem: Boolean, admin: Boolean },
        default: {
            create_contest: false,
            admin: false,
            create_problem: false
        },
    }
})

const UserModel: Model<IUser & Document> = mongoose.models.user || model<IUser & Document>('user', schema);
export default UserModel