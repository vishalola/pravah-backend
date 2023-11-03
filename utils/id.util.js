import Project from "../models/project.model.js";

export const makeID = async (length) => {
    let result = ''
    while(true) {
        result = ''
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        const charactersLength = characters.length
        let counter = 0
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
            counter += 1
        }
        const user = await Project.findOne({ projectID: result });
        if(!user) {
            break;
        }
    }
    return result
}

