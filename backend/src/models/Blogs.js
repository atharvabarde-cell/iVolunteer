import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: "Admin" },
    imageUrl: { type: String },
    category: { type: String },
    tags: [String],
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
