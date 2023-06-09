const express = require('express');
const bodyParser = require('body-parser');

const app = express();
/* const correoRoutes = require('./routes/correo.js'); */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Añadimos CORS para evitar problemas de acceso de dominios cruzados
var cors = require('cors');
app.use(cors());

// Cabezeras
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Authorization,X-API-KEY,Origin,X-Requested-With,Content-Type,Accept,Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,DELETE');
    res.header('Allow','GET,POST,OPTIONS,PUT,DELETE');
    next();
});

// Rutas
require('./server/routes/usuarios')(app);
require('./server/routes/visitantes')(app);
//Configuramos la instancia app de express
app.use(express.json());

//Importamos el archivo router.js
const router = require('./routes/router');

//Implementamos el router en la aplicación
app.use('/api', router);

app.get('*', (req,res)=>{
    res.status(200).send({message:'Bienvenido a la API del inventario de ARCA–Continental'});
});

module.exports=app; 