import { asynhandler } from "../utils/asynchandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { User_Profile } from "../models/user_profile.js";
import { cloudinaryimg } from "../utils/cloudinary.js";

const create_User_Profile = asynhandler(async (req, res) => {
  const {
    first_name,
    last_name,
    heading,
    country,
    city,
    bio,
    profile_image,
    cover_image,
  } = req.body;

  if (
    !first_name ||
    !heading ||
    !country ||
    !city ||
    !bio ||
    !profile_image ||
    !cover_image
  ) {
    throw new apiError(400, "all field are required");
  }

  // ========================= // User ID // =========================

  const User_Id = req.user?._id;

  if (!User_Id) {
    throw new apiError(401, "Unauthorized user");
  }

  // ============// Check user exists // ==========

  const checkUser = await User.findById(User_Id);
  if (!checkUser) {
    throw new apiError(404, "User not found");
  }

  const existingProfile = await User_Profile.findOne({ User_Id });
  if (existingProfile) {
    throw new apiError(409, "Profile already exists for this user");
  }

  // Check profile image

  if (!req.files?.profile_image?.[0]) {
    throw new apiError(400, "Profile image is required");
  }

  // Check cover image

  if (!req.files?.cover_image?.[0]) {
    throw new apiError(400, "cover_image  is required");
  }

  // upload profile image

  let profileImageUrl = "";

  if (req.files?.profile_image?.[0]) {
    try {
      const profileImg = req.files?.profile_image?.[0];
      const profileUpload = await cloudinaryimg(profileImg);

      profileImageUrl = profileUpload?.url || "";
    } catch (error) {
      console.error("Profile image upload failed:", error);
      throw new apiError(500, "Profile image upload failed");
    }
  }

  // upload cover image

  let coverImageUrl = "";
  try {
    const coverImg = req.files.cover_image[0];
    const coverUpload = await cloudinaryimg(coverImg);
    coverImageUrl = coverUpload?.url || "";
  } catch (error) {
    console.error("Cover image upload failed:", error);
    throw new apiError(500, "Cover image upload failed");
  }

  // Create Profile

  const create_Profile = await User_Profile.create({
    User_Id,
    first_name,
    last_name,
    heading,
    country,
    city,
    bio,
    profile_image: profileImageUrl,
    cover_image: coverImageUrl,
  });

  return res
    .status(201)
    .json(
      new apiResponse(201, create_Profile, "User profile created successfully"),
    );
});

const edit_profile = asynhandler(async (req, res) => {
  const { id } = req.params;

  const {
    first_name,
    last_name,
    heading,
    country,
    city,
    bio,
  } = req.body;

  // =========================
  // Validate body
  // =========================

  if (!first_name || !heading || !country || !city || !bio) {
    throw new apiError(400, "All fields are required");
  }

  // =========================
  // User ID
  // =========================

  const User_Id = req.user?._id;

  if (!User_Id) {
    throw new apiError(401, "Unauthorized user");
  }

  // =========================
  // Find profile
  // =========================

  const profile = await User_Profile.findById(id);

  if (!profile) {
    throw new apiError(404, "Profile not found");
  }

  // =========================
  // Check ownership
  // =========================

  if (profile.User_Id.toString() !== User_Id.toString()) {
    throw new apiError(
      403,
      "You are not allowed to edit this profile"
    );
  }

  // =========================
  // Existing images
  // =========================

  let profileImageUrl = profile.profile_image;
  let coverImageUrl = profile.cover_image;

  // =========================
  // Upload new profile image
  // =========================

  if (req.files?.profile_image?.[0]) {
    try {
      const profileImg = req.files.profile_image[0];

      const profileUpload = await cloudinaryimg(profileImg);

      profileImageUrl = profileUpload?.url || profile.profile_image;
    } catch (error) {
      console.error("Profile image upload failed:", error);

      throw new apiError(
        500,
        "Profile image upload failed"
      );
    }
  }

  // =========================
  // Upload new cover image
  // =========================

  if (req.files?.cover_image?.[0]) {
    try {
      const coverImg = req.files.cover_image[0];

      const coverUpload = await cloudinaryimg(coverImg);

      coverImageUrl = coverUpload?.url || profile.cover_image;
    } catch (error) {
      console.error("Cover image upload failed:", error);

      throw new apiError(
        500,
        "Cover image upload failed"
      );
    }
  }

  // =========================
  // Update Profile
  // =========================

  const update_Profile = await User_Profile.findByIdAndUpdate(
    id,
    {
      first_name,
      last_name,
      heading,
      country,
      city,
      bio,
      profile_image: profileImageUrl,
      cover_image: coverImageUrl,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json(
    new apiResponse(
      200,
      update_Profile,
      "User profile updated successfully"
    )
  );
});

export { create_User_Profile, edit_profile };
