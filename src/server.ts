import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser' 
// app
const app = express();
dotenv.config();
const port = process.env.PORT ?? 8080;
//middlewares
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const server = http.createServer(app);
app.get('/', (req: Request, res: Response) => {
    res.send('Judge server is running!');
});


server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
