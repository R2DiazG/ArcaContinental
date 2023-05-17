const usuariosController = require('../controllers').usuarios;
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/users', md_auth.auth, usuariosController.create);
    app.post('/api/login', usuariosController.login);
    app.get('/api/usuarios', md_auth.auth, usuariosController.getAll);
    app.delete('/api/usuariosD/:id', md_auth.auth, usuariosController.deleteById);
    app.put('/api/usuariosM/:id', md_auth.auth, usuariosController.modifyById);
    app.get('/api/usuarios/ultimoId', usuariosController.obtenerUltimoId);
}