const express=require('express');

const { addPayment, getPaymentsByUserId, getAllPayments } = require('../controllers/payment-controller');

const router=express.Router();

router.post('/add-payment',addPayment);
router.get('/by-user-id/:uid',getPaymentsByUserId);
router.get('/all-payments',getAllPayments);// can only be accessed by manager
module.exports=router;