import express, { Request, Response } from 'express'
import authcheck from '../middlewares/authcheck';
import { AuthenticatedRequest, IProblem } from '../types/main';
import { add_problem, create_contest, getContestDetails, get_problems, hasContestPermission } from '../lib/contest';
import AuthorModel from '../models/author';
import addauthtorequest from '../middlewares/addauthtorequest';

const router = express.Router();

router.post("/create", authcheck, (req: AuthenticatedRequest, res: Response) => {
    const { name, date, time, length, announcement, description, authors } = req.body;
    create_contest(name, date, time, length, announcement, description, authors, req.user?.email).then(result => res.send(result))
})

router.post("/checkpermission/:slug", authcheck, async (req: AuthenticatedRequest, res: Response) => {
    const slug = req.params.slug;
    const email = req.user?.email || "";
    hasContestPermission(email, slug).then(result => res.send(result))
})


router.get("/getdetails/:slug", (req: Request, res: Response) => {
    let slug = req.params.slug;
    getContestDetails(slug).then(result => res.send(result))
})

router.get("/getproblems/:slug", addauthtorequest, (req: AuthenticatedRequest, res: Response<{ problems: IProblem[] }>) => {
    get_problems(req.params.slug, req.user?.email ?? "").then(result => res.send(result))
})

router.post("/addproblems/:slug", authcheck, (req: AuthenticatedRequest, res: Response<{ status: boolean }>) => {
    console.log(req.body.problems)
    add_problem(req.params.slug, req.user?.email ?? "", req.body.problems).then(result => res.send({ status: result }))
})

export default router;