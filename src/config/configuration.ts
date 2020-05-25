import cors from 'cors';

/* The application port. */
export const PORT: string = process.env.PORT || "3000";

/* Database connection */
export const URI: string = "mongodb://127.0.0.1:27017/local";

/* Connect to database. Default timeout is 30s. */
export const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}

/* Cors middleware. */
export const corsOptions: cors.CorsOptions = {
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: "http://localhost",
  preflightContinue: false
};
