const express=require('express');
const { busSignup, busLogin } = require('../controllers/bus-controller');

const router=express.Router();


router.post('/signup',busSignup);
router.post('/login',busLogin);

router.get('/test',((req,res)=>{
    res.status(200).json({
        msg:"we are up!!!"
    });
}));


module.exports=router;