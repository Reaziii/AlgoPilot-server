import ProblemModel from "../models/problem";
import { IProblem, ITestcase } from "../types/main";
import get_slug from "../utils/slug";
import { get_sample_test_case } from "./testcase";
export const create_problem = async (name: string | undefined, statement: string | undefined, inputFormat: string | undefined, outputFormat: string | undefined, createdBy: string | undefined, timelimit: string | undefined, memorylimit: string | undefined): Promise<{ status: boolean, message: string, problem?: IProblem }> => {

    const emptyFields: string[] = [];
    if (!name || !name.length) {
        emptyFields.push('name');
    }

    if (!statement || !statement.length) {
        emptyFields.push('statement');
    }

    if (!inputFormat || !inputFormat.length) {
        emptyFields.push('inputFormat');
    }

    if (!outputFormat || !outputFormat.length) {
        emptyFields.push('outputFormat');
    }

    if (!createdBy || !createdBy.length) {
        emptyFields.push('createdBy');
    }

    if (!timelimit || !timelimit.length) {
        emptyFields.push('timelimit');
    }

    if (!memorylimit || !memorylimit.length) {
        emptyFields.push('memorylimit');
    }
    if (!name || !name.length || !statement || !statement.length || !inputFormat || !inputFormat.length || !outputFormat || !outputFormat.length || !createdBy || !createdBy.length || !timelimit || !timelimit.length || !memorylimit || !memorylimit.length) {

        return { status: false, message: `${emptyFields.join(", ")} are empty` }

    }
    try {
        let slug = get_slug(name);
        for (let i = 0; ; i++) {
            let j = String(i);
            if (i === 0) j = "";
            else j = "-" + j;
            let problem = await ProblemModel.findOne({ slug: slug + j });
            if (problem !== null) continue;
            slug = slug + j;
            break;
        }

        let newProblem = new ProblemModel({
            name,
            slug,
            statement,
            inputFormat,
            outputFormat,
            createdBy,
            timelimit,
            memorylimit

        })
        await newProblem.save();
        return { status: true, message: "problem created successfully", problem: newProblem as IProblem }
    }
    catch (err) {
        console.log(err);
        return { status: false, message: "Unknown error" }
    }
}



export const get_problem_details = async (slug: string): Promise<{ status: boolean, message: string, details?: IProblem, test_cases?: ITestcase[] }> => {
    try {
        slug = slug.toLowerCase();
        let _problem = await ProblemModel.findOne({ slug });
        if (!_problem) {
            return ({ status: false, message: "Problem doesn't exists" });
        }
        let problem: {
            details: IProblem;
            test_cases: ITestcase[];
        } = {
            details: _problem,
            test_cases: [],
        }
        problem.details.customChecker = "";
        problem.details.enableCustomChecker = false;
        problem.details.createdBy = "";
        let cases = await get_sample_test_case(slug);
        problem.test_cases = cases.test_cases ?? [];
        return ({ status: true, message: "retrived problem", ...problem })
    }
    catch (err) {
        return ({ status: false, message: "Unknown error!" })
    }

}






