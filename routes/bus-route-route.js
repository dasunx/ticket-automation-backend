const express=require('express');
const { addBusRoute } = require('../controllers/bus-route-controller');

const router=express.Router();

router.post('/add',addBusRoute);

module.exports=router;