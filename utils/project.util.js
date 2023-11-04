import Project from "../models/project.model.js";

export const checkPerm = async (userID, projectID) => {
    const project = await Project.findOne({ projectID: projectID });
    let data = project.usersPerm;
    for(let i=0;i<data.length;i++)
    {
        if(data[i]===userID)
        {
            return true;
        }
    }
    return false;
}

