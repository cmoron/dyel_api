import mongoose = require("mongoose");

export const SessionSchema =  new mongoose.Schema({
    name: { type: String, required: true }
});

const Session = mongoose.model("Session", SessionSchema);

export default Session;
