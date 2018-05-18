var express = require('express');
var router = express.Router();
var userModel = require('../serv_modules/userModel');

//funcion de logeo para el usuario
//funcion de logeo para el usuario
function login(req,res,next){
  if(req.session.userType == 'Administrador'){
    next();
  }else if(req.session.userType == 'Restaurante'){
      res.redirect('/adminRestaurant');
  }else if(req.session.userType == 'Cliente'){
      res.redirect('/');
  }else
      res.redirect('/login');
};

router.get('/',login,function(req,res,next){
  res.render('admin/home');
});
router.get('/count',login,function(req,res,next){
  res.render('admin/countAdmin',{alert: 'mm envio de datos'});
});



module.exports = router;
