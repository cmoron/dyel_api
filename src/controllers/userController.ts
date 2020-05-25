import { Request, Response } from "express";
import User from '../models/user';
import bcrypt from 'bcryptjs';

/*
 * Function hashPassword.
 * Returns hashed password with bcryptjs.
 */
async function hashPassword(password: string) {
    const saltRounds = 10;

    return await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err: Error, hash: string) => {
            if (err) reject();
            else resolve(hash);
        });
    });
}

/*
 * Add new user in database.
 * Handles errors for duplicate values.
 */
export let addUser = async (req: Request, res: Response) => {

    /* Get request body. */
    let { name, username, email, password, confirm_password } = req.body;

    /* Check password and confirmation password match. */
    if (password != confirm_password) {
        return res.status(400).json ({ message: "Passwords do not match." });
    }

    const hash = await hashPassword(password);

    let user = new User({
        name: name,
        username: username,
        email: email,
        password: hash
    });

    user.save().then(user => {
        console.log("user saved");
        return res.status(201).json({
            success: true,
            message: "User is now registered."
        });
    }).catch(err => {
        let errorMessage = "Error saving user."

        /* Handle duplication errors. */
        if (err.name === 'MongoError' && err.code == 11000) {
            if (err.keyValue.username != null) {
                errorMessage = 'username ' + username + ' already exists';
            } else if (err.keyValue.email != null) {
                errorMessage = 'email ' + email + ' already exists';
            }
        }
        return res.status(400).json({
            success: false,
            message: errorMessage
        });
    });
};
