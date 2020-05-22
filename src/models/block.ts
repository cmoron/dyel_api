import mongoose from 'mongoose';
import Exercise from './exercise';
import Session from "./session";
const { ObjectId } = mongoose.Types;

export const BlockSchema = new mongoose.Schema({
    name: { type: String, required: true },
    session: { type: ObjectId, ref: Session, required: true},
    exercises: [{ type: ObjectId, ref: Exercise, required: true }]
});

const Block = mongoose.model("Block", BlockSchema);

export default Block;
