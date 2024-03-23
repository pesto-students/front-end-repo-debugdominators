import { Topic } from "@/utils/types/mongoose";
import mongoose, { Schema } from "mongoose";

const topicSchema = new Schema<Topic>({
  topic: { type: String },
});

const TopicsModel =
  mongoose.models.topics || mongoose.model("topics", topicSchema);
export default TopicsModel;
