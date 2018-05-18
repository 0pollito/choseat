var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'adbRest',
  password: 'Rest.v1',
  database: 'restaurante',
  port: 3306
});

var clientModel = {};

clientModel.getClient = function(idCliente,callback){
  if(connection){
    connection.query('select * from cliente where idCliente = ?',[idCliente],function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}
clientModel.getClients = function(callback){
  if(connection){
    connection.query('select idCliente,nombre,apellidos from cliente ',function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}

clientModel.insertClient = function(clientData,callback) {
  if(connection){
    connection.query('insert into cliente set ?',clientData,function(error,result) {
      if (error) {
        connection.end();
        throw error;
      }else {
        callback(null,{'insertId': result.insertId});
      }
    });
  }
}

clientModel.insertSubscriptorR = function(subscriptorData,callback) {
  if(connection){
    connection.query('insert into subcriptor_restaurante set ?',subscriptorData,function(error,result) {
      if (error) {
        connection.end();
        throw error;
      }else {
        callback(null,{'insertId': result.insertId});
      }
    });
  }
}

module.exports = clientModel;
