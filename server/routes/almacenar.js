/* ******************************************************************* */
// DESCRIPCION:             Este archivo contiene las rutas de la API
//                          para almacenar la ubicación de los productos
//                          
//
// FECHA DE CREACIÓN:       2023-01-23
// FECHA DE MODIFICACIÓN:   2023-03-01
/* ******************************************************************* */
//importamos Router de express
const router = require('express').Router();

//importamos db
const db = require('../db');

//nombre de la tabla 1 Y sus columnas de interes
const TABLA_1 = 'production';
const COLUMNA_1_1 = '"ITEM_NO"';
//nombre de la tabla 2 Y sus columnas de interes
const TABLA_2 = 'layout';
const COLUMNA_2_1 = '"LOCATION"';
//nombre de la tabla 3 Y sus columnas de interes
const TABLA_3 = 'production_layout';

//Rutas de la API
//ruta para obtener los datos de la tabla production dado el noItem ((debe estar en un API aparte)))
router.get('/production/:noItem', (req, res) => {
    const noItem = req.params.noItem;
    db.query('SELECT * FROM '+TABLA_1+' WHERE '+COLUMNA_1_1+' = $1', [noItem], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(result.rows);
            res.send(result.rows);
        }
    });
});

//ruta para obtener los datos de la tabla layout dado el dato location
router.get('/layout/:location', (req, res) => {
    const location = req.params.location;
    db.query('SELECT * FROM '+TABLA_2+' WHERE '+COLUMNA_2_1+' = $1', [location], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(result.rows);
            res.send(result.rows);
        }
    });
});


//ruta para guardar la relacion entre el layout y la produccion, recibe como parametro el location y el noItem
router.post('/almacenar', (req, res) => {
    const location = req.body.location;
    const noItem = req.body.noItem;
    console.log(location, noItem);
    db.query('INSERT INTO '+TABLA_3+' ("LOCATION", "ITEM_NO") VALUES ($1, $2)', [location, noItem], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(result.rows);
            res.send(result.rows);
        }
    });
});


module.exports = router;