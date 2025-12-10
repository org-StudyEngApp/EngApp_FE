import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogService } from '../../api/blogService';
const BlogPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const postData = await blogService.getPostById(postId);
      setPost(postData);

      // Fetch related posts (same category)
      if (postData.category) {
        const relatedData = await blogService.getPostsByCategory(postData.category.category_id, 1, 3);
        setRelatedPosts(relatedData.posts?.filter(p => p.post_id !== parseInt(postId)) || []);
      }
    } catch (err) {
      setError('포스트를 불러오는데 실패했습니다.');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">
              {error || '포스트를 찾을 수 없습니다'}
            </div>
            <button
              onClick={() => navigate('/blog')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              블로그로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">
                홈
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/blog" className="hover:text-blue-600 dark:hover:text-blue-400">
                블로그
              </Link>
            </li>
            {post.category && (
              <>
                <li>/</li>
                <li className="text-gray-700 dark:text-gray-300">
                  {post.category.category_name}
                </li>
              </>
            )}
          </ol>
        </nav>

        {/* Post Header */}
        <header className="mb-8">
          {post.category && (
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm px-3 py-1 rounded-full">
                {post.category.category_name}
              </span>
            </div>
          )}

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {post.post_title}
          </h1>

          <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center space-x-4">
              <span>작성자: {post.user?.user_name || '익명'}</span>
              <span>•</span>
              <span>{formatDate(post.created_at)}</span>
              {post.updated_at && post.updated_at !== post.created_at && (
                <>
                  <span>•</span>
                  <span>수정됨: {formatDate(post.updated_at)}</span>
                </>
              )}
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag.tag_id}
                  className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded-full"
                >
                  #{tag.tag_name}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Post Content */}
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <div 
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300"
            dangerouslySetInnerHTML={{ __html: post.post_content }}
          />
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              관련 포스트
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <div
                  key={relatedPost.post_id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold mb-2">
                    <Link
                      to={`/blog/${relatedPost.post_id}`}
                      className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {relatedPost.post_title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {relatedPost.post_excerpt || relatedPost.post_content.substring(0, 100) + '...'}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {formatDate(relatedPost.created_at)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            블로그로 돌아가기
          </button>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            맨 위로
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
