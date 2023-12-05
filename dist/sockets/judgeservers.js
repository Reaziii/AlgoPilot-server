"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const judgeserver_1 = require("../lib/judgeserver");
class _Socket {
    constructor() {
        this.io = null;
        this.sockets = {};
        this._sockets = {};
        this.online = {};
        this._types = {};
        this.wanttoknowstatus = {};
        this.addServerIO = (io) => {
            this.io = io;
            socketEvents(io, this);
        };
        this.getServerIO = () => this.io;
        this.addServerSockets = (slug, socket, token) => {
            if (!Array.isArray(this.sockets[slug])) {
                this.sockets[slug] = [];
            }
            this.sockets[slug].push(socket);
            this.online[token] = true;
            let id = this.sockets[slug].length - 1;
            this._types[socket.id] = "judge";
            this._sockets[socket.id] = { idx: id, slug, token };
            this.tellEveryOneAboutToken(token);
        };
        this.setStatus = (token, value) => {
            this.online[token] = value;
        };
        this.addClientSocket = (token, socket) => {
            if (!Array.isArray(this.wanttoknowstatus[token]))
                this.wanttoknowstatus[token] = [];
            this.wanttoknowstatus[token].push(socket);
            this._types[socket.id] = "client";
            this.tellTheJudgeStatus(token, socket);
        };
        this.getSocketsStatus = () => this.sockets;
        this.tellTheJudgeStatus = (token, socket) => {
            socket.emit("judgestatus", this.online[token] ? "online" : "ofline");
        };
        this.tellEveryOneAboutToken = (token) => {
            if (Array.isArray(this.wanttoknowstatus[token])) {
                this.wanttoknowstatus[token].map(item => item.emit("judgestatus", this.online[token] ? "online" : "ofline"));
            }
        };
        this.disconnected = (socket) => {
            if (this._types[socket.id] === "judge") {
                this.online[this._sockets[socket.id].token] = false;
                this.tellEveryOneAboutToken(this._sockets[socket.id].token);
            }
        };
        this.printStatus = () => {
        };
        this.requestFromFreeServer = (slug) => {
            var _a;
            (_a = this.sockets[slug]) === null || _a === void 0 ? void 0 : _a.map(item => {
                item.emit("areyoufree", "request");
            });
        };
        this.bitTheHeart = () => {
            Object.keys(this.sockets).forEach(item => {
                this.requestFromFreeServer(item);
            });
        };
    }
    static getInstance() {
        if (_Socket.instance === undefined) {
            _Socket.instance = new _Socket();
        }
        return _Socket.instance;
    }
}
_Socket.instance = undefined;
const socketEvents = (io, socketserver) => {
    io.on("connection", (socket) => {
        socket.on("judgelogin", (token) => {
            let veryfy = judgeserver_1.JudgeServers.verfiytoken(token);
            if (!veryfy) {
                socket.emit("judgelogin", "failed");
            }
            else {
                socketserver.addServerSockets(veryfy.slug, socket, token);
                socket.emit("judgelogin", veryfy.name);
            }
        });
        socket.on("judgestatus", (token) => {
            socketserver.addClientSocket(token, socket);
        });
        socket.on("disconnect", () => {
            socketserver.disconnected(socket);
        });
    });
};
exports.default = _Socket.getInstance();
