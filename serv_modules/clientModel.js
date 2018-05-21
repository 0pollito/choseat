var mysql = require('mysql');

var mysqlPool = mysql.createPool({
  host: 'us-cdbr-iron-east-04.cleardb.net',
  user: 'b3d4fd7a145baf',
  password: '973fb205',
  database: 'heroku_2231ba38cd78c18',
  port: 3306
});

var clientModel = {};

clientModel.getClient = function(idCliente,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('select * from cliente where idCliente = ?',[idCliente],function(error,rows){
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
clientModel.getCupon = function(idCliente,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query("select c.idCupon,c.descripcion,DATE_FORMAT(c.fecha_emision, '%d/%m/%y') as emision,DATE_FORMAT(c.fecha_vencimiento, '%d/%m/%y') as vencimiento, c.imagen from cupon c left join reservacion r on c.idCupon=r.id_cupon where r.idCliente = ?",[idCliente],function(error,rows){
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
clientModel.getClientData = function(email,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('select * from cliente where correo = ?',[email],function(error,rows){
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


clientModel.getComments = function(callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query("select c.nombre,co.texto,DATE_FORMAT(co.fecha, '%d/%m/%y') as fecha, DATE_FORMAT(co.fecha, '%h:%i') as hora from cliente c inner join comentario co on c.idCliente=co.idCliente",function(error,rows){
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

clientModel.addComment = function(commentData,callback) {
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('insert into comentario set ?',commentData,function(error,result) {
      if (error) {
        connection.release();
        throw error;
      }else {
        connection.release();
        callback(null,{'insertId': result.insertId});
      }
    });
  });
}

clientModel.getClients = function(callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('select idCliente,nombre,apellidos from cliente ',function(error,rows){
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

clientModel.insertClient = function(clientData,callback) {
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('insert into cliente set ?',clientData,function(error,result) {
      if (error) {
        connection.end();
        throw error;
      }else {
        connection.release();
        callback(null,{'insertId': result.insertId});
      }
    });
  });
}

clientModel.insertSubscriptorR = function(subscriptorData,callback) {
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('insert into subcriptor_restaurante set ?',subscriptorData,function(error,result) {
      if (error) {
        connection.end();
        throw error;
      }else {
        connection.release();
        callback(null,{'insertId': result.insertId});
      }
    });
  });
}

module.exports = clientModel;
