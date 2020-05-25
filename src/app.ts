/* ES6 module syntax */
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import samples from './__samples__/data';
import routes from './routes/routes';
import * as conf from './config/configuration';

mongoose.connect(conf.URI, conf.mongooseOptions)
.then(() => {
    console.log("Now connected to MongoDB, creating sample data");
    /* Load sample data. */
    samples(); 
})
.catch((err: any) => console.error("Error connecting MongoDB.", err.message));

/* Init app */
const app = express();

/* Middlewares */
app.use(express.json());

/* Cors middleware. */
app.use(cors(conf.corsOptions));

/* Routes middleware. */
app.use(routes);

/* Launch app */
const server = app.listen(conf.PORT, () => {
    console.log("App is running on http://localhost:%d", conf.PORT);
});
