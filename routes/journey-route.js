const express=require('express');
const { beginJourney, endJourney, journeyStatus, getAllJourneys } = require('../controllers/journey-controller');

const router=express.Router();

router.post('/begin',beginJourney);
router.post('/end',endJourney);
router.post('/stat',journeyStatus);
router.get('/get-all',getAllJourneys);
module.exports=router;