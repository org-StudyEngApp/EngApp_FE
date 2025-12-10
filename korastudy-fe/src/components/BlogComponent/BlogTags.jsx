import React from 'react';

const BlogTags = ({ tags, selectedTag, onTagSelect }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Thẻ</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onTagSelect(null)}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            selectedTag === null
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Tất cả
        </button>
        {tags.map((tag) => (
          <button
            key={tag.tag_id}
            onClick={() => onTagSelect(tag.tag_id)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedTag === tag.tag_id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            #{tag.tag_name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlogTags;