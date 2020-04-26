import mongoose from "mongoose";
import Group from './group';
const { ObjectId } = mongoose.Types;


export const SessionSchema =  new mongoose.Schema({
    name: { type: String, required: true },
    groups: [{ type: ObjectId, ref: Group, required: true }]
});

const Session = mongoose.model("Session", SessionSchema);

export default Session;
