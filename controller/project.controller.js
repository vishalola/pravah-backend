import Project from "../models/project.model.js";
import User from "../models/user.model.js";
import Node from "../models/node.model.js";
import { makeID } from "../utils/id.util.js";
import { addNode } from "../utils/node.util.js";
import { checkPerm } from "../utils/project.util.js";


export async function editNode(req, res){
    try{
        let projectID = req.params.id;
        let { nodeID, description, title, position } = req.body;
        if(!nodeID || !position) {
            return res.status(401).json ({
                message: "Bad request"
            })
        }
        const NODE = await Node.findOneAndUpdate (
            { 
                "project": projectID,
                "nodeID": nodeID,
            },
            { 
                "description": description,
                "title": title,
                "position": position
            },
            { returnOriginal: false }
        )
        res.status(200).json({
            "updated": NODE
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

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
                owner: req.user.email,
                usersPerm : []
            });

            const pro2 = await Project.findOneAndUpdate (
                { "projectID": projectID },
                { 
                    "usersPerm": [ [ req.user.email, "Author" ] ]
                },
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

        // console.log(nodes);

        await Node.deleteMany({ projectID: projectID });

        for (let index = 0; index < nodes.length; index++) {
            console.log(await addNode(projectID, nodes[index]));
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

        let f = await checkPerm(req.user.email, projectID);
        if(!f) {
            return res.status(403).json({
                "message": "access denied"
            }); 
        }

        const query = { projectID: projectID };
        const nodes = await Node.find(query);
        const { name, edgeList, usersPerm, owner } = project;

        let teamData =await getUserDetails(usersPerm);
        return res.status(200).json({
            "name": name,
            "edgeList": edgeList,
            "nodes": nodes,
            "usersPerm": teamData,
            "owner": owner
        });  
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

export async function viewDetails(req, res){
    try{
        let projectID = req.params.id;
        const proj = await Project.findOne({ projectID: projectID });
        if(!proj) {
            return res.status(400).json({
                "message": "project id does not exist"
            }); 
        }
        const user = await User.findOne({email: proj.owner})
        return res.status(200).json({
            name: proj.name,
            owner: user.name
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal server error"
        })
    }
}
async function getUserDetails(usersPerm){
    try{
        let temp = [];
       for(let i=0;i<usersPerm.length;i++)
       {
        let userData = await User.findOne({"email":usersPerm[i][0]})
        temp.push([userData.name,usersPerm[i][0],usersPerm[i][1]]);
       }
        return temp;
    }

    catch(e)
    {
        return e;
    }
}

