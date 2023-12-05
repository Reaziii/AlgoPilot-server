"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmittedStatus = void 0;
class SubmittedStatus {
    static get(idx) {
        if (idx === 1)
            return SubmittedStatus.TLE;
        if (idx === 2)
            return SubmittedStatus.MLE;
        if (idx === 3)
            return SubmittedStatus.RE;
        if (idx === 4)
            return SubmittedStatus.CE;
        if (idx === 5)
            return SubmittedStatus.AC;
        if (idx === 6)
            return SubmittedStatus.WA;
        if (idx === 7)
            return SubmittedStatus.Pending;
        if (idx === 8)
            return SubmittedStatus.Running;
        if (idx === 9)
            return SubmittedStatus.Skipped;
        throw "Submission status code is not correct";
    }
}
exports.SubmittedStatus = SubmittedStatus;
SubmittedStatus.TLE = {
    status: 1,
    color: "#FF8C00",
    text: "Time Limit Exceed"
};
SubmittedStatus.MLE = {
    status: 2,
    color: "#9370DB",
    text: "Memory Limit Exceed"
};
SubmittedStatus.RE = {
    status: 3,
    color: '#F08080',
    text: "Runtime Error"
};
SubmittedStatus.CE = {
    status: 4,
    color: "#ADD8E6",
    text: "Compilation Error"
};
SubmittedStatus.AC = {
    status: 5,
    color: "#3CB371",
    text: "Accepted"
};
SubmittedStatus.WA = {
    status: 6,
    color: "#FFC0CB",
    text: "Wrong Answer"
};
SubmittedStatus.Pending = {
    status: 7,
    color: "#D3D3D3",
    text: "Pending"
};
SubmittedStatus.Running = {
    status: 8,
    color: "orange",
    text: "Running"
};
SubmittedStatus.Skipped = {
    status: 9,
    color: "black",
    text: "Skipped"
};
