const userModel = require('../models/user.model');
const blacklistTokenModel = require('../models/blacklistToken.model');
const authUserMiddleware = require('../middlewares/auth.middleware');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @name registerUserController
 * @description Register a new user expects username, email and password
 * @access Public
 */
const registerUserController = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // if user already exists
        const userExists = await userModel.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({ username, email, password: hashedPassword });

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
        
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @name loginUserController
 * @description Login a user expects email and password
 * @access Public
 */
const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // generate token
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
        
        res.status(200).json({ user:{
            id: user._id,
            username: user.username,
            email: user.email
        }, message: 'User logged in successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @name logoutUserController
 * @description Logout a user
 * @access Public
 */
const logoutUserController = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }

        // add token to blacklist
        await blacklistTokenModel.create({ token });

        res.clearCookie('token');
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @name getMeController
 * @description Get current user
 * @access Private
 */
const getMeController = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};