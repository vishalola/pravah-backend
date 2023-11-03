import {model, Schema} from "mongoose";


const UserSchema = new Schema({
    name:{
        type : String,
        required : true,
        trim : true,
    },
    userName : {
        type : String, 
        required : true,
    },
    email : {
        type : String,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    projectPerms: {
        type: [ String ]
    }
});

const User = model("User", UserSchema);
export default User;