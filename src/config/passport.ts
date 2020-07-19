import { Strategy, ExtractJwt } from 'passport-jwt'
import User from './../models/user'
import { loggerFactory, JWT_SECRET } from './configuration'

const logger = loggerFactory.getLogger('config/passport')

const passportOptions: any = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
}

const strategy = new Strategy(passportOptions, (jwtPayload, done) => {
    User.findById(jwtPayload.id).then(dbUser => {
        if (dbUser) return done(null, dbUser)
        return done(null, null)
    }).catch(err => {
        logger.error(err)
    })
})

export default strategy
