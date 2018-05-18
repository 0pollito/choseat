var express = require('express');
var router = express.Router();
var reservationModel = require('../serv_modules/reservationModel');
var clientModel = require('../serv_modules/clientModel');
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
  res.redirect('/admin/reservations/list');
});
router.get('/new_Reservation',login,function(req,res,next){
  res.redirect('/admin/reservations/list');
});
router.get('/update_Reservation',login,function(req,res,next){
  res.redirect('/admin/reservations/list');
});
router.get('/del_Reservation',login,function(req,res,next){
  res.redirect('/admin/reservations/list');
});

function reservationsAll(res,alert) {
  clientModel.getClients(function(error,data) {
    var dataC = [];
    if (typeof data != 'undefined' && data.length > 0) {
      dataC = data;
      console.log(dataC);
      restaurantModel.getRestaurants(function(error,data){
        var dataRest = [];
        if (typeof data != 'undefined' && data.length > 0) {
          dataRest = data;
          reservationModel.getReservations(function(error,data){
            if (typeof data != 'undefined' && data.length > 0) {
              res.render('admin/reservations', {dataR: data, dataRest: dataRest,dataC: dataC,alert: alert});
            }else
              res.render('admin/reservations', {dataR: [],dataRest: dataRest,dataC: dataC, alert: {error: 'No existen registros.'}});
          });
        }else
          res.render('admin/reservations', {dataR: [],dataRest: dataRest,dataC: dataC, alert: {error: 'No existen registros.'}});
      });
    }else{
      res.render('admin/reservations', {dataR: [],dataRest: [], dataC: dataC,alert: {error: 'No existen registros.'}});
    }
  });
}
router.get('/list',login,function(req,res,next){
  reservationsAll(res,{});
});

router.post('/new_Reservation',login,function(req,res,next){
  var reservationData = {
    fecha: req.body.fecha,
    hora: req.body.hora,
    num_personas: req.body.personas,
    vigencia: req.body.vigencia,
    idCliente: req.body.selectCliente,
    idRestaurante: req.body.selectRest,
    estado: req.body.selectEstado
  };
  if((req.body.cupon).length > 0)
    reservationData.id_cupon = req.body.cupon;

  reservationModel.setReservation(reservationData,function(error,data) {
    if (error) reservationsAll(res,{error: 'Ocurrio un problema al insertar la nueva Reservación'});
    if (data && data.affectedRows > 0)
      reservationsAll(res,{success: '*Reservación agregada  correctamente'});
    else
      reservationsAll(res,{error: '*No se realizó ningun cambio'});
  });
});

//ocuupan login
router.post('/del_Reservation',login,function(req, res, next){
    var idReservation = req.body.selectDelRes;
    reservationModel.delReservation(idReservation,function(error,data){
      if (data && data.affectedRows > 0)
        reservationsAll(res,{success: '*La Reservación se eliminado correctamente'});
      else
        reservationsAll(res,{error: '*Ocurrio un problema al eliminar la Reservación'});
    });
});
router.post('/update_Reservation',login,function(req,res,next){
  var reservationData = {
    fecha: req.body.fechaupdate,
    hora: req.body.horaupdate,
    num_personas: req.body.personasupdate,
    vigencia: req.body.vigenciaupdate,
    idCliente: req.body.selectClienteupdate,
    idRestaurante: req.body.selectRestupdate,
    estado: req.body.selectEstadoupdate
  };
  if((req.body.cuponupdate).length > 0)
    reservationData.id_cupon = req.body.cuponupdate;

  reservationModel.updateReservation([reservationData,req.body.selectResupdate],function(error,data){
    if (error)
      reservationsAll(res,{success: 'Ocurrio un error al actualizar la Reservación'});
    else
      reservationsAll(res,{error: '*Reservación Actualizada correctamente'});
  });
});

module.exports = router;