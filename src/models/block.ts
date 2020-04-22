import mongoose = require("mongoose");

export const BlockSchema =  new mongoose.Schema({
    name: { type: String, required: true }
});

const Block = mongoose.model("Block", BlockSchema);

export default Block;
