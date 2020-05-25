import { Request, Response } from "express";
import User from '../models/user';
import bcrypt from 'bcryptjs';

export let addUser = (req: Request, res: Response) => {

    let {
        name,
        username,
        email,
        password,
        confirm_password
    } = req.body;

    /* Check password and confirmation password match. */
    console.log("password: " + password + " // conf : " + confirm_password);
    if (password != confirm_password) {
        return res.status(400).json ({ message: "Passwords do not match." });
    }

    /* Check username unicity. */
    User.findOne({ username: username }).then(user => {
        if (user) {
            return res.status(400).json ({ message: "Username already exists." });
        }
    });

    /* Check email unicity. */
    User.findOne({ email: email }).then(user => {
        if (user) {
            return res.status(400).json ({ message: "Email already exists." });
        }
    });

    /* Register user in database with hashed password. */
    bcrypt.genSalt(10, (err: Error, salt: string) => {
        bcrypt.hash(password, salt, (err: Error, hash: string) => {
            if (err) throw err;
            else {
                let user = new User({
                    name,
                    username,
                    email,
                    hash
                });

                user.save().then(user => {
                    return res.status(201).json({
                        success: true,
                        message: "User is now registered."
                    });
                }).catch(err => {
                    return res.status(400).json({
                        message: "Error saving user."
                    });
                });
            }
        });
    });

};
