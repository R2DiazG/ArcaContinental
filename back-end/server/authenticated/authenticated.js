var nJwt = require('njwt');
var config=require('../config/config');
//var config=require('/Users/arturodiaz/Practicas/back-end/server/config/config');
var secret=config.token_secret;

// Middleware para checar si el usuario está autenticado
function auth(req, res, next) {
    console.log(req.headers);
    if (!req.headers.authorization) {
        return res.status(403).send({ message: "No tienes la cabezera de autorización." });
    }
    var token = req.headers.authorization.replace(/['"]+/g,'');
    var payload=nJwt.verify(token,secret,(err,verifiedJwt)=>{
        if(err){
            return res.status(401).send({message:"Token inválido."});
        }else{
            next();
        }
    });
}

module.exports = {
    auth
}