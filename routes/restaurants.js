var express = require('express');
var router = express.Router();
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

router.get('/',login,function(req,res,next){
  res.redirect('/admin/restaurants/list');
});

function restaurantsAll(res,alert) {
  restaurantModel.getRestaurants(function(error,data) {
    if (typeof data != 'undefined' && data.length > 0) {
      res.render('admin/restaurants', {dataR: data, alert: alert});
    }else{
      res.render('admin/restaurants', {dataR: [], alert: alert});
    }
  });
}
router.get('/list',login,function(req,res,next){
  restaurantsAll(res,{});
});

router.get('/update_Restaurant',login,function(req,res,next){
  res.redirect('/admin/restaurants/list');
});

router.get('/del_Restaurant',login,function(req,res,next){
  res.redirect('/admin/restaurants/list');
});


//ocuupan login
router.post('/del_Restaurant',login,function(req, res, next){
    var idRestaurant = req.body.selectDelRest;
    console.log(idRestaurant);
    restaurantModel.delRestaurant(idRestaurant,function(error,data){
      if (data && data.affectedRows > 0)
        restaurantsAll(res,{success: '*Usuario eliminado correctamente'});
      else
        restaurantsAll(res,{error: '*Ocurrio un problema al eliminar el Usuario'});
    });
});

router.post('/update_Restaurant',login,function(req,res,next){
  var restaurantData =[{nombre: req.body.nameUpdate, descripcion: req.body.descriptionUpdate, direccion: req.body.direccionUpdate,clasificacion: req.body.clasificacion}, req.body.selectUpdRest];
  restaurantModel.updateRestaurant(restaurantData,function(error,data){
    if (error)
      restaurantsAll(res,{error: 'Ocurrio un error al actualizar el Restaurante'});
    else
      restaurantsAll(res,{success: '*Restaurante Actualizado correctamente'});
  });
});



module.exports = router;