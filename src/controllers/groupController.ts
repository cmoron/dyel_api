import { Request, Response } from "express";
import { API_ERROR_CODE, API_SUCCESS_CODE } from "./../config/configuration";
import { loggerFactory } from "./../config/configuration";
import Group from "./../models/group";
import Block from "./../models/block";

/* TS logger. */
const logger = loggerFactory.getLogger("controllers/groupController.ts");

export let allGroups = (req: Request, res: Response) => {
    Group.find((err: any, groups: any) => {
        if (err) {
            res.send("Error!");
        } else {
            res.send(groups);
        }
    });
}

export let getGroup = (req: Request, res: Response) => {
    Group.findById(req.params.id, (err: any, group: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send(group);
        }
    });
}

export let getBlocks = (req: Request, res: Response) => {
    Group.findById(req.params.id, async (err: any, group: any) => {
        if (err) {
            res.send(err);
        } else {
            const blocks: any[] = [];

            if (null != group) {
                for (const blockId of group.blocks) {
                    try {
                        const result = await Block.findById(blockId);
                        blocks.push(result);
                    } catch (error) {
                        logger.error('Failed to retrieve block with id ' + blockId);
                    }
                }
            }
            res.send(blocks);
        }
    });
}

export let deleteGroup = (req: Request, res: Response) => {
    Group.deleteOne({ _id: req.params.id }, (err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send("Successfully deleted group");
        }
    });
}

export let updateGroup = (req: Request, res: Response) => {
    Group.findByIdAndUpdate(
        req.params.id,
        req.body,
        (err: any, group: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully updated group");
            }
        }
    );
}

export let addGroup = (req: Request, res: Response) => {
    const group = new Group(req.body);
    group.save((err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send(group);
        }
    });
}
