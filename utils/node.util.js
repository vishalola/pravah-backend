import Nodes from "../models/node.model.js";

export const addNode = async (projectID, node) => {
    let { id,  position, title, description } = node

    if(!id || !position || !title || !description) {
        return false;
    }

    let newnode = await Nodes.create({
        id,
        projectID,
        position,
        title, 
        description
    });
    return true;
}

