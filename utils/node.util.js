import Nodes from "../models/node.model.js";

export const addNode = async (projectID, node) => {
    let { id,  position, title, description,color } = node

    if(!id || !position) {
        return false;
    }
    let newnode = await Nodes.create({
        id,
        projectID,
        position,
        title, 
        description,
        color
    });
    return true;
}

