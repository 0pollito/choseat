var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'us-cdbr-iron-east-04.cleardb.net',
  user: 'b3d4fd7a145baf',
  password: '973fb205',
  database: 'heroku_2231ba38cd78c18',
  port: 3306
});

var saucerFoodModel = {};

saucerFoodModel.getSaucerFoods = function(callback){
  if(connection){
    connection.query('select p.idPlatillo, r.idRestaurante, p.nombre, (r.nombre) as nombreRest, p.descripcion, p.estado, p.precio, p.imagen, p.activo from platillo as p inner join restaurante as r on p.idRestaurante = r.idRestaurante',function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}

saucerFoodModel.getSaucerFood = function(idPlatillo,callback){
  if(connection){
    connection.query('select * from platillo where idPlatillo = ? ',[idPlatillo],function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}
saucerFoodModel.setSaucerFood = function(saucerFoodData,callback){
  if(connection){
    connection.query('insert into platillo set ? ',saucerFoodData,function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}
saucerFoodModel.delSaucerFood = function(idPlatillo,callback){
  if(connection){
    connection.query('update platillo set activo = 0 where idPlatillo =  ?',[idPlatillo],function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}
saucerFoodModel.updateSaucerFood = function(saucerFoodData,callback){
  if(connection){
    connection.query('update platillo set ? where idPlatillo = ?',saucerFoodData,function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}

module.exports = saucerFoodModel;
