import { Request, Response } from "express";
import Group from "./../models/group";
import Block from "./../models/block";

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
            let blocks: any[] = [];

            if (null != group) {
                for (let blockId of group.blocks) {
                    try {
                        let result = await Block.findById(blockId);
                        blocks.push(result);
                    } catch (error) {
                        console.error('Failed to retrieve block with id ' + blockId);
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
    let group = new Group(req.body);
    group.save((err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send(group);
        }
    });
}
