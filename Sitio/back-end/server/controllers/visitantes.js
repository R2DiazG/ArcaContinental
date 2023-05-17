const { where } = require('sequelize');

const visitantes=require('../models').visitantes;
//const jwt=require('../services/jwt');

function create(req,res){
    var body=req.body;
    visitantes.create(body)
    .then(visitante=>{
        res.status(200).send({visitante});
    })
    .catch(err=>{
        res.status(500).send({message:'Error al crear el visitante',err});
    });
}

function update(req,res){
    var id=req.params.id;
    var body=req.body;

    visitantes.findById(id)
    .then(visitante=>{
        visitante.update(body)
        .then(()=>{
            res.status(200).send({visitante});
        })
        .catch(err=>{
            res.status(500).send({message:'Error al actualizar el visitante',err});
        });
    })
    .catch(err=>{
        res.status(500).send({message:'Error al obtener el visitante',err});
    });
}

function getAll(req,res){
    visitantes.findAll({
        where:{
            activo:true
        },
        order:[
            ['fecha_actual','ASC']
        ]
    })
    .then(visitantes=>{
        /* console.log(visitantes); */
        res.status(200).send({visitantes});
    })
    .catch(err=>{
        res.status(500).send({message:'Error al obtener los visitantes.',err});
    })
}

function getAllAdmin(req,res){
    visitantes.findAll({
        order:[
            ['fecha_actual','ASC']
        ]
    })
    .then(visitantes=>{
        res.status(200).send({visitantes});
    })
    .catch(err=>{
        res.status(500).send({message:'Error al obtener los visitantes como administrador.',err});
    })
}

function getById(req,res){
    var id=req.params.id;
    visitantes.findById(id)
    .then(visitante=>{
        res.status(200).send({visitante});
    })
    .catch(err=>{
        res.status(500).send({message:'Error al obtener el visitante.',err});
    })
}
module.exports={
    create,
    update,
    getAll,
    getAllAdmin,
    getById
}