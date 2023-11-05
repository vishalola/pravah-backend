import Task from "../models/task.model.js";
import Nodes from "../models/node.model.js";
import Project from "../models/project.model.js";
import { checkPerm } from "../utils/project.util.js";

export async function updateTask(req, res){
   
    try{
        let { title, projectID, nodeID, isAssigned,isCompleted, assignedTo } = req.body;
        if(!title || !projectID || !nodeID || !assignedTo) {
            res.status(400).json({
                message: "Bad request"
            })
        }

        const project = await Project.findOne({ projectID: projectID });
        if(!project) {
            return res.status(400).json({
                "message": "project id does not exist"
            }); 
        }

        let f = checkPerm(req.user.email, projectID);
        if(!f) {
            return res.status(403).json({
                "message": "access denied"
            }); 
        }

        await Task.deleteMany({ 
            "projectID": projectID,
            "nodeID": nodeID
        });

        let newTask = await Task.create({
            title,
            projectID,
            nodeID,
            isAssigned,
            assignedTo,
            isCompleted
        });

        const filter = { "projectID": projectID, "id": nodeID };
        const take = await Nodes.findOne(filter);
        console.log(projectID)
        console.log(nodeID)
        let lst = take.taskList;
        let toPush = [ title, assignedTo, isCompleted ] 
        lst.push(toPush)
        const update = { taskList: lst };

        const Node = await Nodes.findOneAndUpdate(filter, update, {
            returnOriginal: false
        });

        return res.status(201).json(newTask);
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

export async function fetchTaskByUser(req, res){
    try{
        const query = { assignedTo: req.user.email };
        console.log(req.user.email)
        const tasks = await Task.find(query);
        return res.status(200).json({ "tasks": tasks });
    }
    catch(err){
        console.log(err)
        res.status(500).json({
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
        return res.status(200).json({ "tasks": tasks });
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal server error"
        })
    }
}