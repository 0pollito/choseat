
var mysql = require('mysql');
var mysqlPool = mysql.createPool({
  host: 'us-cdbr-iron-east-04.cleardb.net',
  user: 'b3d4fd7a145baf',
  password: '973fb205',
  database: 'heroku_2231ba38cd78c18',
  port: 3306
});

var userModel = {};

userModel.getUser = function(correo,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err){
      connection.end();
      throw err;
    }
    connection.query('select * from usuario where correo = ?',[correo],function(error,rows){
      if(error){
        connection.end();
        throw error;
      }
      connection.release();
      callback(null,rows);
    });
  });
}
userModel.getUsers = function(callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err){
      connection.end();
      throw err;
    }
    connection.query('select idUsuario, correo, tipo, activo from usuario',function(error,rows){
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
userModel.getClient = function(correo,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err){
      connection.end();
      throw err;
    }
    connection.query('select * from cliente where correo = ?',[correo],function(error,rows){
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

userModel.getAdmin = function(email,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
    connection.query('select * from admin where email = ?',[email],function(error,rows){
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
userModel.insertUser = function(userData,callback) {
  mysqlPool.getConnection(function(err, connection) {
    if(err){
      connection.end();
      throw err;
    }
    connection.query('insert into usuario set ?',userData,function(error,result) {
      if (error) {
        connection.end();
        throw error;
      }else {
        connection.release();
        callback(null,{'rowAffected': result.affectedRows});
      }
    });
  });
}
userModel.updateUser = function(userData,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err){
      connection.end();
      throw err;
    }
    connection.query('update usuario set ? where idUsuario = ?',userData,function(error,rows){
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
userModel.delUser = function(idUser,callback){
  mysqlPool.getConnection(function(err, connection) {
    if(err){
      connection.end();
      throw err;
    }
    connection.query('update usuario set activo = 0 where idUsuario = ?',[idUser],function(error,rows){
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
module.exports = userModel;
