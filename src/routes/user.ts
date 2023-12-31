
import express, { Request, Response } from 'express'
import UserModel from '../models/user';
import { AuthenticatedRequest, IPermission, IToken, IUser } from '../types/main';
import jwt from 'jsonwebtoken'
import authcheck from '../middlewares/authcheck';
import admincheck from '../middlewares/admincheck';
import { DeleteUser, get_all_users, updateUsersPermission } from '../lib/user';
const router = express.Router();
router.post("/check", async (req: Request, res: Response<IToken>) => {
    try {
        const token = req.body.token;
        if (!token) throw "";
        const user = jwt.verify(token, process.env.TOKENSECRET ?? "HELLO") as { name: string, email: string, permission: IPermission };
        let _user = await UserModel.findOne({ email: user.email });
        if (!_user) throw "";
        res.send({ isLoogedIn: true, name: user.name, email: user.email, token, permissions: _user.permission })
    }
    catch (err) {
        res.send({ isLoogedIn: false, name: "", email: "", token: "", permissions: { admin: false, create_contest: false, create_problem: false } })
    }
})


router.post("/checkforauthors", authcheck, async (req: AuthenticatedRequest, res: Response) => {
    try {
        let authors = req.body.authors as string | undefined;
        if (authors === undefined || !authors) {
            return res.send({ status: false, message: "Item can't be empty" })
        }
        let __authors = authors.replace(new RegExp(" ", 'g'), "")
        let _authors: string[] = __authors.split(',');
        let _final: { name: string; email: string; found: boolean }[] = [];

        for (let i = 0; i < _authors.length; i++) {
            let user = await UserModel.findOne({ email: _authors[i] });
            if (!user) {
                _final.push({
                    found: false,
                    email: _authors[i],
                    name: "",
                })
            }
            else {
                _final.push({
                    found: true,
                    email: _authors[i],
                    name: user.name,
                })
            }
        }
        return res.send({ status: true, message: "", result: _final })
    } catch (err) {
        return res.send({ status: false, message: "Unknown error" })
    }
})



router.post("/getallusers", admincheck, (req: AuthenticatedRequest, res: Response<{ users: IUser[] }>) => {
    get_all_users(req.body.limit, req.body.start, req.body.email).then(result => res.send(result))
})

router.put("/updatepermission", admincheck, (req: Request, res: Response<boolean>) => {
    updateUsersPermission(req.body.item, req.body.email).then(result => res.send(result))
})


router.delete("/:email", admincheck, (req: Request, res: Response) => {
    DeleteUser(req.params.email).then(result => res.send(result))
})

export default router;