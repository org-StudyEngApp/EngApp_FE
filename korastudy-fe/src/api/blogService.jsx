import { API_BASE_URL } from '../config.jsx';
import { formatUserName } from '../utils/formatUserName';
import { formatDate } from '../utils/formatDate';

// Helper function để get token từ localStorage
const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

// Helper function để tạo headers với authentication
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
    return {}; // Trả về object rỗng nếu JSON không hợp lệ
  }
};

export const blogService = {
  // PUBLIC: Lấy tất cả bài viết
  getAllPosts: async () => {
    try {
      console.log('Fetching all posts'); // Thêm log để debug
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'GET',
        headers: getAuthHeaders(),
        cache: 'no-store' // Thêm để đảm bảo không lấy từ cache
      });
      
      // Log response status
      console.log('API response status:', response.status);
      
      const data = await handleResponse(response);
      console.log('Raw API response:', data);
      console.log('🔍 Testing categories display with real API data');
      
      // Log structure của response để debug
      if (Array.isArray(data) && data.length > 0) {
        const firstPost = data[0];
        console.log('First post structure:', {
          id: firstPost.id,
          title: firstPost.post_title || firstPost.title,
          categories: firstPost.categories,
          category_id: firstPost.category_id,
          hasCategories: !!firstPost.categories,
          categoriesType: typeof firstPost.categories,
          categoriesIsArray: Array.isArray(firstPost.categories)
        });
      }
      
      // Kiểm tra cấu trúc dữ liệu API
      let posts = [];
      
      if (Array.isArray(data)) {
        posts = data;
      } else if (data.content && Array.isArray(data.content)) {
        // Trường hợp API trả về dạng { content: [...] }
        posts = data.content;
      } else if (data.posts && Array.isArray(data.posts)) {
        // Trường hợp API trả về dạng { posts: [...] }
        posts = data.posts;
      } else if (data.data && Array.isArray(data.data)) {
        // Trường hợp API trả về dạng { data: [...] }
        posts = data.data;
      } else {
        console.warn('Unexpected API response format:', data);
        posts = [];
      }
      
      console.log(`Extracted ${posts.length} posts from API response`);
      
      // Check format của posts để xem có categories không
      console.log('Posts format check:', {
        totalPosts: posts.length,
        firstPost: posts[0] ? {
          id: posts[0].id,
          title: posts[0].post_title || posts[0].title,
          hasCategories: posts[0].categories && Array.isArray(posts[0].categories),
          categories: posts[0].categories,
          category_id: posts[0].category_id,
          categoryName: posts[0].categoryName
        } : null
      });
      
      // Map dữ liệu để đảm bảo mỗi post có post_id và thông tin chuẩn hóa
      return posts.map(post => {
        const processedPost = { ...post };
        
        // Đảm bảo post có ID
        if (!processedPost.post_id && processedPost.id) {
          processedPost.post_id = processedPost.id;
        }
        
        // Xử lý thông tin tác giả từ createdBy/created_by
        if (processedPost.createdBy) {
          processedPost.author = processedPost.createdBy;
        } else if (processedPost.created_by) {
          processedPost.author = processedPost.created_by;
        }
        
        // Ưu tiên sử dụng thông tin từ author (createdBy)
        if (processedPost.author) {
          processedPost.user = processedPost.author;
        } else if (processedPost.user_id && !processedPost.user) {
          processedPost.user = { id: processedPost.user_id };
        }
        
        // Thêm các trường phụ trợ đã xử lý để hiển thị
        processedPost.formattedDate = formatDate(
          processedPost.created_at || 
          processedPost.createdAt || 
          processedPost.published_at || 
          processedPost.post_published_at
        );
        
        // Cập nhật: Ưu tiên rõ ràng sử dụng createdBy trước
        processedPost.authorName = formatUserName(
          processedPost.createdBy || 
          processedPost.created_by || 
          processedPost.author || 
          processedPost.user
        );
        
        // TEMP: Thêm dữ liệu categories mẫu để test giao diện
        if (!processedPost.categories && !processedPost.category) {
          // Thêm categories mẫu để test hiển thị
          if (processedPost.id % 3 === 1) {
            processedPost.categories = [{ id: 1, name: "Kinh nghiệm học", category_id: 1 }];
          } else if (processedPost.id % 3 === 2) {
            processedPost.categories = [{ id: 2, name: "Từ vựng", category_id: 2 }];
          } else {
            processedPost.categories = [{ id: 3, name: "Kỹ năng nghe", category_id: 3 }];
          }
        }
        
        return processedPost;
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Trả về dữ liệu mẫu khi API lỗi
      return [
        {
          post_id: 1,
          id: 1,
          post_title: "Kinh nghiệm học tiếng Hàn cho người mới bắt đầu",
          post_excerpt: "Chia sẻ những kinh nghiệm quý báu khi mới bắt đầu học tiếng Hàn từ con số 0.",
          post_content: "<p>Korean very easy with anyone. You can study Korea Language every day and you can speak with friend from Korea.</p>",
          published: true,
          created_at: new Date().toISOString(),
          user: { id: 1, user_name: "Admin User" },
          formattedDate: formatDate(new Date().toISOString()),
          authorName: "Admin User"
        },
        {
          post_id: 2,
          id: 2,
          post_title: "Cách học từ vựng tiếng Hàn hiệu quả",
          post_excerpt: "Phương pháp học từ vựng tiếng Hàn nhanh và nhớ lâu.",
          post_content: "<p>Korean very easy with anyone. You can study Korea Language every day and you can speak with friend from Korea.</p>",
          published: true,
          created_at: new Date().toISOString(),
          user: { id: 1, user_name: "Admin User" },
          formattedDate: formatDate(new Date().toISOString()),
          authorName: "Admin User"
        }
      ];
    }
  },

  // PUBLIC: Lấy chi tiết bài viết
  async getPostById(id) {
    try {
      // Validate id before making API call
      if (!id || id === 'undefined' || id === 'null' || isNaN(parseInt(id))) {
        console.error('Invalid post ID:', id);
        throw new Error('ID bài viết không hợp lệ');
      }
      
      console.log('Getting post by ID:', id);
      
      // Thử nhiều endpoint API khác nhau nếu cần
      let response;
      let data;
      let error;
      
      try {
        // Endpoint API chính
        response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
          method: 'GET',
          headers: getAuthHeaders()
        });
        data = await handleResponse(response);
      } catch (err) {
        console.warn('Primary endpoint failed, trying alternative endpoint:', err);
        error = err;
        
        try {
          // Endpoint thay thế nếu có
          response = await fetch(`${API_BASE_URL}/api/blog/posts/${id}`, {
            method: 'GET',
            headers: getAuthHeaders()
          });
          data = await handleResponse(response);
        } catch (altErr) {
          console.error('All API endpoints failed:', altErr);
          // Trả về dữ liệu mẫu khi API lỗi
          data = {
            post_id: id,
            id: id,
            post_title: "Bài viết mẫu khi API lỗi",
            post_content: "<p>Korean very easy with anyone. You can study Korea Language every day and you can speak with friend from Korea.</p>",
            published: true,
            created_at: new Date().toISOString(),
            user: { id: 1, user_name: "Admin User" },
            formattedDate: formatDate(new Date().toISOString()),
            authorName: "Admin User"
          };
        }
      }
      
      console.log('API response data:', data);
      console.log('Expected format check:', {
        hasCategories: data.categories && Array.isArray(data.categories),
        categoriesLength: data.categories ? data.categories.length : 0,
        firstCategory: data.categories && data.categories[0] ? data.categories[0] : null,
        category_id: data.category_id,
        categoryName: data.categoryName,
        expectedFormat: {
          id: 'number',
          title: 'string', 
          content: 'string',
          categories: [
            {
              id: 'number',
              name: 'string',
              category_id: 'number'
            }
          ]
        }
      });
      
      // Đảm bảo data không null/undefined
      if (!data) {
        throw new Error('API returned empty response');
      }
      
      // Xử lý trường hợp API trả về dữ liệu lồng trong thuộc tính 'post' hoặc 'data'
      let processedData = { ...data };
      
      if (data.post && typeof data.post === 'object') {
        console.log('Unwrapping data from "post" property');
        processedData = {
          ...processedData,
          ...data.post
        };
      }
      
      if (data.data && typeof data.data === 'object') {
        console.log('Unwrapping data from "data" property');
        processedData = {
          ...processedData,
          ...data.data
        };
      }
      
      // Map ID nếu cần
      if (!processedData.post_id && processedData.id) {
        console.log('Mapping id to post_id for post detail:', processedData.id);
        processedData.post_id = processedData.id;
      }
      
      // Map các trường dữ liệu theo cả hai quy ước đặt tên
      // Từ camelCase sang snake_case
      if (processedData.postTitle && !processedData.post_title) {
        processedData.post_title = processedData.postTitle;
      }
      if (processedData.post_title && !processedData.postTitle) {
        processedData.postTitle = processedData.post_title;
      }
      
      if (processedData.postContent && !processedData.post_content) {
        processedData.post_content = processedData.postContent;
      }
      if (processedData.post_content && !processedData.postContent) {
        processedData.postContent = processedData.post_content;
      }
      
      if (processedData.postSummary && !processedData.post_excerpt) {
        processedData.post_excerpt = processedData.postSummary;
      }
      if (processedData.post_excerpt && !processedData.postSummary) {
        processedData.postSummary = processedData.post_excerpt;
      }
      
      if (processedData.createdAt && !processedData.created_at) {
        processedData.created_at = processedData.createdAt;
      }
      if (processedData.created_at && !processedData.createdAt) {
        processedData.createdAt = processedData.created_at;
      }
      
      if (processedData.updatedAt && !processedData.updated_at) {
        processedData.updated_at = processedData.updatedAt;
      }
      if (processedData.updated_at && !processedData.updatedAt) {
        processedData.updatedAt = processedData.updated_at;
      }
      
      // Xử lý thông tin tác giả theo cấu trúc bảng Account
      if (processedData.createdBy) {
        console.log('Found createdBy data:', processedData.createdBy);
        processedData.author = processedData.createdBy;
      } else if (processedData.created_by) {
        console.log('Found created_by data:', processedData.created_by);
        processedData.author = processedData.created_by;
      }
      
      // Ưu tiên sử dụng thông tin từ createdBy/created_by
      if (processedData.author) {
        processedData.user = processedData.author;
      } else if (processedData.user_id && !processedData.user) {
        console.log('Found user_id but no author object:', processedData.user_id);
        processedData.user = { id: processedData.user_id };
      }
      
      // Thêm các trường phụ trợ đã xử lý để hiển thị
      processedData.formattedDate = formatDate(
        processedData.created_at || 
        processedData.createdAt || 
        processedData.published_at || 
        processedData.post_published_at
      );
      
      // Cập nhật: Ưu tiên rõ ràng sử dụng createdBy trước
      processedData.authorName = formatUserName(
        processedData.createdBy || 
        processedData.created_by || 
        processedData.author || 
        processedData.user
      );
      
      // Debug thông tin đã xử lý
      console.log('Processed post data:', {
        id: processedData.post_id || processedData.id,
        title: processedData.post_title || processedData.postTitle,
        author: processedData.authorName,
        date: processedData.formattedDate,
        createdBy: processedData.createdBy, // Log thêm createdBy để debug
        category: processedData.category // Log thêm category để debug
      });
      
      // Xử lý dữ liệu danh mục nếu có
      console.log('Processing category data:', {
        category: processedData.category,
        categories: processedData.categories,
        category_id: processedData.category_id,
        categoryId: processedData.categoryId,
        categoryName: processedData.categoryName,
        categoryTitle: processedData.categoryTitle
      });
      
      // Xử lý danh mục từ bảng post_category (có thể trả về dưới dạng array)
      if (processedData.categories && Array.isArray(processedData.categories) && processedData.categories.length > 0) {
        // Lấy danh mục đầu tiên nếu có nhiều danh mục
        const firstCategory = processedData.categories[0];
        processedData.category = {
          category_id: firstCategory.category_id || firstCategory.id,
          id: firstCategory.category_id || firstCategory.id,
          category_name: firstCategory.categoryTitle || firstCategory.title || firstCategory.category_name || firstCategory.name,
          name: firstCategory.categoryTitle || firstCategory.title || firstCategory.category_name || firstCategory.name,
          categoryTitle: firstCategory.categoryTitle || firstCategory.title || firstCategory.category_name || firstCategory.name
        };
        
        // Đặt category_id ở cấp độ post để dễ xử lý
        processedData.category_id = firstCategory.category_id || firstCategory.id;
      }
      // Nếu có category_id hoặc categoryId nhưng không có đối tượng category
      else if ((processedData.category_id || processedData.categoryId) && !processedData.category) {
        const catId = processedData.category_id || processedData.categoryId;
        processedData.category = { 
          category_id: catId,
          id: catId
        };
        
        // Thêm tên danh mục nếu có
        if (processedData.categoryName || processedData.categoryTitle) {
          const catName = processedData.categoryName || processedData.categoryTitle;
          processedData.category.category_name = catName;
          processedData.category.name = catName;
          processedData.category.categoryTitle = catName;
        }
      } 
      // Nếu đã có đối tượng category nhưng cần bổ sung thông tin
      else if (processedData.category) {
        // Đảm bảo category có đủ trường cần thiết
        if (!processedData.category.category_id && processedData.category.id) {
          processedData.category.category_id = processedData.category.id;
        }
        
        const catName = processedData.categoryName || processedData.categoryTitle || 
                        processedData.category.categoryTitle || processedData.category.name;
                        
        if (catName) {
          processedData.category.category_name = catName;
          processedData.category.name = catName;
          processedData.category.categoryTitle = catName;
        }
        
        // Đặt category_id ở cấp độ post
        processedData.category_id = processedData.category.category_id || processedData.category.id;
      }
      
      // TEMP: Thêm dữ liệu categories mẫu nếu không có từ backend
      if (!processedData.categories && !processedData.category) {
        const sampleCategories = [
          { id: 1, name: "Kinh nghiệm học", category_id: 1 },
          { id: 2, name: "Từ vựng", category_id: 2 }, 
          { id: 3, name: "Kỹ năng nghe", category_id: 3 }
        ];
        
        const randomCategory = sampleCategories[parseInt(id) % 3];
        processedData.categories = [randomCategory];
        processedData.category = randomCategory;
        processedData.category_id = randomCategory.category_id;
      }
      
      return processedData;
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      throw error;
    }
  },

  // PUBLIC: Lấy metas của bài viết
  getPostMeta: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}/meta`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching post meta:', error);
      throw error;
    }
  },

  // USER/ADMIN: Tạo bài viết mới
  // Trong src/api/blogService.jsx
// USER/ADMIN: Tạo bài viết mới
createPost: async (postData) => {
  try {
    console.log('Creating post with data:', postData);
    
    // Chuẩn bị dữ liệu cho API - hỗ trợ cả hai kiểu đặt tên để tương thích
    // Log để debug
    console.log('Creating post with category ID:', postData.category_id);
    console.log('Full post data received:', postData);
    
    const apiData = {
      post_title: postData.postTitle || postData.post_title,
      post_excerpt: postData.postSummary || postData.post_excerpt,
      post_content: postData.postContent || postData.post_content,
      postTitle: postData.postTitle || postData.post_title,
      postSummary: postData.postSummary || postData.post_excerpt, 
      postContent: postData.postContent || postData.post_content,
      published: postData.published,
      // Gửi category_id riêng để backend xử lý bảng post_category
      category_id: postData.category_id || null,
      categoryId: postData.categoryId || postData.category_id || null,
      // Thêm categories dưới dạng array nếu cần
      categories: postData.category_id ? [{ category_id: postData.category_id }] : []
    };
    
    console.log('API data being sent:', apiData);
    
    // Thêm thời gian hiện tại để tránh cache
    const timestamp = new Date().getTime();
    const url = `${API_BASE_URL}/api/posts?_t=${timestamp}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: JSON.stringify(apiData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Create response:', data);
    
    // Xóa bộ nhớ cache dữ liệu danh sách bài viết nếu có thể
    try {
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        for (const key of cacheKeys) {
          await caches.delete(key);
        }
        console.log('Cache cleared after post creation');
      }
    } catch (cacheError) {
      console.warn('Error clearing cache:', cacheError);
    }
    
    return data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
},

  // USER/ADMIN: Cập nhật bài viết
  updatePost: async (id, postData) => {
    try {
      console.log('Updating post with ID:', id, 'Data:', postData);
      
      // Đảm bảo dữ liệu bao gồm category_id nếu có
      console.log('Updating post with category ID:', postData.category_id);
      console.log('Full update data received:', postData);
      
      const apiData = {
        ...postData,
        category_id: postData.category_id || null,
        categoryId: postData.categoryId || postData.category_id || null,
        // Thêm categories dưới dạng array nếu cần
        categories: postData.category_id ? [{ category_id: postData.category_id }] : []
      };
      
      console.log('Update API data being sent:', apiData);
      
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(apiData)
      });
      
      console.log('Update response status:', response.status);
      const result = await handleResponse(response);
      console.log('Update response data:', result);
      
      return result;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  // ADMIN: Xóa bài viết
  deletePost: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  // USER/ADMIN: Thêm meta cho bài viết
  addPostMeta: async (postId, metaData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/meta`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(metaData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error adding post meta:', error);
      throw error;
    }
  },

  // USER/ADMIN: Cập nhật meta của bài viết
  updatePostMeta: async (postId, metaId, metaData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/meta/${metaId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(metaData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating post meta:', error);
      throw error;
    }
  },

  // USER/ADMIN: Xóa meta của bài viết
  deletePostMeta: async (postId, metaId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/meta/${metaId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Error deleting post meta:', error);
      throw error;
    }
  },

  // Compatibility methods cho code cũ - fallback to mock data if API fails
  getPosts: async (page = 1, limit = 10, categoryId = null, sortBy = null, search = '', forceRefresh = false, sortOrder = 'desc') => {
    try {
      console.log('Fetching posts with params:', { page, limit, categoryId, sortBy, search, forceRefresh, sortOrder });
      
      // Sắp xếp theo ID bài viết
      const actualSortBy = 'id'; // Luôn sắp xếp theo ID
      
      // Thêm timestamp để tránh cache khi forceRefresh = true
      let url = `${API_BASE_URL}/api/posts?page=${page-1}&size=${limit}`;
      if (categoryId) url += `&categoryId=${categoryId}`;
      url += `&sort=${actualSortBy},${sortOrder}`; // Luôn thêm tham số sắp xếp
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (forceRefresh) url += `&_t=${new Date().getTime()}`; // Thêm timestamp để bỏ qua cache
      
      console.log('API URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...getAuthHeaders(),
          'Cache-Control': forceRefresh ? 'no-cache, no-store, must-revalidate' : 'default'
        }
      });
      
      if (!response.ok) {
        console.error('API error:', response.status, response.statusText);
        // Fallback to getAllPosts
        const allPosts = await blogService.getAllPosts();
        
        // Lọc và phân trang theo các tham số
        let filtered = allPosts;
        if (categoryId) {
          console.log(`Filtering posts by category ID: ${categoryId}`);
          filtered = filtered.filter(post => {
            // Kiểm tra nhiều trường hợp lưu ID danh mục khác nhau
            const postCategoryId = 
              post.category_id || 
              (post.category && (post.category.category_id || post.category.id)) || 
              post.categoryId;
            
            console.log(`Post ${post.id}: category ID = ${postCategoryId}, matching ${categoryId}: ${postCategoryId == categoryId}`);
            return postCategoryId == categoryId;
          });
        }
        
        if (search) {
          filtered = filtered.filter(post => 
            (post.postTitle || post.post_title || '').toLowerCase().includes(search.toLowerCase()) ||
            (post.postSummary || post.post_excerpt || post.post_content || '').toLowerCase().includes(search.toLowerCase())
          );
        }

        const totalPosts = filtered.length;
        const totalPages = Math.ceil(totalPosts / limit);
        const start = (page - 1) * limit;
        const paginatedPosts = filtered.slice(start, start + limit);

        return {
          posts: paginatedPosts,
          totalPages,
          totalPosts
        };
      }
      
      const data = await response.json();
      console.log('API response for posts:', data);
      
      // Normalize API response based on actual structure
      let posts, totalPages, totalPosts;
      
      if (Array.isArray(data)) {
        posts = data;
        totalPosts = data.length;
        totalPages = Math.ceil(totalPosts / limit);
      } else if (data.content && Array.isArray(data.content)) {
        // Spring Data JPA Pageable format
        posts = data.content;
        totalPages = data.totalPages;
        totalPosts = data.totalElements;
      } else {
        posts = data.posts || data.data || [];
        totalPages = data.totalPages || data.total_pages || Math.ceil((data.totalPosts || data.count || posts.length) / limit);
        totalPosts = data.totalPosts || data.total || data.count || posts.length;
      }
      
      console.log(`Extracted ${posts.length} posts, total: ${totalPosts}, pages: ${totalPages}`);
      
      return {
        posts,
        totalPages,
        totalPosts
      };
    } catch (error) {
      console.warn('API failed, using mock data:', error);
      // Fallback to mock data
      const mockPosts = [
        {
          post_id: 1,
          id: 1,
          post_title: "Kinh nghiệm học tiếng Hàn cho người mới bắt đầu",
          post_excerpt: "Chia sẻ những kinh nghiệm quý báu khi mới bắt đầu học tiếng Hàn từ con số 0.",
          post_content: "<p>Korean very easy with anyone. You can study Korea Language every day and you can speak with friend from Korea.</p>",
          published: true,
          created_at: new Date().toISOString(),
          user: { id: 1, user_name: "Admin User" },
          formattedDate: formatDate(new Date().toISOString()),
          authorName: "Admin User"
        },
        {
          post_id: 2,
          id: 2,
          post_title: "Cách học từ vựng tiếng Hàn hiệu quả",
          post_excerpt: "Phương pháp học từ vựng tiếng Hàn nhanh và nhớ lâu.",
          post_content: "<p>Korean very easy with anyone. You can study Korea Language every day and you can speak with friend from Korea.</p>",
          published: true,
          created_at: new Date().toISOString(),
          user: { id: 1, user_name: "Admin User" },
          formattedDate: formatDate(new Date().toISOString()),
          authorName: "Admin User"
        }
      ];

      let filtered = mockPosts;
      if (search) {
        filtered = filtered.filter(post => 
          post.post_title.toLowerCase().includes(search.toLowerCase()) ||
          post.post_excerpt.toLowerCase().includes(search.toLowerCase())
        );
      }

      const totalPosts = filtered.length;
      const totalPages = Math.ceil(totalPosts / limit);
      const start = (page - 1) * limit;
      const paginatedPosts = filtered.slice(start, start + limit);

      return {
        posts: paginatedPosts,
        totalPages,
        totalPosts
      };
    }
  },

  // Lấy danh sách categories từ API
  getCategories: async () => {
    try {
      console.log('🔍 Fetching categories from backend API');
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'GET',
        headers: getAuthHeaders(),
        cache: 'no-store'
      });
      
      console.log('Category API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await handleResponse(response);
      console.log('Category API response:', data);
      
      // Test với dữ liệu thực từ CategoryResponse.fromEntity()
      if (Array.isArray(data) && data.length > 0) {
        console.log('Categories from backend:', data.map(cat => ({
          id: cat.category_id || cat.id,
          name: cat.category_name || cat.categoryTitle || cat.title || cat.name,
          context: cat.context
        })));
      }
      
      // Kiểm tra cấu trúc dữ liệu API
      let categories = [];
      
      if (Array.isArray(data)) {
        categories = data;
      } else if (data.content && Array.isArray(data.content)) {
        categories = data.content;
      } else if (data.categories && Array.isArray(data.categories)) {
        categories = data.categories;
      } else if (data.data && Array.isArray(data.data)) {
        categories = data.data;
      } else {
        console.warn('Unexpected API response format for categories:', data);
      }
      
      // Map dữ liệu để đảm bảo định dạng chuẩn
      const mappedCategories = categories.map(category => {
        const mappedCategory = {
          category_id: category.category_id || category.id,
          category_name: category.categoryTitle || category.title || category.category_title || category.name || category.category_name,
          context: category.context || category.category_context,
          post_count: category.post_count || 0
        };
        console.log('Mapped category:', mappedCategory);
        return mappedCategory;
      });
      
      return mappedCategories;
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      // Trả về dữ liệu mẫu khi API lỗi
      const fallbackCategories = [
        { category_id: 1, category_name: "Kinh nghiệm học", post_count: 1 },
        { category_id: 2, category_name: "Từ vựng", post_count: 1 },
        { category_id: 3, category_name: "Kỹ năng nghe", post_count: 1 }
      ];
      console.log('Using fallback categories:', fallbackCategories);
      return fallbackCategories;
    }
  },

  getTags: async () => {
    return [
      { tag_id: 1, tag_name: "mẹo học" },
      { tag_id: 2, tag_name: "ngữ pháp" },
      { tag_id: 3, tag_name: "từ vựng" },
      { tag_id: 4, tag_name: "luyện nghe" }
    ];
  }
};

export default blogService;