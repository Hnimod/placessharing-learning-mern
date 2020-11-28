const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

const checkAuth = catchAsync(async (req, res, next) => {
  if (req.method === 'OPTIONS') return next();
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // eslint-disable-next-line
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Please login to access', 401));
  }
  const decondedData = jwt.verify(token, process.env.JWT_KEY);
  const user = await User.findById(decondedData.data);
  if (!user) {
    return next(new AppError('This user no longer exist', 401));
  }

  req.user = user;
  next();
});

module.exports = checkAuth;
