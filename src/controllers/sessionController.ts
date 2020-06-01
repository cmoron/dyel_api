import { Request, Response } from "express";
import { API_ERROR_CODE, API_SUCCESS_CODE, API_NOT_FOUND_CODE } from "../config/configuration"
import { loggerFactory } from "./../config/configuration";
import Session from "./../models/session";
import Block from "./../models/block";
import Group from "./../models/group";

const logger = loggerFactory.getLogger("controllers/sessionController.ts");

export let allSessions = (req: Request, res: Response) => {
    Session.find((err: any, sessions: any) => {
        let status = API_SUCCESS_CODE;
        let data: any = {};

        if (!err) {
            data = sessions;
        } else {
            logger.error(err);
            status = API_ERROR_CODE;
            data = "Error while retrieving sessions in database.";
        }

        res.status(status).send(data);
    });
}

export let getSession = (req: Request, res: Response) => {
    Session.findById(req.params.id, (err: any, session: any) => {
        let status = API_SUCCESS_CODE;
        let data: any = {};

        if (!err) {
            data = session;
        } else {
            logger.error(err);
            status = API_ERROR_CODE;
            data = "Error while retrieving session in database.";
        }

        res.status(status).send(data);
    });
}

export let getBlocks = (req : Request, res: Response) => {
    Block.find({ session: req.params.id }, (err: any, blocks: any) => {
        let status = API_SUCCESS_CODE;
        let data: any = {};

        if (!err) {
            data = blocks;
        } else {
            logger.error(err);
            status = API_ERROR_CODE;
            data = "Error while retrieving blocks in database.";
        }

        res.status(status).send(data);
    });
}

export let getGroups = (req: Request, res: Response) => {
    Session.findById(req.params.id, async (err: any, session: any) => {
        let status = API_SUCCESS_CODE;
        let data: any = {};

        if (!err) {
            const groups: any[] = [];
            if (session) {
                for (const group of session.groups) {
                    try {
                        const result = await Group.findById(group);
                        groups.push(result);
                    } catch (error) {
                        logger.error('Failed to retrieve group with id ' + group.id);
                        status = API_ERROR_CODE;
                    }
                }
            }

            data = groups;
        } else {
            logger.error(err);
            data = "Error while retrieving groups for session " + req.params.id;
            status = API_ERROR_CODE;
        }

        res.status(status).send(data);
    });
}

export let deleteSession = (req: Request, res: Response) => {
    Session.deleteOne({ _id: req.params.id }, (err: any) => {
        let status = API_SUCCESS_CODE;
        let data: any = {};

        if (!err) {
            data = "Successfully deleted session.";
        } else {
            logger.error(err);
            status = API_ERROR_CODE;
            data = "Error while deleting session in database.";
        }

        res.status(status).send(data);
    });
}

export let updateSession = (req: Request, res: Response) => {
    Session.findByIdAndUpdate(req.params.id, req.body, (err: any, session: any) => {
        let status = API_SUCCESS_CODE;
        let data: any = {};

        if (!err) {
            data = session;
        } else {
            logger.error(err);
            status = API_ERROR_CODE;
            data = "Error while updating session in database.";
        }

        res.status(status).send(data);
    });
}

export let addSession = (req: Request, res: Response) => {
    const session = new Session(req.body);
    session.save((err: any, dbSession: Session) => {
        let status = API_SUCCESS_CODE;
        let data: any = {};

        if (!err) {
            data = dbSession;
        } else {
            logger.error(err);
            status = API_ERROR_CODE;
            data = "Error while saving session in database.";
        }

        res.status(status).send(data);
    });
}
