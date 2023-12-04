import express, { Response } from 'express'
import judgecheck from '../middlewares/judgecheck';
import { AuthenticatedRequest } from '../types/main';
import { getLastSubmissionFromQueue, get_submission } from '../lib/submissionQueue';
const router = express();


router.post("/", judgecheck, (req: AuthenticatedRequest, res: Response) => {
    getLastSubmissionFromQueue(req.judge?.slug ?? "").then(result => {
        res.send(result)
    })
})


router.post("/verdict/:subid/:tcid", async (req: AuthenticatedRequest, res: Response) => {
    await get_submission(req.params.subid, req.params.tcid, req.body);
    return res.status(200).send({ success: true })

})



export default router;