import mongoose from "mongoose";
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(
            "\x1b[32m%s\x1b[0m",
            `✅ MongoDB connected successfully: ${conn.connection.host}`
        );
    } catch (error) {
        console.log("\x1b[31m%s\x1b[0m", `❌ MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
