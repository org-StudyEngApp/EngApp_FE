import React from 'react';
import { BookOpen, Clock, Users, ChevronUp, ChevronDown } from 'lucide-react';

const PathHeader = ({ path, isExpanded, onToggle }) => {
  const iconMap = {
    'beginner': <BookOpen size={40} className="text-white" />,
    'topik1': <BookOpen size={40} className="text-white" />,
    'topik2': <BookOpen size={40} className="text-white" />
  };

  return (
    <section 
      className={`bg-gradient-to-r ${path.gradient || 'from-blue-600 via-blue-500 to-sky-500'} text-white py-8 relative overflow-hidden cursor-pointer`}
      onClick={() => onToggle(path.id)}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white opacity-20 animate-blob"></div>
        <div className="absolute left-10 bottom-5 w-32 h-32 rounded-full bg-sky-300 opacity-20 animate-blob animation-delay-2000"></div>
      </div>
      
      {/* Thay đổi container từ "container" thành max-w-4xl để thu hẹp chiều ngang */}
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 md:p-5 shadow-lg transform transition-all duration-500 hover:scale-110 hover:rotate-3">
            {iconMap[path.id] || <BookOpen size={32} className="text-white" />}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 animate-fade-in-down flex items-center justify-between">
              {path.title}
              {/* Toggle icon for mobile only */}
              <div className="md:hidden">
                {isExpanded ? 
                  <ChevronUp size={24} className="animate-bounce" /> : 
                  <ChevronDown size={24} className="animate-bounce" />
                }
              </div>
            </h1>
            <p className="text-blue-100 text-base md:text-lg mb-3 md:mb-6 animate-fade-in-up">
              {path.subtitle}
            </p>
            
            <div className="flex flex-wrap gap-2 md:gap-3 animate-fade-in">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 md:px-5 md:py-2 flex items-center text-xs md:text-sm shadow-lg hover:bg-white/30 transition-all duration-300">
                <Clock size={14} className="mr-1 md:mr-2" />
                <span>{path.duration}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 md:px-5 md:py-2 flex items-center text-xs md:text-sm shadow-lg hover:bg-white/30 transition-all duration-300">
                <BookOpen size={14} className="mr-1 md:mr-2" />
                <span>{path.courses} khóa học</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 md:px-5 md:py-2 flex items-center text-xs md:text-sm shadow-lg hover:bg-white/30 transition-all duration-300">
                <Users size={14} className="mr-1 md:mr-2" />
                <span>{path.students.toLocaleString()} học viên</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all duration-300">
              {isExpanded ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
            </div>
          </div>
        </div>
        
        {/* Visual indicator for expanding/collapsing on mobile - always visible */}
        <div className="flex justify-center mt-4 md:hidden">
          <div className="w-10 h-1 bg-white/40 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default PathHeader;