var express = require('express');
var router = express.Router();
var reservationModel = require('../serv_modules/reservationModel');
var restaurantModel = require('../serv_modules/restaurantModel');
var clientModel = require('../serv_modules/clientModel');

function login(req,res,next){
  if(req.session.userType == 'Cliente'){
    next();
  }else if(req.session.userType == 'Restaurante'){
      res.redirect('/adminRestaurant');
  }else if(req.session.userType == 'Administrador'){
      res.redirect('/admin');
  }else
      res.redirect('/login');
};

router.get('/',login,function(req,res,next){
  res.redirect('/');
});

/* GET users listing. */
//-----------Obtener Todos los usuarios-----------------------------------------
function reservationsAll(req,res,alert) {
  var idCliente;
  if(!req.session.clientData.idCliente)
    idCliente = req.session.idClient;
  else
    idCliente = req.session.clientData.idCliente;
  restaurantModel.getRestaurants(function(error,data) {
    if (typeof data != 'undefined' && data.length > 0) {
      var dataRest = data;
      reservationModel.getReservationClient(req.session.clientData.idCliente,function(error,data) {
        if (typeof data != 'undefined' && data.length > 0) {
          res.render('client/reservations', {dataRest: dataRest,dataRs: data,alert: alert});
        }else{
          res.render('client/reservations', {dataRest: dataRest, dataRs: [], alert: {error: 'No has realizado reservaciones'}});
        }
      });
    }else{
      res.render('client/reservations', {dataRest: [],dataRs: [], alert: 'No se encontraron restaurantes.'});
    }
  });
}
router.get('/list',login,function(req,res,next){
  reservationsAll(req,res,{});
});

router.get('/coupons',login,function(req,res,next){
  var idCliente;
  if(!req.session.clientData.idCliente)
    idCliente = req.session.idClient;
  else
    idCliente = req.session.clientData.idCliente;
  restaurantModel.getRestauranRes(idCliente,function(error,data) {
    if (typeof data != 'undefined' && data.length > 0) {
      res.render('client/coupon', {dataCou: data,alert: {}});
    }else{
      res.render('client/coupon', {dataCou: [], alert: {error: 'No cuentas con cupones'}});
    }
  });
});

router.get('/new_Reservation',login,function(req,res,next){
  res.redirect('/client/reservations/list');
});
router.get('/update_Reservation',login,function(req,res,next){
  res.redirect('/client/reservations/list');
});
router.get('/del_Reservation',login,function(req,res,next){
  res.redirect('/client/reservations/list');
});

router.post('/new_Reservation',login,function(req,res,next){
  var idCliente;
  if(!req.session.clientData.idCliente)
    idCliente = req.session.idClient;
  else
    idCliente = req.session.clientData.idCliente;
  var reservationData = {
    fecha: req.body.fecha,
    hora: req.body.hora,
    num_personas: req.body.personas,
    vigencia: req.body.vigencia,
    idCliente: idCliente,
    idRestaurante: req.body.selectRest,
  };
  /*if((req.body.cupon).length > 0)
    reservationData.id_cupon = req.body.cupon; */

  reservationModel.setReservation(reservationData,function(error,data) {
    if (error) reservationsAll(req,res,{error: 'Ocurrio un problema al insertar la nueva Reservación'});
    if (data && data.affectedRows > 0)
      reservationsAll(req,res,{success: '*Reservación agregada  correctamente'});
    else
      reservationsAll(req,res,{error: '*No se realizó ningun cambio'});
  });
});

//ocuupan login
router.post('/del_Reservation',login,function(req, res, next){
    var idReservation = req.body.selectDelRes;
    reservationModel.cancelReservation(idReservation,function(error,data){
      if (data && data.affectedRows > 0)
        reservationsAll(req,res,{success: '*La Reservación se cancelo correctamente'});
      else
        reservationsAll(req,res,{error: '*Ocurrio un problema al cancelar la Reservación'});
    });
});
router.post('/update_Reservation',login,function(req,res,next){
  var idCliente;
  if(!req.session.clientData.idCliente)
    idCliente = req.session.idClient;
  else
    idCliente = req.session.clientData.idCliente;
  var reservationData = {
    fecha: req.body.fechaupdate,
    hora: req.body.horaupdate,
    num_personas: req.body.personasupdate,
    vigencia: req.body.vigenciaupdate,
    idCliente: idCliente,
    idRestaurante: req.body.selectRestupdate
  };

  reservationModel.updateReservation([reservationData,req.body.selectRsupdate],function(error,data){
    if (error)
      reservationsAll(req,res,{success: 'Ocurrio un error al actualizar la Reservación'});
    else
      reservationsAll(req,res,{error: '*Reservación Actualizada correctamente'});
  });
});

module.exports = router;