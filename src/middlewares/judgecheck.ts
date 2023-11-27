import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/main";
import JudgeTokenModel from "../models/judgeservers";
export default async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        let token = req.headers.authorization as string | undefined | null;
        if (!token) {
            return res.send({ status: false, message: "unauthorized" });
        }
        let _judge = await JudgeTokenModel.findOne({ token: token });
        if (!_judge) throw "";
        req.judge = {
            slug: _judge.slug,
            name: _judge.name
        }
        next();
    }
    catch (err) {
        return res.status(404).send({ status: false, message: "unauthorized" });
    }
}

