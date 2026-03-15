const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./financeiro.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS compras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    loja TEXT,
    data_compra TEXT,
    total REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS itens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    compra_id INTEGER,
    produto TEXT,
    preco REAL,
    categoria TEXT,
    FOREIGN KEY(compra_id) REFERENCES compras(id)
  )`);
});

module.exports = db;