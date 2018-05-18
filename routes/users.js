var express = require('express');
var router = express.Router();
var userModel = require('../serv_modules/userModel');

router.get('/',function(req,res,next){
  res.render('admin/home');
});

/* GET users listing. */
//-----------Obtener Todos los usuarios-----------------------------------------
function usersAll(res,alert) {
  userModel.getUsers(function(error,data) {
    if (typeof data != 'undefined' && data.length > 0) {
      res.render('admin/users', {dataU: data,alert: alert});
    }else{
      res.render('admin/users', {dataU: [], alert: {error: 'No existen registros'}});
    }
  });
}
router.get('/list',function(req,res,next){
  usersAll(res,{});
});

router.post('/new',function(req,res,next) {
  var userType = req.body.selectUser;
  if(userType == 'Administrador')
    res.redirect('/count/new_administradorCount');
  if(userType == 'Cliente')
    res.redirect('/count/new_clientCount');
  if(userType == 'Restaurante')
    res.redirect('/count/new_restaurantCount');
});
router.get('/new_administradorCount',function(req,res,next){
  res.render('admin/users/newAdministrador');
});
router.get('/new_restaurantCount',function(req,res,next){
  res.render('admin/users/newRestaurant');
});
router.get('/new_clientCount',function(req,res,next){
  res.render('admin/users/newClient');
});

//ocuupan login
router.post('/del_User',function(req, res, next){
    var idUser = req.body.selectDelArt;
    console.log(idUser);
    userModel.delUser(idUser,function(error,data){
      if (data && data.affectedRows > 0)
        usersAll(res,{success: '*Usuario eliminado correctamente'});
      else
        usersAll(res,{error: '*Ocurrio un problema al eliminar el Usuario'});
    });
});
router.post('/update_User',function(req,res,next){
  var userData =[{correo: req.body.emailUpdate, contrasenia: req.body.inputPassword, tipo: req.body.selectUser}, req.body.selectUpdUser];
  userModel.updateUser(userData,function(error,data){
    if (error)
      usersAll(res,{success: 'Ocurrio un error al actualizar el Usuario'});
    else
      usersAll(res,{error: '*Usuario Actualizado correctamente'});
  });
});

module.exports = router;