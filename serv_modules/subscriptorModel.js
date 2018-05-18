var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'adbRest',
  password: 'Rest.v1',
  database: 'restaurante',
  port: 3306
});

var subscriptorModel = {};

subscriptorModel.getSubscriptors = function(callback){
  if(connection){
    connection.query("select r.idDueño,DATE_FORMAT(r.fecha, '%d/%m/%y') as fecha,r.hora,r.num_personas,DATE_FORMAT(r.vigencia, '%d/%m/%y') as vigencia,re.idRestaurante,(re.nombre) as restaurante, c.idCliente,(c.nombre) as cliente,r.id_cupon,r.estado, r.activo from restaurante re inner join subcriptor_restaurante r on re.idRestaurante=r.idRestaurante inner join cliente c on c.idCliente = r.idCliente",function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}

subscriptorModel.getSubscriptor = function(email,callback){
  if(connection){
    connection.query("select idRestaurante,nombre,apellidos,domicilio,telefono,correo,DATE_FORMAT(fecha_nac, '%d/%m/%y') as fecha_nac from subcriptor_restaurante where correo = ? ",[email],function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}
subscriptorModel.setSubscriptor = function(subscriptorData,callback){
  if(connection){
    connection.query('insert into subcriptor_restaurante set ? ',subscriptorData,function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}
subscriptorModel.delSubscriptor = function(idDueño,callback){
  if(connection){
    connection.query('update subcriptor_restaurante set activo = 0 where idDueño =  ?',[idDueño],function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}
subscriptorModel.updateSubscriptor = function(subscriptorData,callback){
  if(connection){
    connection.query('update subcriptor_restaurante set ? where correo = ?',subscriptorData,function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}

module.exports = subscriptorModel;
