import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String },
  username: { type: String, unique: true, sparse: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String }, // Not required for OAuth users
  image: { type: String },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  verificationCodeExpires: { type: Date },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
