var express = require('express');
var router = express.Router();
var userModel = require('../serv_modules/userModel');

//funcion de logeo para el usuario
function login(req,res,next){
  if(req.session.userType == 'Administrador'){
    next();
  }else{
      res.redirect('/login');
  }
};

router.get('/',function(req,res,next){
  res.render('admin/home');
});
router.get('/count',function(req,res,next){
  res.render('admin/countAdmin',{alert: 'mm envio de datos'});
});



module.exports = router;
