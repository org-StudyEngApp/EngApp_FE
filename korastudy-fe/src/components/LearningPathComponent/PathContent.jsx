import React from 'react';
import LevelTimeline from './LevelTimeline';
import { TrendingUp, BookMarked, Clock, Star } from 'lucide-react';

const PathContent = ({ path, animatedItems }) => {
  return (
    <>
      {/* Description với responsive tốt hơn */}
      <section className="py-6 md:py-8 bg-white dark:bg-dark-800 shadow-md relative z-10 border-b border-gray-200 dark:border-dark-700">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-3 md:gap-4">
            <div className="hidden md:block w-1 bg-gradient-to-b from-blue-500 to-sky-400 rounded-full"></div>
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {path.description}
            </p>
          </div>
          
          <div className="mt-6 md:mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 animate-on-scroll" data-id={`stats-${path.id}`}>
            <div className={`bg-gray-50 dark:bg-dark-700 rounded-xl p-3 md:p-4 border border-gray-200 dark:border-dark-600 shadow-sm transition-all duration-700 ${animatedItems[`stats-${path.id}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                <TrendingUp className="text-blue-500" size={16} />
                <span className="font-semibold text-gray-500 dark:text-gray-400 text-xs md:text-sm">Hoàn thành</span>
              </div>
              <div className="text-base md:text-xl font-bold text-gray-800 dark:text-gray-200">{path.stats?.completion || '40%'}</div>
            </div>
            <div className={`bg-gray-50 dark:bg-dark-700 rounded-xl p-3 md:p-4 border border-gray-200 dark:border-dark-600 shadow-sm transition-all duration-700 delay-100 ${animatedItems[`stats-${path.id}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                <BookMarked className="text-blue-500" size={16} />
                <span className="font-semibold text-gray-500 dark:text-gray-400 text-xs md:text-sm">Bài học</span>
              </div>
              <div className="text-base md:text-xl font-bold text-gray-800 dark:text-gray-200">{path.stats?.lessons || '25 bài'}</div>
            </div>
            <div className={`bg-gray-50 dark:bg-dark-700 rounded-xl p-3 md:p-4 border border-gray-200 dark:border-dark-600 shadow-sm transition-all duration-700 delay-200 ${animatedItems[`stats-${path.id}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                <Clock className="text-blue-500" size={16} />
                <span className="font-semibold text-gray-500 dark:text-gray-400 text-xs md:text-sm">Đã học</span>
              </div>
              <div className="text-base md:text-xl font-bold text-gray-800 dark:text-gray-200">{path.stats?.studyTime || '10 giờ'}</div>
            </div>
            <div className={`bg-gray-50 dark:bg-dark-700 rounded-xl p-3 md:p-4 border border-gray-200 dark:border-dark-600 shadow-sm transition-all duration-700 delay-300 ${animatedItems[`stats-${path.id}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                <Star className="text-blue-500" size={16} />
                <span className="font-semibold text-gray-500 dark:text-gray-400 text-xs md:text-sm">Đánh giá</span>
              </div>
              <div className="text-base md:text-xl font-bold text-gray-800 dark:text-gray-200">{path.stats?.rating || '4.9/5'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Levels with improved responsive */}
      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4">
          {path.levels.map((level, levelIndex) => (
            <LevelTimeline 
              key={level.id}
              level={level}
              levelIndex={levelIndex}
              animatedItems={animatedItems}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default PathContent;