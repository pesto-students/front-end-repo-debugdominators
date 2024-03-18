import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: Schema.Types.String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

const MessageModel =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
export default MessageModel;
