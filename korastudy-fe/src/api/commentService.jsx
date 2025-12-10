import { API_BASE_URL } from '../config';

// Helper function to get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

// Helper function to create headers with authentication
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Handle errors properly
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  try {
    return await response.json();
  } catch (err) {
    return {}; // Return empty object if JSON is invalid
  }
};

// Try multiple endpoint patterns to avoid 404 between posts/blog/api versions
const buildCandidateUrls = (postId, commentId = null) => {
  const bases = [
    `${API_BASE_URL}/api`,
    `${API_BASE_URL}/api/v1`,
  ];
  const resources = [
    // [postResource, commentResource]
    ['posts', 'comments'],
    ['blog', 'comments'],
    ['blogs', 'comments'],
  ];

  const paths = [];
  for (const base of bases) {
    for (const [postRes, commentRes] of resources) {
      const basePath = `${base}/${postRes}/${postId}/${commentRes}`;
      paths.push(commentId ? `${basePath}/${commentId}` : basePath);
    }
  }
  return paths;
};

const requestWithFallback = async (method, postId, { body, commentId } = {}) => {
  const candidates = buildCandidateUrls(postId, commentId);
  let lastError;
  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      if (!res.ok) {
        lastError = new Error(`HTTP ${res.status} at ${url}`);
        // Only try next when 404/405; otherwise throw immediately
        if (![404, 405].includes(res.status)) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status} ${text}`);
        }
        continue;
      }
      // For DELETE that returns no content
      if (method === 'DELETE') return true;
      return await handleResponse(res);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('All comment endpoints failed');
};

export const commentService = {
  // Get all comments for a post
  getComments: async (postId) => {
    try {
  console.log(`Fetching comments for post ${postId}`);
  const data = await requestWithFallback('GET', postId);
  return data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Add a new comment (requires authentication)
  addComment: async (postId, commentData) => {
    try {
  console.log(`Adding comment to post ${postId}`, commentData);
  // commentData can include parentId for replies
  const data = await requestWithFallback('POST', postId, { body: commentData });
  return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Update an existing comment (only for comment author or admin)
  updateComment: async (postId, commentId, commentData) => {
    try {
  console.log(`Updating comment ${commentId} for post ${postId}`, commentData);
  const data = await requestWithFallback('PUT', postId, { body: commentData, commentId });
  return data;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  // Delete a comment (only for comment author or admin)
  deleteComment: async (postId, commentId) => {
    try {
  console.log(`Deleting comment ${commentId} from post ${postId}`);
  await requestWithFallback('DELETE', postId, { commentId });
  return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },
  
  // Get comment count for a single post
  getCommentCount: async (postId) => {
    try {
      const comments = await commentService.getComments(postId);
      return Array.isArray(comments) ? comments.length : 0;
    } catch (error) {
      console.error(`Error getting comment count for post ${postId}:`, error);
      return 0; // Return 0 if error
    }
  },
  
  // Get comment counts for multiple posts
  getCommentCounts: async (postIds) => {
    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return {};
    }
    
    try {
      console.log('Fetching comment counts for posts:', postIds);
      
      // Không sử dụng batch API nữa vì nó đang gây lỗi 404
      // Sử dụng trực tiếp cách lấy comments cho từng bài viết
      const results = {};
      await Promise.all(
        postIds.map(async (postId) => {
          // Gọi trực tiếp API lấy danh sách comments cho bài viết
          try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`, {
              method: 'GET',
              headers: getAuthHeaders(),
            });
            
            if (response.ok) {
              const comments = await response.json();
              results[postId] = Array.isArray(comments) ? comments.length : 0;
            } else {
              results[postId] = 0;
            }
          } catch (error) {
            console.error(`Error fetching comments for post ${postId}:`, error);
            results[postId] = 0;
          }
        })
      );
      
      console.log('Comment counts fetched:', results);
      return results;
    } catch (error) {
      console.error('Error getting comment counts:', error);
      return {}; // Return empty object if error
    }
  }
};

export default commentService;
