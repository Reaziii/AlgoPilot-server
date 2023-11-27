import { Request } from "express";

export interface IProblem {
    name: string;
    statement: string;
    outputFormat: string;
    inputFormat: string;
    createdBy: string;
    slug: string;
    customChecker: string;
    enableCustomChecker: boolean;
    timelimit: string;
    memorylimit: string;
    position: number;
}


export interface IVerifications {
    otp: string;
    name: string;
    email: string;
    password: string;
}
export interface IToken {
    isLoogedIn: boolean;
    name: string;
    email: string;
    token: string;
    permissions: IPermission
}


export interface ITestcase {
    slug: string;
    input: string;
    output: string;
    isSample: boolean;
    explaination: string;
}

export interface IContest {
    name: string;
    slug: string;
    date: string;
    time: string;
    len: string;
    announcement: string;
    description: string;
    createdBy: string;
    published: boolean;
}

export interface IContestAuthors {
    slug: string;
    email: string;
}

export interface IProblemAuthors {
    slug: string;
    email: string;
}


export interface IPermission {
    admin: boolean;
    create_contest: boolean;
    create_problem: boolean;
}

export interface IUser {
    name: string;
    email: string;
    password: string;
    permission: IPermission
}

export interface IContestProblem {
    problemSlug: string;
    contestSlug: string;
    position: number;
}

export interface IClarification {
    comment: string;
    parent: string;
    user: string;

}

export interface ISubmission {
    code: string;
    language: string;
    submission_time: Date;
    user: string;
    problemSlug: string;
    status: { status: number, color: string, text: string };
}

export interface IContestSubmission {
    contsetSlug: string;
    submission_id: string;
    position: number;
    user: string;
}
export interface SubmissionStatus {
    status: number, color: string, text: string
}

export interface IJudgeServerToken {
    token: string;
    name: string;
    slug: string;
    status: boolean;
}


export interface AuthenticatedRequest extends Request {
    user?: {
        email: string;
        permission: IPermission;
        name: string;
    };
    judge?: {
        slug: string;
        name: string;
    }
}

export interface ISubmissionQueue {
    submission : string;
    time : number;
    slug:string;
    running:boolean;
}