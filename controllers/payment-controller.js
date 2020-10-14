const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Payment = require('../models/payment');
const User = require('../models/user');

const addPayment = async (req, res, next) => {
  const { userId, payhereId, type, amount } = req.body;
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      'something went wrong on the db, when retriving User',
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError('Given user not found', 500);
    return next(error);
  }

  const newPayment = new Payment({
    passengerId: userId,
    type,
    payhereId,
    amount,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newPayment.save({ session: sess });
    user.balance += amount;
    user.paymentHistory.push(newPayment);
    await user.save({ session: sess });
    sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(`Payment failed, please try again ${err}`, 500);
    return next(error);
  }
  res.status(201).json({ payment: newPayment, msg: 'payment successfull' });
};

const getPaymentsByUserId = async (req, res, next) => {
  const {uid} = req.params;
  let user;
  try {
    user =await User.findById(uid).populate('paymentHistory');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong on server side. Please try again later!!',
      500
    );
    return next(error);
  }
  if(!user){
    const error = new HttpError(
        "User not found !!!",
        500
    );
    return next(error);
  }
  res.status(201).json({ payments: user.paymentHistory.map((payment)=>payment.toObject({getters:true})) });
};

const getAllPayments = async (req, res, next) => {
    let payments;    
    try {
      payments =await Payment.find();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong on server side. Please try again later!!',
        500
      );
      return next(error);
    }
    if(!payments){
      const error = new HttpError(
          "0 payments found",
          500
      );
      return next(error);
    }
    res.status(201).json({ payments: payments.map((payment)=>payment.toObject({getters:true})) });
  };

exports.addPayment = addPayment;
exports.getPaymentsByUserId=getPaymentsByUserId;
exports.getAllPayments=getAllPayments;