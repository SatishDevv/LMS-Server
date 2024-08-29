import express from "express";
import { activateUser, registarationUser } from "../controllers/userController";

const userRouter = express.Router();

userRouter.post("/registration", registarationUser);

userRouter.post("/activate-user",activateUser);

export default userRouter;