// const fs = require('fs');
// const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
    message: err.message,
  });
};

// const sendErrorProd = (err, res) => {
//   if (err.isOperational) {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//     });
//   } else {
//     // eslint-disable-next-line
//     console.error('ERROR', err);
//     res.status(500).json({
//       status: 'error',
//       message: 'Something went wrong!',
//     });
//   }
// };

module.exports = (err, req, res, next) => {
  const error = Object.assign(err);
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';
  if (req.file) {
    // fs.unlink(req.file.path, (errorUnlink) => {
    //   if (errorUnlink) {
    //     return next(new AppError(errorUnlink.message, 500));
    //   }
    // });
    console.log('image deleted');
  }
  sendErrorDev(err, res);
  // if (process.env.NODE_ENV === 'development') {
  //   sendErrorDev(err, res);
  // } else if (process.env.NODE_ENV === 'production') {
  //   sendErrorProd(err, res);
  // }
};
