/* Router middleware */
import express from "express";
import * as sessionController from "../controllers/sessionController";
import * as groupController from "../controllers/groupController";
import * as blockController from "../controllers/blockController";
import * as exerciseController from "../controllers/exerciseController";
import * as userController from "../controllers/userController";
import { Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => res.send("hello wodz !"));

router.get("/api/sessions", sessionController.allSessions);
router.get("/api/session/:id", sessionController.getSession);
router.get("/api/session/:id/blocks", sessionController.getBlocks);
router.get("/api/session/:id/groups", sessionController.getGroups);
router.post("/api/session", sessionController.addSession);
router.put("/api/session/:id", sessionController.updateSession);
router.delete("/api/session/:id", sessionController.deleteSession);

router.get("/api/groups", groupController.allGroups);
router.get("/api/group/:id", groupController.getGroup);
router.get("/api/group/:id/blocks", groupController.getBlocks);
router.post("/api/group", groupController.addGroup);
router.put("/api/group/:id", groupController.updateGroup);
router.delete("/api/group/:id", groupController.deleteGroup);

router.get("/api/blocks", blockController.allBlocks);
router.get("/api/block/:id", blockController.getBlock);
router.get("/api/block/:id/exercises", blockController.getExercises);
router.post("/api/block", blockController.addBlock);
router.put("/api/block/:id", blockController.updateBlock);
router.delete("/api/block/:id", blockController.deleteBlock);

router.get("/api/exercises", exerciseController.allExercises);
router.get("/api/exercise/:id", exerciseController.getExercise);
router.post("/api/exercise", exerciseController.addExercise);
router.put("/api/exercise/:id", exerciseController.updateExercise);
router.delete("/api/exercise/:id", exerciseController.deleteExercise);

/**
 * @route POST api/user
 * @desc register new user
 * @access Public
 */
router.post('/api/user', userController.addUser);

/**
 * @route POST api/user/login
 * @desc log user in
 * @access Public
 */
router.post('/api/user/login', userController.login);

export default router;
