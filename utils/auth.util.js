import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

export function getJWT(object , expiresIn = "30d"){
    const secret = process.env.SECRET;
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