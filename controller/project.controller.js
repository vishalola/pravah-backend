import Project from "../models/project.model.js";
import User from "../models/user.model.js";
import { makeID } from "../utils/id.util.js";

export async function viewProjects(req, res){
    try{
        let lst = req.user.projectPerms;

        return res.status(201).json({
            "projects": lst
        });    
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

export async function saveProjects(req, res){
    try{
        let { name, isNew, projectID } = req.body;
        if(!name) {
            return res.status(400).json({
                message:"Invalid details provided"
            });
        }
        if(isNew) {
            projectID = await makeID(10);
        }

        let lst = [req.user.email]

        let lst2 = req.user.projectPerms;
        lst2.push(projectID)

        req.user.set({ 
            projectPerms: lst2
        });

        const filter = { email: req.user.email };
        const update = { projectPerms: lst2 };

        const user = await User.findOneAndUpdate(filter, update, {
            returnOriginal: false
        });

        console.log(req.user)

        let project = await Project.create({
            name,
            projectID,
            usersPerms: lst
        });

        return res.status(201).json({
            "projectID": projectID
        });    
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

export async function openProject(req, res){
    try{
        
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

