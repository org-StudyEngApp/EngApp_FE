import React from 'react';

const BlogCategories = ({ categories, selectedCategory, onCategorySelect }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Chuyên mục</h3>
      <div className="space-y-2">
        <button
          onClick={() => onCategorySelect(null)}
          className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
            selectedCategory === null
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Tất cả ({categories.reduce((total, cat) => total + (cat.post_count || 0), 0)})
        </button>
        {categories.map((category) => (
          <button
            key={category.category_id}
            onClick={() => onCategorySelect(category.category_id)}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              selectedCategory === category.category_id
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {category.category_name} ({category.post_count || 0})
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlogCategories;