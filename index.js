const express = require("express");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;
const db = new sqlite3.Database("./database.db");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Rotas
app.get("/", (req, res) => {
  db.all("SELECT * FROM produtos", (err, rows) => {
    res.render("index", { produtos: rows });
  });
});

app.get("/produto/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM produtos WHERE id = ?", [id], (err, row) => {
    res.render("produto", { produto: row });
  });
});

app.post("/produto", (req, res) => {
  const { nome, codigo, descricao, preco } = req.body;
  db.run(
    "INSERT INTO produtos (nome, codigo, descricao, preco) VALUES (?, ?, ?, ?)",
    [nome, codigo, descricao, preco],
    (err) => {
      res.redirect("/");
    }
  );
});

app.post("/produto/:id/editar", (req, res) => {
  const id = req.params.id;
  const { nome, codigo, descricao, preco } = req.body;
  db.run(
    "UPDATE produtos SET nome = ?, codigo = ?, descricao = ?, preco = ? WHERE id = ?",
    [nome, codigo, descricao, preco, id],
    (err) => {
      res.redirect("/");
    }
  );
});

app.post("/produto/:id/deletar", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM produtos WHERE id = ?", [id], (err) => {
    res.redirect("/");
  });
});

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
