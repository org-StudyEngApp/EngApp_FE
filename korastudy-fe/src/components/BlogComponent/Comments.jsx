import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Calendar, Edit, Trash2, Send, X, MessageSquare } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import commentService from '../../api/commentService';
import { formatDate } from '../../utils/formatDate';
import { formatUserName } from '../../utils/formatUserName';


const Comments = ({ postId, onCommentCountChange }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  // Reply state
  const [replyToId, setReplyToId] = useState(null);
  // Keep separate text per comment id to avoid resets
  const [replyTexts, setReplyTexts] = useState({});
  // Control expand/collapse of reply threads (default open)
  const [repliesOpenById, setRepliesOpenById] = useState({});
  const { isAuthenticated, user } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchComments();
  }, [postId]);
  
  const fetchComments = async () => {
    if (!postId) return;
    
    try {
      setLoading(true);
      const data = await commentService.getComments(postId);
      const commentsArray = Array.isArray(data) ? data : [];

      // Helper to get comparable date
      const getDateMs = (c) => {
        const d = c?.publishedAt || c?.createdAt || c?.created_at || c?.lastModified || c?.updatedAt || c?.date;
        const ms = d ? new Date(d).getTime() : 0;
        return Number.isFinite(ms) ? ms : 0;
      };

      // Sort recursively newest-first to support nested replies
      const sortRecursively = (arr) =>
        (arr || [])
          .map((item) => ({
            ...item,
            children: sortRecursively(item.children),
          }))
          .sort((a, b) => getDateMs(b) - getDateMs(a));

      const sorted = sortRecursively(commentsArray);
      setComments(sorted);
      
      // Notify parent component about comment count change
      if (typeof onCommentCountChange === 'function') {
        onCommentCountChange(sorted.length);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Không thể tải bình luận");
    } finally {
      setLoading(false);
    }
  };

  // Resolve the display name for a comment's author
  const getCommentAuthorName = (comment) => {
    if (!comment) return 'Tác giả ẩn danh';
    // Try common user-holder fields first
    const srcUser = comment.user || comment.author || comment.createdBy;
    if (srcUser) return formatUserName(srcUser);
    // Fall back to flat fields often returned by APIs
    return (
      comment.authorName ||
      comment.username ||
      comment.user_name ||
      comment.name ||
      'Tác giả ẩn danh'
    );
  };

  // Build avatar initial from author name
  const getInitial = (comment) => {
    const name = getCommentAuthorName(comment);
    return (name || 'U').trim().charAt(0).toUpperCase();
  };
  
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để bình luận");
      navigate('/dang-nhap', { state: { returnUrl: `/blog/${postId}` } });
      return;
    }
    
    if (!newComment.trim()) {
      toast.warning("Vui lòng nhập nội dung bình luận");
      return;
    }
    
    try {
      setSubmitting(true);
      await commentService.addComment(postId, { context: newComment.trim() });
      setNewComment('');
      toast.success("Đã thêm bình luận");
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Không thể thêm bình luận");
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleEditComment = async (commentId) => {
    if (!editText.trim()) {
      toast.warning("Vui lòng nhập nội dung bình luận");
      return;
    }
    
    try {
      setSubmitting(true);
      await commentService.updateComment(postId, commentId, { context: editText.trim() });
      setEditingCommentId(null);
      setEditText('');
      toast.success("Đã cập nhật bình luận");
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Không thể cập nhật bình luận");
    } finally {
      setSubmitting(false);
    }
  };

  // Add reply to a specific comment
  const handleAddReply = async (parentId) => {
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để trả lời");
      navigate('/dang-nhap', { state: { returnUrl: `/blog/${postId}` } });
      return;
    }

    const text = (replyTexts[parentId] || '').trim();
    if (!text) {
      toast.warning("Vui lòng nhập nội dung trả lời");
      return;
    }

    try {
      setSubmitting(true);
      await commentService.addComment(postId, { context: text, parentId });
      setReplyTexts(prev => ({ ...prev, [parentId]: '' }));
      setReplyToId(null);
      toast.success("Đã thêm trả lời");
      fetchComments();
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Không thể thêm trả lời");
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
      return;
    }
    
    try {
      await commentService.deleteComment(postId, commentId);
      toast.success("Đã xóa bình luận");
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Không thể xóa bình luận");
    }
  };
  
  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.context);
  };
  
  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditText('');
  };
  
  // Check if user can edit/delete a comment
  const canModifyComment = (comment) => {
    if (!isAuthenticated || !user) return false;
    
    // Admin can modify any comment
    if (user.roles && user.roles.includes('ROLE_ADMIN')) return true;
    
    // User can modify their own comments
    return comment.userId === user.id || comment.user?.id === user.id || user.id === comment.user_id;
  };
  
  // Reusable renderer for a comment (supports nesting)
  const CommentItem = ({ comment, depth = 0 }) => (
    <div className="">
      <div className="flex items-start">
        {depth > 0 && (
          <div className="relative w-8 mr-2 flex-shrink-0">
            {/* Horizontal connector from thread line to avatar (straight, no rounded corner) */}
            <div className="absolute top-[18px] left-4 w-4 h-[2px] bg-gray-300 dark:bg-gray-600"></div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          {editingCommentId === comment.id ? (
            <div className="mt-2">
              <input
                type="text"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                disabled={submitting}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 dark:text-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <X size={16} className="mr-1" />
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => handleEditComment(comment.id)}
                  disabled={submitting}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Send size={16} className="mr-1" />
                  {submitting ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start gap-3">
                <div className="relative h-9 w-9 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {getInitial(comment)}
                </div>
                <div className="min-w-0">
                  <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-2xl inline-block max-w-full">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      {getCommentAuthorName(comment)}
                    </div>
                    <div className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed break-words">
                      {comment.context}
                    </div>
                  </div>

                  {/* Actions + timestamp */}
                  <div className="flex items-center gap-4 mt-1 ml-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(comment.publishedAt || comment.createdAt)}
                      {comment.lastModified && ' (đã chỉnh sửa)'}
                    </span>

                    <button
                      onClick={() => {
                        setReplyToId(comment.id);
                        setReplyTexts((prev) => ({ ...prev, [comment.id]: prev[comment.id] || '' }));
                      }}
                      className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                      type="button"
                    >
                      <MessageSquare size={14} className="mr-1" />
                      Trả lời
                    </button>

                    {canModifyComment(comment) && (
                      <>
                        <button
                          onClick={() => startEditing(comment)}
                          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          <Edit size={14} className="mr-1" />
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="inline-flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Xóa
                        </button>
                      </>
                    )}

                    {Array.isArray(comment.children) && comment.children.length > 0 && (
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={() => setRepliesOpenById((prev) => ({ ...prev, [comment.id]: !(prev[comment.id] ?? true) }))}
                      >
                        {(repliesOpenById[comment.id] ?? true) ? 'Thu gọn trả lời' : `Hiển thị ${comment.children.length} trả lời`}
                      </button>
                    )}
                  </div>

                  {replyToId === comment.id && (
                    <div className="mt-3">
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Viết câu trả lời..."
                        value={replyTexts[comment.id] || ''}
                        onChange={(e) => setReplyTexts((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                        autoFocus
                        disabled={!isAuthenticated || submitting}
                      />
                      <div className="flex justify-end mt-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setReplyToId(null);
                            setReplyTexts((prev) => ({ ...prev, [comment.id]: '' }));
                          }}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 dark:text-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          <X size={16} className="mr-1" />
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddReply(comment.id)}
                          disabled={!isAuthenticated || submitting || !(replyTexts[comment.id] || '').trim()}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                          <Send size={16} className="mr-1" />
                          Gửi trả lời
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Children */}
                  {(comment.children && comment.children.length > 0 && (repliesOpenById[comment.id] ?? true)) && (
                    <div className="mt-3 relative pl-8 flex flex-col gap-3">
                      {/* Thread vertical line spanning all children (continuous) */}
                      <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gray-300 dark:bg-gray-600"></div>
                      {comment.children.map((child) => (
                        <CommentItem key={child.id} comment={child} depth={depth + 1} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bình luận
        </h2>
        {loading ? (
          <div className="animate-pulse">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        ) : comments.length > 0 && (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium flex items-center">
            <MessageSquare size={16} className="mr-1" />
            {comments.length} bình luận
          </span>
        )}
      </div>
      
      {/* Comment form */}
      <form onSubmit={handleAddComment} className="mb-8">
        <div className="mb-4">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={isAuthenticated ? "Viết bình luận của bạn..." : "Đăng nhập để bình luận"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!isAuthenticated || submitting}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isAuthenticated || submitting}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              !isAuthenticated || submitting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <Send size={16} className="mr-2" />
            {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
          </button>
        </div>
      </form>
      
      {/* Comments list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex space-x-4 p-4 rounded-lg">
              <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
        </div>
      )}
    </div>
  );
};

export default Comments;
