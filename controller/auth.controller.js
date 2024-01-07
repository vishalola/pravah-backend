import { hashPassword, getJWT,comparePasswords } from "../utils/auth.util.js";
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
    
        if(checkUser) return res.status(400).json({message:"Username already exists"});
    
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

        const {email, password} = req.body;

        if(!email || !password) return res.status(400).json({
            message:"Invalid Credentials"
        });

        // console.log(encryptedPassword)
        const user =await User.findOne({email});
        
        if(!user) return res.status(400).json({
            message:"User does not exist"
        });

        let passMatch = await comparePasswords(password,user.password);
        if(!passMatch){
            return res.status(401).json({
                message:"Invalid Passowrd"
            });
        }

        const token = getJWT({
            email
        });

        return res.status(200).json({token});

}
