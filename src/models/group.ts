import mongoose from "mongoose";
import Block from "./block";
import Session from "./session";
const { ObjectId } = mongoose.Types;

export const GroupSchema =  new mongoose.Schema({
    repeat: { type: Number, required: true },
    blocks: [{ type: ObjectId, ref: Block, required: true }],
    session: { type: ObjectId, ref: Session, required: true}
});

const Group = mongoose.model("Group", GroupSchema);

export default Group;
