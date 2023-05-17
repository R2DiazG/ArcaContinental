const usuarios=require('../models').usuarios;
const jwt=require('../services/jwt');

function create(req,res){
    usuarios.create(req.body)
    .then(usuario=>{
        res.status(200).send({usuario});
    })
    .catch(err=>{
        res.status(500).send({message:'Error al crear el usuario',err});
    });
}

function login(req,res){
    usuarios.findOne({
        where:{
            usuario:req.body.usuario,
            password:req.body.password
        }
    })
    .then(usuario=>{
        if(usuario){
            if(req.body.token){
                res.status(200).send({
                    token:jwt.createToken(usuario)
                });
            }else{
                res.status(200).send({
                    usuario:usuario,
                });
            }
        }else{
            res.status(404).send({message:'Usuario o contraseña incorrectos'});
        }
    }).catch(err=>{
        res.status(500).send({message:'Error al iniciar sesión',err});
    });
}

function getAll(req,res){
    usuarios.findAll({
        order:[
            ['id','ASC']
        ]
    })
    .then(usuarios=>{
        res.status(200).send({usuarios});
    })
    .catch(err=>{
        res.status(500).send({message:'Error al obtener los usuarios.',err});
    })
}


function deleteById(req,res){
    var id=req.params.id;
    usuarios.findOne ({
        where:{
            id:id
        }
    })
    .then(usuario=>{
        usuario.destroy()
        .then(()=>{
            res.status(200).send({usuario});
        })
        .catch(err=>{
            res.status(500).send({message:'Error al eliminar el usuario',err});
        });
    })
    .catch(err=>{
        res.status(500).send({message:'Error al obtener el usuario',err});
    });
}

function modifyById(req,res){
    var id=req.params.id;
    var body=req.body;
    
    usuarios.findOne ({
        where:{
            id:id
        }
    })
    .then(usuario=>{
        usuario.update(body)
        .then(()=>{
            res.status(200).send({usuario});
        })
        .catch(err=>{
            res.status(500).send({message:'Error al actualizar el usuario',err});
        });
    })
    .catch(err=>{
        res.status(500).send({message:'Error al obtener el usuario',err});
    });
}

function obtenerUltimoId(req, res) {
    usuarios.max('id')
    .then(ultimoId => {
        res.status(200).json({ ultimoId });
    })
    .catch(err => {
        res.status(500).send({ message: 'Error al obtener el último ID de usuario', err });
    });
}

module.exports={
    create,
    login,
    getAll,
    deleteById,
    modifyById,
    obtenerUltimoId
}