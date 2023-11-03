import {model, Schema} from "mongoose";

const ProjectSchema = new Schema({
    name:{
        type : String,
        required : true,
        trim : true,
    },
    projectID : {
        type : String, 
        required : true,
    },
    usersPerm : {
        type : [
            String
        ]
    }
});

const Project = model("Project", ProjectSchema);
export default Project;