// Script to clear localStorage and fix avatar URL
// Run this in browser console

console.log('=== Fixing Avatar URL ===');

// Get current user
const userStr = localStorage.getItem('user');
if (userStr) {
  const user = JSON.parse(userStr);
  console.log('Current user:', user);
  console.log('Current avatar:', user.avatar);
  
  if (user.avatar) {
    // Decode the avatar URL
    try {
      const decodedAvatar = decodeURIComponent(user.avatar);
      console.log('Decoded avatar:', decodedAvatar);
      
      // Update user object
      user.avatar = decodedAvatar;
      localStorage.setItem('user', JSON.stringify(user));
      console.log('✅ Avatar URL fixed!');
      console.log('New avatar URL:', user.avatar);
      
      // Reload page
      console.log('Reloading page...');
      window.location.reload();
    } catch (e) {
      console.error('Error decoding avatar:', e);
    }
  } else {
    console.log('No avatar URL found');
  }
} else {
  console.log('No user found in localStorage');
}
