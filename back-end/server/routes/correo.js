const express = require('express');
const router = express.Router();
const correoController = require('../controllers/correoController');

router.post('/enviar-correo', correoController.enviarCorreo);

module.exports = router;
