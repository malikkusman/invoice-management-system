const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();
const SECRET = "expertbcomputercoursesacademy55050";
const HOST =  process.env.SMTP_HOST;
const PORT =  process.env.SMTP_PORT;
const USER =  process.env.SMTP_USER;
const PASS =  process.env.SMTP_PASS;

const User = require('../models/userModel.js');
const ProfileModel = require('../models/ProfileModel.js');


// Signin function - User login
const signin = async (req, res) => {
    const { email, password } = req.body; // Coming from formData

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });

        // Check if password matches
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        // If credentials are valid, create a token
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, SECRET, { expiresIn: "1h" });

        // Get user profile if exists
        const userProfile = await ProfileModel.findOne({ userId: existingUser._id });

        // Return user data, profile, and token
        res.status(200).json({ result: existingUser, userProfile, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Signup function - User registration
const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName, bio } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ message: "User already exists" });

        if (password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`, bio });

        // Create a profile after user signup
        const userProfile = new ProfileModel({
            userId: result._id,
            name: `${firstName} ${lastName}`,
            email,
            createdAt: new Date().toISOString()
        });

        await userProfile.save();

        const token = jwt.sign({ email: result.email, id: result._id }, SECRET, { expiresIn: "1h" });

        // Return user data, profile, and token
        res.status(200).json({ result, userProfile, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Forgot Password Function
const forgotPassword = (req, res) => {
    const { email } = req.body;

    const transporter = nodemailer.createTransport({
        host: HOST,
        port: PORT,
        auth: {
            user: USER,
            pass: PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    crypto.randomBytes(32, (err, buffer) => {
        if (err) return res.status(500).json({ error: "Error generating token" });

        const token = buffer.toString("hex");

        User.findOne({ email: email })
            .then(user => {
                if (!user) return res.status(422).json({ error: "User does not exist" });

                user.resetToken = token;
                user.expireToken = Date.now() + 3600000; // Token expires in 1 hour
                user.save().then(() => {
                    transporter.sendMail({
                        to: user.email,
                        from: "Accountill <hello@accountill.com>",
                        subject: "Password reset request",
                        html: `
                            <p>You requested a password reset from Arc Invoicing application</p>
                            <h5>Please click this <a href="https://accountill.com/reset/${token}">link</a> to reset your password</h5>
                            <p>If this was a mistake, just ignore this email and nothing will happen.</p>
                        `,
                    });

                    res.json({ message: "Check your email" });
                }).catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    });
};

// Reset Password Function
const resetPassword = (req, res) => {
    const { password, token } = req.body;

    User.findOne({ resetToken: token, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) return res.status(422).json({ error: "Session expired, please try again" });

            bcrypt.hash(password, 12).then(hashedPassword => {
                user.password = hashedPassword;
                user.resetToken = undefined;
                user.expireToken = undefined;

                user.save().then(() => {
                    res.json({ message: "Password updated successfully" });
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Something went wrong during password reset" });
        });
};

// Exporting functions
module.exports = {
    signin,
    signup,
    forgotPassword,
    resetPassword
};
