var nJwt=require('njwt');
var config=require('../config/config');
var secret=config.token_secret;

exports.createToken=(usuario)=>{
    var params={
        sub:usuario.id,
        usuario:usuario.usuario,
        id_role:usuario.id_role
    }

    var jwt=nJwt.create(params,secret);

    var t=new Date();
    t.setHours(t.getHours()+2);
    jwt.setExpiration(t);

    var token=jwt.compact();
    return token;
}