const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const { checkAuth } = require("../helpers/auth");
// Rota principal
router.get("/login", AuthController.login);
router.post("/login", AuthController.loginPost);
router.get("/register", checkAuth, AuthController.register);
router.post("/register", checkAuth, AuthController.registerPost);
router.get("/logout", AuthController.logout);

// Criação e edição de usuario
router.get("/usuarios", checkAuth, AuthController.usuarios);
router.get("/editusuarios/:id", checkAuth, AuthController.usuariosEdit);
router.post("/editusuarios", checkAuth, AuthController.usuariosEditPost);

// Atualziar Senha
router.get("/atualizasenha/:id", checkAuth, AuthController.atualizarSenha); 
router.post("/atualizasenha", checkAuth, AuthController.atualizarSenhaPost);

module.exports = router;
