var mysql = require('mysql');
var mysqlPool = mysql.createPool({
  host: 'us-cdbr-iron-east-04.cleardb.net',
  user: 'b3d4fd7a145baf',
  password: '973fb205',
  database: 'heroku_2231ba38cd78c18',
  port: 3306
});
var reservationModel = {};

reservationModel.getReservations = function(callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query("select r.idReservacion,DATE_FORMAT(r.fecha, '%d/%m/%y') as fecha,r.hora,r.num_personas,DATE_FORMAT(r.vigencia, '%d/%m/%y') as vigencia,re.idRestaurante,(re.nombre) as restaurante, c.idCliente,(c.nombre) as cliente,r.id_cupon,r.estado, r.activo from restaurante re inner join reservacion r on re.idRestaurante=r.idRestaurante inner join cliente c on c.idCliente = r.idCliente",function(error,rows){
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
reservationModel.getReservationClient = function(idClient,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query("select r.idReservacion,res.nombre,DATE_FORMAT(r.fecha, '%d/%m/%y') as fecha, DATE_FORMAT(r.hora, '%h:%i') as hora, r.num_personas, DATE_FORMAT(r.vigencia, '%d/%m/%y') as vigencia, r.id_cupon, r.estado from reservacion r inner join restaurante res on r.idRestaurante=res.idRestaurante where r.activo= 1 and r.idCliente = ?",[idClient],function(error,rows){
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
reservationModel.getReservation = function(idReservacion,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('select * from reservacion where idReservacion = ? ',[idReservacion],function(error,rows){
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
reservationModel.setReservation = function(reservationData,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('insert into reservacion set ? ',reservationData,function(error,rows){
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

reservationModel.delReservation = function(idReservacion,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('update reservacion set activo = 0 where idReservacion =  ?',[idReservacion],function(error,rows){
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
reservationModel.updateReservation = function(reservationData,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('update reservacion set ? where idReservacion = ?',reservationData,function(error,rows){
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

module.exports = reservationModel;
