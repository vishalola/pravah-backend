import { hashPassword, getJWT } from "../utils/auth.util.js";
import User from "../models/user.model.js";

export async function signUp(req, res){
    try{
        const {name, userName, email, password} = req.body;
        if(!name || !userName || !email || !password){
            return res.status(400).json({
                message:"Invalid details provided"
            });
        }
    
        if(password.length < 8){
            return res.status(400).json({
                message:"Passowrd is too small."
            })
        }
    
        const checkUser = await User.findOne({email});
    
        if(checkUser) return res.status(400).json({message:"User already exists"});
    
        const encryptedPassword = await hashPassword(password);
    
        let user = await User.create({
            name,
            email,
            userName,
            password : encryptedPassword
        })
    
        const jwtToken = getJWT({
            email
        });
    
        return res.status(201).json({
            token : jwtToken
        });    
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

export async function logIn(req, res){
    try {
        const {email, password} = req.body;

        if(!email || !password) return res.status(400).json({
            message:"Invalid Credentials"
        });

        const encryptedPassword = hashPassword(password);

        const user = User.findOne({email});

        if(!user) return res.status(400).json({
            message:"User does not exist"
        });

        if(user.password != encryptedPassword){
            return res.status(400).json({
                message:"Invalid Passowrd"
            });
        }

        const token = getJWT({
            email
        });

        return res.status(201).json({token});
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"});       
    }
}