import express, { Request, Response } from 'express'
import { handleLogin, handleRegistration, verifyEmail } from '../lib/auth';

const router = express.Router();

router.post("/login", (req: Request, res: Response) => {
    handleLogin(req.body.email, req.body.password).then(result => res.send(result))
})
router.post("/registration", (req: Request, res: Response) => {
    handleRegistration(req.body.email, req.body.password, req.body.name).then(result => {
        res.send(result)
    })
})

router.post("/verify", (req: Request, res: Response) => {
    verifyEmail(req.body.email, req.body.otp).then(result => res.send(result))
})
export default router;