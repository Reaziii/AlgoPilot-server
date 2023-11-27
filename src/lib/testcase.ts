import ProblemModel from "../models/problem";
import TestcaseModel from "../models/testcase";
import { ITestcase } from "../types/main";
export const create_test_case = async (slug: string | undefined, input: string | undefined, output: string | undefined, isSample: boolean | undefined, explaination: string | undefined, email: string | undefined): Promise<{ status: boolean, message: string, testcase?: ITestcase }> => {
    if (!slug || !input || !output || isSample === undefined || !email) {
        return { status: false, message: "All the fields must be fillup" };
    }
    try {
        let problem = await ProblemModel.findOne({ slug: slug });
        if (!problem) {
            return { status: false, message: "Problem not found!" }
        }
        if (problem.createdBy !== email && email !== "admin") {
            return { status: false, message: "Unauthorized" };
        }
        let newTestCase = new TestcaseModel({
            slug,
            input,
            output,
            explaination,
            isSample
        })

        await newTestCase.save();
        return { status: true, message: "Test Case Added", testcase: newTestCase }
    }
    catch (err) {
        return { status: false, message: "Unknown error" };
    }
}

export const get_all_test_case = async (slug: string | undefined, email: string | undefined): Promise<{ status: boolean, message: string, test_cases?: ITestcase[] }> => {
    try {
        if (!slug) {
            return { status: false, message: "slug can't be empty", test_cases: [] };
        }
        let problem = await ProblemModel.findOne({ slug: slug });
        if (!problem) {
            return { status: false, message: "Problem not found", test_cases: [] }
        }
        if (problem.createdBy !== email) {
            return { status: false, message: "Unathorized" };
        }

        let test_cases: ITestcase[] = await TestcaseModel.find({ slug: slug });

        return { status: true, message: "Testcases for problem - " + slug, test_cases }
    }
    catch (err) {
        return { status: false, message: "Unknown error" }
    }



}

export const get_sample_test_case = async (slug: string): Promise<{ status: boolean, message: string, test_cases?: ITestcase[] }> => {
    try {
        if (!slug) {
            return { status: false, message: "slug can't be empty", test_cases: [] };
        }
        let problem = await ProblemModel.findOne({ slug: slug });
        if (!problem) {
            return { status: false, message: "Problem not found", test_cases: [] }
        }
        let test_cases: ITestcase[] = await TestcaseModel.find({ slug: slug, isSample: true });

        return { status: true, message: "sample testcases for problem - " + slug, test_cases }
    }
    catch (err) {
        return { status: false, message: "Unknown error" }
    }


}

export const update_test_case = async (_id: string) => {

}