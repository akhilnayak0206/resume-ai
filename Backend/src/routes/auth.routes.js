const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const authUserMiddleware = require('../middlewares/auth.middleware');

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post('/register', authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @description Login a user
 * @access Public
 */
authRouter.post('/login', authController.loginUserController);

/**
 * @route GET /api/auth/logout
 * @description Logout a user
 * @access Public
 */
authRouter.get('/logout', authController.logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @description Get current user
 * @access private
 */
authRouter.get('/get-me', authUserMiddleware, authController.getMeController);

module.exports = authRouter;
