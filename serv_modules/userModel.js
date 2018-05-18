
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'us-cdbr-iron-east-04.cleardb.net',
  user: 'b3d4fd7a145baf',
  password: '973fb205',
  database: 'heroku_2231ba38cd78c18',
  port: 3306
});

var userModel = {};

userModel.getUser = function(correo,callback){
  if(connection){
    connection.query('select * from usuario where correo = ?',[correo],function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });

  }
}
userModel.getUsers = function(callback){
  if(connection){
    connection.query('select idUsuario, correo, tipo, activo from usuario',function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });

  }
}
userModel.getClient = function(correo,callback){
  if(connection){
    connection.query('select * from cliente where correo = ?',[correo],function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
} 

userModel.getAdmin = function(email,callback){
  if(connection){
    connection.query('select * from admin where email = ?',[email],function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}
userModel.insertUser = function(userData,callback) {
  if(connection){
    connection.query('insert into usuario set ?',userData,function(error,result) {
      if (error) {
        connection.end();
        throw error;
      }else {
        callback(null,{'rowAffected': result.affectedRows});
      }
    });
  }
}
userModel.updateUser = function(userData,callback){
  if(connection){
    connection.query('update usuario set ? where idUsuario = ?',userData,function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}
userModel.delUser = function(idUser,callback){
  if(connection){
    connection.query('update usuario set activo = 0 where idUsuario = ?',[idUser],function(error,rows){
      if(error){
        connection.end();
        throw error;
      }else{
        callback(null,rows);
      }
    });
  }
}
module.exports = userModel;
