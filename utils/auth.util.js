import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

dotenv.config();

export function getJWT(object , expiresIn = "30d"){
    const secret = process.env.JWT_SECRET;
    const options = {
        algorithm : "HS256",
        expiresIn: expiresIn
    }
    const token = jwt.sign({payload : object}, secret, options);
    return token;
}

export async function hashPassword(password){
    const salt = await bcrypt.genSalt(16);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}
export async function comparePasswords(plaintextPassword, hashedPassword) {
        const isMatch = await bcrypt.compare(plaintextPassword, hashedPassword);
        return isMatch;
}