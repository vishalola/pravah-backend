import {model, Schema} from "mongoose";


const TaskSchema = new Schema({
    title :{
        type : String,
        required : true,
    },
    isAssigned : {
        type : Boolean,
        required : true,
    },
    isCompleted:{
        type:Boolean,
        required : true,
    },
    assignedTo : {
        type : String,
        required : true
    },
    projectID : {
        type : String,
        required : true
    },
    nodeID : {
        type : Number,
        required : true
    },
    taskID:{
        type:Number,
        required: true
    }
});

const Task = model("Task", TaskSchema);
export default Task;