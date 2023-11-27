import express, { Request, Response } from 'express'
import authcheck from '../middlewares/authcheck';
import { AuthenticatedRequest, IContest, IProblem, ITestcase } from '../types/main';
import { add_problem, all_published_contest, changePublishMoode, checkImAuthor, create_contest, getContestDetails, getContestSatus, get_authors, get_contest_problem_details, get_problems, handleDeleteContest, hasContestPermission, my_contests, submit_contest_problem_solution, update_contest } from '../lib/contest';
import addauthtorequest from '../middlewares/addauthtorequest';
import { addNewServerTokens, deleteAServer, getAllServerOfAContest } from '../lib/judgeserver';
import jwt from 'jsonwebtoken'
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
    add_problem(req.params.slug, req.user?.email ?? "", req.body.problems).then(result => res.send({ status: result }))
})

router.get("/published", (req: Request, res: Response<{ contests: IContest[] }>) => {
    all_published_contest().then(result => res.send(result))
})

router.get("/my", authcheck, (req: AuthenticatedRequest, res: Response<{ contests: IContest[] }>) => {
    my_contests(req.user?.email ?? "").then(result => res.send(result))
})

router.get("/checkiamauthor/:slug", authcheck, (req: AuthenticatedRequest, res: Response<{ status: boolean }>) => {
    checkImAuthor(req.params.slug, req.user?.email ?? "..").then(result => res.send(result))
})

router.get("/conteststatus/:slug", (req: Request, res: Response<"running" | "finished" | "upcoming" | "error">) => {
    getContestSatus(req.params.slug).then(result => res.send(result))
})

router.get("/changepublish/:slug", authcheck, (req: AuthenticatedRequest, res: Response<Boolean>) => {
    changePublishMoode(req.params.slug, req.user?.email ?? "..").then(result => res.send(result))
})

router.delete("/:slug", authcheck, (req: AuthenticatedRequest, res: Response<Boolean>) => {
    handleDeleteContest(req.params.slug, req.user?.email ?? "..").then(result => res.send(result))
})

router.get("/getauthors/:slug", (req: Request, res: Response) => {
    get_authors(req.params.slug).then(result => res.send(result))
})

router.put("/:slug", authcheck, (req: AuthenticatedRequest, res: Response<{ status: boolean, message: string, slug?: string }>) => {
    update_contest(req.params.slug, req.body.name, req.body.date, req.body.time, req.body.length, req.body.announcement, req.body.description, req.body.authors, req.user?.email ?? "").then(result => {
        res.send(result)
    })
})

router.get("/problemdetails/:slug/:position", (req: Request, res: Response<{ status: boolean, problem?: IProblem, test_cases?: ITestcase[] }>) => {
    get_contest_problem_details(req.params.slug, parseInt(req.params.position)).then(result => res.send(result));
})

router.post("/submit/:slug/:position", authcheck, (req: AuthenticatedRequest, res: Response) => {
    submit_contest_problem_solution(req.params.slug, parseInt(req.params.position), req.body.code, req.body.language, req.user?.email ?? "").then(result => res.send(result))
})


router.post("/judgeserver/:slug", authcheck, async (req: AuthenticatedRequest, res: Response) => {
    let check = await checkImAuthor(req.params.slug, req.user?.email ?? "")
    if (!check.status) {
        return res.status(404).send({ status: false });
    }
    let token = jwt.sign({ slug: req.params.slug, name: req.body.pcname }, process.env.TOKENSECRET ?? "HELLO");
    let xxx = await addNewServerTokens([{
        name: req.body.pcname,
        token,
        slug: req.params.slug,
        status: false
    }]);
    if (xxx.length !== 0) {
        xxx[0].id = String(xxx[0].id);
        return res.send({ data: xxx[0], status: true })
    }
    res.send({ status: false })
})
router.get("/judgeserver/:slug", authcheck, async (req: AuthenticatedRequest, res: Response) => {
    let check = await checkImAuthor(req.params.slug, req.user?.email ?? "")
    if (!check.status) {
        return res.status(404).send(null);
    }
    getAllServerOfAContest(req.params.slug).then(result => res.send(result))
})


router.delete("/judgeserver/:slug/:id", authcheck, async (req: AuthenticatedRequest, res: Response) => {
    let check = await checkImAuthor(req.params.slug, req.user?.email ?? "")
    if (!check.status) {
        return res.status(404).send(null);
    }
    deleteAServer(req.params.id).then(result => res.send(result))
})

export default router;