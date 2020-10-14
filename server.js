const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const HttpError = require('./models/http-error');
const authRoutes = require('./routes/auth-route');
const paymentRoutes=require('./routes/payment-route');
const busRoutes=require('./routes/bus-route');
const busRouteRoutes=require('./routes/bus-route-route');
const journeyRoutes=require('./routes/journey-route');
// db connection
mongoose
  .connect(process.env.DATABASE, { useNewUrlParser: true })
  .then(() => {
    console.log('DB connected!!!');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

// cors error handler
if (process.env.NODE_ENV === 'development') {
  app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
} else {
  app.use(cors());
}
// routes middleware
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/bus',busRoutes);
app.use('/api/bus-route', busRouteRoutes);
app.use('/api/journey',journeyRoutes);
// Error Handler
app.use(() => {
  const error = new HttpError('page not found!', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    // when headers already sent, we can't output a error. because response already sent. so just return next
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ error: error.message || 'An unknown error occurred !!' });
  return next();
});

// port
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server is running on port : ${port}`);
});
