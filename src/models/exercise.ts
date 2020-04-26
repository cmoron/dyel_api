import mongoose from "mongoose";

export const ExerciseSchema =  new mongoose.Schema({
    name: { type: String, required: true },
    repeat: { type: String, required: true }
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

export default Exercise;
