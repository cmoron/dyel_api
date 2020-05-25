import mongoose from "mongoose";

/* Mongoose schema for Sessions. */
export const SessionSchema =  new mongoose.Schema({
    name: { type: String, required: true }
});

/* Session model. */
const Session = mongoose.model("Session", SessionSchema);

export default Session;
