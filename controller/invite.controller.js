import User from "../models/user.model.js";
import Invite from "../models/invite.model.js";
import Project from "../models/project.model.js";
import { checkPerm } from "../utils/project.util.js";

export async function viewInvites(req, res){
    try{
        let invites = await Invite.find({ userID: req.user.email });
        return res.status(200).json({
            invites: invites
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
        
        await Invite.deleteOne({
            projectID: projectID,
            userID: req.user.email
        })

        if(action) {
            let lst = project.usersPerm
            lst.push(req.user.email)
            
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
        let { toInvite } = req.body;

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

        let invite = await Invite.create({
            userID: toInvite,
            projectID: projectID
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