import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import LoginForm from '../../components/auth/LoginForm';

const LoginContainer = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const { login } = useUser();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear API error when user changes anything
    if (apiError) {
      setApiError('');
    }

    // Real-time validation for username
    if (name === 'username') {
      validateField(name, newValue);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'username':
        if (!value.trim()) {
          error = 'Vui lòng nhập tên đăng nhập';
        } else if (value.trim().length < 3) {
          error = 'Tên đăng nhập phải có ít nhất 3 ký tự';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Vui lòng nhập mật khẩu';
        }
        break;

      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    return error === '';
  };

  const validateForm = () => {
    const fields = ['username', 'password'];
    let isValid = true;

    fields.forEach(field => {
      const fieldIsValid = validateField(field, formData[field]);
      if (!fieldIsValid) {
        isValid = false;
      }
    });

    // Mark all fields as touched
    const touchedFields = {};
    fields.forEach(field => {
      touchedFields[field] = true;
    });
    setTouched(touchedFields);

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setApiError('');
      
      try {
        const loginData = {
          username: formData.username,
          password: formData.password
        };
        
        console.log('Login attempt with:', loginData);
        
        const response = await login(loginData);
        
        console.log('Login successful, response:', response);
        
        // Chuyển hướng đến trang chủ mà không reload trang
        navigate('/', { replace: true });
        
        
      } catch (error) {
        console.error('Login error:', error);
        // Thay thông báo lỗi thành "Sai mật khẩu hoặc tài khoản, hãy thử lại"
        setApiError('Sai mật khẩu hoặc tài khoản, hãy thử lại');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full lg:w-1/2 bg-gradient-to-br from-primary-500 via-secondary-400 to-secondary-500 flex flex-col items-center justify-center p-4 lg:p-10 lg:rounded-r-custom relative shadow-custom">
      <LoginForm
        formData={formData}
        errors={errors}
        touched={touched}
        isLoading={isLoading}
        apiError={apiError}
        showPassword={showPassword}
        handleInputChange={handleInputChange}
        handleBlur={handleBlur}
        handleSubmit={handleSubmit}
        toggleShowPassword={toggleShowPassword}
      />
    </div>
  );
};

export default LoginContainer;