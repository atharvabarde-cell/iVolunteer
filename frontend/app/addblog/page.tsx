"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useBlog } from "@/contexts/blog-context";
import { Loader2, Upload, FileText, User, Image as ImageIcon } from "lucide-react";

const AddBlogPage: React.FC = () => {
  const { addBlog } = useBlog();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("content", content);
      if (imageFile) formData.append("image", imageFile);

      await addBlog(formData);

      setMessage("Blog published successfully!");
      setTitle("");
      setAuthor("");
      setContent("");
      setImageFile(null);
      setImagePreview("");
      
      // Clear file input
      const fileInput = document.getElementById("image-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      setMessage(`Failed to publish blog: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
    const fileInput = document.getElementById("image-upload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Create New Blog Post
          </h1>
          <p className="text-gray-600 text-lg">
            Share your inspiring story with our community
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid md:grid-cols-5">
            {/* Preview Panel */}
            <div className="md:col-span-2 bg-gradient-to-br from-green-50 to-blue-50 p-8 border-r border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Preview
              </h3>
              
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden bg-white shadow-sm border border-gray-200">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-40 object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl border-2 border-dashed border-gray-300 h-40 bg-gray-50 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Image preview</p>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 line-clamp-2">
                    {title || "Your blog title will appear here"}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {content || "Blog content preview will be shown here..."}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-500">
                      By {author || "Author"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Panel */}
            <div className="md:col-span-3 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    Blog Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a compelling title..."
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                  />
                </div>

                {/* Author Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 text-green-600" />
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Your name..."
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                  />
                </div>

                {/* Content Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    Blog Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your inspiring story..."
                    rows={6}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white resize-none"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Upload className="w-4 h-4 text-green-600" />
                    Featured Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors duration-200 bg-gray-50">
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Click to upload image
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, WEBP up to 10MB
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                  {imageFile && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <ImageIcon className="w-4 h-4" />
                      {imageFile.name}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Publish Blog Post
                    </>
                  )}
                </button>

                {/* Message */}
                {message && (
                  <div className={`p-4 rounded-xl text-center font-medium ${
                    message.includes("successfully") 
                      ? "bg-green-50 text-green-700 border border-green-200" 
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">💡 Writing Tips</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Craft a compelling headline that grabs attention</li>
            <li>• Start with a strong opening paragraph</li>
            <li>• Use high-quality, relevant images</li>
            <li>• Break content into readable sections</li>
            <li>• Add a clear call-to-action at the end</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddBlogPage;