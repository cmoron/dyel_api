import express from 'express';
import mongoose from 'mongoose';
import samples from './__samples__/data';
import routes from './routes/routes';
import { Request, Response } from 'express';

/* Database connection */
const URI: string = "mongodb://127.0.0.1:27017/local";

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("Now connected to MongoDB, creating sample data");
    samples();
})
.catch((err: any) => console.error("Error connecting MongoDB.", err.message));

mongoose.set('useFindAndModify', false);

/* Init app */
const app = express();
app.use(express.json());
app.set("port", process.env.PORT || 3000);

/* Routes */
app.use(routes);

/* Launch app */
const server = app.listen(app.get("port"), () => {
    console.log("App is running on http://localhost:%d", app.get("port"));
});
