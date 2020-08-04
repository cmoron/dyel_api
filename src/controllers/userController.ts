import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { API_ERROR_CODE, API_SUCCESS_CODE, API_NOT_FOUND_CODE, API_UNOTHORIZED_CODE } from '../config/configuration'
import { loggerFactory, JWT_SECRET } from './../config/configuration'
import User from '../models/user'

const logger = loggerFactory.getLogger('controllers/userController.ts')

/*
 * Function hashPassword.
 * Returns hashed password with bcryptjs.
 */
function hashPassword(password: string) {
    const SALT_ROUNDS = 10
    return bcrypt.hashSync(password, SALT_ROUNDS)
}

/*
 * Add new user in database.
 * Handles errors for duplicate values.
 */
export let addUser = async (req: Request, res: Response) => {

    /* Get request body. */
    const { name, username, email, password, confirm_password } = req.body

    /* Check input data :
     * username is set
     * name is set
     * password and confirmation password match.
     * email is set
     */
    if (!username || username === '') {
        return res.status(API_ERROR_CODE).json ({
            success: false,
            message: 'Username should be provided.'
        })
    }
    if (!name || name === '') {
        return res.status(API_ERROR_CODE).json ({
            success: false,
            message: 'Name should be provided.'
        })
    }
    if (password !== confirm_password) {
        return res.status(API_ERROR_CODE).json ({
            success: false,
            message: 'Passwords do not match.'
        })
    }
    if (!email || email === '') {
        return res.status(API_ERROR_CODE).json ({
            success: false,
            message: 'Email should be provided.'
        })
    }

    const hash = hashPassword(password)
    const user = new User({ name, username, email, password: hash })

    user.save().then((dbUser: User) => {

        return res.status(API_SUCCESS_CODE).json({
            success: true,
            message: 'User ' + dbUser.name + ' is now registered.'
        })

    }).catch(err => {

        /* Default error message */
        let errorMessage = 'Error saving user.'
        logger.error(errorMessage, err)

        /* Handle duplication errors. */
        if (err.name === 'MongoError' && err.code === 11000) {
            if (err.keyValue.username != null) {
                errorMessage = 'username ' + username + ' already exists'
            } else if (err.keyValue.email != null) {
                errorMessage = 'email ' + email + ' already exists'
            }
        }

        return res.status(API_ERROR_CODE).json({
            success: false,
            message: errorMessage
        })
    })
}

/*
 * Log user in
 * Check username and password
 * Returns the user data if user and password are OK.
 */
export let login = async (req: Request, res: Response) => {
    const userData = {
        username: req.body.username,
        password: req.body.password
    }

    User.findOne({ username: userData.username }).then(dbUser => {
        if (dbUser && bcrypt.compareSync(userData.password, dbUser.password)) {

            const payload = {
                id: dbUser.id,
                username: dbUser.username,
                name: dbUser.name,
                email: dbUser.email
            }

            jwt.sign(payload, JWT_SECRET, {
                expiresIn: 604800
            }, (err, token) => {
                return res.status(API_SUCCESS_CODE).json({
                    success: true,
                    user: payload,
                    token: `Bearer ${token}`,
                    message: 'You are now logged'
                })
            })

        } else {
            return res.status(API_UNOTHORIZED_CODE).json({
                success: false,
                message: 'Username or password incorrect'
            })
        }
    }).catch(err => {
        return res.status(API_ERROR_CODE).json({
            success: false,
            message: 'Error during login.'
        })
    })
}

export let profile = (req: Request, res: Response) => {
    return res.json({
        user: req.user
    })
}
