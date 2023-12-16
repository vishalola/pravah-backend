import User from "../models/user.model.js";
import Invite from "../models/invite.model.js";
import Project from "../models/project.model.js";
import { checkPerm } from "../utils/project.util.js";

export async function viewInvites(req, res){
    try{
        let invites = await Invite.find({ userID: req.user.email });
        let invitesWithProjectInfo = [];

        for (const invite of invites) {
          const project = await Project.findOne({projectID: invite.projectID });
            // console.log(project)
          // Check if the project exists
          if (project) {
            invitesWithProjectInfo.push({
              projectName: project.name,
              projectID: invite.projectID,
              author: invite.author,
              role:invite.role
            });
          }
        }
        return res.status(200).json({
            invites: invitesWithProjectInfo
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

export async function acceptInvites(req, res){
    try{
        let { action } = req.body;

        let projectID = req.params.id;
        let project = await Project.findOne({ projectID: projectID });
        if(!project) {
            return res.status(400).json({
                "message": "project id does not exist"
            }); 
        }

        let invite = await Invite.findOne({ projectID: projectID, userID: req.user.email });
        if(!invite) {
            return res.status(400).json({
                "message": "no such invites"
            }); 
        }

        let { role } = invite;
        if(!role) {
            return res.status(400).json({
                "message": "no role found"
            });
        }
        
        await Invite.deleteOne({
            projectID: projectID,
            userID: req.user.email
        })

        if(action) {
            let lst = project.usersPerm
            lst.push([ req.user.email, role ])
            
            const pro2 = await Project.findOneAndUpdate (
                { "projectID": projectID },
                { "usersPerm": lst },
                { returnOriginal: false }
            )
            let lst2 = req.user.projectPerms;
            lst2.push(projectID)

            const filter = { email: req.user.email };
            const update = { projectPerms: lst2 };

            const user = await User.findOneAndUpdate(filter, update, {
                returnOriginal: false
            });

            return res.status(200).json({
                "message": "added to the project"
            })
        }
        
        return res.status(200).json({
            "message": "invite rejected"
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

export async function sendInvites(req, res){
    try{
        let { toInvite, role } = req.body;

        if(!toInvite) {
            return res.status(403).json({
                "message": "Bad request"
            })
        }

        let projectID = req.params.id;
        let project = await Project.findOne({ projectID: projectID });
        if(!project) {
            return res.status(400).json({
                "message": "project id does not exist"
            }); 
        }

        let f = checkPerm(req.user.email, projectID)
        if(!f) {
            return res.status(403).json({
                "message": "access denied"
            })
        }
        // here first check if the invited person exists or not
        const userCheck = await User.findOne({email:toInvite})
        if(!userCheck)
        {
            return res.status(404).json({
                "message":"user not found"
            })
        }
        if(toInvite===req.user.email)
        {
            return res.status(401).json({
                "message":"Self invitation detected"
            })
        }
        const user = await User.findOne({email:req.user.email})
        let invite = await Invite.create({
            userID: toInvite,
            projectID: projectID,
            role: role,
            author: user.name
        });

        return res.status(201).json({
            "message": "Invited"
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal server error"
        })
    }
}