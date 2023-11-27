import { SubmissionStatus } from "../types/main";

export class SubmittedStatus {
    static TLE: { status: number, color: string, text: string } = {
        status: 1,
        color: "#FF8C00",
        text: "Time Limit Exceed"
    };
    static MLE: { status: number, color: string, text: string } = {
        status: 2,
        color: "#9370DB",
        text: "Memory Limit Exceed"
    };
    static RE: { status: number, color: string, text: string } = {
        status: 3,
        color: '#F08080',
        text: "Runtime Error"
    }
    static CE: { status: number, color: string, text: string } = {
        status: 4,
        color: "#ADD8E6",
        text: "Compilation Error"
    };
    static AC: { status: number, color: string, text: string } = {
        status: 5,
        color: "#3CB371",
        text: "Accepted"
    }
    static WA: { status: number, color: string, text: string } = {
        status: 6,
        color: "#FFC0CB",
        text: "Wrong Answer"
    };
    static Pending: { status: number, color: string, text: string } = {
        status: 7,
        color: "#D3D3D3",
        text: "Pending"
    }
    static Running: { status: number, color: string, text: string } = {
        status: 8,
        color: "orange",
        text: "Running"
    }
    static get(idx: number): SubmissionStatus {
        if (idx === 1) return SubmittedStatus.TLE;
        if (idx === 2) return SubmittedStatus.MLE;
        if (idx === 3) return SubmittedStatus.RE;
        if (idx === 4) return SubmittedStatus.CE;
        if (idx === 5) return SubmittedStatus.AC;
        if (idx === 6) return SubmittedStatus.WA;
        if (idx === 7) return SubmittedStatus.Pending;
        if (idx === 8) return SubmittedStatus.Running;
        throw "Submission status code is not correct"
    }

}

