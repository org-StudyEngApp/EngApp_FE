import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight, Clock, Eye } from 'lucide-react';
import newsService from '../../api/newsService';
import ArticleCard from '../../components/NewsComponent/ArticleCard';

/**
 * NewsFeed Page
 * Main page for displaying news articles with filters and search
 */
const NewsFeed = () => {
  const navigate = useNavigate();
  
  // State management
  const [articles, setArticles] = useState([]);
  const [topics, setTopics] = useState([]);
  const [topicsMap, setTopicsMap] = useState({}); // Map topicId -> topic name
  const [topicsLoading, setTopicsLoading] = useState(true); // Loading state for topics
  const [topicsError, setTopicsError] = useState(null); // Error state for topics
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter states
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 12;

  // Display control
  const [showAll, setShowAll] = useState(false);
  const initialDisplayCount = 8; // Số bài hiển thị ban đầu

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

  // Level options
  const levelOptions = [
    { value: '', label: 'All Levels' },
    { value: 'BEGINNER', label: 'Beginner' },
    { value: 'INTERMEDIATE', label: 'Intermediate' },
    { value: 'ADVANCED', label: 'Advanced' },
  ];

  // Fetch topics on mount
  useEffect(() => {
    fetchTopics();
  }, []);

  // Fetch articles when filters change
  useEffect(() => {
    fetchArticles();
  }, [selectedTopic, selectedLevel, searchKeyword, currentPage]);

  const fetchTopics = async () => {
    try {
      setTopicsLoading(true);
      setTopicsError(null);
      console.log('📡 Fetching topics from /api/v1/news-topics...');
      
      // Fetch all topics with large page size
      const response = await newsService.getAllTopics({ size: 100 });
      console.log('✅ Topics API response:', response);
      
      // Parse paginated response: {data: {content: [...], totalElements, ...}}
      const topicsData = response?.data || response;
      const topicsArray = topicsData?.content || [];
      
      console.log('📝 Processed topics array:', topicsArray);
      console.log('📊 Topics count:', topicsArray.length, '/', topicsData?.totalElements || 0);
      
      // If topics found from API, use them
      if (topicsArray.length > 0) {
        console.log('📋 Topics from API:', topicsArray.map(t => ({
          id: t.id,
          title: t.title,
          viewCount: t.viewCount
        })));
        
        setTopics(topicsArray);
        
        // Create a map for quick topic name lookup
        const map = {};
        topicsArray.forEach(topic => {
          map[topic.id] = topic.title || topic.name;
        });
        setTopicsMap(map);
        console.log('✅ Topics loaded from API:', topicsArray.length, 'topics');
        console.log('🗺️ Topics map:', map);
        setTopicsLoading(false);
        setTopicsError(null);
      } else {
        console.warn('⚠️ No topics from API. Will extract from articles data.');
        // Don't set loading to false, let articles extraction handle it
      }
    } catch (err) {
      console.warn('⚠️ Failed to fetch topics from API:', err.message);
      console.log('💡 Will extract topics from articles instead.');
      // Don't set error, let articles extraction provide topics
      // Topics will be populated when articles load
    }
  };

  // Extract unique topics from articles
  const extractTopicsFromArticles = (articles) => {
    console.log('🔍 Extracting topics from articles...');
    const topicsMap = new Map();
    
    articles.forEach(article => {
      if (article.newsTopicId) {
        const topicName = article.newsTopicName || 
                         article.newsTopic?.title || 
                         article.newsTopic?.name;
        
        if (topicName && !topicsMap.has(article.newsTopicId)) {
          topicsMap.set(article.newsTopicId, {
            id: article.newsTopicId,
            title: topicName,
            name: topicName
          });
        }
      }
    });
    
    const uniqueTopics = Array.from(topicsMap.values());
    console.log('✅ Extracted topics:', uniqueTopics);
    
    // Update topics state if we found new topics
    if (uniqueTopics.length > 0) {
      setTopics(prevTopics => {
        // Merge with existing topics
        const merged = new Map();
        prevTopics.forEach(t => merged.set(t.id, t));
        uniqueTopics.forEach(t => merged.set(t.id, t));
        return Array.from(merged.values());
      });
      
      // Update topics map
      const map = {};
      uniqueTopics.forEach(topic => {
        map[topic.id] = topic.title || topic.name;
      });
      setTopicsMap(prevMap => ({ ...prevMap, ...map }));
      
      setTopicsLoading(false);
      setTopicsError(null);
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        size: pageSize,
        sortBy: 'publishedAt',
        sortDir: 'DESC',
      };

      if (selectedTopic) {
        params.newsTopicId = selectedTopic;
      }

      if (selectedLevel) {
        params.level = selectedLevel;
      }

      if (searchKeyword) {
        params.keyword = searchKeyword;
      }

      console.log('📡 Fetching articles with params:', params);
      const response = await newsService.getArticles(params);
      console.log('✅ Articles response:', response);
      
      // Handle nested data structure: {data: {content: [...], totalPages, totalElements}}
      const articlesData = response?.data || response;
      const articles = articlesData?.content || [];
      
      // Debug: Log first article to check isLocked field
      if (articles.length > 0) {
        console.log('🔍 First article data:', {
          id: articles[0].id,
          title: articles[0].title?.substring(0, 40),
          isLocked: articles[0].isLocked,
          hasIsLockedField: 'isLocked' in articles[0],
          newsTopicId: articles[0].newsTopicId,
          newsTopicName: articles[0].newsTopicName,
          newsTopic: articles[0].newsTopic
        });
        
        // Log ALL articles with isLocked field
        console.log('📋 All articles isLocked status:', articles.map(a => ({
          id: a.id,
          title: a.title?.substring(0, 30),
          isLocked: a.isLocked
        })));
      }
      
      // Extract unique topics from articles
      extractTopicsFromArticles(articles);
      
      setArticles(articles);
      setTotalPages(articlesData?.totalPages || 0);
      setTotalElements(articlesData?.totalElements || 0);
    } catch (err) {
      console.error('❌ Failed to fetch articles:', err);
      console.error('Error details:', {
        status: err.status,
        message: err.message,
        data: err.data
      });
      
      // Check if it's a 404 error (endpoint not found)
      if (err.status === 404) {
        setError('Backend API chưa sẵn sàng. Vui lòng đảm bảo:\n1. Backend đang chạy trên port 8080\n2. Endpoint /api/v1/articles đã được implement');
      } else if (err.message?.includes('Network Error') || err.message?.includes('ECONNREFUSED')) {
        setError('Không thể kết nối đến server backend tại http://localhost:8080\nVui lòng khởi động backend server.');
      } else {
        setError(`Lỗi: ${err.message || 'Không thể tải tin tức'}`);
      }
      
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchKeyword(searchInput);
    setCurrentPage(0);
  };

  // Handle topic filter
  const handleTopicClick = (topicId) => {
    setSelectedTopic(topicId === selectedTopic ? null : topicId);
    setCurrentPage(0);
  };

  // Handle level filter
  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
    setCurrentPage(0);
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedTopic(null);
    setSelectedLevel('');
    setSearchKeyword('');
    setSearchInput('');
    setCurrentPage(0);
  };

  // Helper function to get topic name from topicId
  const getTopicName = (article) => {
    if (article.newsTopicName) return article.newsTopicName;
    if (article.newsTopic?.title) return article.newsTopic.title;
    if (article.newsTopic?.name) return article.newsTopic.name;
    if (article.newsTopicId && topicsMap[article.newsTopicId]) {
      return topicsMap[article.newsTopicId];
    }
    return null;
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible);

    if (end - start < maxVisible) {
      start = Math.max(0, end - maxVisible);
    }

    for (let i = start; i < end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero/Featured Section */}
      {!loading && !error && articles.length > 0 && (
        <div className="relative h-[600px] w-full overflow-hidden bg-gray-900">
          {/* Background Image */}
          <img
            src={articles[0].thumbnailUrl || '/img_social/default-news.jpg'}
            alt={articles[0].title}
            className="absolute top-0 left-0 h-full w-full object-cover object-top opacity-60"
            onError={(e) => {
              e.target.src = '/img_social/default-news.jpg';
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          
          {/* Content */}
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-12">
              <div className="max-w-3xl">
                {/* Level Badge */}
                <div className="mb-4">
                  <span className={`inline-block rounded-full px-4 py-1.5 text-sm font-semibold ${
                    articles[0].level === 'BEGINNER'
                      ? 'bg-green-500 text-white'
                      : articles[0].level === 'INTERMEDIATE'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}>
                    {articles[0].level === 'BEGINNER'
                      ? 'Beginner'
                      : articles[0].level === 'INTERMEDIATE'
                      ? 'Intermediate'
                      : 'Advanced'}
                  </span>
                </div>
                
                {/* Title */}
                <h1
                  onClick={() => navigate(`/news/${articles[0].id}`)}
                  className="mb-4 cursor-pointer text-4xl font-bold leading-tight text-white transition-colors hover:text-blue-400 md:text-5xl"
                >
                  {articles[0].title}
                </h1>
                
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                  {getTopicName(articles[0]) && (
                    <span className="inline-flex items-center rounded-lg bg-blue-500/20 px-3 py-1 font-semibold text-blue-300 backdrop-blur-sm">
                      {getTopicName(articles[0])}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {new Date(articles[0].publishedAt).toLocaleDateString('vi-VN')}
                  </span>
                  {articles[0].viewCount !== undefined && (
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {formatViewCount(articles[0].viewCount)} lượt xem
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Section */}
      <div className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-2xl">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="w-full rounded-full border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-500 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    setSearchKeyword('');
                    setCurrentPage(0);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              )}
            </div>
          </form>

          {/* Filters Section */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Topic Filters */}
            <div className="flex-1">
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Chủ đề
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleTopicClick(null)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                    selectedTopic === null
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Tất cả
                </button>
                {topicsLoading ? (
                  <div className="flex items-center gap-2 px-4 py-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Đang tải chủ đề...
                    </span>
                  </div>
                ) : topicsError ? (
                  <div className="flex items-center gap-2 rounded-lg bg-yellow-50 px-4 py-2 dark:bg-yellow-900/20">
                    <span className="text-sm text-yellow-700 dark:text-yellow-400">
                      ⚠️ {topicsError}
                    </span>
                  </div>
                ) : topics.length === 0 ? (
                  <div className="flex items-center gap-2 px-4 py-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Chưa có chủ đề nào
                    </span>
                  </div>
                ) : (
                  topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicClick(topic.id)}
                      className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                        selectedTopic === topic.id
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {topic.title || topic.name}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Level Filter */}
            <div className="lg:w-48">
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Cấp độ
                </h3>
              </div>
              <select
                value={selectedLevel}
                onChange={handleLevelChange}
                className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {levelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Info */}
          {(selectedTopic || selectedLevel || searchKeyword) && (
            <div className="mt-4 flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3 dark:bg-gray-700">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tìm thấy {totalElements} bài viết
              </div>
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
              <p className="text-gray-600 dark:text-gray-400">Đang tải bài viết...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800">
              <div className="mb-4 text-6xl">⚠️</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Không thể tải tin tức
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-400">{error}</p>
              <div className="space-y-3">
                <button
                  onClick={fetchArticles}
                  className="w-full rounded-lg bg-blue-500 px-6 py-3 text-white transition hover:bg-blue-600"
                >
                  Thử lại
                </button>
                <a
                  href="/"
                  className="block w-full rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Về trang chủ
                </a>
              </div>
              <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                Chức năng tin tức đang được phát triển. Vui lòng quay lại sau!
              </p>
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-6xl">📰</div>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Không tìm thấy bài viết nào
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Section Title */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Bài viết mới nhất
              </h2>
              <div className="mt-2 h-1 w-20 rounded-full bg-blue-500"></div>
            </div>

            {/* Articles Grid - Skip first article as it's shown in hero */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {articles
                .slice(1, showAll ? articles.length : initialDisplayCount + 1)
                .map((article) => (
                  <ArticleCard key={article.id} article={article} topicsMap={topicsMap} />
                ))}
            </div>

            {/* Empty State if only 1 article */}
            {articles.length === 1 && (
              <div className="py-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Không có bài viết khác
                </p>
              </div>
            )}

            {/* Show More/Less Button */}
            {articles.length > initialDisplayCount + 1 && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="rounded-full bg-blue-500 px-8 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-600 hover:shadow-lg dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  {showAll ? (
                    <span className="flex items-center gap-2">
                      Thu gọn
                      <ChevronLeft size={16} className="rotate-90" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Xem thêm {articles.length - initialDisplayCount - 1} bài viết
                      <ChevronRight size={16} className="rotate-90" />
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                  className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    currentPage === 0
                      ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
                      : 'bg-white text-gray-700 shadow-sm hover:shadow-md dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  <ChevronLeft size={16} />
                  Trước
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageClick(page)}
                      className={`h-10 w-10 rounded-lg text-sm font-medium transition-all ${
                        currentPage === page
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-white text-gray-700 shadow-sm hover:shadow-md dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {page + 1}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages - 1}
                  className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    currentPage >= totalPages - 1
                      ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
                      : 'bg-white text-gray-700 shadow-sm hover:shadow-md dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  Sau
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Page Info */}
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Hiển thị {Math.max(1, currentPage * pageSize)} đến{' '}
              {Math.min((currentPage + 1) * pageSize, totalElements)} trong tổng số {totalElements}{' '}
              bài viết
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;
