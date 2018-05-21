var express = require('express');
var router = express.Router();
var userModel = require('../serv_modules/userModel');
var saucerFoodModel = require('../serv_modules/saucerFoodModel');
var restaurantModel = require('../serv_modules/restaurantModel');
var clientModel = require('../serv_modules/clientModel');

/* GET home page public. */
router.get('/', function(req, res, next) {
  if (!req.session.clientData)
    req.session.clientData = {};
  clientModel.getComments(function(error,data) {
    res.render('index',{dataP: [], comments: data});
  });
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
  delete req.session.idClient;
  delete req.session.clientData;
  delete req.session.user;
  delete req.session.email;
  res.redirect('/');
});

router.get('/plans',function(req,res){
  res.render('plans');
});
router.get('/about',function(req,res){
  res.render('about');
});

router.get('/search',function(req,res){
  res.redirect('/');
});

router.get('/restaurantProfile',function(req,res,next){
  var idRestaurante = req.query.rest || '';
  if(idRestaurante != '')
    saucerFoodAllforRest(res,idRestaurante,{});
  else
    res.redirect('/');
});

function saucerFoodAllforRest(res,idRestaurante,alert) {
  saucerFoodModel.getSaucerFoodRest(idRestaurante,function(error,data) {
    var dataP = [];
    var dataCou = [];
    var dataPhones = [];
    var dataHours = [];
    if (typeof data != 'undefined' && data.length > 0) {
      dataP = data;
      restaurantModel.getRestaurant(idRestaurante,function(error,data) {
        if (typeof data != 'undefined' && data.length > 0){ 
         var dataR = data[0];
          restaurantModel.getCupons(idRestaurante,function(error,data){
            if (typeof data != 'undefined' && data.length > 0)
              dataCou = data;
            restaurantModel.getPhones(idRestaurante,function(error,data){
              if (typeof data != 'undefined' && data.length > 0)
                dataPhones = data;
              restaurantModel.getHours(idRestaurante,function(error,data){
                if (typeof data != 'undefined' && data.length > 0)
                  dataHours = data;
                res.render('restaurantview', {dataP: dataP,dataR: dataR,dataPhones: dataPhones,dataHours:dataHours, alert: alert});
              });
            });
          });
        }else
          res.render('restaurantview', {dataP: dataP,dataR: {},dataPhones: dataPhones,dataHours:dataHours, alert: alert});
      });
    }else{
      res.render('restaurantview', {dataP: [],dataR: {},dataPhones: dataPhones,dataHours:dataHours, alert: {error: 'No existen registros.'}});
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
router.get('/comida_tradicional',function(req,res){
  restaurantsCat(res,{},'Comida Tradicional');
});
router.get('/comida_rapida',function(req,res){
  restaurantsCat(res,{},'Comida rápida');
});
router.get('/marisqueria',function(req,res){
  restaurantsCat(res,{},'Marisqueria');
});
router.get('/comida_extranjera',function(req,res){
  restaurantsCat(res,{},'Comida Extranjera');
});

router.post('/search',function(req,res){
  var dataP = [];
  saucerFoodModel.getSearch(req.body.search,function(error,data) {
     dataP = data;
    if (!req.session.clientData)
      req.session.clientData = {};
    clientModel.getComments(function(error,data) {
      res.render('index',{dataP: dataP,comments: data, message: 'Se encontraron '+dataP.length+' resultados'});
    });
  });
});

router.post('/comment',function(req,res){
  var commentData = {idCliente: req.session.idClient,texto: req.body.comentario};
  clientModel.addComment(commentData,function(error,data) {
    res.redirect('/');
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
          clientModel.getClientData(req.session.email,function(error,data) {
            req.session.clientData = data[0];
            req.session.idClient = data[0].idCliente;
            if(error) req.session.clientData = {};
            res.redirect('/');
          });
        }
        if(req.session.userType == 'Restaurante'){
          res.redirect('/adminRestaurant/profile');
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
