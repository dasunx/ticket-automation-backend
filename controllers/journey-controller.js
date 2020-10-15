const mongoose = require('mongoose');
const Bus = require('../models/bus');
const HttpError = require('../models/http-error');
const Journey = require('../models/journey');
const User = require('../models/user');

const beginJourney = async ( userId, busId, location, res, next) => {
  
  // check passenger id validity
  let passenger;
  try {
    passenger = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      'something went wrong on the db, when retriving User',
      500
    );
    return next(error);
  }
  if (!passenger) {
    const error = new HttpError('Invalid Smart Card', 500);
    return next(error);
  }
  // bus validity
  let selectedBus;
  try {
    selectedBus = await Bus.findById(busId).populate('route');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong on server side when selecting the given bus',
      500
    );
    return next(error);
  }
  if (!selectedBus) {
    const error = new HttpError('No Bus found for given id', 500);
    return next(error);
  }
  // check that user has enough money
  const maxAmount = selectedBus.route.route.slice(-1)[0].price; // max amount for the jorney
  if (passenger.balance < maxAmount) {
    const error = new HttpError(
      'You do not have enough money to continue the journey, Please top-up your account',
      500
    );
    return next(error);
  }
  // selected place validity
  const selectedPlace = selectedBus.route.route.filter(
    (p) => p.name === location
  )[0]; // check that given place is in the route
  if (!selectedPlace) {
    const error = new HttpError(
      'Selected place not in the route, system fault!!',
      500
    );
    return next(error);
  }
  console.log(selectedPlace);
  // create journey
  const newJourney = new Journey({
    startPlace: selectedPlace.name,
    passengerId: passenger,
    busId: selectedBus,
  });
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newJourney.save({ session: sess });
    passenger.ongoing = true;
    passenger.journey = newJourney._id;
    await passenger.save({ session: sess });
    sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong in server-side, when saving the journey in db',
      500
    );
    return next(error);
  }

  res.status(201).json({ journey: newJourney });
};

const endJourney = async (userId, busId, location, res, next) => {
  
  // check passenger id validity
  let passenger;
  try {
    passenger = await User.findById(userId).populate('journey');
  } catch (err) {
    const error = new HttpError(
      'something went wrong on the db, when retriving User',
      500
    );
    return next(error);
  }
  if (!passenger) {
    const error = new HttpError('Invalid Smart Card', 500);
    return next(error);
  }
  // bus validity
  let selectedBus;
  try {
    selectedBus = await Bus.findById(busId).populate('route');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong on server side when selecting the given bus',
      500
    );
    return next(error);
  }
  if (!selectedBus) {
    const error = new HttpError('No Bus found for given id', 500);
    return next(error);
  }
  // selected place validity
  const selectedPlace = selectedBus.route.route.filter(
    (p) => p.name === location
  )[0]; // check that given place is in the route
  if (!selectedPlace) {
    const error = new HttpError(
      'Selected place not in the route, system fault!',
      500
    );
    return next(error);
  }
  // calculation
  const { startPlace } = passenger.journey;
  const startedPlace = selectedBus.route.route.filter(
    (p) => p.name === startPlace
  )[0];
  const total = Math.abs(selectedPlace.price - startedPlace.price);
  console.log(total);

  // end the journey
  // select the journey
  let currentJourney;
  try {
    currentJourney = await Journey.findById(passenger.journey._id);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong! when selecting the current journey from journey collection',
      500
    );
    return next(error);
  }
  if (!currentJourney) {
    const error = new HttpError('No current journey found!', 500);
    return next(error);
  }
  // update the journey
  currentJourney.endPlace = selectedPlace.name;
  currentJourney.status = false;
  currentJourney.cost = total;
  currentJourney.endTime = Date.now();
  // update the passenger
  passenger.journey = null;
  passenger.ongoing = false;
  passenger.balance -= total;
  // save both of them
  try {
    await currentJourney.save();
    await passenger.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong on db, when saving the both passenger and journey',
      500
    );
    return next(error);
  }
  res.status(201).json({ journey: currentJourney });
};

const journeyStatus = async (req, res, next) => {
  const { userId, busId, location } = req.body;
  // check passenger id validity
  let passenger;
  try {
    passenger = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      'something went wrong on the db, when retriving User',
      500
    );
    return next(error);
  }
  if (!passenger) {
    const error = new HttpError('Invalid Smart Card', 500);
    return next(error);
  }
  const journeyStat = passenger.ongoing;
  if (journeyStat === false) {
    // res.status(201).json({ msg: 'start the journey', status: true });
    beginJourney(userId, busId, location, res, next);
  } else {
    endJourney(userId, busId, location, res, next);
  }
};

exports.beginJourney = beginJourney;
exports.endJourney = endJourney;
exports.journeyStatus = journeyStatus;
