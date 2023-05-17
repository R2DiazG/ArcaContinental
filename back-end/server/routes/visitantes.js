const visitantesController = require('../controllers').visitantes;
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/visitante', md_auth.auth, visitantesController.create);
    app.put('/api/visitante/:id', md_auth.auth, visitantesController.update);
    app.get('/api/visitantes', visitantesController.getAll);
    app.get('/api/visitantesAdmin', md_auth.auth, visitantesController.getAllAdmin);
    app.get('/api/visitante/:id', visitantesController.getById);
}