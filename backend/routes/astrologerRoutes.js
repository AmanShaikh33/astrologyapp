import express from "express";
import { createProfile, getMyProfile, updateProfile, deleteProfile, getAllAstrologers,updateAvailability } from "../controllers/astrologerController.js";
import { protect, verifyRole } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Only astrologers can create/update/delete their profile
router.post("/profile", protect, verifyRole(["astrologer"]), upload.single("profilePic"), createProfile);
router.get("/my-profile", protect, verifyRole(["astrologer"]), getMyProfile);
router.put("/profile", protect, verifyRole(["astrologer"]), upload.single("profilePic"), updateProfile);
router.delete("/profile", protect, verifyRole(["astrologer"]), deleteProfile);
router.put("/status", protect, verifyRole(["astrologer"]), updateAvailability);

// For users: get all astrologers
router.get("/", protect, getAllAstrologers);

export default router;
