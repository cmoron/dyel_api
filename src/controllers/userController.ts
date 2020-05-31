import { Request, Response } from "express";
import User from '../models/user';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { 
    API_ERROR_CODE,
    API_SUCCESS_CODE,
    API_NOT_FOUND_CODE } from "../config/configuration"

/*
 * Function hashPassword.
 * Returns hashed password with bcryptjs.
 */
function hashPassword(password: string) {
    const SALT_ROUNDS = 10;
    return bcrypt.hashSync(password, SALT_ROUNDS);
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
        return res.status(API_ERROR_CODE).json ({
            sucess: false,
            message: "Passwords do not match." }
        );
    }

    const hash = hashPassword(password);
    let user = new User({ name, username, email, password: hash });

    user.save().then((user: User) => {

        return res.status(API_SUCCESS_CODE).json({
            success: true,
            message: "User is now registered."
        });

    }).catch(err => {

        /* Default error message */
        let errorMessage = "Error saving user."
        console.error(err);

        /* Handle duplication errors. */
        if (err.name === 'MongoError' && err.code == 11000) {
            if (err.keyValue.username != null) {
                errorMessage = 'username ' + username + ' already exists';
            } else if (err.keyValue.email != null) {
                errorMessage = 'email ' + email + ' already exists';
            }
        }

        return res.status(API_ERROR_CODE).json({
            success: false,
            message: errorMessage
        });
    });
};

/*
 * Log user in
 * Check username and password 
 * Returns the user data if user and password are OK.
 */
export let login = async (req: Request, res: Response) => {
    let userData = {
        username: req.body.username,
        password: req.body.password
    }

    User.findOne({ username: userData.username }).then( user => {
        if (user && bcrypt.compareSync(userData.password, user.password)) {
            return res.status(API_SUCCESS_CODE).json({
                sucess: true,
                user: user
            });
        } else {
            return res.status(API_NOT_FOUND_CODE).json({
                success: false,
                message: 'Username or password incorrect'
            });
        }
    }).catch(err => {
        return res.status(API_ERROR_CODE).json({
            success: false,
            message: 'Error during login.'
        });
    });

}
