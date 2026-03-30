import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const protect = async (req, res, next) => {
    try {

        const token = req.cookies.token

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user_id = decodedToken.id;

        const user = await User.findById(user_id);

        if (!user) {
            return res.status(401).json({ success: false, message: 'Not Authorized, user not found' })
        }

        req.user = user
        next();

    } catch (err) {
        console.log(err.message)
        return res.status(401).json('401, Unauthorized')
    }
}