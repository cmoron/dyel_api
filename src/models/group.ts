import mongoose from "mongoose";
import Block from "./block";
import Session from "./session";
const { ObjectId } = mongoose.Types;

interface Group extends mongoose.Document {
    order: Number,
    repeat: Number,
    blocks: [ string ],
}

export const GroupSchema: mongoose.Schema =  new mongoose.Schema({
    order: { type: Number, required: true },
    repeat: { type: Number, required: true },
    blocks: [{ type: ObjectId, ref: Block, required: true }],
});

const Group = mongoose.model<Group>("Group", GroupSchema);

export default Group;
