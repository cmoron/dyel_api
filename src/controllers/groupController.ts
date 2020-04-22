import { Request, Response } from "express";
import Group from "./../models/group";

export let allGroups = (req: Request, res: Response) => {
    let groups = Group.find((err: any, groups: any) => {
        if (err) {
            res.send("Error!");
        } else {
            res.send(groups);
        }
    });
}

export let getGroup = (req: Request, res: Response) => {
    let group = Group.findById(req.params.id, (err: any, group: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send(group);
        }
    });
}

export let deleteGroup = (req: Request, res: Response) => {
    let group = Group.deleteOne({ _id: req.params.id }, (err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send("Successfully deleted group");
        }
    });
}

export let updateGroup = (req: Request, res: Response) => {
    console.log(req.body);

    let group = Group.findByIdAndUpdate(
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

    var group = new Group(req.body);
    group.save((err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send(group);
        }
    });
}

