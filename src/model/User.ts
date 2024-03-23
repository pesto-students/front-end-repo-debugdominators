import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { User } from "@/utils/types/mongoose";

const userSchema = new Schema<User>({
  name: { type: Schema.Types.String, required: true, trim: true },
  email: {
    type: Schema.Types.String,
    required: true,
    unique: true,
    trim: true,
  },
  password: { type: Schema.Types.String, required: true, trim: true },
  emailVerified: { type: Schema.Types.Boolean, required: true, default: false },
  emailVerification: {
    token: { type: Schema.Types.String, trim: true },
    expiry: { type: Schema.Types.Date, trim: true },
  },
  image: { type: Schema.Types.String, trim: true },
  bio: { type: Schema.Types.String, trim: true },
  address: { type: Schema.Types.String, trim: true },
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(this.password, salt);
    this.password = hashPass;
    return next();
  } catch (error: unknown) {
    return next(error as Error);
  }
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export default UserModel;
