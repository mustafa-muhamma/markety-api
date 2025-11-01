// src/server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";

// Load env vars
dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("\x1b[36m%s\x1b[0m", `🚀 Server running at: http://localhost:${PORT}`);
});
