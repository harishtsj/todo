import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from "node:dns/promises";
import cookieParser from 'cookie-parser';

import 'dotenv/config'
import connectDB from './config/db.js';
import todoRouter from './router/todoRouter.js';
import userRouter from './router/userRouter.js';


dns.setServers(["1.1.1.1"]);

const app = express();
const PORT = process.env.PORT;
app.use(helmet());
app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use('/api/todo', todoRouter);
app.use('/api/user', userRouter);

app.use(express.static(path.join(__dirname, 'dist')))

app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Listening on the PORT - ${PORT}`)
});