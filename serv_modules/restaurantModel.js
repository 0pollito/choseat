var mysql = require('mysql');
var mysqlPool = mysql.createPool({
  host: 'us-cdbr-iron-east-04.cleardb.net',
  user: 'b3d4fd7a145baf',
  password: '973fb205',
  database: 'heroku_2231ba38cd78c18',
  port: 3306
});

var restaurantModel = {};

restaurantModel.getRestaurants = function(callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('select * from restaurante ',function(error,rows){
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

restaurantModel.getCupons = function(idRestaurante,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query("select DATE_FORMAT(fecha_emision, '%d/%m/%y') as emision,DATE_FORMAT(fecha_vencimiento, '%d/%m/%y') as vigencia, imagen from cupon where idRestaurante = ?",[idRestaurante],function(error,rows){
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

restaurantModel.setCupon = function(cuponData,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('insert into cupon set ? ',cuponData,function(error,rows){
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

restaurantModel.getRestaurantsCat = function(categoria,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('select * from restaurante where clasificacion = ? ',[categoria],function(error,rows){
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

restaurantModel.getRestaurant = function(idRestaurante,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('select * from restaurante where idRestaurante = ? ',[idRestaurante],function(error,rows){
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
restaurantModel.setRestaurant = function(restaurantData,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('insert into restaurante set ? ',restaurantData,function(error,rows){
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
restaurantModel.delRestaurant = function(idRestaurante,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('update restaurante set activo = 0 where idRestaurante =  ?',[idRestaurante],function(error,rows){
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
restaurantModel.updateRestaurant = function(restaurantData,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('update restaurante set ? where idRestaurante = ?',restaurantData,function(error,rows){
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
restaurantModel.updatePhotos = function(photosData,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('update restaurante set ? where idRestaurante = ?',photosData,function(error,rows){
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

module.exports = restaurantModel;
