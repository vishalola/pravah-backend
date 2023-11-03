import Nodes from "../models/node.model.js";

export const updateNode = async (projectID, node) => {
    let { id, isNew, position, title, description, toDelete } = node

    if(toDelete) {
        if(!projectID) {
            return false;
        }
        await Nodes.deleteOne( { projectID: projectID} )
        return true;
    }

    if(!id || !position || !title || !description) {
        return false;
    }

    if(isNew) {
        let node = await Nodes.create({
            id,
            projectID,
            position,
            title, 
            description
        });
        return true;
    }

    const filter = { projectID: projectID };
    const update = { 
        position: position,
        title: title,
        description: description
    };

    const Node = await Nodes.findOneAndUpdate(filter, update, {
        returnOriginal: false
    });
    return true
}

