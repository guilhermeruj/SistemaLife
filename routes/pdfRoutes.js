const express = require("express");
const router = express.Router();

const PdfController = require("../controllers/GerarPdf");
const { checkAuth } = require("../helpers/auth");

router.get("/gerarpdf/:id", checkAuth, PdfController.gerarPdf);

module.exports = router;
