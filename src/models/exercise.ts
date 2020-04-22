import mongoose = require("mongoose");
import ExerciseType from "./exerciseType";

export const ExerciseSchema =  new mongoose.Schema({
    type: { type: ExerciseType, required: true },
    repeat: { type: String, required: true }
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

export default Exercise;
