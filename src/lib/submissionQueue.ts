import ProblemModel from "../models/problem";
import SubmissionModel from "../models/submission";
import SubmissionQueueModel from "../models/submissionQueue"
import TestcaseModel from "../models/testcase";
import { ITestcase } from "../types/main";
import { get_current_time } from "../utils/utils"


export const addNewSubmissionToQueue = async (contsetSlugslug: string, sub_id: string): Promise<{ status: boolean }> => {
    try {
        const sub = new SubmissionQueueModel({
            slug: contsetSlugslug,
            submission: sub_id,
            time: get_current_time().getTime()
        });
        await sub.save();
        return { status: true }
    } catch (err) {
        return { status: false }
    }
}

export const getLastSubmissionFromQueue = async (slug: string): Promise<{ status: boolean, submission?: { code: string, testcases: { input: string, output: string, id: string }[], checker: string, enable: boolean, sub_id: string, timelimit: string, memorylimit: string, language: string } }> => {
    try {
        let lastsub = await SubmissionQueueModel.findOne({ slug, running: false }).sort("-time").exec();
        if (!lastsub) throw "";
        let submission = await SubmissionModel.findById(lastsub.submission);
        if (!submission) throw "";
        let problem = await ProblemModel.findOne({ slug: submission.problemSlug });
        if (!problem) throw "";
        let test_cases: { input: string, output: string, id: string }[] = (await TestcaseModel.find({ slug: submission.problemSlug })).map(item => ({
            input: item.input,
            output: item.output,
            id: item._id
        }));
        lastsub.running = true;
        await lastsub.save();
        setTimeout(async () => {
            let sss = await SubmissionQueueModel.findOne(lastsub?._id)
            if (sss?.running) {
                sss.running = false;
                await sss.save();
            }
        }, 60 * 1000)
        return {
            status: true,
            submission: {
                code: submission.code,
                testcases: test_cases,
                checker: problem.customChecker,
                enable: problem.enableCustomChecker,
                sub_id: submission._id,
                timelimit: problem.timelimit,
                memorylimit: problem.memorylimit,
                language: submission.language

            }
        }
    } catch (err) {
        return { status: false }
    }
}