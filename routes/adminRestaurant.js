var express = require('express');
var router = express.Router();
var userModel = require('../serv_modules/userModel');
var restaurantModel = require('../serv_modules/restaurantModel');
var subscriptorModel = require('../serv_modules/subscriptorModel');
var saucerFoodModel = require('../serv_modules/saucerFoodModel');
var fs = require('fs');
var multer  = require('multer');

//imagenUp server
var storage = multer.diskStorage({
  destination: function(req, file, callback){
      callback(null, "./public/images/users/");
  },
  filename: function(req, file, callback){
      callback(null, Date.now() + file.originalname);
    }
  });
var cupons = multer.diskStorage({
  destination: function(req, file, callback){
      callback(null, "./public/images/cupones/");
  },
  filename: function(req, file, callback){
      callback(null, Date.now() + file.originalname);
    }
  });
//imagenUp server
var platillos = multer.diskStorage({
  destination: function(req, file, callback){
      callback(null, "./public/images/platillos/");
  },
  filename: function(req, file, callback){
      callback(null, Date.now() + file.originalname);
    }
  });
var upload = multer({ storage: storage }).single('imagenUp');
var uploadP = multer({ storage: platillos }).single('imagenUp');
var uploadUpdate = multer({ storage: storage }).single('imagenUpd');
var cuponUp = multer({ storage: cupons }).single('imagenUp');

function isNumber(number) {
  return (/^(\d)+((\.)(\d){1,2})?$/.test(number));
}

//funcion de logeo para el usuario
function login(req,res,next){
  if(req.session.userType === 'Restaurante'){
    next();
  }else if(req.session.userType === 'Administrador'){
    res.redirect('/admin');
  }else if(req.session.userType === 'Cliente'){
     res.redirect('/');
  }else{
    res.redirect('/login');
  }
};

router.get('/',login,function(req,res,next){
  res.redirect('adminRestaurant/profile');
});

router.get('/saucerFoods',login,function(req,res,next){
  saucerFoodAll(res,req,{});
});

router.get('/viewSaucer',login,function(req,res,next){
  saucerVi(res,req,{});
});

router.get('/payments',login,function(req,res,next){
  var idSubscriptor = req.session.subscriptor.idDueño;
  console.log(idSubscriptor);
  subscriptorModel.getPayments(idSubscriptor,function(error,data){
    if (typeof data != 'undefined' && data.length > 0){
      res.render('adminRestaurant/payments',{dataP: data,alert: {}});
    }else{
      res.render('adminRestaurant/payments',{dataP: [],alert: {error: 'No existen registros'}});
    }
  });
});

function saucerFoodAll(res,req,alert) {
  var idRestaurante = req.session.restaurante.idRestaurante;
  saucerFoodModel.getSaucerFoodRest(idRestaurante,function(error,data) {
    var dataP = [];
    if (typeof data != 'undefined' && data.length > 0) {
      dataP = data;
      res.render('adminRestaurant/saucerFood', {dataP: dataP, alert: alert});
    }else{
      res.render('adminRestaurant/saucerFood', {dataP: dataP, alert: {error: 'No existen registros.'}});
    }
  });
}
function saucerVi(res,req,alert) {
  var idRestaurante = req.session.restaurante.idRestaurante;
  saucerFoodModel.getSaucerFoodRest(idRestaurante,function(error,data) {
    var dataP = [];
    if (typeof data != 'undefined' && data.length > 0) {
      dataP = data;
      res.render('adminRestaurant/saucerview', {dataP: dataP, alert: alert});
    }else{
      res.render('adminRestaurant/saucerview', {dataP: dataP, alert: {error: 'No existen registros.'}});
    }
  });
}


//checarr aquii ---------------------------------------------------
function profile(req, res, alert) {
  var email = req.session.email;
  var dataS = [];
  subscriptorModel.getSubscriptor(email,function(error,data) {
    if (typeof data != 'undefined' && data.length > 0){
      dataS = data[0];
      req.session.subscriptor = dataS;
      var categorias = ['Marisqueria', 
                    'Comida Tradicional',
                    'Comida Extranjera',
                    'Comida rápida'];
      restaurantModel.getRestaurant(dataS.idRestaurante,function(error,data){
        if (typeof data != 'undefined' && data.length > 0){
          req.session.restaurante = data[0];
          var dataR = data[0];
          restaurantModel.getPhones(dataS.idRestaurante,function(error,data){
            if (typeof data != 'undefined' && data.length > 0){
              var dataPhones = data;
              restaurantModel.getHours(dataS.idRestaurante,function(error,data){
                console.log(data);
                if (typeof data != 'undefined' && data.length > 0)
                  res.render('adminRestaurant/profile',{dataHours: data,dataPhones: dataPhones,dataR: dataR,dataC: categorias,dataS: dataS, alert: alert});
                else
                  res.render('adminRestaurant/profile',{dataHours:[],dataPhones: dataPhones,dataR: dataR,dataC: categorias,dataS: dataS, alert: alert});
              });
            }else
              res.render('adminRestaurant/profile',{dataHours:[],dataR: dataR,dataPhones: [],dataC: categorias,dataS: dataS, alert: alert});
          });
        }
        else
          res.render('adminRestaurant/profile',{dataHours:[],dataPhones: [],dataR: [],dataC: categorias,dataS: dataS, alert: {error: '*No existen registros.'}});
      });
    }else
      res.render('adminRestaurant/profile',{dataHours:[],dataPhones: [],dataR: [],dataC: categorias,dataS: dataS,alert: {error: '* No existen registross'}});
  });  
}
router.get('/profile',login,function(req,res,next){
  profile(req,res,{});
});

router.get('/cupons',login,function(req,res,next){
  cuponsAll(req,res,{});
});
router.get('/add_cupon',login,function(req,res,next){
  cuponsAll(req,res,{});
});

function cuponsAll(req,res,alert) {
  var idRestaurante = req.session.restaurante.idRestaurante;
  restaurantModel.getCupons(idRestaurante,function(error,data){
    if (typeof data != 'undefined' && data.length > 0)
      res.render('adminRestaurant/cupon',{dataCou: data,alert: alert});
    else
      res.render('adminRestaurant/cupon',{dataCou: [],alert: {error: 'No hay cupones'}});
  });
}

router.post('/add_cupon',login,function(req, res, next){
    var idRestaurante = req.session.restaurante.idRestaurante;
    cuponUp(req, res, function(err) {//subida de imagen
      if(err)  return cuponsAll(res,req,{error: 'Error al subir la imagen'});
       var cuponData = {
          descripcion: 'Desc',
          fecha_vencimiento: req.body.vigencia,
          imagen: req.file.filename,
          idRestaurante: idRestaurante
       };
      restaurantModel.setCupon(cuponData,function(error,data){
        if (error) cuponsAll(req,res,{error: 'Ocurrio un problema al Guardar el nuevo Cupon'});
        if (data && data.affectedRows > 0)
          cuponsAll(req,res,{success: '*Cupon guardado  correctamente'});
        else
          cuponsAll(req,res,{error: '*No se realizó ningun cambio'});
      });
  });
});

router.post('/newTelefono',login,function(req, res, next){
    var idRestaurante = req.session.restaurante.idRestaurante;
    var phoneData = {idRestaurante: idRestaurante,telefono: req.body.tel};
    restaurantModel.setTelefono(phoneData,function(error,data){
        if (error) profile(req,res,{error: 'Ocurrio un problema al Guardar el nuevo Telefono'});
        if (data && data.affectedRows > 0)
          profile(req,res,{success: '*Telefono guardado  correctamente'});
        else
          profile(req,res,{error: '*No se realizó ningun cambio'});
      });
});
router.post('/newHorario',login,function(req, res, next){
    var idRestaurante = req.session.restaurante.idRestaurante;
    var hourData = {dInicio: req.body.diaI,dFin: req.body.diaF,hinicio: req.body.horaI, hfin: req.body.horaF};
    restaurantModel.setHorario(hourData,function(error,data){
        if (error) profile(req,res,{error: 'Ocurrio un problema al Guardar el nuevo horario'});
        if (data && data.insertId) {
          var insertId = data.insertId;
          var hourDataRest = {idHorario: insertId,idRestaurante:idRestaurante};
          restaurantModel.setHorarioRest(hourDataRest,function(error,data){
            if (data && data.affectedRows > 0)
            profile(req,res,{success: '*Horario guardado  correctamente'});
          else
            profile(req,res,{error: '*No se realizó ningun cambio'});
          });
        }
        else
          profile(req,res,{error: '*No se realizó ningun cambio'});
      });
});

router.post('/update_Restaurant',login,function(req,res,next){
  var restaurantData =[{nombre: req.body.nombreRestaurant, descripcion: req.body.descripcion, direccion: req.body.direccion,clasificacion: req.body.clasificacion}, req.session.restaurante.idRestaurante];
  restaurantModel.updateRestaurant(restaurantData,function(error,data){
    if (error)
      profile(req,res,{error: 'Ocurrio un error al actualizar el Restaurante'});
    else
      profile(req,res,{success: '*Restaurante Actualizado correctamente'});
  });
});

router.post('/update_subscriptor',login,function(req,res,next){
  var subcriptorData =[{nombre: req.body.nameUpdate, apellidos: req.body.apellidosUpdate, domicilio: req.body.domicilioUpdate,telefono: req.body.telUpdate,fecha_nac: req.body.fecha_nacUpdate}, req.session.email];
  console.log(subcriptorData);
  subscriptorModel.updateSubscriptor(subcriptorData,function(error,data){
    if (error)
      profile(req,res,{error: 'Ocurrio un error al actualizar el Restaurante'});
    else
      profile(req,res,{success: '*Restaurante Actualizado correctamente'});
  });
});


//new_SaucerFood----------------falta
 
router.post('/update_saucerFood',login,function(req,res,next){
  uploadP(req, res, function(err) {//subida de imagen
    if(err)  return saucerFoodAll(res,req,{error: 'Error al subir la imagen'});
    var precio = req.body.precioUpdate;

      if(!isNumber(precio)){
        fs.unlinkSync(req.file.path, function (err) {
          if(err)
            console.log(err);
          console.log ( "Archivo eliminado correctamente!");
          saucerFoodAll(res,req,{error: '*Los datos para el campo precio no son validos'});
        });
      }else{
        var saucerFoodData =[{nombre: req.body.nameUpdate, 
          descripcion: req.body.descriptionUpdate, 
          estado: req.body.selectEstadoUpd,
          precio: req.body.precio,
          imagen: req.file.filename}, req.body.selectPlatillo];
        saucerFoodModel.updateSaucerFood(saucerFoodData,function(error,data){
          if (error)
            saucerFoodAll(res,req,{error: 'Ocurrio un error al actualizar el Platillo'});
          else
            saucerFoodAll(res,req,{success: '*Platillo Actualizado correctamente'});
        });
      }
  });
});

router.post('/new_SaucerFood',login,function(req, res, next){
    uploadP(req, res, function(err) {//subida de imagen
      if(err)  return saucerFoodAll(res,req,{error: 'Error al subir la imagen'});
      
      var precio = req.body.precio;

      if(!isNumber(precio)){
        fs.unlinkSync(req.file.path, function (err) {
          if(err)
            console.log(err);
          console.log ( "Archivo eliminado correctamente!");
          saucerFoodAll(res,req,{error: '*Los datos para el campo precio no son validos'});
        });
      }else {
          var saucerFoodData = {
            idRestaurante: req.session.restaurante.idRestaurante,
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            estado: req.body.selectEstado,
            precio: req.body.precio,
            imagen: req.file.filename
          };

          saucerFoodModel.setSaucerFood(saucerFoodData,function(error,data){
            if (error) saucerFoodAll(res,{error: 'Ocurrio un problema al insertar el nuevo Platillo'});
            if (data && data.affectedRows > 0)
              saucerFoodAll(res,req,{success: '*Platilo agregado  correctamente'});
            else
              saucerFoodAll(res,req,{error: '*No se realizó ningun cambio'});
          });
        }
    });
  });

router.post('/update_Perfil',login,function(req, res, next){
    uploadUpdate(req, res, function(err) {//subida de imagen
      if(err)  return saucerFoodAll(res,req,{error: 'Error al subir la imagen'});
      var profileData = [{imagenPerfil: req.file.filename},req.session.restaurante.idRestaurante];
      restaurantModel.updatePhotos(profileData,function(error,data){
        if (error) profile(req,res,{error: 'Ocurrio un problema al insertar el nuevo Platillo'});
        if (data && data.affectedRows > 0)
          profile(req,res,{success: '*Imagen de Perfil actualizada  correctamente'});
        else
          profile(req,res,{error: '*No se realizó ningun cambio'});
      });
  });
});
router.post('/update_Portada',login,function(req, res, next){
    upload(req, res, function(err) {//subida de imagen
      if(err)  return saucerFoodAll(res,req,{error: 'Error al subir la imagen'});
      var profileData = [{imagenPortada: req.file.filename},req.session.restaurante.idRestaurante];
      restaurantModel.updatePhotos(profileData,function(error,data){
        if (error) profile(req,res,{error: 'Ocurrio un problema al insertar el nuevo Platillo'});
        if (data && data.affectedRows > 0)
          profile(req,res,{success: '*Imagen de Perfil actualizada  correctamente'});
        else
          profile(req,res,{error: '*No se realizó ningun cambio'});
      });
  });
});







module.exports = router;
