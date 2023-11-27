import ProblemModel from "../models/problem";
import { get_current_time } from "../utils/utils";
import { SubmittedStatus } from "../utils/enum";
import SubmissionModel from "../models/submission";
import ContestSubmissionModel from "../models/contestSubmission";
import { IProblem, ISubmission } from "../types/main";
export const submitACode = async (code: string, language: string, problemSlug: string, email: string): Promise<string | null> => {
    try {
        let time = get_current_time();
        let problem = await ProblemModel.findOne({ slug: problemSlug });
        if (!problem) throw "Problem doesn't exists - " + problemSlug;

        let submission = new SubmissionModel({
            code,
            language,
            problemSlug,
            user: email,
            submission_time: time,
            status: SubmittedStatus.Pending
        })
        await submission.save();
        return submission.id;
    } catch (err) {
        console.log(err);
        return null
    }
}

export const submissionDetails = async (id: string, email: string): Promise<{ status: boolean, submission?: ISubmission, problem?: IProblem }> => {
    try {
        let submission = await SubmissionModel.findById(id);
        if (!submission || submission.user !== email) throw "submission not found";
        let problem = await ProblemModel.findOne({ slug: submission.problemSlug });
        if (!problem) throw "problem not found";
        return { status: true, problem, submission }
    } catch (errs) {
        console.log(errs)
        return { status: false };
    }
}

export const get_problem_by_sub_id = async (id: string): Promise<{ position: number, slug: string } | null> => {
    try {
        let submission = await SubmissionModel.findById(id);
        if (!submission) throw "Submission not found"
        let contest = await ContestSubmissionModel.findOne({ submission_id: id });
        if (!contest) throw "";
        return { position: contest.position, slug: contest.contsetSlug }
    } catch (err) {
        return null;
    }
}