import mongoose = require("mongoose");

export const ExerciseTypeSchema =  new mongoose.Schema({
    name: { type: String, required: true }
});

const ExerciseType = mongoose.model("ExerciseType", ExerciseTypeSchema);

export default ExerciseType;
