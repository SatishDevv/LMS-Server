import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";

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

// get single course --without purchasing
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;

      const isCacheExist = await redis.get(courseId); // 1st check in redis database related id data present or not.
      
      // if the data is present in our redis data base then the data
      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        console.log(course);
        
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        // Fetch data from the main database if it's not present in Redis.
        const course = await CourseModel.findById(courseId).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );
        // set the on redis database
        await redis.set(courseId, JSON.stringify(course));

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all course --- without purchasing.
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try { 
      const isCacheExist = await redis.get("allCourses"); // search our redis database
      // if data is present in redis data base then retuen the all courses data 
      if (isCacheExist) {
        const course = JSON.stringify(isCacheExist);
        console.log("Hitting redis database"+isCacheExist);
        res.json(200).json({
          success: true,
          course,
        });
      } else { 
        // get all courese form main database.
        const course = await CourseModel.find().select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );
        console.log("hitting an mongoDB data Base"+course);
        
        await redis.set("allCourses",JSON.stringify(course)); // set the data on our redis data base. next time get and esay access to the user. 
        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
