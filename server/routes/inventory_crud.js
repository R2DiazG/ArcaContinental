/* ******************************************************************* */
// DESCRIPCION:             Este archivo contiene las rutas de la API
//                          para eliminar y editar la ubicación de los productos
//                          
//
// FECHA DE CREACIÓN:       2023-03-01
// FECHA DE MODIFICACIÓN:   2023-03-01
/* ******************************************************************* */

//importamos Router de express
const router = require('express').Router();
//importamos db
const db = require('../db');

const TABLA_1 = 'production_layout';
const TABLA_2 = 'layout';
const TABLA_3 = 'production';

//ruta para eliminar la relacion entre el layout y la produccion, recibe como parametro elnoItem
router.delete('/eliminar', (req, res) => {
    const noItem = req.body.noItem;
    console.log(noItem);
    db.query('DELETE FROM '+TABLA_1+' WHERE "ITEM_NO" = $1', [noItem], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows);
        }
    });
});

//ruta para editar la relacion entre el layout y la produccion, recibe como parametro el location, el noItem y el nuevo location
router.put('/editar', (req, res) => {
    const noItem = req.body.noItem;
    const newLocation = req.body.newLocation;
    console.log(noItem, newLocation);
    db.query('UPDATE '+TABLA_1+' SET "LOCATION" = $1 WHERE "ITEM_NO" = $2', [newLocation, noItem], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows);
        }
    });
});

// Ruta para comprobar si el location existe dado el dato location
router.get('/layout/:location', (req, res) => {
    const location = req.params.location;
    db.query('SELECT * FROM '+TABLA_2+' WHERE "LOCATION" = $1', [location], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows);
        }
    });
});

// Ruta para comprobar si la location ya esta ocupada por otro producto dado el dato location
router.get('/layout_disponibility/:location', (req, res) => {
    const location = req.params.location;
    db.query('SELECT * FROM '+TABLA_1+' WHERE "LOCATION" = $1', [location], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows);
        }
    });
});

module.exports = router;