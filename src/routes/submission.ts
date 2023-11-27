import express, { Request, Response } from "express";
import authcheck from "../middlewares/authcheck";
import { AuthenticatedRequest } from "../types/main";
import { get_problem_by_sub_id, submissionDetails, submitACode } from "../lib/submission";


const router = express();

router.post("/", authcheck, (req: AuthenticatedRequest, res: Response<string | null>) => {
    submitACode(req.body.code, req.body.language, req.body.problemSlug, req.user?.email ?? "").then(result => res.send(result))
})

router.get("/getproblem/:id", (req: Request, res: Response) => {
    get_problem_by_sub_id(req.params.id).then(result => res.send(result));
})

router.get("/details/:id", authcheck, (req: AuthenticatedRequest, res: Response) => {
    submissionDetails(req.params.id, req.user?.email ?? "").then(result => res.send(result))
})




export default router;