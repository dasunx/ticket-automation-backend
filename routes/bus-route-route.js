const express=require('express');
const { addBusRoute, getBusRouteById } = require('../controllers/bus-route-controller');

const router=express.Router();

router.get('/get/:rid',getBusRouteById);
router.post('/add',addBusRoute);

module.exports=router;