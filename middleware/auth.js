const jwt = require('jsonwebtoken')
const auth = (req, res, next) => {
  try {

    console.log('Authorization Header:', req.header('Authorization'));
    
    const token = req.header('Authorization');
    
    // Define an array of routes that are accessible without authentication
    const publicRoutes = ['/category','/category/:id','/category/:id/products','/api/products/:id']; // Add other public routes as needed
    
    // Check if the requested route is in the publicRoutes array
    if (publicRoutes.includes(req.path)) {
      // If it's a public route, skip authentication and proceed to the route handler
      return next();
    }

    if (!token) {
      return res.status(400).json({ msg: 'Invalid Authentication' });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ msg: 'Token has expired.' });
        }
        return res.status(403).json({ msg: 'Authorization not valid.', err });
      }  
      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = auth