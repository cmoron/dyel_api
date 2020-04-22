import { Request, Response } from "express";
import Session from "./../models/session";

export let allSessions = (req: Request, res: Response) => {
    let sessions = Session.find((err: any, sessions: any) => {
        if (err) {
            res.send("Error!");
        } else {
            res.send(sessions);
        }
    });
}

export let getSession = (req: Request, res: Response) => {
    let session = Session.findById(req.params.id, (err: any, session: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send(session);
        }
    });
}

export let deleteSession = (req: Request, res: Response) => {
    let session = Session.deleteOne({ _id: req.params.id }, (err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send("Successfully deleted session");
        }
    });
}

export let updateSession = (req: Request, res: Response) => {
    console.log(req.body);

    let session = Session.findByIdAndUpdate(
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

    var session = new Session(req.body);
    session.save((err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send(session);
        }
    });
}
