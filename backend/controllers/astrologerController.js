import Astrologer from "../models/Astrologer.js";
import fs from "fs";

// Create Profile
export const createProfile = async (req, res) => {
  try {
    const { bio, skills, languages, pricePerMinute, experience } = req.body;

    const astrologer = await Astrologer.create({
      userId: req.user.id,
      bio,
      skills: skills.split(","),
      languages: languages.split(","),
      pricePerMinute,
      experience,
      profilePic: req.file ? req.file.path : null
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

    const { bio, skills, languages, pricePerMinute, experience, availability } = req.body;

    astrologer.bio = bio || astrologer.bio;
    astrologer.skills = skills ? skills.split(",") : astrologer.skills;
    astrologer.languages = languages ? languages.split(",") : astrologer.languages;
    astrologer.pricePerMinute = pricePerMinute || astrologer.pricePerMinute;
    astrologer.experience = experience || astrologer.experience;
    astrologer.availability = availability || astrologer.availability;

    if (req.file) {
      // Delete old profile picture if exists
      if (astrologer.profilePic && fs.existsSync(astrologer.profilePic)) {
        fs.unlinkSync(astrologer.profilePic);
      }
      astrologer.profilePic = req.file.path;
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
export const getAllAstrologers = async (req, res) => {
  try {
    const astrologers = await Astrologer.find({ isApproved: true })
      .select("-userId -__v -createdAt -updatedAt");

    res.status(200).json({
      success: true,
      count: astrologers.length,
      astrologers
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


