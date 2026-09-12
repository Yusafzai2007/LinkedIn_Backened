import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  create_User_Profile,
  edit_profile,
} from "../controllers/user_profile.controller.js";
import { jwtverify } from "../middlewares/auth.middleware.js";

const route = Router();

route.post(
  "/create_User_Profile",
  jwtverify,
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
  create_User_Profile,
);
route.put(
  "/edit_profile/:id",
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
  edit_profile,
);
export default route;
