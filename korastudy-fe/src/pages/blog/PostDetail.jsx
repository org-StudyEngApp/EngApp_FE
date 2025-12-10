import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Pencil, Trash, MessageSquare, Folder } from 'lucide-react';
import { toast } from 'react-toastify';
import blogService from '../../api/blogService';
import { formatUserName } from '../../utils/formatUserName';
import { formatDate } from '../../utils/formatDate';
import { useUser } from '../../contexts/UserContext';
import Comments from '../../components/BlogComponent/Comments';


const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useUser();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const [userPermissions, setUserPermissions] = useState({
    canEdit: false,
    canDelete: false,
    isOwner: false
  });
  
  // Cập nhật số lượng bình luận
  const handleCommentCountChange = (count) => {
    setCommentCount(count);
    // Cập nhật post.commentCount
    if (post) {
      setPost(prevPost => ({
        ...prevPost,
        commentCount: count
      }));
    }
  };

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        const data = await blogService.getPostById(id);
        console.log('Post data with author and category details:', {
          createdBy: data.createdBy,
          author: data.author,
          user: data.user,
          authorName: data.authorName,
          category: data.category,
          category_id: data.category_id,
          categoryId: data.categoryId,
          categoryName: data.categoryName,
          categoryTitle: data.categoryTitle
        });
        setPost(data);

        // Kiểm tra quyền chỉnh sửa và xóa bài viết
        if (isAuthenticated && user && data) {
          // Lấy ID của người tạo bài viết
          const creatorId = data.createdBy?.id || data.author?.id || null;
          
          // Kiểm tra người dùng có phải là admin hoặc người tạo bài viết không
          const isAdmin = user.roles?.includes('ROLE_ADMIN') || user.roles?.includes('admin');
          const isOwner = user.id === creatorId;
          
          setUserPermissions({
            canEdit: isAdmin || isOwner,
            canDelete: isAdmin,
            isOwner: isOwner
          });
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.message || 'Không thể tải dữ liệu bài viết');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPostData();
    }
  }, [id, isAuthenticated, user]);

  useEffect(() => {
    if (post) {
      console.log('Post data before rendering:', {
        id: post.post_id || post.id,
        title: post.post_title || post.postTitle,
        createdBy: post.createdBy,
        author: post.author,
        user: post.user,
        authorName: post.authorName,
        date: post.formattedDate || post.created_at || post.createdAt
      });
    }
  }, [post]);

  if (loading) {
    return (
      <>

        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-dark-700 rounded-md w-3/4 mb-6"></div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-gray-200 dark:bg-dark-700 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-32"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
 
      </>
    );
  }

  if (error) {
    return (
      <>

        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-12 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Không thể tải bài viết
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <Link to="/blog" className="text-primary-500 hover:underline flex items-center justify-center gap-2">
              <ArrowLeft size={18} />
              Quay lại trang blog
            </Link>
          </div>
        </div>
 
      </>
    );
  }

  if (!post) {
    return (
      <>

        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-12 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Không tìm thấy bài viết
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <Link to="/blog" className="text-primary-500 hover:underline flex items-center justify-center gap-2">
              <ArrowLeft size={18} />
              Quay lại trang blog
            </Link>
          </div>
        </div>

      </>
    );
  }

  // Fallback formatUserName nếu import không hoạt động
  const localFormatUserName = (user) => {
    if (!user) return 'Tác giả ẩn danh';
    if (typeof user === 'string') return user;
    
    return user.username || 
      user.fullName || 
      user.user_name || 
      (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : null) ||
      (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : null) ||
      user.email ||
      'Tác giả ẩn danh';
  };

  // Fallback formatDate nếu import không hoạt động
  const localFormatDate = (dateString, includeTime = false) => {
    if (!dateString) return new Date().toLocaleDateString('vi-VN');
    try {
      const date = new Date(dateString);
      if (includeTime) {
        return date.toLocaleString('vi-VN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      return date.toLocaleDateString('vi-VN');
    } catch (e) {
      return new Date().toLocaleDateString('vi-VN');
    }
  };

  return (
    <>

      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex text-sm">
              <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                Trang chủ
              </Link>
              <span className="mx-2 text-gray-500 dark:text-gray-400">/</span>
              <Link to="/blog" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                Blog
              </Link>
              <span className="mx-2 text-gray-500 dark:text-gray-400">/</span>
              <span className="text-gray-900 dark:text-gray-200">
                {post.post_title || post.postTitle}
              </span>
            </nav>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {post.post_title || post.postTitle}
            </h1>
            
            {/* Author and Date */}
            <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <User size={18} className="text-gray-400" />
                  <span>
                    {post.authorName ||
                    (post.createdBy && formatUserName(post.createdBy)) ||
                    'Tác giả ẩn danh'}
                  </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-gray-400" />
                <span>
                  {post.formattedDate || 
                    (post.created_at && (typeof formatDate === 'function' ? formatDate(post.created_at, true) : localFormatDate(post.created_at, true))) || 
                    (post.createdAt && (typeof formatDate === 'function' ? formatDate(post.createdAt, true) : localFormatDate(post.createdAt, true))) || 
                    localFormatDate(new Date(), true)}
                </span>
              </div>
              {(post.commentCount !== undefined || commentCount > 0) && (
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} className="text-gray-400" />
                  <span>{post.commentCount !== undefined ? post.commentCount : commentCount} bình luận</span>
                </div>
              )}
              {/* Hiển thị danh mục - xử lý từ bảng post_category */}
              {(post.categories && Array.isArray(post.categories) && post.categories.length > 0) && (
                <div className="flex items-center gap-2">
                  <Folder size={18} className="text-gray-400" />
                  <span>
                    {post.categories.map(cat => cat.name).join(', ')}
                  </span>
                </div>
              )}
              
              {/* Fallback cho category đơn lẻ hoặc trường hợp khác */}
              {(!post.categories || !Array.isArray(post.categories) || post.categories.length === 0) && 
               (post.category || post.categoryName || post.categoryTitle) && (
                <div className="flex items-center gap-2">
                  <Folder size={18} className="text-gray-400" />
                  <span>
                    {post.category?.category_name || 
                     post.category?.name || 
                     post.category?.categoryTitle || 
                     post.categoryName || 
                     post.categoryTitle || 
                     "Không có danh mục"}
                  </span>
                </div>
              )}
            </div>
          </header>

          {/* Main Content */}
          <div className="post-content prose prose-slate max-w-none dark:prose-invert overflow-hidden break-words" 
               dangerouslySetInnerHTML={{ __html: post.post_content || post.postContent }} />

          {/* Edit and Delete buttons */}
          {userPermissions.canEdit && (
            <div className="mt-6 flex gap-4">
              <Link
                to={`/blog/edit/${post.post_id || post.id}`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Pencil size={16} className="mr-2" />
                Chỉnh sửa bài viết
              </Link>
            </div>
          )}

          {/* Comments Section */}
          <Comments postId={post.post_id || post.id} onCommentCountChange={handleCommentCountChange} />

          {/* Back to blog list */}
          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
            <Link to="/blog" className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center gap-2">
              <ArrowLeft size={20} />
              <span>Quay lại danh sách bài viết</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;
