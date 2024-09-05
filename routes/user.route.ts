import express from "express";
import { activateUser, loginUser, logoutUser, registarationUser } from "../controllers/userController";
import { isAutheticated } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/registration", registarationUser);

userRouter.post("/activate-user",activateUser);

userRouter.post("/login",loginUser);

userRouter.get("/logout" ,isAutheticated ,logoutUser );

export default userRouter;