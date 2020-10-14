const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt'); // to protect routes by checking tokens validity.

const HttpError = require('../models/http-error');
const Bus = require('../models/bus');
const BusRoute = require('../models/bus-route');

const signup = async (req, res, next) => {
  const { regNo, password, routeId } = req.body;
  let bus;
  try {
    bus = await Bus.findOne({ regNo: regNo });
  } catch (err) {
    const error = new HttpError('something went wrong on the db', 500);
    return next(error);
  }

  if (bus) {
    return res.status(400).json({
      error: 'This bus has already registered in the system. Please Login.',
    });
  }
  let route;
  try {
    route =await BusRoute.findById( routeId);
  } catch (err) {
    const error = new HttpError(
      'something went wrong on the db, when finding the give route name',
      500
    );
    return next(error);
  }
  if (!route) {
    const error = new HttpError('Route not found', 500);
    return next(error);
  }
  const newBus = new Bus({
    regNo,
    password,
    route,
  });
  try {
    await newBus.save();
  } catch (err) {
    const error = new HttpError(
      'something went wrong, when saving the bus in the db',
      500
    );
    return next(error);
  }
  let token;
  try {
    token = jwt.sign({ _id: newBus._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    // generate a cookie with the token
    res.cookie('token', token, { expiresIn: '1h' });
    // send user details and token to the front end
  } catch (err) {
    const error = new HttpError(
      `sigining up faild, token creation error!+${err}`,
      500
    );
    return next(error);
  }
  const { _id} = newBus;
  return res.json({
    token,
    bus: { _id, route, regNo }
  });
};

const login = async (req, res, next) => {
  const { regNo, password } = req.body;
  let bus;
  try {
    bus = await Bus.findOne({ regNo: regNo });
  } catch (err) {
    const error = new HttpError('Something went wrong on server side', 500);
    return next(error);
  }
  if (!bus) {
    const error = new HttpError('Bus does not exsists! Sign up instead.', 500);
    return next(error);
  }
  // Authentication
  if (!bus.authenticate(password)) {
    return res.status(400).json({
      error: { msg: 'email and password do not match' },
    });
  }
  // generate a token
  const token = jwt.sign({ _id: bus._id }, process.env.JWT_SECRET, {
    expiresIn: '10h',
  });
  // generate a cookie with the token
  res.cookie('token', token, { expiresIn: '10h' });
  // send user details and token to the front end
  const { _id, route } = bus;

  return res.json({
    token,
    bus: { _id, route, regNo }
  });
};



/*
 * Checks the token validity
 * We can use this to protect routes which only meant to access by loggedIn users.
 * This also has the user id, because when we generate the token we added the user id.
 */
const requireBusSignIn = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
});

exports.busSignup = signup;
exports.busLogin = login;
exports.requireBusSignIn = requireBusSignIn;

