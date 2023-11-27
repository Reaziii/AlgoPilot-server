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


const server = http.createServer(app);
app.get('/', (req: Request, res: Response) => {
    res.send('Judge server is running!');
});
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});