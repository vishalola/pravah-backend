import Project from "../models/project.model.js";
import User from "../models/user.model.js";
import Node from "../models/node.model.js";
import { makeID } from "../utils/id.util.js";
import { updateNode } from "../utils/node.util.js";

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
        let { name, isNew, projectID, edgeList, nodes } = req.body;
        if(!name) {
            return res.status(400).json({
                message:"Invalid details provided"
            });
        }

        if(isNew) {
            projectID = await makeID(10);
            let lst = [req.user.email]
            let project = await Project.create({
                name,
                projectID,
                usersPerm : []
            });

            const pro2 = await Project.findOneAndUpdate (
                { "projectID": projectID },
                { "usersPerm": [req.user.email] },
                { returnOriginal: false }
            )
            
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

            return res.status(201).json({
                "projectID": projectID
            }); 
        }

        const proj = await Project.findOne({ projectID: projectID });
        if(!proj) {
            return res.status(400).json({
                "message": "project id does not exist"
            }); 
        }

        const filter = { projectID: projectID };
        const update =  { name: name, edgeList: edgeList };
        
        const project = await Project.findOneAndUpdate(filter, update, {
            returnOriginal: false
        });

        console.log(nodes);

        for (let index = 0; index < nodes.length; index++) {
            console.log(await updateNode(projectID, nodes[index]));
        }

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
        let projectID  = req.params.id;
        const project = await Project.findOne({ projectID: projectID });
        if(!project) {
            return res.status(400).json({
                "message": "project id does not exist"
            }); 
        }

        console.log(project);
        console.log(req.user.email);

        let f = project.usersPerm.includes(req.user.email, 0);

        if(!f) {
            return res.status(403).json({
                "message": "access denied"
            }); 
        }

        const query = { projectID: projectID };
        const nodes = await Node.find(query);
        console.log(nodes);

        const { name, edgeList } = project;

        return res.status(200).json({
            "name": name,
            "edgeList": edgeList,
            "nodes": nodes
        });  
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

