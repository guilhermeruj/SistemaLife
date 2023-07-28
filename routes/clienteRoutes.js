const express = require("express");
const router = express.Router();

const ClienteController = require("../controllers/ClienteController");
const { checkAuth } = require("../helpers/auth");

router.get("/indicar", checkAuth, ClienteController.indicar);
router.get("/indicar/:id", checkAuth, ClienteController.indicarPost);
router.get("/perfilcliente/:id", checkAuth, ClienteController.perfilcliente);
router.get("/deletecliente/:id", checkAuth, ClienteController.deletecliente);
router.get("/editcliente/:id", checkAuth, ClienteController.editcliente);

// Aprovação
router.get('/aprovar/:id', checkAuth, ClienteController.aprovarCliente)
router.get('/reprovar/:id', checkAuth, ClienteController.reprovarCliente)

module.exports = router;
