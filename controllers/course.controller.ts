import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.service";
import CourseModel from "../models/course.model";

export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body; // get All course data from the req body.
      const thumbnail = data.thumbnail; // get the thaumnail from data

      // if course have an thumbnail then upload in cloudinary
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thaumnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      //
      createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// edit course.
export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body; // take the data form request body
      const thaumbnail = data.thaumbnail;
      //
      if (thaumbnail) {
        await cloudinary.v2.uploader.destroy(thaumbnail.public_id); // if hava an thaumbnail then delete  it.
        // and upload new thaumbnail.
        const myCloud = await cloudinary.v2.uploader.upload(thaumbnail, {
          folder: "Courses",
        });
        // set the thaumbnail publid id and url
        data.thaumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      const courseId = req.params.id; // take the course id to update form params.
      // find the course By Id and update the data into the DB.
      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true }
      );

      res.status(200).json({
        success: true,
        course,
      });


    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
