const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
     
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.tokenData = decoded;
    console.log(decoded);
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyToken;