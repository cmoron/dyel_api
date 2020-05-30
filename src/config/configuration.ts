import cors from 'cors';

/* The application port. */
export const PORT: string = process.env.PORT || "3000";

/* Database connection */
export const URI: string = "mongodb://127.0.0.1:27017/local";

/* The api response codes */
export const API_SUCCESS_CODE = 201;
export const API_ERROR_CODE = 400;
export const API_UNOTHORIZED_CODE = 401;
export const API_NOT_FOUND_CODE = 404;

/* Connect to database. Default timeout is 30s. */
export const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}

/* Cors options. */
export const corsOptions: cors.CorsOptions = {
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: "http://localhost:8080",
  preflightContinue: false
};
