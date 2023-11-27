import ContestModel from "../models/contest";
import get_slug from "../utils/slug";
import AuthorModel from "../models/author";
import UserModel from "../models/user";
import ProblemModel from "../models/problem";
import ContestProblemModel from "../models/contestProblem";
import { addDateAndTime, get_current_time } from "./../utils/utils";
import ContestSubmissionModel from "../models/contestSubmission";
import { JudgeServers } from "./judgeserver";
import { IContest, IContestAuthors, IContestProblem, IContestSubmission, IProblem, ITestcase } from "../types/main";
import { get_sample_test_case } from "./testcase";
import { submitACode } from "./submission";
import judgeservers from "../sockets/judgeservers";
import { addNewSubmissionToQueue } from "./submissionQueue";
// import { submitacode } from "./socket";

export const create_contest = async (name: string | undefined, date: string | undefined, time: string | undefined, length: string | undefined, announcement: string | undefined, description: string | undefined, authors: string | undefined, email: string | undefined): Promise<{ status: boolean, message: string, slug?: string }> => {
    try {
        let _creator = email;
        if (!name || !name.length || !date || !date.length || !time || !time.length || !length || !length.length) {
            return { status: false, message: "Some fields are empty" };
        }
        let slug: string = get_slug(name);
        for (let i = 0; ; i++) {
            let newslug = slug + (i === 0 ? "" : String(i));
            let check = await ContestModel.findOne({ slug: newslug });
            if (!check) {
                slug = newslug;
                break;
            }
        }
        let newContest = new ContestModel({
            name,
            slug,
            len: length,
            date,
            time,
            announcement,
            description,
            createdBy: _creator,

        });
        await newContest.save();
        let _authors: string[] = authors?.split(',') || [];
        _authors.push(newContest.createdBy)
        for (let i = 0; i < _authors.length; i++) {
            let Author = await UserModel.findOne({ email: _authors[i] });
            if (!Author) continue;
            let __ = await AuthorModel.findOne({ email: _authors[i], slug: slug });
            if (__) continue;
            let newAuthor = new AuthorModel({
                slug,
                email: _authors[i],
            });
            await newAuthor.save();
        }
        return { status: true, message: "Contest created Successfully", slug }

    }
    catch (err) {
        console.log(err);
        return { status: false, message: "Unknown error" }
    }
}


export const update_contest = async (slug: string, name: string | undefined, date: string | undefined, time: string | undefined, length: string | undefined, announcement: string | undefined, description: string | undefined, authors: string | undefined, email: string): Promise<{ status: boolean, message: string, slug?: string }> => {

    try {
        let ret = await checkImAuthor(slug, email);
        if (ret.status === false) {
            return { status: false, message: "Unauthorized" }
        }
        if (!name || !name.length || !date || !date.length || !time || !time.length || !length || !length.length) {
            return { status: false, message: "Some fields are empty" };
        }
        let contest = await ContestModel.findOne({ slug });
        if (!contest) throw "";
        contest.name = name;
        contest.slug = slug;
        contest.len = length;
        contest.date = date;
        contest.time = time;
        contest.announcement = announcement ?? "";
        contest.description = description ?? "";
        await contest.save();
        let prevauthors = await get_authors(slug);
        for (let i = 0; i < prevauthors.length; i++) {
            await (await AuthorModel.findOne({ slug, email: prevauthors[i].email }))?.deleteOne();
        }
        let _authors: string[] = authors?.replace(new RegExp(" ", 'g'), "").split(',') || [];
        _authors.push(contest.createdBy)
        for (let i = 0; i < _authors.length; i++) {
            let Author = await UserModel.findOne({ email: _authors[i] });
            if (!Author) continue;
            let __ = await AuthorModel.findOne({ email: _authors[i], slug: slug });
            if (__) continue;
            let newAuthor = new AuthorModel({
                slug,
                email: _authors[i],
            });
            await newAuthor.save();
        }
        return { status: true, message: "Contest created Successfully", slug }

    }
    catch (err) {
        return { status: false, message: "Unknown error" }
    }
}

export const getContestDetails = async (slug: string): Promise<{ status: boolean, details?: IContest }> => {
    try {
        let details: IContest | null = await ContestModel.findOne({ slug });
        if (!details) {
            return { status: false }
        }
        return { status: true, details }

    }
    catch (err) {
        return { status: false }
    }
}



export const checkImAuthor = async (slug: string, email: string): Promise<{ status: boolean }> => {
    try {
        let _ = await AuthorModel.findOne({ slug: slug, email: email });
        if (!_) return { status: false }
        return { status: true }

    } catch (err) {
        return { status: false }
    }
}

export const add_problem = async (contest: string, email: string, problems: { slug: string, position: number }[]): Promise<boolean> => {
    try {
        let Contest = await ContestModel.findOne({ slug: contest })
        if (!Contest) throw "";
        let author = await AuthorModel.findOne({ email: email, slug: Contest.slug });
        if (!author) throw "";
        let pos = 1;
        for (let i = 0; i < problems.length; i++) {
            let Problem = await ProblemModel.findOne({ slug: problems[i].slug, createdBy: email });
            if (!Problem) continue;
            let __contestProblem = await ContestProblemModel.findOne({ contestSlug: contest, problemSlug: Problem.slug });
            if (__contestProblem) await __contestProblem.deleteOne();
            let newContestProblem = new ContestProblemModel({
                contestSlug: Contest.slug,
                problemSlug: Problem.slug,
                position: problems[i].position,
            });
            await newContestProblem.save();
            ++pos;
        }
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

export const hasContestPermission = async (email: string, slug: string): Promise<{ status: boolean, permission: boolean }> => {
    try {
        let author = await AuthorModel.findOne({ email, slug });
        if (!author) throw ""
        return ({ status: true, permission: true });

    } catch (err) {
        return ({ status: false, permission: false });
    }
}

export const get_problems = async (contest: string, email: string): Promise<{ problems: (IProblem)[] }> => {
    try {

        let Contest = await ContestModel.findOne({ slug: contest });
        if (!Contest) throw "";
        let contestStarted = addDateAndTime(Contest.date, Contest.time).getTime() <= get_current_time().getTime();
        if (!contestStarted) {
            let checkAuthor = await hasContestPermission(email, contest);
            if (!checkAuthor.status) throw "";
        }

        let __problems: IContestProblem[] = await ContestProblemModel.find({ contestSlug: contest });
        let ret: IProblem[] = [];
        for (let i = 0; i < __problems.length; i++) {
            let temp: IProblem | null = await ProblemModel.findOne({ slug: __problems[i].problemSlug });
            if (temp) {
                temp.position = __problems[i].position
                ret.push({
                    name: temp.name,
                    statement: "",
                    position: temp.position,
                    enableCustomChecker: false,
                    customChecker: "",
                    inputFormat: "",
                    outputFormat: "",
                    slug: temp.slug,
                    createdBy: temp.createdBy,
                    timelimit: "",
                    memorylimit: ""
                });
            }
        }
        ret = ret.map(item => ({ ...item, customChecker: "", enableCustomChecker: false, position: item.position, statement: "", inputFormat: "", outputFormat: "" }));
        console.log(ret);
        return { problems: ret }
    }
    catch (err) {
        console.log(err)
        return { problems: [] }
    }
}


export const all_published_contest = async (): Promise<{ contests: IContest[] }> => {
    try {
        let contest: IContest[] = await ContestModel.find({ published: true });
        contest = contest.sort((a: IContest, b: IContest) => {
            if (addDateAndTime(a.date, a.time).getTime() > addDateAndTime(b.date, b.time).getTime()) {
                return 1;
            }
            return 0;
        })
        return { contests: contest }
    } catch (err) {
        return { contests: [] };
    }
}

export const my_contests = async (email: string): Promise<{ contests: IContest[] }> => {
    try {
        let __contest: IContestAuthors[] = await AuthorModel.find({ email: email });
        let _slugs: string[] = __contest.map(item => item.slug);
        let contest: IContest[] = await ContestModel.find({ slug: { $in: _slugs } });
        contest = contest.sort((a: IContest, b: IContest) => {
            if (addDateAndTime(a.date, a.time).getTime() < addDateAndTime(b.date, b.time).getTime()) {
                return 1;
            }
            return -1;
        })
        return { contests: contest }
    } catch (err) {
        console.log(err);
        return { contests: [] };
    }
}



// // const get_contest_details = async (slug: string): Promise<{ status: boolean, details?: IContest, started?: Boolean, problems?: {[] }> => {
// //     try {
// //         let conn = await connectDB();
// //         if (!conn.connected) throw "db failed";
// //         let contest = await ContestModel.findOne({ slug: slug });
// //         if(!contest) throw "";
// //         let problems = await ContestProblemModel.find({contestSlug : slug});
// //         let __problems:

// //     } catch (err) {
// //         return { status: false }
// //     }
// // }


export const changePublishMoode = async (slug: string, email: string): Promise<Boolean> => {
    try {
        let author = await AuthorModel.findOne({ slug, email: email });
        if (!author) throw "";
        let contest = await ContestModel.findOne({ slug });
        if (!contest) throw "";
        contest.published = !contest.published;
        await contest.save();
        return true;

    } catch (err) {
        return false;
    }
}

export const handleDeleteContest = async (slug: string, email: string): Promise<Boolean> => {
    try {
        let author = await AuthorModel.findOne({ email: email, slug });
        if (!author) throw "";
        let contest = await ContestModel.findOne({ slug });
        if (!contest) throw "";
        await contest.deleteOne();
        let authors = await AuthorModel.find({ slug });
        for (let i = 0; i < authors.length; i++) {
            await authors[i].deleteOne();
        }
        let problems = await ContestProblemModel.find({ contestSlug: slug });
        for (let i = 0; i < problems.length; i++) {
            await problems[i].deleteOne();
        }

        return true;

    }
    catch (err) {
        return false;
    }
}


export const get_authors = async (slug: string): Promise<IContestAuthors[]> => {
    try {
        let authors: IContestAuthors[] = await AuthorModel.find({ slug });
        return authors;
    }
    catch (err) {
        return []
    }
}

export const getContestSatus = async (slug: string): Promise<"running" | "finished" | "upcoming" | "error"> => {
    try {
        let contest = await ContestModel.findOne({ slug });
        if (!contest) throw "";
        let nowTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
        let contestTime = addDateAndTime(contest.date, contest.time);
        if (contestTime.getTime() > nowTime.getTime()) {
            return "upcoming"
        }
        let endTime = new Date(contestTime.getTime() + (parseInt(contest.len) * 60 * 1000));
        if (nowTime.getTime() > endTime.getTime()) return "finished";
        return "running"
    }
    catch (err) {
        return "error"
    }
}


export const get_contest_problem_details = async (slug: string, position: number): Promise<{ status: boolean, problem?: IProblem, test_cases?: ITestcase[] }> => {
    try {
        let problem = await ContestProblemModel.findOne({ position, contestSlug: slug });
        if (!problem) throw "";
        let _problem = await ProblemModel.findOne({ slug: problem.problemSlug });
        if (!_problem) throw "";
        _problem.customChecker = ""
        _problem.enableCustomChecker = false;
        let testcases = (await get_sample_test_case(_problem.slug)).test_cases;
        return { problem: _problem, status: true, test_cases: testcases };
    } catch (err) {
        return { status: false };
    }
}

export const submit_contest_problem_solution = async (slug: string, position: number, code: string | null, language: string | null, email: string): Promise<{ status: boolean, submission?: IContestSubmission, id?: string }> => {
    try {
        if (!code || !language) throw "code | language didn't found";
        let contest = await ContestModel.findOne({ slug });
        if (!contest) throw "";
        let status = await getContestSatus(slug);
        if (status !== "running" && status !== "finished") throw "not started";
        let temp = await ContestProblemModel.findOne({ contestSlug: slug, position: position });
        if (!temp) throw "";
        let problem = await ProblemModel.findOne({ slug: temp?.problemSlug });
        if (!problem) throw "prblem not found";
        let __problem = await ContestProblemModel.findOne({ contestSlug: slug, problemSlug: temp.problemSlug, position });
        if (!__problem) throw "problem is not in contest";
        let submission = await submitACode(code as string, language as string, problem.slug, email);
        if (!submission) {
            throw "submission failed"
        }
        let _submission = new ContestSubmissionModel({
            contsetSlug: slug,
            position: position,
            submission_id: submission,
            user: email
        });
        await _submission.save();
        JudgeServers.addNewSubmission(submission, slug);
        await addNewSubmissionToQueue(slug, submission)
        judgeservers.requestFromFreeServer(slug);
        return { status: true, id: submission }

    } catch (err) {
        console.log(err);
        return { status: false };
    }
}