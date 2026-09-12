import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    User_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
    },
    heading: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    profile_image: {
      type: String,
      required: true,
    },
    cover_image: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true },
);

export const User_Profile = mongoose.model("User_Profile", ProfileSchema);
