import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { AuthenticatedRequest, IPermission } from "../types/main";
import UserModel from "../models/user";
export default async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        let token = req.headers.authorization as string | undefined | null;
        if (!token) {
            return res.send({ status: false, message: "unauthorized" });
        }
        let user = jwt.verify(token, process.env.TOKENSECRET ?? "HELLO") as { name: string; email: string; permission: IPermission };
        let check = await UserModel.findOne({ email: user.email });
        if (!check) throw "";
        req.user = {
            name: check.name, email: check.email, permission: check.permission
        }
        next();
    }
    catch (err) {
        return res.send({ status: false, message: "unauthorized" });
    }
}

