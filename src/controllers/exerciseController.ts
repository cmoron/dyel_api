import { Request, Response } from "express";
import { API_ERROR_CODE, API_SUCCESS_CODE, API_NOT_FOUND_CODE } from "../config/configuration"
import { loggerFactory } from "./../config/configuration";
import Exercise from "./../models/exercise";

const logger = loggerFactory.getLogger("controllers/exerciseController.ts");

export let allExercises = (req: Request, res: Response) => {
    Exercise.find((err: any, dbExercises: any) => {
        let status = API_SUCCESS_CODE;
        let data: any = {};

        if (!err) {
            data = dbExercises;
        } else {
            logger.error(err);
            status = API_ERROR_CODE;
            data = "Error while retrieving exercises in database.";
        }

        res.status(status).send(data);
    });
}

export let getExercise = (req: Request, res: Response) => {
    Exercise.findById(req.params.id, (err: any, dbExercise: any) => {
        let status = API_SUCCESS_CODE;
        let data: any = {};

        if (!err) {
            data = dbExercise;
        } else {
            logger.error(err);
            status = API_ERROR_CODE;
            data = "Error while retrieving exercise in database.";
        }

        res.status(status).send(data);
    });
}

export let deleteExercise = (req: Request, res: Response) => {
    Exercise.deleteOne({ _id: req.params.id }, (err: any) => {
        let status = API_SUCCESS_CODE;
        let data: any = {};

        if (!err) {
            data = "Sucessfully deleted exercise.";
        } else {
            logger.error(err);
            status = API_ERROR_CODE;
            data = "Error while deleting exercise in database.";
        }

        res.status(status).send(data);
    });
}

export let updateExercise = (req: Request, res: Response) => {
    Exercise.findByIdAndUpdate(req.params.id, req.body, (err: any, dbExercise: any) => {
        let status = API_SUCCESS_CODE;
        let data: any = {};

        if (!err) {
            data = dbExercise;
        } else {
            logger.error(err);
            status = API_ERROR_CODE;
            data = "Error while updating exercise in database.";
        }

        res.status(status).send(data);
    });
}

export let addExercise = (req: Request, res: Response) => {

    const exercise = new Exercise(req.body);
    exercise.save((err: any, dbExercise: Exercise) => {
        let status = API_SUCCESS_CODE;
        let data: any = {};

        if (!err) {
            data = dbExercise;
        } else {
            logger.error(err);
            status = API_ERROR_CODE;
            data = "Error while adding exercise in database.";
        }

        res.status(status).send(data);
    });
}
