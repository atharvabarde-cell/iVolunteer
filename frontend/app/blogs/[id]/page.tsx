"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import api from "@/lib/api";

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string;
  imageUrl?: string;
  createdAt: string;
}

export default function BlogDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          // ✅ Properly typed response
          const res = await api.get<{ blog: Blog }>(`/v1/blogs/${id}`);

          setBlog(res.data.blog);
        } catch (err) {
          console.error("Error fetching blog:", err);
        }
      };
      fetchBlog();
    }
  }, [id]);

  if (!blog)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading story...
      </div>
    );

  return (
    <section className="max-w-4xl mx-auto py-16 px-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          {blog.title}
        </h1>
        <p className="text-gray-500 text-sm">
          By <span className="font-semibold text-gray-800">{blog.author}</span>{" "}
          •{" "}
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Image */}
      <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-10">
        <Image
          src={
            blog.imageUrl?.startsWith("http")
              ? blog.imageUrl
              : `http://localhost:5000/${blog.imageUrl}`
          }
          alt={blog.title}
          width={400}
          height={280}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
        {blog.content}
      </div>
    </section>
  );
}
