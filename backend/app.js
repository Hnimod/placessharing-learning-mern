const express = require('express');
const path = require('path');
const morgan = require('morgan');
const AppError = require('./src/utils/appError');
const errorController = require('./src/controllers/errorController');
const placeRouter = require('./src/routes/placeRoutes');
const userRouter = require('./src/routes/userRoutes');

const app = express();

app.use(express.json());
// app.use(bodyParser.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/api/v1/places', placeRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl}`, 404));
});

app.use(errorController);

module.exports = app;
