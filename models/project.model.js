import {model, Schema} from "mongoose";

const ProjectSchema = new Schema({
    name:{
        type : String,
        required : true,
        trim : true,
    },
    owner:{
        type : String,
        required : true,
    },
    projectID : {
        type : String, 
        required : true,
    },
    usersPerm : {
        type : [
            [ String ]
        ]
    },

    edgeList : {
        type : [ 
            [ String ]
        ]
    }
});

const Project = model("Project", ProjectSchema);
export default Project;