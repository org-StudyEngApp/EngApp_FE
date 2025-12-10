import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MessageSquare } from 'lucide-react';
import blogService from '../../api/blogService';
import commentService from '../../api/commentService';
import { useUser } from '../../contexts/UserContext';
import { formatDate } from '../../utils/formatDate';
import { formatUserName } from '../../utils/formatUserName';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('latest'); // 'latest', 'popular', 'featured'
  const [newPostId, setNewPostId] = useState(null); // ID của bài viết mới tạo
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchInitialData();
    
    // Kiểm tra nếu vừa chuyển từ trang tạo bài về
    const params = new URLSearchParams(location.search);
    const newPostCreated = params.get('created') === 'true';
    const newPostIdParam = params.get('postId');
    
    if (newPostIdParam) {
      setNewPostId(newPostIdParam);
      
      // Tự động xóa hiệu ứng highlight sau 5 giây
      setTimeout(() => {
        setNewPostId(null);
      }, 5000);
    }
    
    // Fetch posts với cờ để đảm bảo không dùng cache khi bài viết mới được tạo
    fetchPosts(newPostCreated);
    fetchFeaturedPosts(newPostCreated);
    
    if (newPostCreated) {
      // Đã tạo bài viết mới, hiển thị thông báo
      toast.success('Bài viết đã được đăng thành công!');
      // Xóa tham số khỏi URL để tránh thông báo lặp lại
      navigate('/blog', { replace: true });
    }
  }, [currentPage, searchTerm, selectedCategory, activeTab, location.search, navigate]);

  const fetchInitialData = async () => {
    try {
      // Lấy tất cả các bài viết không phân trang để tính số lượng cho mỗi danh mục
      const allPostsResponse = await blogService.getPosts(1, 1000, null, 'id', '', true, 'desc');
      const allPosts = allPostsResponse.posts || [];
      
      // Lấy danh sách danh mục và tag
      const [categoriesData, tagsData] = await Promise.all([
        blogService.getCategories(),
        blogService.getTags()
      ]);
      
      console.log('Raw categories from API:', categoriesData);
      
      // Đếm số lượng bài viết cho mỗi danh mục
      const categoryCounts = {};
      allPosts.forEach(post => {
        // Kiểm tra nhiều cách lưu trữ khác nhau của category_id
        const categoryId = post.category_id || 
                         (post.category && (post.category.category_id || post.category.id)) || 
                         post.categoryId;
                         
        if (categoryId) {
          console.log(`Post ${post.id || post.post_id} has category ID: ${categoryId}`);
          categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
        }
      });
      
      console.log('Category counts:', categoryCounts);
      
      // Cập nhật số lượng bài viết cho mỗi danh mục
      const updatedCategories = categoriesData.map(category => {
        const catId = category.category_id || category.id;
        return {
          ...category,
          post_count: categoryCounts[catId] || 0
        };
      });
      
      setCategories(updatedCategories);
      setTags(tagsData);
    } catch (err) {
      console.error('Error fetching initial data:', err);
      // Đặt dữ liệu mặc định nếu API fails
      setCategories([
        { category_id: 1, category_name: "Kinh nghiệm học", post_count: 1 },
        { category_id: 2, category_name: "Từ vựng", post_count: 1 },
        { category_id: 3, category_name: "Kỹ năng nghe", post_count: 1 }
      ]);
      setTags([
        { tag_id: 1, tag_name: "mẹo học" },
        { tag_id: 2, tag_name: "ngữ pháp" },
        { tag_id: 3, tag_name: "từ vựng" },
        { tag_id: 4, tag_name: "luyện nghe" }
      ]);
    }
  };

  const fetchPosts = async (forceRefresh = false) => {
    try {
      setLoading(true);
      // Luôn sắp xếp theo ID giảm dần (ID lớn hơn lên đầu tiên)
      const sortField = 'id'; // Luôn sắp xếp theo ID bài viết
      const sortOrder = 'desc'; // Luôn sắp xếp giảm dần
      
      console.log(`Fetching posts with category ID: ${selectedCategory}`);
      
      // Debug thông tin danh mục đã chọn
      if (selectedCategory) {
        const selectedCategoryInfo = categories.find(cat => cat.category_id == selectedCategory);
        console.log('Selected category details:', selectedCategoryInfo);
      }
      
      const response = await blogService.getPosts(
        currentPage,
        9, // postsPerPage
        selectedCategory,
        sortField, // sort field
        searchTerm,
        forceRefresh, // Thêm tham số để bỏ qua cache khi cần
        sortOrder // Thêm tham số để sắp xếp theo thứ tự
      );
      
      let postsData = response.posts || [];
      
      // Lấy số lượng bình luận cho mỗi bài viết
      if (postsData.length > 0) {
        const postIds = postsData.map(post => post.post_id || post.id);
        try {
          const commentCounts = await commentService.getCommentCounts(postIds);
          
          // Thêm số lượng bình luận vào dữ liệu bài viết
          postsData = postsData.map(post => {
            const postId = post.post_id || post.id;
            return {
              ...post,
              commentCount: commentCounts[postId] || 0
            };
          });
        } catch (commentErr) {
          console.error('Error fetching comment counts:', commentErr);
        }
        
        // Đảm bảo bài viết được sắp xếp theo ID lớn nhất trước
        if (activeTab !== 'popular') {
          postsData.sort((a, b) => {
            const idA = parseInt(a.post_id || a.id || 0);
            const idB = parseInt(b.post_id || b.id || 0);
            return idB - idA; // Sắp xếp giảm dần (ID lớn -> ID nhỏ)
          });
        }
      }
      
      setPosts(postsData);
      setTotalPages(response.totalPages || 1);
      setTotalPosts(response.totalPosts || 0);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Không thể tải dữ liệu bài viết');
      toast.error('Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedPosts = async (forceRefresh = false) => {
    try {
      // Lấy 3 bài mới nhất (theo ID) cho phần nổi bật
      const featuredResponse = await blogService.getPosts(1, 3, null, 'id', '', forceRefresh, 'desc');
      let featuredData = featuredResponse.posts || [];
      
      // Lấy số lượng bình luận cho mỗi bài viết nổi bật
      if (featuredData.length > 0) {
        const postIds = featuredData.map(post => post.post_id || post.id);
        try {
          const commentCounts = await commentService.getCommentCounts(postIds);
          
          // Thêm số lượng bình luận vào dữ liệu bài viết
          featuredData = featuredData.map(post => {
            const postId = post.post_id || post.id;
            return {
              ...post,
              commentCount: commentCounts[postId] || 0
            };
          });
        } catch (commentErr) {
          console.error('Error fetching comment counts for featured posts:', commentErr);
        }
        
        // Đảm bảo bài viết nổi bật cũng được sắp xếp theo thứ tự mới nhất
        featuredData.sort((a, b) => {
          const dateA = new Date(a.created_at || a.createdAt || 0);
          const dateB = new Date(b.created_at || b.createdAt || 0);
          return dateB - dateA; // Sắp xếp giảm dần (mới -> cũ)
        });
      }
      
      setFeaturedPosts(featuredData);
    } catch (err) {
      console.error('Error fetching featured posts:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  const handleDeleteSuccess = () => {
    toast.success('Xóa bài viết thành công!');
    fetchPosts(); // Làm mới danh sách sau khi xóa
  };

  const handleCategoryChange = (categoryId) => {
    const newCategoryId = categoryId === selectedCategory ? null : categoryId;
    setSelectedCategory(newCategoryId);
    setCurrentPage(1);
    
    // Làm mới danh sách bài viết dựa trên danh mục đã chọn
    fetchPosts(true);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Add refresh function to reload posts after delete
  const refreshPosts = () => {
    fetchPosts();
  };

  // Thêm hàm để gọi API trực tiếp và đảm bảo không dùng cache
  const forceRefreshPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Gọi trực tiếp API mà không dùng cache
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'GET',
        headers: {
          ...getAuthHeaders(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      const data = await response.json();
      console.log('Force refreshed data:', data);
      
      // Sau đó gọi lại fetchPosts để xử lý dữ liệu
      fetchPosts();
      fetchFeaturedPosts();
      
    } catch (err) {
      console.error('Error force refreshing posts:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Breadcrumb và Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <li>
                    <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
                  </li>
                  <li>
                    <span className="mx-1">/</span>
                    <span className="font-medium text-gray-800 dark:text-white">Bài viết</span>
                  </li>
                </ol>
              </nav>
              <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">BÀI VIẾT</h1>
              <p className="mt-1 text-gray-600 dark:text-gray-300">
                Kiến thức và tài nguyên học tiếng Hàn từ KoraStudy
              </p>
            </div>

            {/* Nút tạo bài viết mới */}
            {isAuthenticated() && (
              <div className="mt-4 md:mt-0">
                <Link
                  to="/blog/create"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Viết bài mới
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Banner quảng cáo (tương tự Study4) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl overflow-hidden">
          <div className="p-8 sm:p-12 flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Kiểm tra trình độ tiếng Hàn miễn phí
              </h2>
              <p className="mt-2 text-blue-100">
                Nhanh chóng - Chính xác - Hiệu quả
              </p>
              <div className="mt-6">
                <a href="#" className="inline-block bg-white text-blue-700 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors">
                  KHỞI ĐỘNG NGAY
                </a>
              </div>
            </div>
            <div className="md:w-1/3">
              <img src="./banner/banner1.png" alt="Study" className="max-h-48 object-contain mx-auto" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="lg:w-3/4 lg:pr-8">
            {/* Search Bar và Filter */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Nhập từ khóa bạn muốn tìm..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <button
                      type="submit"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <span className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        Tìm
                      </span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Category Pills */}
              {categories.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedCategory === null
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Tất cả
                  </button>
                  
                  {categories.map(cat => (
                    <button
                      key={cat.category_id}
                      onClick={() => handleCategoryChange(cat.category_id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedCategory === cat.category_id
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {cat.category_name} ({cat.post_count || 0})
                    </button>
                  ))}
                </div>
              )}

              {/* Tab selector - Mới nhất, Phổ biến, Nổi bật */}
              <div className="mt-4 border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex" aria-label="Tabs">
                  <button
                    onClick={() => handleTabChange('latest')}
                    className={`py-2 px-4 text-sm font-medium ${
                      activeTab === 'latest'
                        ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Mới nhất
                  </button>
                  <button
                    onClick={() => handleTabChange('popular')}
                    className={`py-2 px-4 text-sm font-medium ${
                      activeTab === 'popular'
                        ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Phổ biến
                  </button>
                  <button
                    onClick={() => handleTabChange('featured')}
                    className={`py-2 px-4 text-sm font-medium ${
                      activeTab === 'featured'
                        ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Đề xuất
                  </button>
                </nav>
              </div>
            </div>

            {/* Tiêu đề danh sách */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {activeTab === 'latest' && 'Bài viết mới nhất'}
                {activeTab === 'popular' && 'Bài viết được đọc nhiều'}
                {activeTab === 'featured' && 'Bài viết đề xuất'}
                {selectedCategory && categories.find(c => c.category_id === selectedCategory) && 
                  ` - ${categories.find(c => c.category_id === selectedCategory).category_name}`
                }
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {totalPosts} bài viết
              </span>
            </div>

            {/* Post List */}
            {loading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 animate-pulse flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4">
                      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                    <div className="md:w-3/4 flex flex-col">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                      <div className="mt-auto pt-4 flex justify-between items-center">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg text-center">
                <p className="text-red-600 dark:text-red-200">{error}</p>
                <button
                  onClick={() => fetchPosts()}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Thử lại
                </button>
              </div>
            ) : posts.length > 0 ? (
              <>
                <div className="space-y-6">
                  {posts.map((post) => {
                    // Debug log để xem dữ liệu post
                    console.log('Rendering post:', post);
                    
                    // Đảm bảo post có post_id
                    const postId = post.post_id || post.id;
                    
                    if (!postId) {
                      console.warn('Post without ID, skipping render:', post);
                      return null;
                    }
                    
                    // Kiểm tra xem đây có phải là bài viết mới không
                    const isNewPost = postId === newPostId;
                    
                    return (
                      <div 
                        key={postId || Math.random().toString(36).substr(2, 9)} 
                        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row ${
                          isNewPost ? 'ring-2 ring-blue-500 animate-pulse-light' : ''
                        }`}
                      >
                        <Link to={`/blog/${postId}`} className="block md:w-1/4">
                          {post.featured_image || post.thumbnail ? (
                            <img 
                              src={post.featured_image || post.thumbnail} 
                              alt={post.postTitle || post.post_title || "Blog post"} 
                              className="w-full h-48 object-cover"
                            />
                          ) : (
                            <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                              <h2 className="text-4xl font-bold text-white">
                                {(post.postTitle || post.post_title || "A").charAt(0)}
                              </h2>
                            </div>
                          )}
                        </Link>
                        <div className="p-5 flex flex-col md:w-3/4">
                          <Link to={`/blog/${postId}`} className="block">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                              {post.postTitle || post.post_title || "Bài viết chưa có tiêu đề"}
                            </h3>
                          </Link>
                          
                          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                            {post.postSummary || post.post_excerpt || "Không có mô tả"}
                          </p>
                          
                          {/* Hiển thị danh mục nếu có */}
                          {(post.category || post.categoryName || post.categoryTitle) && (
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
                          
                          <div className="mt-auto flex items-center justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
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
                                {post.formattedDate || (post.created_at && formatDate(post.created_at)) || "Mới đăng"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination - Improved */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center space-x-1" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-md text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                          </svg>
                          <span className="hidden sm:inline">Trước</span>
                        </div>
                      </button>
                      
                      {/* Page numbers - With ellipsis for many pages */}
                      {(() => {
                        const visiblePageCount = window.innerWidth < 640 ? 3 : 5;
                        let pageNumbers = [];
                        
                        if (totalPages <= visiblePageCount) {
                          // If few pages, show all
                          pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
                        } else {
                          // Always show first page
                          pageNumbers.push(1);
                          
                          // Calculate middle pages
                          let startPage = Math.max(2, currentPage - Math.floor(visiblePageCount / 2));
                          let endPage = Math.min(totalPages - 1, startPage + visiblePageCount - 3);
                          
                          // Adjust if we're near the end
                          if (endPage - startPage < visiblePageCount - 3) {
                            startPage = Math.max(2, endPage - (visiblePageCount - 3));
                          }
                          
                          // Add ellipsis if needed
                          if (startPage > 2) {
                            pageNumbers.push('...');
                          }
                          
                          // Add middle pages
                          for (let i = startPage; i <= endPage; i++) {
                            pageNumbers.push(i);
                          }
                          
                          // Add ellipsis if needed
                          if (endPage < totalPages - 1) {
                            pageNumbers.push('...');
                          }
                          
                          // Always show last page
                          if (totalPages > 1) {
                            pageNumbers.push(totalPages);
                          }
                        }
                        
                        return pageNumbers.map((page, index) => {
                          if (page === '...') {
                            return (
                              <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500 dark:text-gray-400">
                                ...
                              </span>
                            );
                          }
                          
                          return (
                            <button
                              key={`page-${page}`}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 rounded-md text-sm font-medium ${
                                currentPage === page
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        });
                      })()}
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-md text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center">
                          <span className="hidden sm:inline">Tiếp</span>
                          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </div>
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
                <div className="text-5xl mb-4">�</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  Không tìm thấy bài viết nào
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {searchTerm ? `Không có kết quả cho "${searchTerm}"` : 'Chưa có bài viết nào trong mục này'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Xóa bộ lọc
                  </button>
                )}
                {isAuthenticated() && (
                  <div className="mt-4">
                    <Link
                      to="/blog/create"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Viết bài viết đầu tiên
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4 mt-8 lg:mt-0">
            {/* Categories Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                Chuyên mục
              </h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.category_id}>
                    <button
                      onClick={() => handleCategoryChange(cat.category_id)}
                      className={`w-full text-left px-2 py-1 rounded-md ${
                        selectedCategory === cat.category_id 
                          ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="flex justify-between items-center">
                        <span>{cat.category_name}</span>
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 rounded-full text-xs">
                          {cat.post_count || 0}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Tags */}
            {tags.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  Tags phổ biến
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag.tag_id}
                      className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1 text-sm"
                    >
                      #{tag.tag_name}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        ({tag.post_count || 0})
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  Bài viết nổi bật
                </h3>
                <div className="space-y-4">
                  {featuredPosts.map((post) => {
                    // Đảm bảo post có post_id
                    const postId = post.post_id || post.id;
                    
                    // Debug log nếu không có post_id
                    if (!postId) {
                      console.warn('Featured post without ID:', post);
                    }
                    
                    return (
                      <div key={postId || Math.random().toString(36).substr(2, 9)} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold">{post.post_title?.charAt(0) || 'A'}</span>
                        </div>
                        <div className="flex-grow min-w-0">
                          <Link
                            to={`/blog/${postId}`}
                            className="block text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate"
                          >
                            {post.post_title}
                          </Link>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {post.formattedDate || 
                              new Date(
                                post.created_at || 
                                post.createdAt || 
                                post.published_at || 
                                post.post_published_at || 
                                new Date()
                              ).toLocaleDateString('vi-VN')
                            }
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;