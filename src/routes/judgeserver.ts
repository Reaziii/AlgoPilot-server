import express, { Response } from 'express'
import judgecheck from '../middlewares/judgecheck';
import { AuthenticatedRequest } from '../types/main';
import { getLastSubmissionFromQueue } from '../lib/submissionQueue';
const router = express();


router.post("/", judgecheck, (req: AuthenticatedRequest, res: Response) => {
    getLastSubmissionFromQueue(req.judge?.slug ?? "").then(result => {
        res.send(result)
    })
})




export default router;