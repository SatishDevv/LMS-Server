import express from "express";
import { activateUser, getUserInfo, loginUser, logoutUser, registarationUser, socialAuth, updateAccessToken, updatePassword, updateProfilePicture, updateUser } from "../controllers/user.Controller";
import { isAutheticated } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/registration", registarationUser);

userRouter.post("/activate-user",activateUser);

userRouter.post("/login",loginUser);

userRouter.get("/logout" ,isAutheticated ,logoutUser );

userRouter.get("/refresh",updateAccessToken);

userRouter.get("/me",isAutheticated, getUserInfo);

userRouter.post("/social-auth",socialAuth );

userRouter.put("/update-user-info", isAutheticated, updateUser);

userRouter.put("/update-user-password", isAutheticated, updatePassword);

userRouter.put("/update-user-avatar",isAutheticated, updateProfilePicture);


export default userRouter;