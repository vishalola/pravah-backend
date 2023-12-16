import User from "../models/user.model.js";
import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import { checkPerm } from "../utils/project.util.js";

export async function createTask(req, res){
   
    try{
        let { title, projectID, nodeID, isAssigned,isCompleted, assignedTo, taskID } = req.body;
        if(!title || !projectID || !nodeID || !assignedTo || !taskID) {
            return res.status(400).json({
                message: "Bad request"
            })
        }
        
        const project = await Project.findOne({ projectID: projectID });
        if(!project) {
            return res.status(400).json({
                "message": "project id does not exist"
            }); 
        }

        let f =await checkPerm(req.user.email, projectID);
        if(!f) {
            return res.status(403).json({
                "message": "access denied"
            }); 
        }

        let newTask = await Task.create({
            title,
            projectID,
            nodeID,
            taskID,
            isAssigned,
            assignedTo,
            isCompleted
        });
        return res.status(201).json(newTask);
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}
export async function assignTask(req,res){
    try{
        let {projectID,nodeID,taskID,assignedTo} = req.body
        if(!projectID || !nodeID || !assignedTo || !taskID) {
            return res.status(400).json({
                message: "Bad request"
            })
        }
        
        const project = await Project.findOne({ projectID: projectID });
        if(!project) {
            return res.status(400).json({
                "message": "project id does not exist"
            }); 
        }

        let f =await checkPerm(req.user.email, projectID);
        if(!f) {
            return res.status(403).json({
                "message": "access denied"
            }); 
        }
        let query = {
            "projectID":projectID,
            "taskID":taskID,
            "nodeID":nodeID
        }
        let updateField = {
            "isAssigned":true,
            "assignedTo":assignedTo
        }

        let updateTask = await Task.updateOne(query,updateField);
        return res.status(200).json(updateTask);

    }
    catch(e)
    {
        console.log(e);
        return res.status(500).json({
            message:"Interval server error"
        })
    }
}
export async function completeTask(req,res){
    try{
        let {projectID,nodeID,taskID,isCompleted} = req.body
        if(!projectID || !nodeID || !taskID || isCompleted === null) {
            return res.status(400).json({
                message: "Bad request"
            })
        }
        
        const project = await Project.findOne({ projectID: projectID });
        if(!project) {
            return res.status(400).json({
                "message": "project id does not exist"
            }); 
        }

        let f =await checkPerm(req.user.email, projectID);
        if(!f) {
            return res.status(403).json({
                "message": "access denied"
            }); 
        }
        let query = {
            "projectID":projectID,
            "taskID":taskID,
            "nodeID":nodeID
        }
        let updateField = {
            "isCompleted":isCompleted
        }

        let updateTask = await Task.updateOne(query,updateField);
        console.log(updateTask);
        return res.status(200).json(updateTask);

    }
    catch(e)
    {
        console.log(e);
        return res.status(500).json({
            message:"Interval server error"
        })
    }
}

export async function fetchTaskByUser(req, res){
    try{
        const query = { assignedTo: req.user.email };
        const tasks = await Task.find(query);
        const dataToBeSent = [];
        for(const tsk of tasks)
        {   
            const project = await Project.findOne({projectID:tsk.projectID})

            if(project)
            {
                let tempObject = {
                    title: tsk.title,
                    projectID:tsk.projectID,
                    taskID:tsk.taskID,
                    nodeID:tsk.nodeID,
                    assignedTo:tsk.assignedTo,
                    projectName:project.name,
                    isCompleted:tsk.isCompleted
                };
                dataToBeSent.push(tempObject);
            }
        }
        return res.status(200).json({ "tasks": dataToBeSent });
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

export async function fetchTaskByID(req, res){
    try{
        let { projectID, nodeID } = req.body;

        if(!projectID || !nodeID) {
            return res.status(400).json({
                message: "Bad request"
            })
        }
        const query = { 
            projectID: projectID,
            nodeID: nodeID
        };
        const tasks = await Task.find(query);
        const dataToBeSent = [];
        for(const tsk of tasks)
        {   
            if(tsk.assignedTo==="Unassigned")
            {
                let tempObject = {
                    title:tsk.title,
                    taskID:tsk.taskID,
                    assignedTo:tsk.assignedTo,
                    isAssigned:tsk.isAssigned,
                    isCompleted:tsk.isCompleted
                };
                dataToBeSent.push(tempObject);
            }
            else
            {
                const user = await User.findOne({email:tsk.assignedTo})

                if(user)
                {
                    let tempObject = {
                        title: tsk.title,
                        taskID:tsk.taskID,
                        assignedTo:user.name,
                        isAssigned:tsk.isAssigned,
                        isCompleted:tsk.isCompleted
                    };
                    dataToBeSent.push(tempObject);
                }
            }

        }
        return res.status(200).json({ "tasks": dataToBeSent });
        // return res.status(200).json({ "tasks": tasks });
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}