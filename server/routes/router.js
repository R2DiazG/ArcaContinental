/* ******************************************************************* */
// DESCRIPCION:             Este archivo es un enrutador para las rutas de
//                          la API
//
// FECHA DE CREACIÓN:       2023-01-23
// FECHA DE MODIFICACIÓN:   2023-03-01
/* ******************************************************************* */
//Importamos el Router
var router = require('express').Router();

//Importamos el archivo startup.js
let startup = require('./startup');
//implementamos startup en el router
router.use('/', startup);

//Importamos el archivo almacenar.js
let almacenar = require('./almacenar');
//implementamos almacenar en el router
router.use('/', almacenar);

//Importamos el archivo inventory_crud.js
let inventory_crud = require('./inventory_crud');
//implementamos inventory_crud en el router
router.use('/', inventory_crud);

//Añadimos una ruta de prueba
router.get('/', function (req, res) {
    res.send('Servidor API Rest Activo');
});

module.exports = router;