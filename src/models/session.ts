import mongoose from "mongoose";

interface Session extends mongoose.Document {
    name: string
}

/* Mongoose schema for Sessions. */
export const SessionSchema =  new mongoose.Schema({
    name: { type: String, required: true }
});

/* Session model. */
const Session = mongoose.model<Session>("Session", SessionSchema);

export default Session;
