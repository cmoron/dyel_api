import { Request, Response } from "express";
import Exercise from "./../models/exercise";

export let allExercises = (req: Request, res: Response) => {
    let exercises = Exercise.find((err: any, exercises: any) => {
        if (err) {
            res.send("Error!");
        } else {
            res.send(exercises);
        }
    });
}

export let getExercise = (req: Request, res: Response) => {
    let exercise = Exercise.findById(req.params.id, (err: any, exercise: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send(exercise);
        }
    });
}

export let deleteExercise = (req: Request, res: Response) => {
    let exercise = Exercise.deleteOne({ _id: req.params.id }, (err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send("Successfully deleted exercise");
        }
    });
}

export let updateExercise = (req: Request, res: Response) => {
    console.log(req.body);

    let exercise = Exercise.findByIdAndUpdate(
        req.params.id,
        req.body,
        (err: any, exercise: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully updated exercise");
            }
        }
    );
}

export let addExercise = (req: Request, res: Response) => {

    var exercise = new Exercise(req.body);
    exercise.save((err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send(exercise);
        }
    });
}

