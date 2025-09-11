import Astrologer from "../models/Astrologer.js";
import fs from "fs";

// Create Profile
export const createProfile = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debug

    const { bio, skills, languages, pricePerMinute, experience } = req.body;

    if (!bio) {
      return res.status(400).json({ message: "Bio is required" });
    }

    // ✅ Generate full URL for profilePic
    const profilePicUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;

    const astrologer = await Astrologer.create({
      userId: req.user.id,
      bio,
      skills: skills.split(","),
      languages: languages.split(","),
      pricePerMinute,
      experience,
      profilePic: profilePicUrl,
      isApproved: "pending"
    });

    res.status(201).json({ message: "Profile created successfully", astrologer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// Get My Profile
export const getMyProfile = async (req, res) => {
  try {
    const astrologer = await Astrologer.findOne({ userId: req.user.id });
    if (!astrologer) return res.status(404).json({ message: "Profile not found" });
    res.json(astrologer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Profile

export const updateProfile = async (req, res) => {
  try {
    const astrologer = await Astrologer.findOne({ userId: req.user.id });

    if (!astrologer) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // 🚫 Block updates if profile is not approved
    if (astrologer.isApproved !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Your profile is still pending approval. You cannot edit it until admin approves.",
      });
    }

    const { bio, skills, languages, pricePerMinute, experience, availability } = req.body;

    astrologer.bio = bio || astrologer.bio;
    astrologer.skills = skills ? skills.split(",") : astrologer.skills;
    astrologer.languages = languages ? languages.split(",") : astrologer.languages;
    astrologer.pricePerMinute = pricePerMinute || astrologer.pricePerMinute;
    astrologer.experience = experience || astrologer.experience;
    astrologer.availability = availability || astrologer.availability;

    if (req.file) {
      astrologer.profilePic = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const updatedProfile = await astrologer.save();
    res.status(200).json({ message: "Profile updated successfully", astrologer: updatedProfile });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




// Delete Profile
export const deleteProfile = async (req, res) => {
  try {
    await Astrologer.findOneAndDelete({ userId: req.user.id });
    res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Astrologers (for user browsing)
// Get All Approved Astrologers with Filters
export const getAllAstrologers = async (req, res) => {
  try {
    const { skills, languages, priceMin, priceMax, availability, page = 1, limit = 10 } = req.query;

    let filter = { isApproved: "approved" };

    if (skills) {
      filter.skills = { $regex: skills, $options: "i" }; // case-insensitive
    }

    if (languages) {
      filter.languages = { $regex: languages, $options: "i" };
    }

    if (availability) {
      filter.availability = availability; // online or offline
    }

    if (priceMin || priceMax) {
      filter.pricePerMinute = {};
      if (priceMin) filter.pricePerMinute.$gte = Number(priceMin);
      if (priceMax) filter.pricePerMinute.$lte = Number(priceMax);
    }

    const skip = (page - 1) * limit;

    const astrologers = await Astrologer.find(filter)
      .select("-userId -__v -createdAt -updatedAt")
      .skip(skip)
      .limit(Number(limit));

    const total = await Astrologer.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: astrologers.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      astrologers
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// controllers/astrologerController.js
export const updateAvailability = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("User ID from token:", req.user.id);

    const { availability } = req.body;

    // Validate availability input
    if (!availability || !["online", "offline"].includes(availability)) {
      return res.status(400).json({ success: false, message: "Invalid availability status" });
    }

    // Update only availability without full validation
    const astrologer = await Astrologer.findOneAndUpdate(
      { userId: req.user.id },
      { availability },
      { new: true } // return the updated document
    );

    if (!astrologer) {
      return res.status(404).json({ success: false, message: "Astrologer not found" });
    }

    res.status(200).json({
      success: true,
      message: `Status updated to ${availability}`,
      astrologer
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// controllers/astrologerController.js // adjust path

// controllers/astrologerController.js
export const getApprovedAstrologers = async (req, res) => {
  try {
    const astrologers = await Astrologer.find({ isApproved: "approved" });
    res.status(200).json(astrologers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch approved astrologers" });
  }
};




