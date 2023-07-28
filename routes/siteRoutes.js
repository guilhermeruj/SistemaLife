const express = require("express");
const router = express.Router();

const siteController = require("../controllers/SiteContoller");

router.get("/operacao", siteController.geraOperacao);
router.get("/geraservicos/:id", siteController.geraServico);
router.get("/geraservicosone/:id", siteController.geraServicosOne);

// Simulação
router.post("/simularApi", siteController.simularApi);
router.get("/simulaTable/:id", siteController.simulaTable);
router.get("/simulaCliente/:id", siteController.simulaCliente)

module.exports = router;
