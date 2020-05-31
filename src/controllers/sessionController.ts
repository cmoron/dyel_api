import { Request, Response } from "express";
import { API_ERROR_CODE, API_SUCCESS_CODE, API_NOT_FOUND_CODE } from "../config/configuration"
import { loggerFactory } from "./../config/configuration";
import Session from "./../models/session";
import Block from "./../models/block";
import Group from "./../models/group";

const logger = loggerFactory.getLogger("controllers/sessionController.ts");

export let allSessions = (req: Request, res: Response) => {
    Session.find((err: any, sessions: any) => {
        if (err) {
            res.send("Error!");
        } else {
            res.send(sessions);
        }
    });
}

export let getSession = (req: Request, res: Response) => {
    Session.findById(req.params.id, (err: any, session: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send(session);
        }
    });
}

export let getBlocks = (req : Request, res: Response) => {
    Block.find({ session: req.params.id }, (err: any, blocks: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send(blocks)
        }
    });
}

export let getGroups = (req: Request, res: Response) => {
    Session.findById(req.params.id, async (err: any, session: any) => {
        if (err) {
            res.send(err);
        } else {
            const groups: any[] = [];
            if (null != session) {
                for (const group of session.groups) {
                    try {
                        const result = await Group.findById(group);
                        groups.push(result);
                    } catch (error) {
                        logger.error('Failed to retrieve group with id ' + group.id);
                    }
                }
            }
            res.send(groups);
        }
    });
}

export let deleteSession = (req: Request, res: Response) => {
    Session.deleteOne({ _id: req.params.id }, (err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send("Successfully deleted session");
        }
    });
}

export let updateSession = (req: Request, res: Response) => {
    Session.findByIdAndUpdate(
        req.params.id,
        req.body,
        (err: any, session: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully updated session");
            }
        }
    );
}

export let addSession = (req: Request, res: Response) => {
    const session = new Session(req.body);
    session.save((err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send(session);
        }
    });
}
