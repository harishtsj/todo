import express from 'express'
import { getUser, loginUser, logoutUser, registerUser } from '../controller/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.get('/fetchUser', protect, getUser);
userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.post('/logout', logoutUser);

export default userRouter