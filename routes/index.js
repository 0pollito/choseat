var express = require('express');
var router = express.Router();
var userModel = require('../serv_modules/userModel');

/* GET home page public. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('session/login');
});
router.get('/recovery', function(req, res, next) {
  res.render('session/recovery');
});
router.get('/authenticate', function(req, res, next) {
  res.redirect('/login');
});
router.get('/register', function(req, res, next) {
  res.render('session/register');
});
router.get('/logout',function(req,res){
  delete req.session.userType;
  res.redirect('/');
});

//post login :: receive user and password for authenticate
router.post('/authenticate', function(req, res, next){
  var email = req.body.inputEmail;
  var password = req.body.inputPassword;

  userModel.getUser(email,function(eror,data){
    if (typeof data != 'undefined' && data.length > 0) {
      if (password == data[0].contrasenia){
        req.session.user = data[0].nombre + ' '+data[0].apellidos;
        req.session.email = email;
        req.session.userType = data[0].tipo;
        if(req.session.userType == 'Administrador'){
          res.redirect('/admin');
        }
        if(req.session.userType == 'Cliente'){
          res.redirect('/');
        }
        if(req.session.userType == 'Restaurante'){
          res.redirect('/adminRestaurant');
        }
      }else{
        res.render('session/login',{alertToast: '*Email o Contraseña incorrecta'});
      }
    }else{
      res.render('session/login',{alertToast: '*El usuario no existe'});
    }
  });
});



module.exports = router;
