import mongoose from 'mongoose';
import Exercise from './exercise';
const { ObjectId } = mongoose.Types;

export const BlockSchema = new mongoose.Schema({
    name: { type: String, required: true },
    exercises: [{ type: ObjectId, ref: Exercise, required: true }]
});

const Block = mongoose.model("Block", BlockSchema);

export default Block;
