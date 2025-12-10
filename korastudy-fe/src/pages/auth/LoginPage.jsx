import React from 'react';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import LoginContainer from '../../containers/auth/LoginContainer';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-900">
      <NavBar />
      
      <div className="flex flex-1 min-h-[calc(100vh-160px)]">
        <LoginContainer />

        {/* Right Side - Promotional Content (Hidden on mobile) */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-dark-800 dark:to-dark-700 relative flex-col items-center justify-center px-15 py-10 overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute -top-25 -left-25 w-75 h-75 gradient-bg-1 rounded-full"></div>
          <div className="absolute -bottom-25 -right-25 w-100 h-100 gradient-bg-2 rounded-full"></div>
          
          {/* Main Content */}
          <div className="text-center z-10 mb-10">
            <h1 className="font-inter font-bold text-5xl leading-tight text-gray-800 dark:text-gray-200 mb-5 gradient-text">
              Để tiếng Anh<br />
              không còn là trở ngại
            </h1>
            <p className="font-inter text-lg leading-relaxed text-gray-500 dark:text-gray-400">
              Dễ dàng đạt được Level mong muốn với KoraStudy.com
            </p>
          </div>

          {/* Korean Architecture Illustration */}
          <div className="w-full max-w-lg z-10">
            <img 
              src="Learning-English.png" 
              alt="Learning English" 
              className="w-full h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.1)] rounded-2xl"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;