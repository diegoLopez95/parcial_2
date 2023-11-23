import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByUsername, saveUser } from "../users"

const router = express.Router();

router.post("/login", async (req, res) => {
    const secretKey = process.env.JWT_SECRET_KEY;
    const { username, password } = req.body;
    const user = findUserByUsername(username);

    if (!user) {
        return res
            .status(401)
            .json({ message: "Authentication failed, invalid user" });
    }
    if (secretKey) {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            const token = jwt.sign({ username: user.username }, secretKey, {
                expiresIn: "1h",
            });
            return res.status(200).json({ token });
        }
    }

    return res.status(401).json({
        message: "Authentication failed, user and password must match...",
    });
});

router.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    const existingUser = findUserByUsername(username);

    if (existingUser) {
        return res.status(400).json({ message: "Username is already taken" });
    }

    const saltRounds = 10;
    await bcrypt.hash(password, saltRounds, (err: any, hash: any) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error" });
        }
        saveUser(username, hash);
        return res.status(201).json({ message: "User registered successfully" });
    });
});

export default router;
