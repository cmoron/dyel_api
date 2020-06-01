import mongoose from 'mongoose'

interface Exercise extends mongoose.Document {
    name: string,
    repeat: string
}

export const ExerciseSchema =  new mongoose.Schema({
    name: { type: String, required: true },
    repeat: { type: String, required: true }
})

const Exercise = mongoose.model<Exercise>('Exercise', ExerciseSchema)

export default Exercise
