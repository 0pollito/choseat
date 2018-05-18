var express = require('express');
var router = express.Router();
var saucerFoodModel = require('../serv_modules/saucerFoodModel');
var restaurantModel = require('../serv_modules/restaurantModel');
var fs = require('fs');
var multer  = require('multer');

//imagenUp server
var storage = multer.diskStorage({
  destination: function(req, file, callback){
      callback(null, "./public/images/platillos/");
  },
  filename: function(req, file, callback){
      callback(null, Date.now() + file.originalname);
    }
  });
var upload = multer({ storage: storage }).single('imagenUp');
var uploadUpdate = multer({ storage: storage }).single('imagenUpd');

function isNumber(number) {
  return (/^(\d)+((\.)(\d){1,2})?$/.test(number));
}

router.get('/',function(req,res,next){
  res.redirect('/admin/saucerFoods/list');
});

function saucerFoodAll(res,alert) {
  saucerFoodModel.getSaucerFoods(function(error,data) {
    var dataP = [];
    if (typeof data != 'undefined' && data.length > 0) {
      dataP = data;
      restaurantModel.getRestaurants(function(error,data){
        if (typeof data != 'undefined' && data.length > 0) {
          res.render('admin/saucerFood', {dataP: dataP, dataR: data,alert: alert});
        }else
          res.render('admin/saucerFood', {dataP: dataP,dataR: [], alert: {error: 'No existen registros.'}});
      });
    }else{
      res.render('admin/saucerFood', {dataP: dataP, dataR: [], alert: {error: 'No existen registros.'}});
    }
  });
}
router.get('/list',function(req,res,next){
  saucerFoodAll(res,{});
});
router.get('/new_SaucerFood',function(req,res,next){
  res.redirect('/admin/saucerFoods');
});
router.get('/update_SaucerFood',function(req,res,next){
  res.redirect('/admin/saucerFoods');
});
router.get('/del_SaucerFood',function(req,res,next){
  res.redirect('/admin/saucerFoods');
});

//ocuupan login
router.post('/new_SaucerFood',function(req, res, next){
    upload(req, res, function(err) {//subida de imagen
    if(err)  return saucerFoodAll(res,{error: 'Error al subir la imagen'});
    
    var precio = req.body.precio;

    if(!isNumber(precio)){
      fs.unlinkSync(req.file.path, function (err) {
        if(err)
          console.log(err);
        console.log ( "Archivo eliminado correctamente!");
        saucerFoodAll(res,{error: '*Los datos para el campo precio no son validos'});
      });
    }else {
        var saucerFoodData = {
          idRestaurante: req.body.selectRest,
          nombre: req.body.nombre,
          descripcion: req.body.descripcion,
          estado: req.body.selectEstado,
          precio: req.body.precio,
          imagen: req.file.filename
        }

        saucerFoodModel.setSaucerFood(saucerFoodData,function(error,data){
          if (error) saucerFoodAll(res,{error: 'Ocurrio un problema al insertar el nuevo Platillo'});
          if (data && data.affectedRows > 0)
            saucerFoodAll(res,{success: '*Platilo agregado  correctamente'});
          else
            saucerFoodAll(res,{error: '*No se realizó ningun cambio'});
        });
      }
    });
  });


//ocuupan login
router.post('/del_SaucerFood',function(req, res, next){
    var idSaucerFood = req.body.selectDelRest;
    saucerFoodModel.delSaucerFood(idSaucerFood,function(error,data){
      if (data && data.affectedRows > 0)
        saucerFoodAll(res,{success: '*Platillo eliminado correctamente'});
      else
        saucerFoodAll(res,{error: '*Ocurrio un problema al eliminar el Platillo'});
    });
});

router.post('/update_SaucerFood',function(req,res,next){
  uploadUpdate(req, res, function(err) {//subida de imagen
    if(err)  return saucerFoodAll(res,{error: 'Error al subir la imagen'});
    
    var precio = req.body.precioUpdate;

    if(!isNumber(precio)){
      fs.unlinkSync(req.file.path, function (err) {
        if(err)
          console.log(err);
        console.log ( "Archivo eliminado correctamente!");
        saucerFoodAll(res,{error: '*Los datos para el campo precio no son validos'});
      });
    }else {
        var saucerFoodData = [{
          idRestaurante: req.body.selectUpdRest,
          nombre: req.body.nameUpdate,
          descripcion: req.body.descriptionUpdate,
          estado: req.body.selectEstadoUpd,
          precio: req.body.precioUpdate,
          imagen: req.file.filename
        }, req.body.selectPlatillo];

        saucerFoodModel.updateSaucerFood(saucerFoodData,function(error,data){
          if (error) saucerFoodAll(res,{error: 'Ocurrio un problema al actualizar el Platillo'});
          if (data && data.affectedRows > 0)
            saucerFoodAll(res,{success: '*Platillo actualizado  correctamente'});
          else
            saucerFoodAll(res,{error: '*No se realizó ningun cambio'});
        });
      }
    });
});



module.exports = router;