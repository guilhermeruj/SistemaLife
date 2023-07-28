const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");
const path = require("path");
const { checkAuth } = require("./helpers/auth");
const cors = require("cors");

// Models
const conn = require("./db/conn");
const User = require("./models/Users");
const Tipo = require("./models/Tipo");
const Servico = require("./models/Servico");
const Cliente = require("./models/Clientes");
const Simulacao = require("./models/Simulacao");
//sempre vem primeiro para iniciar o aplicativo
const app = express();

// Routes
const silifeRoutes = require("./routes/silifeRoutes");
const silifeController = require("./controllers/SilifeController");
const authRoutes = require("./routes/authRoutes");
const clienteRoutes = require("./routes/clienteRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const siteRoutes = require("./routes/siteRoutes")

//configura o handlebars
app.engine(
  "handlebars",
  exphbs.engine({
    helpers: {
      eq: function (a, b) {
        return a === b;
      },
    },
  })
);
app.set("view engine", "handlebars");

//congigurando o bodyParser para receber os dados
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    name: "session",
    secret: "nosso_secret",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: path.join(__dirname, "session"), // Caminho para a pasta "session" no diretório raiz
    }),
    cookie: {
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    },
  })
);

app.use(express.static("public"));

app.use(flash());

// Liberação de API
app.use(cors());


// Salvar a session na resposta
app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session;
  }

  next();
});

app.get("/", checkAuth, silifeController.showSilife);

// Routes
app.use("/", silifeRoutes);
app.use("/", authRoutes);
app.use("/", clienteRoutes);
app.use("/", pdfRoutes);
app.use("/", siteRoutes);

// Conecção do banco
conn
  .sync()
  .then(() => {
    app.listen(3001);
  })
  .catch((err) => console.log(err));
