import UserModel from "../models/user";
import VerificationModel from "../models/verifications";
import generateOTP from "../utils/generate_otp";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sendVerficationCode } from "./sendmail";
export const handleRegistration = async (email: string | undefined, password: string | undefined, name: string | undefined): Promise<{ status: boolean, message: string }> => {
    
    try {
        if (email === undefined || password === undefined || name === undefined) {
            return { status: false, message: "All the files should be filled" };
        }
        let users = await UserModel.findOne({ email });
        if (users !== null) {
            return { status: false, message: "Email already exists!" }
        }
        let hash = await bcrypt.hash(password, 10);
        let otp = generateOTP(6);
        let newVerfication = new VerificationModel({
            name,
            email,
            password : hash,
            otp
        })

        await newVerfication.save();
        await sendVerficationCode(email, otp, name);
        return { status: true, message: "Otp has been sended!" };
    } catch (err) {
        console.log(err);
        return { status: false, message: "something went wrong" }
    }
}

export const verifyEmail = async (email: string | undefined, otp: string | undefined): Promise<{ status: boolean, message: string }> => {
    if (email === undefined || otp === undefined) {
        return { status: false, message: "Fill all the fields" }
    }
    try {
        const _user = await VerificationModel.findOne({ otp, email });
        if (!_user) {
            return { status: false, message: "Email not found!" }
        }
        const newUser = new UserModel({
            name: _user.name,
            email: _user.email,
            password: _user.password
        })
        await newUser.save();
        await VerificationModel.deleteMany({email})
        return { status: true, message: "Verified" }

    }
    catch (err) {
        console.log(err);
        return { status: false, message: "Unknown error" }
    }
}


export const handleLogin = async (email: string | undefined, password: string | undefined): Promise<{ status: boolean, message: string, token?: string }> => {
    if (!email || !password) return { status: false, message: "Email and password are required" }
    try {
        const user = await UserModel.findOne({ email })
        if (!user) {
            return { status: false, message: "Email not found!" }
        }
        let _matched = await bcrypt.compare(password, user.password)
        if (!_matched) {
            return { status: false, message: "Invalid password" }
        }
        let token = jwt.sign({
            email,
            name: user.name,
            permission: user.permission
        }, process.env.TOKENSECRET ?? "HELLO")
        return { status: true, message: "Login successfull", token }

    } catch (err) {
        console.log(err);
        return { status: false, message: "Unknown error" }
    }
}