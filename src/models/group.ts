import mongoose from "mongoose";
import Block from "./block";
const { ObjectId } = mongoose.Types;

export const GroupSchema =  new mongoose.Schema({
    name: { type: String, required: true },
    blocks: [{ type: ObjectId, ref: Block, required: true }]
});

const Group = mongoose.model("Group", GroupSchema);

export default Group;
