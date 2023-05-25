/* ******************************************************************* */
// DESCRIPCION:             Este archivo contiene las rutas de la API 
//                          para recuperar la ubicación del layout y los
//                          productos almacenados en cada ubicación
//
// FECHA DE CREACIÓN:       2023-01-23
// FECHA DE MODIFICACIÓN:   2023-02-21
/* ******************************************************************* */
//importamos Router de express
const router = require('express').Router();
//importamos db
const db = require('../db');

const TABLA_1 = 'Layout';

//Rutas de la API
router.get('/startup', (req, res) => {
    db.query('SELECT * FROM ' + TABLA_1, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows);
        }
    });
});

//ruta para recuperar los datos en el stored procedure productslocation
router.get('/productslocation', (req, res) => {
    //se utiliza el stored procedure productslocation en el query
    db.query('SELECT production_layout."ITEM_NO", production_layout."LOCATION", layout."WIDTH", layout."HEIGHT", layout."DEPTH", layout."X", layout."Y", layout."Z", production."ITEM_DESCRIPTION", production."MANUFACTURING_DATE", production."EXPIRATION", production."CATEGORY", production."SIZE" FROM production_layout, layout, production WHERE layout."LOCATION"=production_layout."LOCATION" AND production_layout."ITEM_NO"=production."ITEM_NO"', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows);
        }
    });
});

//ruta para comprobar que la tabla layout existe
router.get('/checktablelayout', (req, res) => {
    //se utiliza el query
    db.query('SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = \'public\' AND table_name = \'layout\')', (err, result) => {
        if (result.rows[0].exists == false) {
            res.send(false);
            console.log("No existe la tabla layout")
            console.log(result.rows);
        } else {
            console.log(result.rows);
            res.send(true);
        }
    });
});

//PARA SET UP
//ruta para insertar rows en la tabla layout
//recibe un json con los datos de la ubicación que son: LOCATION, WIDTH, HEIGHT, DEPTH, X, Y, Z, AISLE, AREA, LEVEL
//ejemplo: {"LOCATION": "A1", "WIDTH": 1, "HEIGHT": 1, "DEPTH": 1, "X": 1, "Y": 1, "Z": 1, "AISLE": 1, "AREA": 1, "LEVEL": 1}
router.post('/insertlayout', (req, res) => {
    //se utiliza el query
    db.query('INSERT INTO layout ("LOCATION", "WIDTH", "HEIGHT", "DEPTH", "X", "Y", "Z", "AISLE", "AREA", "LEVEL") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', 
    [req.body.LOCATION, req.body.WIDTH, req.body.HEIGHT, req.body.DEPTH, req.body.X, req.body.Y, req.body.Z, req.body.AISLE, req.body.AREA, req.body.LEVEL], 
    (err, result) => {
        if (err) {
            console.log(err);
            res.send(false);
        } else {
            res.send(result.rows);
        }
    });
});

// Ruta para recuperar los valores SIZE de la tabla production de acuerdo a un CATEGORY
// Recibe un json con el CATEGORY
// Ejemplo: {"CATEGORY": "Refresco/Gaseosa"}
router.post('/getsize', (req, res) => {
    //se utiliza el query
    db.query('SELECT DISTINCT "SIZE" FROM production WHERE "CATEGORY" = $1', [req.body.CATEGORY], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows);
        }
    });
});

// Ruta para recuperar los valores production de acuerdo a un CATEGORY, un SIZE y que MANUFACTURING_DATE esté entre dos fechas
// Recibe un json con el CATEGORY, SIZE, MANUFACTURING_DATE1 y MANUFACTURING_DATE2
// Ejemplo {"CATEGORY": "Refresco/Gaseosa", "SIZE": "1.5L", "MANUFACTURING_DATE1": "2021-01-01", "MANUFACTURING_DATE2": "2021-12-31"}
router.post('/getproduction', (req, res) => {
    //se utiliza el query
    db.query('SELECT * FROM production WHERE "CATEGORY" = $1 AND "SIZE" = $2 AND "MANUFACTURING_DATE" BETWEEN $3 AND $4', [req.body.CATEGORY, req.body.SIZE, req.body.MANUFACTURING_DATE1, req.body.MANUFACTURING_DATE2], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows);
        }
    });
});



//ruta para crear la tabla layout si no existe
router.get('/createtablelayout', (req, res) => {
    //se utiliza el query
    db.query('DROP TABLE IF EXISTS public.layout; CREATE TABLE IF NOT EXISTS public.layout'
    +'('
        +'"LOCATION" character varying COLLATE pg_catalog."default" NOT NULL,'
        +'"WIDTH" bigint,'
        +'"DEPTH" bigint,'
        +'"HEIGHT" bigint,'
        +'"X" bigint,'
        +'"Y" bigint,'
        +'"Z" bigint,'
        +'"AISLE" character varying COLLATE pg_catalog."default",'
        +'"AREA" character varying COLLATE pg_catalog."default",'
        +'"LEVEL" character varying COLLATE pg_catalog."default",'
        +'CONSTRAINT layout_pkey PRIMARY KEY ("LOCATION")'
    +')',
    (err, result) => {
        if (err) {
            console.log("Error al crear tabla layout:" + err);
            res.send(false);
        } else {
            console.log("Tabla layout creada");
            res.send(true);
        }
    });
});

//ruta para crear la tabla production si no existe
router.get('/createtableproduction', (req, res) => {
    //se utiliza el query
    db.query('CREATE TABLE IF NOT EXISTS public.production'
    +'('
        +'"ITEM_NO" character varying COLLATE pg_catalog."default" NOT NULL,'
        +'"ITEM_DESCRIPTION" character varying COLLATE pg_catalog."default",'
        +'"PACK" character varying COLLATE pg_catalog."default",'
        +'"SIZE" character varying COLLATE pg_catalog."default",'
        +'"ITEM_WGT" character varying COLLATE pg_catalog."default",'
        +'"MANUFACTURING_DATE" character varying COLLATE pg_catalog."default",'
        +'"EXPIRATION" character varying COLLATE pg_catalog."default",'
        +'"CATEGORY" character varying COLLATE pg_catalog."default",'
        +'CONSTRAINT production_pkey PRIMARY KEY ("ITEM_NO")'
    +')',
    (err, result) => {
        if (err) {
            console.log("Error al crear tabla production:" + err);
            res.send(false);
        } else {
            console.log("Tabla production creada");
            res.send(true);
        }
    });
});

//ruta para crear la tabla production_layout si no existe
router.get('/createtableproductionlayout', (req, res) => {
    //se utiliza el query
    db.query('DROP TABLE IF EXISTS public.production_layout; CREATE TABLE IF NOT EXISTS public.production_layout'
    +'('
        +'"ITEM_NO" character varying COLLATE pg_catalog."default" NOT NULL,'
        +'"LOCATION" character varying COLLATE pg_catalog."default" NOT NULL,'
        +'CONSTRAINT production_layout_pkey PRIMARY KEY ("ITEM_NO", "LOCATION"),'
        +'CONSTRAINT "production_layout_ITEM_NO_fkey" FOREIGN KEY ("ITEM_NO")'
        +'REFERENCES public.production ("ITEM_NO") MATCH SIMPLE '
        +'ON UPDATE NO ACTION '
        +'ON DELETE NO ACTION, '
        +'CONSTRAINT "production_layout_LOCATION_fkey" FOREIGN KEY ("LOCATION")'
        +'REFERENCES public.layout ("LOCATION") MATCH SIMPLE '
        +'ON UPDATE NO ACTION '
        +'ON DELETE NO ACTION'
    +')',
    (err, result) => {
        if (err) {
            console.log("Error al crear tabla production_layout:" + err);
            res.send(false);
        } else {
            console.log("Tabla production_layout creada");
            res.send(true);
        }
    });
});

//Ruta para consultar los valores de la tabla Dimension con los campos X_LENGTH, Y_LENGTH, Z_LENGTH
router.get('/getdimension', (req, res) => {
    //se utiliza el query
    db.query('SELECT * FROM "Dimension"', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // Comprobar que el resultados no está vacío, de ser asi enviar datos por default
            if (result.rows.length == 0) {
                db.query('INSERT INTO public."Dimension"("X_LENGHT", "Y_LENGHT", "Z_LENGHT", "ID") VALUES (8, 30, 3, 1)', (err, result) => {   
                    if (err) {
                        console.log(err);
                    } else {

                    }
                });
                res.send({"X_LENGHT": 8, "Y_LENGHT": 30, "Z_LENGHT": 3});
            } else {
            res.send(result.rows[0]);
            }
        }   
    });
});

//Ruta para actualizar los valores de la tabla Dimension con los campos X_LENGTH, Y_LENGTH, Z_LENGTH
router.post('/updatedimension', (req, res) => {
    //se utiliza el query
    db.query('UPDATE public."Dimension" SET "X_LENGHT"= $1, "Y_LENGHT"=$2, "Z_LENGHT"=$3, "ID"=1 WHERE "ID"=1', [req.body.X_LENGTH, req.body.Y_LENGTH, req.body.Z_LENGTH], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows[0]);
        }
    });
});


module.exports = router;