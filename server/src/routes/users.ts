import { Router } from "express";
import  UserController from "../controllers/User";
import { isAuthenticated } from "middlewares/jwtAuth";
import { Logger } from "middlewares/logger";

const router = Router();

router.post("/users", UserController.store);
router.post("/new-bookmark", Logger, UserController.addBookmark);
router.get("/users", isAuthenticated, UserController.all);
router.get("/users/info", UserController.info);
router.get("/users/:id", UserController.byUserId);
router.delete("/users/:id", UserController.delete);

export default router;
