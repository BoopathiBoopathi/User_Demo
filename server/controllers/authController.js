import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

const DEFAULT_USER = {
    emailId: "eve.holt@reqres.in",
    password: "cityslicka",
};

let refreshTokens = [];

const generateTokens = (email) => {
    const accessToken = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "15m",
    });

    const refreshToken = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d",
    });

    refreshTokens.push(refreshToken);

    return { accessToken, refreshToken };
};

export const loginUser = async (req, res) => {
    const { emailId, password } = req.body;
    console.log(" req.body ", req.body)
    try {
        if (!emailId || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        if (emailId === DEFAULT_USER.emailId && password === DEFAULT_USER.password) {
            const tokens = generateTokens(emailId);

            return res.status(200).json({
                message: "Login successful",
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const loginUser_bkp = async (req, res) => {
    const { emailId, password } = req.body;

    console.log(" req.body ", req.body)
    try {

        if (!emailId || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }
        if (emailId === DEFAULT_USER.emailId && password === DEFAULT_USER.password) {
            const isMatch = await bcrypt.compare(password, DEFAULT_USER.password);
            console.log(" SSSSSSSSSSSSSS ", isMatch)
            if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });


            const tokens = generateTokens(user._id);

            return res.status(200).json({
                message: "Login successful",
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token required" });
    }

    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const accessToken = jwt.sign(
            { emailId: decoded.emailId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "15m" }
        );

        return res.status(200).json({ accessToken });
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired refresh token" });
    }
};

export const logoutUser = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token required" });
    }

    refreshTokens = refreshTokens.filter((t) => t !== refreshToken);

    return res.status(200).json({ message: "Logged out successfully" });
};
export const registerUser = async (req, res) => {
    const { firstName, lastName, emailId, password } = req.body;

    try {
        const existingUser = await User.findOne({ emailId });
        if (existingUser) return res.status(400).json({ message: "User exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            firstName,
            lastName,
            emailId,
            password: hashedPassword,
        });

        res.status(201).json({ message: "User registered", userId: user._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};