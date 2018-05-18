var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'adbRest',
  password: 'Rest.v1',
  database: 'restaurante',
  port: 3306
});

var reservationModel = {};

reservationModel.getReservations = function(callback){
  if(connection){
    connection.query("select r.idReservacion,DATE_FORMAT(r.fecha, '%d/%m/%y') as fecha,r.hora,r.num_personas,DATE_FORMAT(r.vigencia, '%d/%m/%y') as vigencia,re.idRestaurante,(re.nombre) as restaurante, c.idCliente,(c.nombre) as cliente,r.id_cupon,r.estado, r.activo from restaurante re inner join reservacion r on re.idRestaurante=r.idRestaurante inner join cliente c on c.idCliente = r.idCliente",function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}

reservationModel.getReservation = function(idReservacion,callback){
  if(connection){
    connection.query('select * from reservacion where idReservacion = ? ',[idReservacion],function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}
reservationModel.setReservation = function(reservationData,callback){
  if(connection){
    connection.query('insert into reservacion set ? ',reservationData,function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}
reservationModel.delReservation = function(idReservacion,callback){
  if(connection){
    connection.query('update reservacion set activo = 0 where idReservacion =  ?',[idReservacion],function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}
reservationModel.updateReservation = function(reservationData,callback){
  if(connection){
    connection.query('update reservacion set ? where idReservacion = ?',reservationData,function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}

module.exports = reservationModel;
