// auth.js

import axios from 'axios';

const checkLogin = async () => {
  const token = localStorage.getItem('tokenStore');

  if (token) {
    try {
      const response = await axios.get('/shopper/verify/a', {
        headers: { Authorization: token },
      });

      const isUserLoggedIn = response.data;

      if (!isUserLoggedIn) {
        localStorage.removeItem('tokenStore');
        return false; // User is not logged in
      }

      return true; // User is logged in
    } catch (error) {
      console.error('Error checking login status:', error);
      // Handle error as needed
      return false; // Error occurred while checking login status
    }
  } else {
    return false; // Token not present
  }
};

export default checkLogin;
