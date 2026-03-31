import User from "../models/User.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

const getToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: '30d'
    })
}

export const registerUser = async (req, res) => {
    const { email, name, password } = req.body;

    try {
        if (!email || !name || !password) {
            return res.status(400).json({ success: false, message: 'Required fields are missing' });
        }

        const user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({ success: false, message: 'User already exist' });
        }

        await User.create({ name, email, password });

        return res.status(201).json({ success: true, message: 'User registered successfully' });

    } catch (err) {
        console.log(err.message);
        return res.status(400).json({ success: false, message: err.message })
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {

        // as when creating the schema, the password is made to select: flase, 
        // this means, By default, NEVER include password when fetching a user 

        // the below line does overrides the default.
        // “Even though password is hidden, INCLUDE it for this query”
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // we need to the password to be visible, 
        // as we are comparing the hashed password, with the user input password from req.body
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const token = getToken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, user })

        // return res.json({ success: true, message: 'Logged in successfully', token })

    } catch (err) {
        console.log(err.message);
        return res.status(400).json({ success: false, message: err.message });
    }
}

export const logoutUser = (req, res) => {
    try {

        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        })

        return res.json({success: true, message: 'User logged out successfully'})

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}

export const getUser = async (req, res) => {
    try {

        const user = req.user;
        return res.json({ success: true, user: { name: user.name, email: user.email, id: user._id } })

    } catch (err) {
        return res.status(400).json({ success: false, message: 'Bad Request' })
    }
}