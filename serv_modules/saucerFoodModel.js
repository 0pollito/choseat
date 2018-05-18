var mysql = require('mysql');
var mysqlPool = mysql.createPool({
  host: 'us-cdbr-iron-east-04.cleardb.net',
  user: 'b3d4fd7a145baf',
  password: '973fb205',
  database: 'heroku_2231ba38cd78c18',
  port: 3306
});
var saucerFoodModel = {};

saucerFoodModel.getSaucerFoods = function(callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('select p.idPlatillo, r.idRestaurante, p.nombre, (r.nombre) as nombreRest, p.descripcion, p.estado, p.precio, p.imagen, p.activo from platillo as p inner join restaurante as r on p.idRestaurante = r.idRestaurante',function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        connection.release();
        callback(null,rows);
      }
    });
  });
}
saucerFoodModel.getSearch = function(busqueda,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    //console.log('select * from material where nombre like \'%'+busqueda+'%\' ');
    connection.query('select (p.nombre) as platillo,r.nombre,r.clasificacion,p.imagen,p.precio,p.descripcion from platillo as p inner join restaurante as r on p.idRestaurante=r.idRestaurante where p.descripcion like \'%'+busqueda+'%\' ',function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        connection.release();
        callback(null,rows);
      }
    });
  });
}

saucerFoodModel.getSaucerFood = function(idPlatillo,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('select * from platillo where idPlatillo = ? ',[idPlatillo],function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        connection.release();
        callback(null,rows);
      }
    });
  });
}
saucerFoodModel.getSaucerFoodRest = function(idRestaurante,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('select * from platillo where idRestaurante = ? ',[idRestaurante],function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        connection.release();
        callback(null,rows);
      }
    });
  });
}
saucerFoodModel.setSaucerFood = function(saucerFoodData,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('insert into platillo set ? ',saucerFoodData,function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        connection.release();
        callback(null,rows);
      }
    });
  });
}
saucerFoodModel.delSaucerFood = function(idPlatillo,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('update platillo set activo = 0 where idPlatillo =  ?',[idPlatillo],function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        connection.release();
        callback(null,rows);
      }
    });
  });
}
saucerFoodModel.updateSaucerFood = function(saucerFoodData,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('update platillo set ? where idPlatillo = ?',saucerFoodData,function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        connection.release();
        callback(null,rows);
      }
    });
  });
}

module.exports = saucerFoodModel;
