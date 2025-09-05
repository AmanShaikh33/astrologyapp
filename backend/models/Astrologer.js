import mongoose from "mongoose";

const astrologerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  bio: String,
  skills: [String],
  languages: [String],
  pricePerMinute: Number,
  experience: Number,
  profilePic: String,
  availability: {
    type: String,
    default: "offline"
  },
  isApproved: {
    type: Boolean,
    default: false // New astrologers need approval
  }
}, { timestamps: true });

export default mongoose.model("Astrologer", astrologerSchema);
