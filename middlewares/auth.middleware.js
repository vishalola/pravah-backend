import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Passing jwt through
export async function verifyUser(req, res, next) {
  const token = req.header('Authorization');
  if(!token){
    return res.status(401).json({message : "Unauthorized"})
  }
  // if (!token) return response_401(res, 'Unauthorized');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.payload.email });
    // if (!user) return response_401(res, 'Unauthorized');
    if(!user){
      return res.status(401).json({
        message : "Unauthorizeds"
      })
    }
    req.user = user;
    next();
  } catch (err) {
    // return response_500(res, err);
    return res.status(500).json({message : "Internal Server Error"})
  }
}