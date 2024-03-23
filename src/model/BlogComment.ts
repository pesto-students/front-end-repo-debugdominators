import mongoose, { Schema } from "mongoose";
import UserModel from "./User";
import BlogModel from "./Blog";

const blogCommentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
  },
  blog: {
    type: Schema.Types.ObjectId,
    ref: BlogModel,
    required: true,
  },
  content: {
    type: Schema.Types.String || Schema.Types.Number,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

const BlogCommentModel =
  mongoose.models.BlogComment ||
  mongoose.model("BlogComment", blogCommentSchema);
export default BlogCommentModel;
