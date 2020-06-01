import { Request, Response } from "express";
import { API_ERROR_CODE, API_SUCCESS_CODE } from "./../config/configuration";
import Block from "./../models/block";
import Exercise from "./../models/exercise";
import { loggerFactory } from "./../config/configuration";

const logger = loggerFactory.getLogger("controllers/blockController.ts");

export let allBlocks = (req: Request, res: Response) => {
    Block.find((err: any, blocks: any) => {
        let status: number = API_SUCCESS_CODE;
        let data: any = {};

        if (!err) {
            data = blocks;
        } else {
            status = API_ERROR_CODE;
            logger.error(err);
            data = "Error while retrieving blocks in database.";
        }

        res.status(status).send(data);
    });
}

export let getBlock = (req: Request, res: Response) => {
    Block.findById(req.params.id, (err: any, block: any) => {
        let status: number = API_SUCCESS_CODE;
        let data: any = {};

        if (!err) {
            data = block;
        } else {
            status = API_ERROR_CODE;
            logger.error(err);
            data = "Error while retrieving block in database.";
        }

        res.status(status).send(data);
    });
}

export let getExercises = (req: Request, res: Response) => {
    Block.findById(req.params.id, async (err: any, block: any) => {
        let status: number = API_SUCCESS_CODE;
        let data: any = {};

        if (null != block) {
            const exercises: any[] = [];

            for(const exerciseId of block.exercises) {
                try {
                    const exercise = await Exercise.findById(exerciseId);
                    exercises.push(exercise);
                } catch (error) {
                    status = API_ERROR_CODE;
                    data = 'API error';
                    logger.error('INTERNAL API ERROR: Failed to retrieve exercise with id ' + exerciseId);
                }
            }

            status = API_SUCCESS_CODE;
            data = exercises;
        } else {
            logger.error(err);
            status = API_ERROR_CODE;
            data = 'Failed to retrieve block of id ' + req.params.id
        }

        res.status(status).send(data);
    });
}

export let deleteBlock = (req: Request, res: Response) => {
    Block.deleteOne({ _id: req.params.id }, (err: any) => {
        let status: number = API_SUCCESS_CODE;
        let data: any = {};

        if (!err) {
            data = "Successfully deleted block";
        } else {
            logger.error(err);
            status = API_ERROR_CODE;
            data = "Error while deleting block";
        }

        res.status(status).send(data);
    });
}

export let updateBlock = (req: Request, res: Response) => {
    Block.findByIdAndUpdate(req.params.id, req.body, (err: any, block: any) => {
        let status: number = API_SUCCESS_CODE;
        let data: any = {};

        if (!err) {
            data = block;
        } else {
            logger.error(err);
            status = API_ERROR_CODE;
            data = "Error while updating block.";
        }

        res.status(status).send(data);
    });
}

export let addBlock = (req: Request, res: Response) => {

    const block = new Block(req.body);
    block.save((err: any, dbBlock: Block) => {
        let status: number = API_SUCCESS_CODE;
        let data: any = {};

        if (!err) {
            data = dbBlock;
        } else {
            logger.error(err);
            status = API_ERROR_CODE;
            data = "Error while registering block in database.";
        }

        res.status(status).send(data);
    });
}
