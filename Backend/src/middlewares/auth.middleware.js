const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistToken.model');

const authUserMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // check if token is blacklisted
  const isBlacklisted = await blacklistTokenModel.findOne({ token });
  if (isBlacklisted) {
    return res.status(401).json({ message: 'Token is invalid' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authUserMiddleware;
