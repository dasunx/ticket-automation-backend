const express=require('express');
const { beginJourney, endJourney, journeyStatus } = require('../controllers/journey-controller');

const router=express.Router();

router.post('/begin',beginJourney);
router.post('/end',endJourney);
router.get('/stat/:uid',journeyStatus);
module.exports=router;