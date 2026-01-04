import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';

/**
 * ArticleCard Component
 * Displays article information in a card format
 */
const ArticleCard = ({ article, topicsMap = {} }) => {
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

  // Get topic name
  const getTopicName = () => {
    if (article.newsTopicName) return article.newsTopicName;
    if (article.newsTopic?.title) return article.newsTopic.title;
    if (article.newsTopic?.name) return article.newsTopic.name;
    if (article.newsTopicId && topicsMap[article.newsTopicId]) {
      return topicsMap[article.newsTopicId];
    }
    return null;
  };

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

  // Format view count
  const formatViewCount = (count) => {
    if (!count && count !== 0) return '0';
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toLocaleString();
  };

  const handleClick = () => {
    navigate(`/news/${article.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        {article.thumbnailUrl ? (
          <img
            src={article.thumbnailUrl}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.src = '/img_social/default-news.jpg';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-5xl text-gray-400">📰</span>
          </div>
        )}

        {/* Level Badge */}
        <div className="absolute left-3 top-3">
          <span
            className={`rounded-lg px-3 py-1 text-xs font-bold shadow-md ${level.className}`}
          >
            {level.label}
          </span>
        </div>

        {/* Trial Badge */}
        {article.isTrial && (
          <div className="absolute right-3 top-3">
            <span className="rounded-lg bg-blue-500 px-3 py-1 text-xs font-bold text-white shadow-md">
              Free
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Source/Topic Label */}
        {getTopicName() && (
          <div className="mb-3">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {getTopicName()}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="mb-3 line-clamp-2 text-lg font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
          {article.title}
        </h3>

        {/* Description */}
        {article.description && (
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {article.description}
          </p>
        )}

        {/* Footer Info */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
          {/* Published Date */}
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="flex-shrink-0" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>

          {/* View Count */}
          {article.viewCount !== undefined && (
            <div className="flex items-center gap-1.5">
              <Eye size={14} className="flex-shrink-0" />
              <span className="font-medium">{formatViewCount(article.viewCount)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
