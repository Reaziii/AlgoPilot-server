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


router.post("/verdict/:subid/:tcid", (req:AuthenticatedRequest, res:Response)=>{
    console.log(req.body)
    return res.status(200).send({success : true})

})



export default router;