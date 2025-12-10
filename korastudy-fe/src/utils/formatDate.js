export function formatDate(dateString, includeTime = false) {
  if (!dateString || dateString === 'N/A') {
    const today = new Date();
    return formatDateObject(today, includeTime);
  }
  
  if (typeof dateString !== 'string') {
    dateString = String(dateString);
  }
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      const today = new Date();
      return formatDateObject(today, includeTime);
    }
    
    return formatDateObject(date, includeTime);
  } catch (error) {
    console.error('Error formatting date:', error, dateString);
    return formatDateObject(new Date(), includeTime);
  }
}

function formatDateObject(date, includeTime) {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  };
  
  if (includeTime) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
  
  return date.toLocaleDateString('vi-VN', options);
}