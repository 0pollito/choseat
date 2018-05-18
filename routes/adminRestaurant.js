var express = require('express');
var router = express.Router();
var userModel = require('../serv_modules/userModel');
var restaurantModel = require('../serv_modules/restaurantModel');
var subscriptorModel = require('../serv_modules/subscriptorModel');

//funcion de logeo para el usuario
function login(req,res,next){
  if(req.session.userType == 'Restaurante'){
    next();
  }else if(req.session.userType == 'Administrador'){
      res.redirect('/admin');
  }else
    res.redirect('/login');

};

router.get('/',function(req,res,next){
  res.render('adminRestaurant/home');
});
function profile(req, res, alert) {
  var email = req.session.email;
  email= 'juanito@gmail.com';
  req.session.email = email;
  var dataS = [];
  subscriptorModel.getSubscriptor(email,function(error,data) {
    if (typeof data != 'undefined' && data.length > 0){
      dataS = data[0];
      var categorias = ['Restaurante Gourmet', 
                    'Restaurante de especialidad',
                    'Restaurante familiar',
                    'Restaurante buffet',
                    'Restaurante de comida rápida',
                    'Comida para llevar'];
      restaurantModel.getRestaurant(dataS.idRestaurante,function(error,data){
        if (typeof data != 'undefined' && data.length > 0){
          req.session.restaurante = data[0];
          res.render('adminRestaurant/profile',{dataR: data[0],dataC: categorias,dataS: dataS, alert: alert});
        }
        else
          res.render('adminRestaurant/profile',{dataR: [],dataC: categorias,dataS: dataS, alert: {error: '*No existen registros.'}});
      });
    }else
      res.render('adminRestaurant/profile',{dataR: [],dataC: categorias,dataS: dataS,alert: {error: '* No existen registross'}});
  });  
}
router.get('/profile',function(req,res,next){
  profile(req,res,{});
});

router.post('/update_Restaurant',function(req,res,next){
  var restaurantData =[{nombre: req.body.nombreRestaurant, descripcion: req.body.descripcion, direccion: req.body.direccion,clasificacion: req.body.clasificacion}, req.session.restaurante.idRestaurante];
  restaurantModel.updateRestaurant(restaurantData,function(error,data){
    if (error)
      profile(req,res,{error: 'Ocurrio un error al actualizar el Restaurante'});
    else
      profile(req,res,{success: '*Restaurante Actualizado correctamente'});
  });
});

router.post('/update_subscriptor',function(req,res,next){
  var subcriptorData =[{nombre: req.body.nameUpdate, apellidos: req.body.apellidosUpdate, domicilio: req.body.domicilioUpdate,telefono: req.body.telUpdate,fecha_nac: req.body.fecha_nacUpdate}, req.session.email];
  console.log(subcriptorData);
  subscriptorModel.updateSubscriptor(subcriptorData,function(error,data){
    if (error)
      profile(req,res,{error: 'Ocurrio un error al actualizar el Restaurante'});
    else
      profile(req,res,{success: '*Restaurante Actualizado correctamente'});
  });
});



module.exports = router;
