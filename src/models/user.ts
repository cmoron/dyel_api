import mongoose from 'mongoose'

interface User extends mongoose.Document {
    name: string,
    username: string,
    email: string,
    password: string,
}

export const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    date: { type: Date, default: Date.now }
})

const User = mongoose.model<User>('User', UserSchema)

export default User
