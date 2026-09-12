import { asynhandler } from "../utils/asynchandler.js";
import { apiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const jwtverify = asynhandler(async (req, res, next) => {
  const token =
    req.cookies?.isaccesstoken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new apiError(401, "unauthorized requrest");
  }

  const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const user = await User.findById(decode._id).select("-password");

  if (!user) {
    throw new apiError(401, "unauthorized requrest");
  }

  req.user = user;
  next();
});

export { jwtverify };
