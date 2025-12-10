import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Editor } from '@tinymce/tinymce-react';
import { useUser } from '../../contexts/UserContext';
import blogService from '../../api/blogService';

const CreatePost = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUser();
  
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  // Kiểm tra xác thực
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Bạn cần đăng nhập để tạo bài viết');
      navigate('/login', { state: { from: '/blog/create' } });
    }
  }, [isAuthenticated, navigate]);
  
  // Lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoriesData = await blogService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Không thể lấy danh sách danh mục');
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Vui lòng nhập tiêu đề bài viết');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung bài viết');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Đảm bảo rằng dữ liệu có cả định dạng post_title và postTitle để phù hợp với mọi API
      console.log('Selected category ID before create:', selectedCategoryId);
      
      const postData = {
        postTitle: title,
        post_title: title,
        postSummary: summary,
        post_excerpt: summary,
        postContent: content,
        post_content: content,
        published: published,
        category_id: selectedCategoryId ? parseInt(selectedCategoryId) : null, // Đảm bảo là số
        categoryId: selectedCategoryId ? parseInt(selectedCategoryId) : null // Thêm cả camelCase
      };
      
      console.log('Submitting new post data:', postData);
      
      const result = await blogService.createPost(postData);
      console.log('Create post result:', result);
      
      // Tạo timestamp hiện tại để đảm bảo trang blog tải lại và hiển thị bài viết mới
      const timestamp = new Date().getTime();
      
      // Lấy ID của bài viết mới tạo để highlight
      const newPostId = result?.id || result?.post_id;
      
      toast.success('Bài viết đã được tạo thành công!');
      // Thêm timestamp và postId vào URL query để đánh dấu bài viết mới
      navigate(`/blog?created=true&_t=${timestamp}${newPostId ? `&postId=${newPostId}` : ''}`);
    } catch (err) {
      console.error('Error creating post:', err);
      toast.error('Không thể tạo bài viết: ' + (err.message || 'Đã xảy ra lỗi'));
    } finally {
      setSubmitting(false);
    }
  };
  
  // Lấy API key từ biến môi trường
  const TINYMCE_API_KEY = import.meta.env.VITE_TINYMCE_API_KEY;
  
  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            Tạo bài viết mới
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="title" className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Nhập tiêu đề bài viết"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="summary" className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Tóm tắt
              </label>
              <textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Nhập tóm tắt ngắn gọn về bài viết"
                rows="3"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="category" className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Danh mục
              </label>
              <select
                id="category"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                disabled={loadingCategories}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
              
              {loadingCategories && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Đang tải danh mục...</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="content" className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Nội dung <span className="text-red-500">*</span>
              </label>
              <Editor
                apiKey={TINYMCE_API_KEY}
                value={content}
                onEditorChange={(newContent) => setContent(newContent)}
                init={{
                  height: 520,
                  menubar: 'file edit view insert format tools table help',
                  toolbar_sticky: true,
                  plugins: [
                    'advlist autolink lists link image charmap preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table help wordcount',
                    'quickbars emoticons checklist'
                  ],
                  toolbar: [
                    'undo redo | blocks | bold italic underline | forecolor backcolor',
                    'alignleft aligncenter alignright alignjustify | bullist numlist checklist outdent indent',
                    '| link image table | removeformat | code fullscreen'
                  ].join(' '),
                  quickbars_selection_toolbar: 'bold italic | forecolor backcolor | h2 h3 blockquote | bullist numlist',
                  content_style: `
                    body { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif; font-size: 16px; }
                    mark, span.highlight { background: #fff3a3; padding: 0 .15em; }
                  `,
                  // Allow mark/highlight elements
                  extended_valid_elements: 'mark[class|style],span[class|style]',
                  style_formats: [
                    { title: 'Highlight', inline: 'mark' },
                    { title: 'Inline code', inline: 'code' },
                    { title: 'Small', inline: 'small' }
                  ],
                  image_advtab: true,
                  file_picker_types: 'image',
                  automatic_uploads: true,
                  images_upload_handler: async (blobInfo) => {
                    return new Promise((resolve) => {
                      const reader = new FileReader();
                      reader.onload = () => resolve(reader.result);
                      reader.readAsDataURL(blobInfo.blob());
                    });
                  }
                }}
              />
            </div>
            
            <div className="mb-8">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-200">Xuất bản ngay</span>
              </label>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                  submitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? 'Đang tạo...' : 'Tạo bài viết'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/blog')}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreatePost;