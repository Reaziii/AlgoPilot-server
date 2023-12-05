"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./routes/user"));
const problem_1 = __importDefault(require("./routes/problem"));
const contest_1 = __importDefault(require("./routes/contest"));
const submission_1 = __importDefault(require("./routes/submission"));
const socket_io_1 = require("socket.io");
const judgeservers_1 = __importDefault(require("./sockets/judgeservers"));
const judgeserver_1 = __importDefault(require("./routes/judgeserver"));
const submission_2 = __importDefault(require("./sockets/submission"));
// app
const app = (0, express_1.default)();
dotenv_1.default.config();
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8080;
//middlewares
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// database
mongoose_1.default.connect((_b = process.env.DB) !== null && _b !== void 0 ? _b : "").then(() => {
    console.log("[database connected]");
}).catch(err => {
    console.log("database connection failed");
});
//routers
app.use("/auth", auth_1.default);
app.use("/user", user_1.default);
app.use("/problem", problem_1.default);
app.use("/contest", contest_1.default);
app.use('/submission', submission_1.default);
app.use('/judge', judgeserver_1.default);
const server = http_1.default.createServer(app);
app.get('/', (req, res) => {
    res.send('Judge server is running!');
});
//sockets
const io = new socket_io_1.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'], }, });
judgeservers_1.default.addServerIO(io);
submission_2.default.addIoServer(io);
//heart bit
let x = setInterval(() => {
    judgeservers_1.default.bitTheHeart();
}, 30000);
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
