import mongoose from 'mongoose';
import Exercise from './exercise';
import Session from "./session";
const { ObjectId } = mongoose.Types;

interface Block extends mongoose.Document {
    name: string,
    session: string,
    exercises: [ string ]
}
export const BlockSchema: mongoose.Schema = new mongoose.Schema({
    name: { type: String, required: true },
    session: { type: ObjectId, ref: Session, required: true},
    exercises: [{ type: ObjectId, ref: Exercise, required: true }]
});

const Block = mongoose.model<Block>("Block", BlockSchema);

export default Block;
