const express = require("express");
const router = express.Router();

const SilifeController = require("../controllers/SilifeController");
const { checkAuth } = require("../helpers/auth");

router.get("/clientes", checkAuth, SilifeController.clientes);

router.post("/cadTipoPost", checkAuth, SilifeController.cadTipoPost);

//Listar altera e apaga os Servicos
router.get("/listaservicos", checkAuth, SilifeController.listaservicos);
router.get("/listarservicos/", checkAuth, SilifeController.listarServicoId);
router.get("/listarServico/:id", checkAuth, SilifeController.listarServico);

router.get("/servico", checkAuth, SilifeController.servico);
router.post("/servico", checkAuth, SilifeController.servicoPost);

router.get("/editservico/:id", checkAuth, SilifeController.editservico);
router.post("/editservico", checkAuth, SilifeController.editservicPost);
router.get("/delete/:id", checkAuth, SilifeController.delete);
router.get("/listarTipo/:id", checkAuth, SilifeController.listarTipo);

//listar e editar Tipo
router.get("/cadTipo", checkAuth, SilifeController.cadTipo);
router.get("/listatipo", checkAuth, SilifeController.listatipo);
router.get("/edittipo/:id", checkAuth, SilifeController.editatipo);
router.post("/edittipo", checkAuth, SilifeController.editatipoPost);
router.get("/deletetipo/:id", checkAuth, SilifeController.deletatipo);

// Simulador
router.get("/simulador", checkAuth, SilifeController.simulador);
router.post("/simular", checkAuth, SilifeController.simularPost);
router.get("/", checkAuth, SilifeController.showSilife);

// Edição de Simulação
router.get("/editsimulacao/:id", checkAuth, SilifeController.editsimulacao);
router.post("/editsimulacao", checkAuth, SilifeController.editsimulacaoPost);
router.get("/deletesimulacao/:id", checkAuth, SilifeController.deletesimulacao);

module.exports = router;
