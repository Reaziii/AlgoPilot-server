import ProblemModel from "../models/problem";
import SubmissionModel from "../models/submission";
import SubmissionQueueModel from "../models/submissionQueue"
import TestcaseModel from "../models/testcase";
import { ITestcase } from "../types/main";
import { SubmittedStatus } from "../utils/enum";
import { addDateAndTime, get_current_time } from "../utils/utils"
import submissionSocket from '../sockets/submission'
import ContestSubmissionModel from "../models/contestSubmission";
import ContestModel from "../models/contest";
import StandingsModel from "../models/Standings";
import UserModel from "../models/user";
import { getContestSatus } from "./contest";

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

export const contest_final_submission = async (subid: string, status: boolean) => {
    const submission = await SubmissionModel.findById(subid);
    if (!submission) return;
    let contest_sub = await ContestSubmissionModel.findOne({ submission_id: subid });
    if (!contest_sub) {
        return;
    }
    let contest = await ContestModel.findOne({ slug: contest_sub.contsetSlug });
    if (!contest) return;
    console.log(subid)

    let check = await getContestSatus(contest.slug);
    if (check !== "running") return;
    let user = await UserModel.findOne({ email: contest_sub.user });
    if (!user) return;
    let delay = new Date(submission.submission_time).getTime() - new Date(addDateAndTime(contest.date, contest.time)).getTime();
    delay /= 1000;
    delay /= 60;
    delay = Math.floor(delay);
    let find = await StandingsModel.findOne({ cid: contest.slug, status: true, email: contest_sub.user, position: contest_sub.position });
    console.log(find);
    if (find) return;
    let standing = new StandingsModel({
        email: user?.email,
        name: user?.name,
        position: contest_sub.position,
        delay: delay,
        cid: contest.slug,
        status: status

    })
    await standing.save();
}


export const get_submission = async (sub_id: string, tcid: string, status: { status: string, judge?: { time: number, memory: number, signal: number, exit_code: number, error: number, result: number } }) => {
    try {
        let submission = await SubmissionModel.findById(sub_id);
        if (!submission) throw "";
        submission.memory = status.judge?.memory ?? 0;
        submission.time = status.judge?.time ?? 0;
        await submission.save();
        let statuscode = parseInt(status.status);
        let _status: { status: number, color: string, text: string, memory: number, time: number } = { status: SubmittedStatus.Pending.status, color: SubmittedStatus.Pending.color, text: SubmittedStatus.Pending.text, memory: status.judge?.memory ?? 0, time: status.judge?.time ?? 0 };

        if (statuscode === 1) {
            _status = { status: SubmittedStatus.AC.status, color: SubmittedStatus.AC.color, text: SubmittedStatus.AC.text, memory: status.judge?.memory ?? 0, time: status.judge?.time ?? 0 };
        }
        else if (statuscode === -1 || statuscode === 0) {
            if (status.judge?.result === 0)
                _status = { status: SubmittedStatus.WA.status, color: SubmittedStatus.WA.color, text: SubmittedStatus.WA.text, memory: status.judge?.memory ?? 0, time: status.judge?.time ?? 0 };
            else {
                _status = { status: SubmittedStatus.get(status.judge?.result ?? 0).status, color: SubmittedStatus.get(status.judge?.result ?? 0).color, text: SubmittedStatus.get(status.judge?.result ?? 0).text, memory: status.judge?.memory ?? 0, time: status.judge?.time ?? 0 };
            }
        }
        else if (statuscode === 8 || statuscode === 4 || statuscode === 9) {
            _status = { status: SubmittedStatus.get(statuscode).status, color: SubmittedStatus.get(statuscode).color, text: SubmittedStatus.get(statuscode).text, memory: status.judge?.memory ?? 0, time: status.judge?.time ?? 0 };
        }
        else if (statuscode === 100) {
            let status = submission.status;

            contest_final_submission(sub_id, status.status === SubmittedStatus.AC.status);


            submissionSocket.tellFinalSubmissionStatus(sub_id, submission.status);
            return;
        }
        if (SubmittedStatus.Running.status !== statuscode && statuscode !== SubmittedStatus.Skipped.status)
            submission.status = _status;
        for (let i = 0; i < submission.testcases.length; i++) {
            if (submission.testcases[i].tcid === tcid) {
                submission.testcases[i] = { ..._status, tcid: tcid };
            }
        }
        submissionSocket.tellSubmissionStatus(sub_id, { ..._status, tcid: tcid })
        await submission.save();
        return
    } catch (err) {

    }
}