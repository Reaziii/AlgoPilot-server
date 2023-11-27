import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import authRouter from './routes/auth'
import mongoose from 'mongoose';
import userRoute from './routes/user'
import problemRoute from './routes/problem'
import contestRoute from './routes/contest'
import submissionRoute from './routes/submission'
import { Server } from 'socket.io'
import judgeservers from './sockets/judgeservers';
import judgeRoutes from './routes/judgeserver'
// app
const app = express();
dotenv.config();
const port = process.env.PORT ?? 8080;
//middlewares
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// database
mongoose.connect(process.env.DB ?? "").then(() => {
    console.log("[database connected]")
}).catch(err => {
    console.log("database connection failed")
    console.log(err);

})

//routers
app.use("/auth", authRouter)
app.use("/user", userRoute)
app.use("/problem", problemRoute)
app.use("/contest", contestRoute)
app.use('/submission', submissionRoute)
app.use('/judge', judgeRoutes)



const server = http.createServer(app);



app.get('/', (req: Request, res: Response) => {
    res.send('Judge server is running!');
});


//sockets
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'], }, });
judgeservers.addServerIO(io)


server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
