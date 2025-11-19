// server/middleware/auth.js

// A simple middleware template
module.exports = (req, res, next) => {
  try {
    // Example: you can check headers or tokens here
    console.log('Auth middleware triggered');

    // For now, allow all requests
    // Later, you can add real authentication logic
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};
