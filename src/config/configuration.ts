import dotenv from 'dotenv'
import cors from 'cors'
import { LoggerFactory, LoggerFactoryOptions, LFService, LogGroupRule, LogLevel } from 'typescript-logging'

/* Load conf from .env file. */
dotenv.config()

/* The application port. */
export const PORT: string = process.env.PORT || '3000'

/* Database connection */
export const URI: string = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT

/* The api response codes */
export const API_SUCCESS_CODE = 201
export const API_ERROR_CODE = 400
export const API_UNOTHORIZED_CODE = 401
export const API_NOT_FOUND_CODE = 404

/* Connect to database. Default timeout is 30s. */
export let mongooseOptions: any = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
    authSource: process.env.DB_NAME
}

if (process.env.DB_SSL === 'true') {
    mongooseOptions.ssl = true
    mongooseOptions.sslValidate = false
}

/* Cors options. */
export const corsOptions: cors.CorsOptions = {
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization'],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: ['http://localhost:8080',
      'http://192.168.1.17:8080'
  ],
  preflightContinue: false
}

/* Logger factory. */
const loggerOptions = new LoggerFactoryOptions()
const genericRule = new LogGroupRule(new RegExp('.+'), LogLevel.Debug)
loggerOptions.addLogGroupRule(genericRule)
export const loggerFactory = LFService.createNamedLoggerFactory('LoggerFactory', loggerOptions)

/* Mock Secret key : real secret key should be stored as environment variable. */
export const JWT_SECRET = "trololo"
