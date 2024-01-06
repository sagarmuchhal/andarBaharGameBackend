const express = require("express");
// const userRouter = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const NewUser = require("../models/new_user.model");
// const Admin = require("./Models/admin.model");
require("dotenv").config();

const register = async(req, res) => {
    try {
        const { name, user_name, email, password, mobile_no } = req.body;

        const existingUser = await NewUser.findOne({ mobile_no });
        if (existingUser) {
            // can use 409 status code for conflict that shows user exists using 200 for respose
            return res
                .status(409)
                .json({ message: "User with this email already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const user = new NewUser({
            name,
            user_name,
            email,
            mobile_no,
            coins: 0,
            password: hashedPassword,
        });

        await user.save();
        res.status(201).json({ user, message: "Account Created Successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

const login = async(req, res) => {
    try {
        const { mobile_no, password } = req.body;

        // Check if the user exists
        const user =
            (await NewUser.findOne({ mobile_no }))
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Verify the password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Create and send a JWT token for authentication
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

        if (user) {
            // if (user.email == "harshal@admin.com") {
            //   res.status(200).json({type:"admin", message: "Admin logged in", token });
            // } else {
            res.status(200).json({ type: "user", message: "User logged in", token });
            // }
        } else {
            res.status(400).json({ message: "login failed" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { register, login };