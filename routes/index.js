var express = require('express');
var router = express.Router();
var userModel = require('../serv_modules/userModel');
var saucerFoodModel = require('../serv_modules/saucerFoodModel');
var restaurantModel = require('../serv_modules/restaurantModel');

/* GET home page public. */
router.get('/', function(req, res, next) {
  res.render('index',{dataP: []});
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

router.get('/search',function(req,res){
  res.redirect('/');
});
router.get('/restaurantProfile',function(req,res){
  saucerFoodAllforRest(res,req,{});
});

function saucerFoodAllforRest(res,req,alert) {
  var idRestaurante = req.body.rest;
  console.log(idRestaurante);
  saucerFoodModel.getSaucerFoodRest(idRestaurante,function(error,data) {
    var dataP = [];
    if (typeof data != 'undefined' && data.length > 0) {
      dataP = data;
      res.render('restaurantview', {dataP: dataP, alert: alert});
    }else{
      res.render('restaurantview', {dataP: dataP, alert: {error: 'No existen registros.'}});
    }
  });
}

function restaurantsCat(res,alert,categoria) {
  restaurantModel.getRestaurantsCat(categoria,function(error,data) {
    if (typeof data != 'undefined' && data.length > 0) {
      res.render('restaurants', {dataR: data, titulo: categoria, alert: alert});
    }else{
      res.render('restaurants', {dataR: [], alert: {error: 'no se encontraron coincidencias'}});
    }
  });
}
router.get('/gour',function(req,res){

  restaurantsCat(res,{},'Restaurante Gourmet');
});
router.get('/desp',function(req,res){
  restaurantsCat(res,{},'Restaurante de especialidad');
});
router.get('/fam',function(req,res){
  restaurantsCat(res,{},'Restaurante familiar');
});
router.get('/buff',function(req,res){
  restaurantsCat(res,{},'Restaurante buffet');
});
router.get('/comra',function(req,res){
  restaurantsCat(res,{},'Restaurante de comida rápida');
});
router.get('/comll',function(req,res){
  restaurantsCat(res,{},'Comida para llevar');
});

router.post('/search',function(req,res){
  saucerFoodModel.getSearch(req.body.search,function(error,data) {
    res.render('index',{dataP: data, message: 'Se encontraron '+data.length+' resultados'});
  });
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
