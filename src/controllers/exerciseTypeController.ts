import { Request, Response } from "express";
import ExerciseType from "./../models/exerciseType";

export let allExerciseTypes = (req: Request, res: Response) => {
    let exerciseTypes = ExerciseType.find((err: any, exerciseTypes: any) => {
        if (err) {
            res.send("Error!");
        } else {
            res.send(exerciseTypes);
        }
    });
}

export let getExerciseType = (req: Request, res: Response) => {
    let exerciseType = ExerciseType.findById(req.params.id, (err: any, exerciseType: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send(exerciseType);
        }
    });
}

export let deleteExerciseType = (req: Request, res: Response) => {
    let exerciseType = ExerciseType.deleteOne({ _id: req.params.id }, (err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send("Successfully deleted exerciseType");
        }
    });
}

export let updateExerciseType = (req: Request, res: Response) => {
    console.log(req.body);

    let exerciseType = ExerciseType.findByIdAndUpdate(
        req.params.id,
        req.body,
        (err: any, exerciseType: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully updated exerciseType");
            }
        }
    );
}

export let addExerciseType = (req: Request, res: Response) => {

    var exerciseType = new ExerciseType(req.body);
    exerciseType.save((err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send(exerciseType);
        }
    });
}
