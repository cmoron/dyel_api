import express, { Request, Response } from "express";
import * as sessionController from "./controllers/sessionController";
import * as groupController from "./controllers/groupController";
import * as blockController from "./controllers/blockController";
import * as exerciseController from "./controllers/exerciseController";
import * as exerciseTypeController from "./controllers/exerciseTypeController";
import mongoose = require("mongoose");

/* Database connection */
const uri: string = "mongodb://127.0.0.1:27017/local";
console.log(mongoose);
mongoose.connect(uri, (err: any) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Sucessfully connected to database!");
    }
});

/* Init app */
const app = express();
app.use(express.json());
app.set("port", process.env.PORT || 3000);

/* Routes */
app.get("/", (req: Request, res: Response) => res.send("hello !"));

app.get("/api/sessions", sessionController.allSessions);
app.get("/api/session/:id", sessionController.getSession);
app.post("/api/session", sessionController.addSession);
app.put("/api/session/:id", sessionController.updateSession);
app.delete("/api/session/:id", sessionController.deleteSession);

app.get("/api/groups", groupController.allGroups);
app.get("/api/group/:id", groupController.getGroup);
app.post("/api/group", groupController.addGroup);
app.put("/api/group/:id", groupController.updateGroup);
app.delete("/api/group/:id", groupController.deleteGroup);

app.get("/api/blocks", blockController.allBlocks);
app.get("/api/block/:id", blockController.getBlock);
app.post("/api/block", blockController.addBlock);
app.put("/api/block/:id", blockController.updateBlock);
app.delete("/api/block/:id", blockController.deleteBlock);

app.get("/api/exercises", exerciseController.allExercises);
app.get("/api/exercise/:id", exerciseController.getExercise);
app.post("/api/exercise", exerciseController.addExercise);
app.put("/api/exercise/:id", exerciseController.updateExercise);
app.delete("/api/exercise/:id", exerciseController.deleteExercise);

app.get("/api/exerciseTypes", exerciseTypeController.allExerciseTypes);
app.get("/api/exerciseType/:id", exerciseTypeController.getExerciseType);
app.post("/api/exerciseType", exerciseTypeController.addExerciseType);
app.put("/api/exerciseType/:id", exerciseTypeController.updateExerciseType);
app.delete("/api/exerciseType/:id", exerciseTypeController.deleteExerciseType);

/* Launch app */
const server = app.listen(app.get("port"), () => {
    console.log("App is running on http://localhost:%d", app.get("port"));
});
