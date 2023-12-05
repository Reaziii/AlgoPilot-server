"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SubmissionSockets {
    constructor() {
        this.wantstoknow = {};
        this.io = null;
        this.tellSubmissionStatus = (subid, details) => {
            var _a;
            let __details = JSON.stringify(details);
            (_a = this.wantstoknow[subid]) === null || _a === void 0 ? void 0 : _a.forEach((item) => item.emit("submissionstatus", __details));
        };
        this.tellFinalSubmissionStatus = (subid, details) => {
            var _a;
            let __details = JSON.stringify(details);
            (_a = this.wantstoknow[subid]) === null || _a === void 0 ? void 0 : _a.forEach((item) => item.emit("finalstatus", __details));
        };
    }
    static getInstance() {
        if (SubmissionSockets.instance === undefined) {
            SubmissionSockets.instance = new SubmissionSockets();
        }
        return SubmissionSockets.instance;
    }
    addIoServer(io) {
        this.io = io;
        handleSockets(io, this);
    }
    addSubmissionClient(socket, subid) {
        if (!Array.isArray(this.wantstoknow[subid])) {
            this.wantstoknow[subid] = [];
        }
        this.wantstoknow[subid].push(socket);
    }
}
SubmissionSockets.instance = undefined;
const handleSockets = (io, socketinstance) => {
    io.on("connection", (socket) => {
        socket.on("submissionstatus", (subid) => {
            socketinstance.addSubmissionClient(socket, subid);
        });
    });
};
exports.default = SubmissionSockets.getInstance();
