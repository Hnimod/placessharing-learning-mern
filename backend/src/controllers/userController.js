const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

const signToken = (data) => {
  return jwt.sign({ data }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      result: users.length,
      users,
    },
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return next(new AppError('Email already taken', 409));
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({
    name,
    email,
    image: req.file.location,
    password: hashedPassword,
    places: [],
  });
  await newUser.save();

  const token = signToken(newUser.id);
  newUser.password = undefined;
  res.status(201).json({
    status: 'success',
    token,
    data: { user: newUser },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  let isEqual = null;
  if (user) {
    isEqual = await bcrypt.compare(password, user.password);
  }
  if (!user || !isEqual) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(user.id);
  user.password = undefined;
  res.status(200).json({
    status: 'success',
    token,
    data: { user },
  });
});
