const express=require('express');

const router=express.Router();
const authController=require('../controllers/auth-controller');
const authValidator=require('../validators/auth-validator');
const validator=require('../validators/index');

router.post('/signup',authValidator.userSignUpValidator,validator.runValidation,authController.signup);
router.post('/login',authValidator.userLoginValidator,validator.runValidation,authController.login);

router.get('/test',((req,res)=>{
    res.status(200).json({
        msg:"we are up!!!"
    });
}));

// router.get('/signout',authController.signout);

router.get('/secret',authController.requireSignIn,authController.managerInfo,(req,res)=>{
    res.json({user:req.user})
}); 

module.exports=router;