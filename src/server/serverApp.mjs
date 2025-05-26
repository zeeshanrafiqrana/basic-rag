import express from "express"
const app = express()
import cors from 'cors'
import { connectDB } from "../db/connectionDB.mjs";
import "./models.mjs";

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json())

connectDB()
export { app }