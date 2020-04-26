/*
 * Router middleware
 */
let router = require('express').Router();

import * as sessionController from "../controllers/sessionController";
import * as groupController from "../controllers/groupController";
import * as blockController from "../controllers/blockController";
import * as exerciseController from "../controllers/exerciseController";
import { Request, Response } from "express";

router.get("/", (req: Request, res: Response) => res.send("hello wodz !"));

router.get("/api/sessions", sessionController.allSessions);
router.get("/api/session/:id", sessionController.getSession);
router.post("/api/session", sessionController.addSession);
router.put("/api/session/:id", sessionController.updateSession);
router.delete("/api/session/:id", sessionController.deleteSession);

router.get("/api/groups", groupController.allGroups);
router.get("/api/group/:id", groupController.getGroup);
router.post("/api/group", groupController.addGroup);
router.put("/api/group/:id", groupController.updateGroup);
router.delete("/api/group/:id", groupController.deleteGroup);

router.get("/api/blocks", blockController.allBlocks);
router.get("/api/block/:id", blockController.getBlock);
router.post("/api/block", blockController.addBlock);
router.put("/api/block/:id", blockController.updateBlock);
router.delete("/api/block/:id", blockController.deleteBlock);

router.get("/api/exercises", exerciseController.allExercises);
router.get("/api/exercise/:id", exerciseController.getExercise);
router.post("/api/exercise", exerciseController.addExercise);
router.put("/api/exercise/:id", exerciseController.updateExercise);
router.delete("/api/exercise/:id", exerciseController.deleteExercise);

export default router;
