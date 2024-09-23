import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import { uploadCourse } from "../controllers/course.controller";
const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  isAutheticated,
  authorizeRoles("admin"),
  uploadCourse
);

export default courseRouter;
