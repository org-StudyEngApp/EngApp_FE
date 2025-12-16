import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';

/**
 * ArticleCard Component
 * Displays article information in a card format
 */
const ArticleCard = ({ article }) => {
  const navigate = useNavigate();

  // Level badge configuration
  const levelConfig = {
    BEGINNER: {
      label: 'Beginner',
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
    INTERMEDIATE: {
      label: 'Intermediate',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    },
    ADVANCED: {
      label: 'Advanced',
      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    },
  };

  const level = levelConfig[article.level] || levelConfig.BEGINNER;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleClick = () => {
    navigate(`/news/${article.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        {article.thumbnailUrl ? (
          <img
            src={article.thumbnailUrl}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = '/img_social/default-news.jpg';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-4xl text-gray-400">📰</span>
          </div>
        )}

        {/* Level Badge */}
        <div className="absolute left-3 top-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${level.className}`}
          >
            {level.label}
          </span>
        </div>

        {/* Trial Badge */}
        {article.isTrial && (
          <div className="absolute right-3 top-3">
            <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
              Free
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
          {article.title}
        </h3>

        {/* Description */}
        {article.description && (
          <p className="mb-3 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
            {article.description}
          </p>
        )}

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          {/* Published Date */}
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{formatDate(article.publishedAt)}</span>
          </div>

          {/* Read Count */}
          {article.readCount !== undefined && (
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>{article.readCount} lượt đọc</span>
            </div>
          )}
        </div>

        {/* Topic Tag */}
        {article.newsTopic && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {article.newsTopic.title}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;
