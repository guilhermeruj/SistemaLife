const User = require("../models/Users");
const bcrypt = require("bcryptjs");

module.exports = class AuthController {
  static login(req, res) {
    res.render("auth/login", { layout: false });
  }
  static async usuarios(req, res) {
    const users = await User.findAll({ raw: true });
    res.render("auth/user", {
      users: users,
      userid: req.session.userid,
      username: req.session.username,
      userNivel: req.session.usernivel,
    });
  }
  static async loginPost(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    // Check Email
    if (!user) {
      req.flash("message", "Usuário não encontrado!");
      res.render("auth/login", { layout: false });
      return;
    }
    // Check Password
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      req.flash("message", "Senha Inválida");
      res.render("auth/login", { layout: false });
      return;
    }
    req.session.userid = user.id;
    req.session.username = user.name;
    req.session.userNivel = user.nivel;
    req.flash("message", "Autenticação realizada com sucesso");
    req.session.save(() => {
      res.redirect("/");
    });
  }
  static logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
  }
  // Pagina de cadastro de usuario
  static register(req, res) {
    res.render("auth/caduser", {
      username: req.session.username,
      userNivel: req.session.usernivel,
    });
  }

  static async registerPost(req, res) {
    const { name, cpf, rg, telefone, email, password, confpassword, nivel } =
      req.body;

    // Password match validation
    if (password != confpassword) {
      // Mensagem
      req.flash("message", "As senhas não conferem, tente novamente!");
      res.render("auth/caduser", {
        name,
        cpf,
        rg,
        telefone,
        email,
        nivel,
        username: req.session.username,
        userNivel: req.session.usernivel,
      });
      return;
    }

    const emailExist = await User.findOne({ where: { email: email } });

    if (emailExist) {
      req.flash("message", "O e-mail já esta cadastado!");
      res.render("auth/caduser", {
        name,
        cpf,
        rg,
        telefone,
        email,
        nivel,
        username: req.session.username,
        userNivel: req.session.usernivel,
      });
      return;
    }
    const existingCpf = await User.findOne({ where: { cpf: cpf } });
    if (existingCpf) {
      req.flash("message", "O CPF já esta cadastado!");
      res.render("auth/caduser", {
        name,
        cpf,
        rg,
        telefone,
        email,
        nivel,
        username: req.session.username,
        userNivel: req.session.usernivel,
      });
      return;
    }
    const existingRg = await User.findOne({ where: { rg: rg } });
    if (existingRg) {
      req.flash("message", "O RG já esta cadastado!");
      res.render("auth/caduser", {
        name,
        cpf,
        rg,
        telefone,
        email,
        nivel,
        username: req.session.username,
        userNivel: req.session.usernivel,
      });
      return;
    }

    // create a password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassaword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      cpf,
      rg,
      telefone,
      email,
      password: hashedPassaword,
      nivel,
    };

    console.log(user);
    try {
      const createUser = await User.create(user);

      req.flash("success", `${name} cadastrado com sucesso`);
      res.redirect("/caduser");
    } catch (err) {
      console.log(err);
    }
  }
  // Opções de Edição
  static async usuariosEdit(req, res) {
    const id = req.params.id;
    const user = await User.findOne({ raw: true, where: { id: id } });
    res.render("auth/edituser", {
      user,
      username: req.session.username,
      userNivel: req.session.usernivel,
    });
  }
  // Recebe as Edições
  static async usuariosEditPost(req, res) {
    const { id, name, cpf, rg, telefone, email, nivel } = req.body;

    try {
      // Recupera o usuário existente do banco de dados
      const user = await User.findOne({ where: { id: id } });

      if (!user) {
        req.flash("error", "Usuário não encontrado");
        res.redirect("/usuarios");
        return;
      }

      // Verifica se algum campo foi alterado
      const updatedFields = {};
      if (name !== user.name) {
        updatedFields.name = name;
      }
      if (cpf !== user.cpf) {
        updatedFields.cpf = cpf;
      }
      if (rg !== user.rg) {
        updatedFields.rg = rg;
      }
      if (telefone !== user.telefone) {
        updatedFields.telefone = telefone;
      }
      if (email !== user.email) {
        updatedFields.email = email;
      }
      if (nivel !== user.nivel) {
        updatedFields.nivel = nivel;
      }
      console.log(updatedFields);
      // Verifica se algum campo foi alterado antes de atualizar
      if (Object.keys(updatedFields).length === 0) {
        req.flash("info", "Nenhum campo foi alterado");
        res.redirect(`/editusuarios/${id}`);
        return;
      }

      // Atualiza apenas os campos modificados
      await User.update(updatedFields, { where: { id: id } });

      req.flash("success", `${user.name} foi editado com sucesso!`);
      res.redirect("/usuarios");
    } catch (err) {
      console.log(err);
      req.flash("error", "Ocorreu um erro ao editar o usuário.");
      res.redirect(`/usuarios/${id}`);
    }
  }
  static async atualizarSenha(req, res) {
    const id = req.params.id;
    const user = await User.findOne({ raw: true, where: { id: id } });
    res.render("auth/editpassword", {
      user,
      username: req.session.username,
      userNivel: req.session.usernivel,
    });
  }

  static async atualizarSenhaPost(req, res) {
    const { id, password, confirmePassword } = req.body;

    if (password != confirmePassword) {
      // Mensagem
      req.flash("message", "As senhas não conferem, tente novamente!");
      res.render("auth/editpassword", {
        username: req.session.username,
        userNivel: req.session.usernivel,
      });
      return;
    }
    // create a password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassaword = bcrypt.hashSync(password, salt);
    const user = { password: hashedPassaword };

    await User.update(user, { where: { id: id } });

    req.flash("success", `${user.name} foi editado com sucesso!`);
    res.redirect("/usuarios");
  }

  static logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
  }
};
