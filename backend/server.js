const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line
  console.log(err.name, err.message);
  // eslint-disable-next-line
  console.log('-----Uncaught Exception. App closing...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const dbUri = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);
mongoose
  .connect(dbUri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    // eslint-disable-next-line
    console.log('-----Database connected');
  })
  .catch((err) => {
    // eslint-disable-next-line
    console.log('-----Database failed', err);
  });

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`-----App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line
  console.log(err.name, err.message);
  // eslint-disable-next-line
  console.log('-----Unhandled Rejection. App closing...');
  server.close(() => {
    process.exit(1);
  });
});
