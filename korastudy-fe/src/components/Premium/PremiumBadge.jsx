import React from 'react';
import { Crown, Lock } from 'lucide-react';

/**
 * Component hiển thị Premium Badge
 * @param {boolean} isLocked - Nội dung có bị khóa không (yêu cầu Premium)
 * @param {string} size - Kích thước badge: 'small' | 'default'
 * @param {string} className - Additional CSS classes
 */
const PremiumBadge = ({ isLocked = false, size = 'default', className = '' }) => {
  if (!isLocked) return null;

  const sizeClasses = size === 'small' 
    ? 'px-2 py-0.5 text-[10px] gap-0.5' 
    : 'px-3 py-1 text-xs gap-1';

  const iconSize = size === 'small' ? 10 : 14;

  return (
    <span 
      className={`inline-flex items-center ${sizeClasses} bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-full font-semibold shadow-md ${className}`}
      title="Nội dung Premium - Chỉ dành cho thành viên Premium"
    >
      <Lock size={iconSize} className="flex-shrink-0" />
      <span>Premium</span>
    </span>
  );
};

export default PremiumBadge;
