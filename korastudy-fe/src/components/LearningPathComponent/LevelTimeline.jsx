import React from 'react';
import { Clock } from 'lucide-react';
import CourseCard from './CourseCard';

const LevelTimeline = ({ level, levelIndex, animatedItems }) => {
  return (
    <div key={level.id} className="mb-12 last:mb-0 animate-on-scroll" data-id={`level-${levelIndex}`}>
      <div className="relative">
        {/* Vertical line connecting levels - chỉ hiển thị trên tablet trở lên */}
        <div className="hidden sm:block absolute left-8 top-16 w-1 h-[calc(100%+4rem)] bg-gradient-to-b from-blue-500 to-blue-100 dark:to-blue-900 rounded-full"></div>
        
        {/* Circle with number - cải thiện responsive */}
        <div className={`absolute left-0 sm:left-0 top-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-sky-500 text-white rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold shadow-lg transform transition-all duration-700 ${animatedItems[`level-${levelIndex}`] ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          {levelIndex + 1}
        </div>
        
        {/* Level content - cải thiện margin và spacing cho mobile */}
        <div className="ml-16 sm:ml-28">
          <h3 className={`text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2 transition-all duration-500 ${animatedItems[`level-${levelIndex}`] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {level.title}
          </h3>
          <p className={`text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 flex items-center text-sm sm:text-base transition-all duration-500 delay-100 ${animatedItems[`level-${levelIndex}`] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <Clock size={16} className="mr-1 sm:mr-2 text-blue-500" />
            Thời gian ước tính: <span className="font-semibold ml-1">{level.duration}</span>
          </p>
          
          {/* Grid của các khóa học với responsive tốt hơn */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {level.courses.map((course, courseIndex) => (
              <div 
                key={course.id}
                className={`transition-all duration-500 ${animatedItems[`level-${levelIndex}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
                style={{ transitionDelay: `${200 + courseIndex * 150}ms` }}
              >
                <CourseCard course={course} delay={courseIndex * 150} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelTimeline;