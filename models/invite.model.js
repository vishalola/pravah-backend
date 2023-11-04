import {model, Schema} from "mongoose";

const InviteSchema = new Schema({
    projectID: {
        type: String, 
        required: true
    },
    userID: {
        type: String,
        required: true
    }
});

const Invite = model("Invite", InviteSchema);
export default Invite;