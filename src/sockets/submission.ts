import { Server, Socket } from 'socket.io'

class SubmissionSockets {
    private static instance: undefined | SubmissionSockets = undefined;
    private wantstoknow: { [subid: string]: Socket[] } = {}
    private io: null | Server = null;
    public static getInstance(): SubmissionSockets {
        if (SubmissionSockets.instance === undefined) {
            SubmissionSockets.instance = new SubmissionSockets();
        }
        return SubmissionSockets.instance;
    }
    public addIoServer(io: Server) {
        this.io = io;
        handleSockets(io, this);

    }
    public addSubmissionClient(socket: Socket, subid: string) {
        if (!Array.isArray(this.wantstoknow[subid])) {
            this.wantstoknow[subid] = [];
        }
        this.wantstoknow[subid].push(socket);
    }
    public tellSubmissionStatus = (subid: string, details: { status: number, color: string, text: string, tcid: string, memory:number, time:number }) => {
        let __details: string = JSON.stringify(details);
        this.wantstoknow[subid]?.forEach((item) => item.emit("submissionstatus", __details))
    }
    public tellFinalSubmissionStatus = (subid:string, details: { status: number, color: string, text: string })=>{
        let __details: string = JSON.stringify(details);
        this.wantstoknow[subid]?.forEach((item) => item.emit("finalstatus", __details))
    }
}


const handleSockets = (io: Server, socketinstance: SubmissionSockets) => {
    io.on("connection", (socket: Socket) => {
        socket.on("submissionstatus", (subid: string) => {
            socketinstance.addSubmissionClient(socket, subid);
        })
    })
}






export default SubmissionSockets.getInstance();