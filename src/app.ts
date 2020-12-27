import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import passport from 'passport'
import samples from './__samples__/data'
import routes from './routes/routes'
import * as conf from './config/configuration'
import strategy from './config/passport'

const logger = conf.loggerFactory.getLogger('app.ts')

logger.info("URI : " + conf.URI)

mongoose.connect(conf.URI, conf.mongooseOptions)
.then(() => {
    logger.info('Now connected to MongoDB')
    /* Load sample data. */
    if (process.env.NODE_ENV == 'dev') {
        logger.info('Dev mode, create sample data.')
        samples(); 
    }
})
.catch((err: any) => logger.error('Error connecting MongoDB.', err.message))

/* Init app */
const app = express()

/* Middlewares */
app.use(express.json())

/* Cors middleware. */
app.use(cors(conf.corsOptions))

/* Passport middleware. */
app.use(passport.initialize())
passport.use(strategy)

/* Routes middleware. */
app.use(routes)

/* Launch app */
const server = app.listen(conf.PORT, () => {
    logger.info('Appp is running on http://localhost:' + conf.PORT)
})
