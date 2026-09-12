import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { create_User_Profile } from "../controllers/user_profile.controller.js";

const route = Router();

route.post(
  "/create_User_Profile",
  upload.fields([
    {
      name: "profile_image",
      maxCount: 1,
    },
    {
      name: "cover_image",
      maxCount: 1,
    },
  ]),
  create_User_Profile
);

export default route;