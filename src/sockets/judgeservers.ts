import { Server, Socket } from 'socket.io'
import { JudgeServers } from '../lib/judgeserver';
class _Socket {
    private static instance: undefined | _Socket = undefined;
    private io: Server | null = null;
    private sockets: { [slug: string]: Socket[] } = {};
    private _sockets: { [socketid: string]: { idx: number, slug: string, token: string } } = {};
    private online: { [token: string]: boolean } = {};
    private _types: { [socketid: string]: null | "judge" | "client" } = {};
    private wanttoknowstatus: { [token: string]: Socket[] } = {};
    public static getInstance(): _Socket {
        if (_Socket.instance === undefined) {
            _Socket.instance = new _Socket();
        }
        return _Socket.instance;
    }
    public addServerIO = (io: Server) => {
        this.io = io;
        socketEvents(io, this);
    }
    public getServerIO = (): Server => this.io as Server;
    public addServerSockets = (slug: string, socket: Socket, token: string) => {
        if (!Array.isArray(this.sockets[slug])) {
            this.sockets[slug] = [];
        }
        this.sockets[slug].push(socket);
        this.online[token] = true;
        let id = this.sockets[slug].length - 1;
        this._types[socket.id] = "judge"
        this._sockets[socket.id] = { idx: id, slug, token }
        this.tellEveryOneAboutToken(token);
    }
    public setStatus = (token: string, value: boolean) => {
        this.online[token] = value;
    }
    public addClientSocket = (token: string, socket: Socket) => {
        if (!Array.isArray(this.wanttoknowstatus[token])) this.wanttoknowstatus[token] = [];
        this.wanttoknowstatus[token].push(socket);
        this._types[socket.id] = "client"
        this.tellTheJudgeStatus(token, socket)
    }
    public getSocketsStatus = () => this.sockets
    public tellTheJudgeStatus = (token: string, socket: Socket) => {
        socket.emit("judgestatus", this.online[token] ? "online" : "ofline")
    }
    public tellEveryOneAboutToken = (token: string) => {
        if (Array.isArray(this.wanttoknowstatus[token])) {
            this.wanttoknowstatus[token].map(item => item.emit("judgestatus", this.online[token] ? "online" : "ofline"))
        }
    }
    public disconnected = (socket: Socket) => {
        if (this._types[socket.id] === "judge") {
            this.online[this._sockets[socket.id].token] = false;
            this.tellEveryOneAboutToken(this._sockets[socket.id].token);
        }
    }
    public printStatus = () => {
    }

    public requestFromFreeServer = (slug:string)=>{
        this.sockets[slug]?.map(item=>{
            item.emit("areyoufree", "request")
        })
    }

    public bitTheHeart = ()=>{
        Object.keys(this.sockets).forEach(item=>{
            this.requestFromFreeServer(item);
        })
    }

}


const socketEvents = (io: Server, socketserver: _Socket) => {
    io.on("connection", (socket: Socket) => {
        socket.on("judgelogin", (token: string) => {
            let veryfy = JudgeServers.verfiytoken(token);
            if (!veryfy) {
                socket.emit("judgelogin", "failed");
            }
            else {
                socketserver.addServerSockets(veryfy.slug, socket, token);
                socket.emit("judgelogin", veryfy.name);
            }
        });
        socket.on("judgestatus", (token: string) => {
            socketserver.addClientSocket(token, socket);
        });
        socket.on("disconnect", () => {
            socketserver.disconnected(socket);

        })
    });
}


export default _Socket.getInstance();
