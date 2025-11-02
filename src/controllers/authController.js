import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Generate JWT access token
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

const authController = {
    // Register new user
    signup: async (req, res) => {
        try {
            const { firstName, lastName, username, email, password, phone } = req.body;

            // Check required fields
            if (!firstName || !lastName || !username || !email || !password || !phone) {
                return res.status(400).json({ message: "All fields are required" });
            }

            // Check if email or username already exists
            const existingUser = await User.findOne({ $or: [{ email }, { username }] });
            if (existingUser)
                return res
                    .status(400)
                    .json({ message: "Email or username already exists" });

            // Create user (password will be auto-hashed by Mongoose pre-save)
            const newUser = new User({
                firstName,
                lastName,
                username,
                email,
                password,
                phone,
            });

            await newUser.save();

            // Generate token
            const token = generateAccessToken(newUser._id);

            res.status(201).json({
                message: "Registration successful!",
                user: {
                    id: newUser._id,
                    fullName: newUser.fullName,
                    username: newUser.username,
                    email: newUser.email,
                    role: newUser.role,
                    phone: newUser.phone,
                },
                token,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    },

    // 🔑 Login existing user
    login: async (req, res) => {
        try {
            const { identifier, password } = req.body;
            // `identifier` can be either email or username

            if (!identifier || !password)
                return res.status(400).json({ message: "Please provide email/username and password." });

            // Find user by email OR username and include password field
            const user = await User.findOne({
                $or: [{ email: identifier }, { username: identifier }],
            }).select("+password");

            if (!user) return res.status(404).json({ message: "User not found." });

            // Compare password
            const isMatch = await user.matchPassword(password);
            if (!isMatch)
                return res.status(400).json({ message: "Invalid email or password" });

            // Generate token
            const token = generateAccessToken(user._id);

            res.status(200).json({
                message: "Login successful!",
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    phone: user.phone,
                },
                token,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    },
};

export default authController;
