import mongoose = require("mongoose");
import ExerciseType from "./exerciseType";
import ObjectId = mongoose.Schema.Types.ObjectId;

export const ExerciseSchema =  new mongoose.Schema({
    type: { type: ObjectId, required: true },
    repeat: { type: String, required: true }
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

export default Exercise;
