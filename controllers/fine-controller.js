const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Payment = require('../models/payment');
const User = require('../models/user');
const Fine = require('../models/fine');
const { use } = require('../routes/bus-route');

const addFine = async (req, res, next) => {
  const { amount, managerId, passengerId } = req.body;
  payFines(passengerId);
  let user;
  try {
    user = await User.findById(passengerId);
    if (!user) {
      const error = new HttpError('Given user not found', 404);
      return next(error);
    }
    let newFine;
    if (user.balance >= amount) {
      newFine = new Fine({
        amount: 0.0,
        paidAmount: amount,
        managerId,
        passengerId,
        paidTime: Date.now(),
        paid: true,
      });
      user.balance -= amount;

      const newPayment = new Payment({
        passengerId,
        type: 'Fine',
        payhereId: 'Fine',
        amount,
      });

      user.paymentHistory.unshift(newPayment);
      await newPayment.save();
    } else {
      if (user.balance > 0) {
        newFine = new Fine({
          amount: amount - user.balance,
          paidAmount: user.balance,
          managerId,
          passengerId,
        });
        user.fineBalance = amount - user.balance;

        const newPayment = new Payment({
          passengerId,
          type: 'Fine',
          payhereId: 'Fine',
          amount: Number(user.balance),
        });
        user.paymentHistory.unshift(newPayment);
        await newPayment.save();
        user.balance -= user.balance;
      } else {
        newFine = new Fine({ amount, passengerId, managerId });
        user.fineBalance += amount;
      }
    }

    user.fineHistory.unshift(newFine);
    await newFine.save();
    await user.save();
    res.status(201).json({ fine: newFine, msg: 'fine added successfully' });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Something went wrong on server side. Please try again later!!',
      500
    );
    return next(error);
  }
};

const payFines = async (userId, amount) => {
  try {
    let user = await User.findById(userId);
    if (!user) {
      return amount;
    }
    console.log('paying fines');
    const userAllFines = await Fine.find({ passengerId: userId });
    const unPaidFines = userAllFines.filter((fine) => fine.paid == false);
    if (unPaidFines.length > 0) {
      for (i = 0; i < unPaidFines.length; i++) {
        let fine = unPaidFines[i];
        if (amount == 0) {
          break;
        }
        if (fine.amount <= amount) {
          amount -= fine.amount;

          fine.paidAmount += fine.amount;
          fine.amount = 0.0;
          fine.paid = true;
          fine.paidTime = Date.now();
          user.fineBalance -= fine.amount;
          await user.save();
          await fine.save();
        } else {
          fine.amount -= amount;
          fine.paidAmount += amount;
          user.fineBalance -= amount;
          amount -= amount;
          await user.save();
          await fine.save();
          break;
        }
      }
    }

    return amount;
  } catch (error) {
    console.log(error);
    return amount;
  }
};

exports.addFine = addFine;
exports.payFines = payFines;
