import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import helmet from "helmet";
import AuthRouter from "./src/routes/AuthRouter.js";

// Load env vars
dotenv.config();

// Create express app
const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use('/auth', AuthRouter)
app.use('/', AuthRouter)

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("\x1b[36m%s\x1b[0m", `🚀 Server running at: http://localhost:${PORT}`);
});
