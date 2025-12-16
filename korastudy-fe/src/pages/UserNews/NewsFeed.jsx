import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import newsService from '../../api/newsService';
import ArticleCard from '../../components/NewsComponent/ArticleCard';

/**
 * NewsFeed Page
 * Main page for displaying news articles with filters and search
 */
const NewsFeed = () => {
  // State management
  const [articles, setArticles] = useState([]);
  const [topics, setTopics] = useState([]);
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
      const response = await newsService.getAllTopics();
      // Handle different response structures
      const topicsData = response.data?.data || response.data || [];
      setTopics(Array.isArray(topicsData) ? topicsData : []);
    } catch (err) {
      console.error('Failed to fetch topics:', err);
      setTopics([]);
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

      const response = await newsService.getArticles(params);
      
      // Handle different response structures
      const articlesData = response.data?.data || response.data || {};
      setArticles(articlesData.content || []);
      setTotalPages(articlesData.totalPages || 0);
      setTotalElements(articlesData.totalElements || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch articles');
      console.error('Failed to fetch articles:', err);
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
      {/* Header Section */}
      <div className="bg-white shadow-sm dark:bg-gray-800">
        <div className="container mx-auto px-4 py-6">
          {/* Title */}
          <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
            News Feed
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search articles..."
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </form>

          {/* Filters Section */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Topic Filters (Tabs/Chips) */}
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Filter size={16} />
                <span>Topics:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleTopicClick(null)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedTopic === null
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  All Topics
                </button>
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicClick(topic.id)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      selectedTopic === topic.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {topic.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Filter (Dropdown) */}
            <div className="lg:w-48">
              <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Level:
              </div>
              <select
                value={selectedLevel}
                onChange={handleLevelChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {levelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters & Clear Button */}
          {(selectedTopic || selectedLevel || searchKeyword) && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {totalElements} article{totalElements !== 1 ? 's' : ''} found
              </div>
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading articles...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <p className="mb-4 text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={fetchArticles}
                className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-6xl">📰</div>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No articles found
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                Try adjusting your filters or search query
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Articles Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                  className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    currentPage === 0
                      ? 'cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-600'
                      : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageClick(page)}
                      className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
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
                  className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    currentPage >= totalPages - 1
                      ? 'cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-600'
                      : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Page Info */}
            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Showing {currentPage * pageSize + 1} to{' '}
              {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements}{' '}
              articles
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;
