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
