import { Request, Response } from "express";
import { 
    API_ERROR_CODE,
    API_SUCCESS_CODE
} from "./../config/configuration";
import Block from "./../models/block";
import Exercise from "./../models/exercise";

export let allBlocks = (req: Request, res: Response) => {
    Block.find((err: any, blocks: any) => {
        if (err) {
            res.send("Error!");
        } else {
            res.send(blocks);
        }
    });
}

export let getBlock = (req: Request, res: Response) => {
    Block.findById(req.params.id, (err: any, block: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send(block);
        }
    });
}

/*
 * TODO : Harmoniser les réponses API sur ce modèle.
 */
export let getExercises = (req: Request, res: Response) => {
    Block.findById(req.params.id, async (err: any, block: any) => {
        let status: number = API_SUCCESS_CODE;
        let data: any = {};
        if (null != block) {
            let exercises: any[] = [];

            for(let exerciseId of block.exercises) {
                try {
                    let exercise = await Exercise.findById(exerciseId);
                    exercises.push(exercise);
                } catch (error) {
                    status = API_ERROR_CODE;
                    data = 'API error';
                    console.error('INTERNAL API ERROR: Failed to retrieve exercise with id ' + exerciseId);
                }
            }
            status = API_SUCCESS_CODE;
            data = exercises;
        } else {
            status = API_ERROR_CODE;
            data = 'Failed to retrieve block of id ' + req.params.id
        }
        res.status(status).send(data);
    });
}

export let deleteBlock = (req: Request, res: Response) => {
    Block.deleteOne({ _id: req.params.id }, (err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send("Successfully deleted block");
        }
    });
}

export let updateBlock = (req: Request, res: Response) => {
    Block.findByIdAndUpdate(
        req.params.id,
        req.body,
        (err: any, block: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully updated block");
            }
        }
    );
}

export let addBlock = (req: Request, res: Response) => {

    let block = new Block(req.body);
    block.save((err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send(block);
        }
    });
}
