// src/components/blog/BlogCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';
import { formatUserName } from '../../utils/formatUserName';
import { MessageSquare } from 'lucide-react';

const BlogCard = ({ post }) => {
  // Log để debug tiêu đề
  console.log("Blog card rendering with post:", { 
    id: post.id || post.post_id,
    title: post.postTitle || post.post_title || "No title"
  });
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      <Link to={`/blog/${post.post_id || post.id}`} className="block">
        {post.featured_image || post.thumbnail ? (
          <img 
            src={post.featured_image || post.thumbnail} 
            alt={post.postTitle || post.post_title || "Blog post"} 
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
            <h2 className="text-4xl font-bold text-white">
              {/* Hiển thị chữ cái đầu tiên của tiêu đề nếu có */}
              {(post.postTitle || post.post_title || "A").charAt(0)}
            </h2>
          </div>
        )}
      </Link>
      
      <div className="p-5">
        <Link to={`/blog/${post.post_id || post.id}`} className="block">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {/* Hiển thị đầy đủ tiêu đề */}
            {post.postTitle || post.post_title || "Bài viết chưa có tiêu đề"}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {post.postSummary || post.post_excerpt || "Không có mô tả"}
        </p>
        
        {/* Hiển thị danh mục - xử lý từ bảng post_category */}
        {(post.categories && Array.isArray(post.categories) && post.categories.length > 0) && (
          <div className="mb-3 flex flex-wrap gap-2">
            {post.categories.map((category, index) => (
              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                {category.name}
              </span>
            ))}
          </div>
        )}
        
        {/* Fallback cho category đơn lẻ */}
        {(!post.categories || !Array.isArray(post.categories) || post.categories.length === 0) && 
         (post.category || post.categoryName || post.categoryTitle) && (
          <div className="mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
              {post.category?.category_name || 
               post.category?.name || 
               post.category?.categoryTitle || 
               post.categoryName || 
               post.categoryTitle || 
               "Chưa phân loại"}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {/* Hiển thị tên tác giả */}
            {post.authorName || (post.user && formatUserName(post.user)) || "Tác giả ẩn danh"}
          </span>
          <div className="flex items-center gap-4">
            {/* Hiển thị số lượng bình luận */}
            {post.commentCount !== undefined && (
              <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <MessageSquare size={16} />
                <span>{post.commentCount}</span>
              </span>
            )}
            <span className="text-gray-500 dark:text-gray-400">
              {/* Hiển thị ngày đăng kèm giờ phút */}
              {post.formattedDate || 
               (post.created_at ? formatDate(post.created_at, true) : 
               (post.createdAt ? formatDate(post.createdAt, true) : formatDate(new Date(), true)))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;