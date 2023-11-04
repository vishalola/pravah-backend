import Project from "../models/project.model.js";

export const checkPerm = async (userID, projectID) => {
    const project = await Project.findOne({ projectID: projectID });
    return project.usersPerm.includes(userID, 0);
}

