import express, { Request, Response } from 'express'
import { create_problem, get_problem_details } from '../lib/problem';
import { AuthenticatedRequest } from '../types/main';
import authcheck from '../middlewares/authcheck';
import addauthtorequest from '../middlewares/addauthtorequest';
import ProblemModel from '../models/problem';
import { create_test_case, get_all_test_case, get_sample_test_case } from '../lib/testcase';
const router = express.Router();

router.post("/create", authcheck, (req: AuthenticatedRequest, res: Response) => {
    create_problem(req.body.name, req.body.statement, req.body.inputformat, req.body.outputformat, req.user?.email, req.body.timelimit, req.body.memorylimit).then(result => res.send(result))
})

router.get("/details/:contestslug", (req: AuthenticatedRequest, res: Response) => {
    get_problem_details(req.params.contestslug).then(result => res.send(result))
})

router.get("/testcases/:slug", addauthtorequest, async (req: AuthenticatedRequest, res: Response) => {
    let problem = await ProblemModel.findOne({ slug: req.params.slug });
    if (!problem) {
        res.send({ status: false, message: "problem doesn't exists" });
        return;
    }
    if (problem.createdBy === req.user?.email) {
        get_all_test_case(problem.slug, req.user.email).then(result => res.send({ ...result, name: problem?.name }));
    }
    else get_sample_test_case(problem.slug).then(result => res.send({ ...result, name: problem?.name }))
})

router.post("/testcases/:slug", authcheck, async (req: AuthenticatedRequest, res: Response) => {
    create_test_case(req.params.slug, req.body.input, req.body.output, req.body.isSample, req.body.explaination, req.user?.email).then(result => res.send(result))
})

router.get("/checkercode/:slug", authcheck, async (req: AuthenticatedRequest, res: Response) => {
    let problem = await ProblemModel.findOne({ slug: req.params.slug });
    if (!problem) {
        res.send({ status: false, message: "problem doesn't exists" });
        return;
    }
    if (req.user?.email !== problem.createdBy) {
        return res.send({ status: false, message: "Unauthorized" });
    }
    return res.send({ status: true, message: "custom checker for problem - " + problem.slug, checker: problem.customChecker, enable: problem.enableCustomChecker })
})

router.post("/checkercode/:slug", authcheck, async (req: AuthenticatedRequest, res: Response<{ status: boolean, message: string }>) => {
    let problem = await ProblemModel.findOne({ slug: req.params.slug });
    if (!problem) {
        res.send({ status: false, message: "problem doesn't exists" });
        return;
    }
    if (req.user?.email !== problem.createdBy) {
        return res.send({ status: false, message: "Unauthorized" });
    }
    let checker = req.body.checker as string | undefined;
    if (!checker) {
        return res.send({ status: false, message: "Checker is empty" })
    }
    problem.customChecker = checker;
    problem.enableCustomChecker = req.body.enable ? true : false;
    await problem.save();
    res.send({ status: true, message: "Checker updated successfully" })
})

router.post("/problemname", authcheck, async (req: AuthenticatedRequest, res: Response<{ status: boolean, message: string, name?: string }>) => {
    try {
        let slug = req.body.slug as string | undefined;
        if (!slug) {
            return res.send({ status: false, message: "Problem not found" })
        }
        let problem = await ProblemModel.findOne({ slug });
        if (!problem || !(problem.createdBy === req.user?.email)) {
            return res.send({ status: false, message: "Problem not found" })
        }
        return res.send({ status: true, message: "Problem not found", name: problem.name })

    } catch (err) {
        return res.send({ status: false, message: "Unknown error" })
    }
})

export default router;