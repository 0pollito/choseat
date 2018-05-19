var express = require('express');
var router = express.Router();
var clientModel = require('../serv_modules/clientModel');
var userModel = require('../serv_modules/userModel');
var restaurantModel = require('../serv_modules/restaurantModel');

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

router.get('/',function(req,res,next){
  res.redirect('/register');
});
router.get('/new_administradorCount',login,function(req,res,next){
  res.render('admin/users/newAdministrador');
});
router.get('/new_restaurantCount',function(req,res,next){
  res.render('count/newRestaurant');
});
router.get('/new_clientCount',function(req,res,next){
  res.render('count/newClient');
});
// crear nuevo cliente
router.post('/new_clientCount',function(req,res,next){
  var user = req.body.inputEmail;
  userModel.getUser(user,function(eror,data){
    if (typeof data != 'undefined' && data.length > 0) {
      res.render('count/newClient',{alert: "p class=text-danger",text: '* Ya existe un usuario para esa cuenta. :/'});
    }else {
      var clientData = {
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        domicilio: req.body.domicilio,
        telefono: req.body.tel,
        correo: user,
        fecha_nac: req.body.fecha_nac
      };
      var userData = {
        correo: user,
        contrasenia: req.body.password,
        tipo: 'Cliente'
      };
      clientModel.insertClient(clientData,function(error,data) {
        if (data && data.insertId) {
          userModel.insertUser(userData,function(error,data) {
            if (data && data.rowAffected) {
              req.session.user = clientData.nombre+' '+clientData.apellidos;
              req.session.userType = 'Cliente';
              req.session.email = clientData.user;
              res.redirect('/');
            }else {
              console.log('error al insertar user');
              res.redirect('/register');
            }
          });
      }else{
        console.log('error al insertar cliente');
        res.redirect('/register');
      }
      });
    }
    });
});
//Crear nuevo cliete Restaurante,
router.post('/newRestaurant',function(req,res,next){
  var user = req.body.inputEmail;
  userModel.getUser(user,function(eror,data){
    if (typeof data != 'undefined' && data.length > 0) {
      res.render('count/newRestaurant',{alert: "p class=text-danger",text: '* Ya existe un usuario para esa cuenta. :/'});
    }else {
      var restaurantData = {
        nombre: req.body.nombreRestaurant,
        descripcion: req.body.descripcion,
        direccion: req.body.direccion,
        clasificacion: req.body.clasificacion
      };
      var userData = {
        correo: user,
        contrasenia: req.body.password,
        tipo: 'Restaurante'
      };
      restaurantModel.setRestaurant(restaurantData,function(error,data) {
        if (data && data.insertId) {
          console.log(data.insertId);
          var subscriptorData = {
            idRestaurante: data.insertId,
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            domicilio: req.body.domicilio,
            telefono: req.body.tel,
            correo: user,
            fecha_nac: req.body.fecha_nac
          };
          clientModel.insertSubscriptorR(subscriptorData,function(error,data) {
            if (data && data.insertId) {
              userModel.insertUser(userData,function(error,data) {
                if (data && data.rowAffected) {
                  req.session.user = subscriptorData.nombre+' '+subscriptorData.apellidos;
                  req.session.userType = 'Restaurante';
                  res.redirect('/restaurantAdmin/home');
                }else {
                  console.log('error al insertar user');
                  res.redirect('/new_restaurantCount');
                }
              });
            }else{
              console.log('error al insertar Restaurante');
              res.redirect('/new_restaurantCount');
            }
          });
        }else{
        console.log('error al insertar resturante');
        res.redirect('/new_restaurantCount');
        }
      });
    }
  });
});
router.post('/new_administradorCount',login,function(req,res,next){
  var user = req.body.email;
  console.log(user);
  userModel.getUser(user,function(eror,data){
    if (typeof data != 'undefined' && data.length > 0) {
      res.render('count/newClient',{alert: "p class=text-danger",text: '* Ya existe un usuario para esa cuenta. :/'});
    }else {
      var userData = {
        correo: user,
        contrasenia: req.body.password,
        tipo: 'Administrador'
      };
      if(userData.contrasenia == req.body.passwordConfirm){
        userModel.insertUser(userData,function(error,data) {
          if (data && data.rowAffected) {
            req.session.user = userData.user;
            req.session.userType = 'Administrador';
            res.redirect('/admin/users');
          }else {
            console.log('error al insertar usuario');
            res.redirect('/admin/users');
          }
        });
      }else{
        res.render('count/newClient',{alert: "p class=text-danger",text: '* Las contraseñas no coinciden.'});
      }
    }
  });
});

module.exports = router;