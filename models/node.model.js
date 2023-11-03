import {model, Schema} from "mongoose";

const NodeSchema = new Schema({
    id: {
        type: Number,
        required : true
    },
    projectID: {
        type: String, 
        required: true
    },
    position: {
        type: [ Number ],
        required : true
    },
    title: {
        type: String,
        required : true
    },
    description: {
        type: String
    }
});

const Node = model("Node", NodeSchema);
export default Node;