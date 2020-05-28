import mongoose from "mongoose";
import Group from "./group";
const { ObjectId } = mongoose.Types;

interface Session extends mongoose.Document {
    name: string,
    groups: [ string ]
}

/* Mongoose schema for Sessions. */
export const SessionSchema: mongoose.Schema = new mongoose.Schema({
    name: { type: String, required: true },
    groups: [{ type: ObjectId, ref: Group, required: true }]
});

/* Session model. */
const Session = mongoose.model<Session>("Session", SessionSchema);

export default Session;
