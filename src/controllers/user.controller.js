import { asynhandler } from "../utils/asynchandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";

const generateaccesstoken = async (userId) => {
  console.log("1. generateaccesstoken START");

  const user = await User.findById(userId);

  console.log("2. USER FOUND:", user?._id);

  if (!user) {
    throw new apiError(404, "User not found");
  }

  console.log("3. Calling access token method");

  const isaccesstoken = await user.isaccesstoken();

  console.log("4. Access token generated:", isaccesstoken);

  console.log("5. Calling refresh token method");

  const isrefrehtoken = await user.isrefrehtoken();

  console.log("6. Refresh token generated:", isrefrehtoken);

  return {
    isaccesstoken,
    isrefrehtoken,
  };
};

const createaccount = asynhandler(async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    throw new apiError(400, "all field are required");
  }

  const checkemail = await User.findOne({ email });

  if (checkemail) {
    throw new apiError(409, "email already exist");
  }

  const user = await User.create({
    userName,
    email,
    password,
    role: "user",
    status: "active",
  });

  const userdata = await User.findById(user._id).select("-password");

  if (!userdata) {
    throw new apiError(500, "server error");
  }

  res.status(200).json(new apiResponse(200, userdata, "signup successfully"));
});

const user_login = asynhandler(async (req, res) => {
  console.log("LOGIN CONTROLLER START");

  const { email, password } = req.body;

  if (!email || !password) {
    throw new apiError(400, "all field are required");
  }

  const find_email = await User.findOne({ email });

  if (!find_email) {
    throw new apiError(404, "user not exist");
  }

  const check_password = await find_email.ispassworcorrect(password);

  if (!check_password) {
    throw new apiError(404, "password not match");
  }

  console.log("LOGIN SUCCESS - BEFORE TOKEN");

  const { isaccesstoken, isrefrehtoken } =
    await generateaccesstoken(find_email._id);

  console.log("ACCESS TOKEN:", isaccesstoken);
  console.log("REFRESH TOKEN:", isrefrehtoken);

  const userdata = await User.findById(find_email._id).select("-password");

  const option = {
    httpOnly: true,
    secure: false,
  };

  res
    .status(200)
    .cookie("isaccesstoken", isaccesstoken, option)
    .cookie("isrefrehtoken", isrefrehtoken, option)
.json(
  new apiResponse(
    200,
    {
      user: userdata,
      accessToken: isaccesstoken,
      refreshToken: isrefrehtoken
    },
    "user login successfully"
  )
);});

const get_user = asynhandler(async (req, res) => {
  const getusers = await User.find();

  if (!getusers || getusers.length === 0) {
    throw new apiError(404, "No users found");
  }

  res
    .status(200)
    .json(new apiResponse(200, getusers, "Users fetched successfully"));
});

const edit_user = asynhandler(async (req, res) => {
  const { id } = req.params;
  const { userName, email } = req.body;

  if (!userName || !email) {
    throw new apiError(400, "All fields are required");
  }

  const userdata = await User.findByIdAndUpdate(
    id,
    {
      userName,
      email,
    },
    {
      new: true, // updated data return karega
      runValidators: true, // validation apply hogi
    },
  ).select("-password");

  if (!userdata) {
    throw new apiError(404, "User not found");
  }

  res
    .status(200)
    .json(new apiResponse(200, userdata, "User updated successfully"));
});

const logout_user = asynhandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id);

  const option = {
    httpOnly: true,
    secure: false,
  };

  res
    .status(200)
    .clearCookie("isaccesstoken", option)
    .clearCookie("isrefrehtoken", option)
    .json(new apiResponse(200, "user logout successfully"));
});

export { createaccount, user_login, get_user, edit_user, logout_user };
