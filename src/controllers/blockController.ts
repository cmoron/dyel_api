import { Request, Response } from "express";
import Block from "./../models/block";

export let allBlocks = (req: Request, res: Response) => {
    let blocks = Block.find((err: any, blocks: any) => {
        if (err) {
            res.send("Error!");
        } else {
            res.send(blocks);
        }
    });
}

export let getBlock = (req: Request, res: Response) => {
    let block = Block.findById(req.params.id, (err: any, block: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send(block);
        }
    });
}

export let deleteBlock = (req: Request, res: Response) => {
    let block = Block.deleteOne({ _id: req.params.id }, (err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send("Successfully deleted block");
        }
    });
}

export let updateBlock = (req: Request, res: Response) => {
    console.log(req.body);

    let block = Block.findByIdAndUpdate(
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

    var block = new Block(req.body);
    block.save((err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send(block);
        }
    });
}
