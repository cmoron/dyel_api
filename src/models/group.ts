import mongoose = require("mongoose");

export const GroupSchema =  new mongoose.Schema({
    name: { type: String, required: true }
});

const Group = mongoose.model("Group", GroupSchema);

export default Group;
