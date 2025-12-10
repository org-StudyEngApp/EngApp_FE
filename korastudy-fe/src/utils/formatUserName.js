export function formatUserName(user) {
  if (!user) return 'Tác giả ẩn danh';
  
  // Kiểm tra từng trường dữ liệu theo thứ tự ưu tiên
  if (user.fullName) return user.fullName;
  
  const fn = user.firstName || user.first_name || '';
  const ln = user.lastName || user.last_name || '';
  const full = `${fn} ${ln}`.trim();
  
  if (full) return full;
  if (user.username) return user.username;
  if (user.user_name) return user.user_name;
  if (user.email) return user.email.split('@')[0];
  
  return 'Tác giả ẩn danh';
}