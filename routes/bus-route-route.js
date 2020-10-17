const express=require('express');
const { addBusRoute, getBusRouteById, getAllRoutes } = require('../controllers/bus-route-controller');

const router=express.Router();

router.get('/get/:rid',getBusRouteById);
router.get('/get-all',getAllRoutes);
router.post('/add',addBusRoute);

module.exports=router;