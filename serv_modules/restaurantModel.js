var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'us-cdbr-iron-east-04.cleardb.net',
  user: 'b3d4fd7a145baf',
  password: '973fb205',
  database: 'heroku_2231ba38cd78c18',
  port: 3306
});

var restaurantModel = {};

restaurantModel.getRestaurants = function(callback){
  if(connection){
    connection.query('select * from restaurante ',function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}

restaurantModel.getRestaurantsCat = function(categoria,callback){
  if(connection){
    connection.query('select * from restaurante where clasificacion = ? ',[categoria],function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}

restaurantModel.getRestaurant = function(idRestaurante,callback){
  if(connection){
    connection.query('select * from restaurante where idRestaurante = ? ',[idRestaurante],function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}
restaurantModel.setRestaurant = function(restaurantData,callback){
  if(connection){
    connection.query('insert into restaurante set ? ',restaurantData,function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}
restaurantModel.delRestaurant = function(idRestaurante,callback){
  if(connection){
    connection.query('update restaurante set activo = 0 where idRestaurante =  ?',[idRestaurante],function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}
restaurantModel.updateRestaurant = function(restaurantData,callback){
  if(connection){
    connection.query('update restaurante set ? where idRestaurante = ?',restaurantData,function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}
restaurantModel.updatePhotos = function(photosData,callback){
  if(connection){
    connection.query('update restaurante set ? where idRestaurante = ?',restaurantData,function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}

module.exports = restaurantModel;
