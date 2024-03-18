import { Blog } from "@/utils/types/mongoose";
import mongoose, { Schema } from "mongoose";

const contentSchema = new Schema({
  html: { type: Schema.Types.String },
  image: { type: Schema.Types.String },
  url: { type: Schema.Types.String },
  code: { type: Schema.Types.Mixed },
  video: { type: Schema.Types.String },
});

const blogSchema = new Schema<Blog>({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  heading: { type: Schema.Types.String, required: true, trim: true },
  createdAt: { type: Schema.Types.Date, required: true, default: new Date() },
  updatedAt: { type: Schema.Types.Date, required: true, default: new Date() },
  topic: { type: Schema.Types.String, required: true, trim: true },
  bannerImg: { type: Schema.Types.String, required: true, trim: true },
  content: [contentSchema],
  staffPick: { type: Schema.Types.Boolean, default: false },
  isPublished: { type: Schema.Types.Boolean, required: true, default: false },
  seen: { type: Schema.Types.Number },
  readingTime: { type: Schema.Types.Number },
  likes: { type: Schema.Types.Number },
  unlikes: { type: Schema.Types.Number },
  likedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  savedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const BlogModel = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
export default BlogModel;
