require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const db = require('./database');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));
app.use(express.json());

// Limpa a chave de qualquer espaço ou aspas que o Windows possa ter colocado
const API_KEY = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim().replace(/['"]+/g, '') : null;

console.log("Chave carregada:", API_KEY ? "Sim ✅" : "Não ❌");

app.post('/upload', upload.single('nota'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("Nenhuma imagem enviada.");

        const imagemBuffer = fs.readFileSync(req.file.path);
        const base64Image = imagemBuffer.toString("base64");

const prompt = `Analise esta nota fiscal ou comprovante. 
Extraia: nome da loja, data e valor total. 
Liste os itens com nome, preço e uma categoria adequada.

REGRAS DE SINAL FINANCEIRO:
1. Itens das categorias 'Rendimento' e 'Transferência' (recebida) devem ter valor POSITIVO (ex: +55.00).
2. Itens de todas as outras categorias (Alimentos, Higiene, Pagamento, Limpeza, etc.) devem ter valor NEGATIVO (ex: -10.46).

Retorne APENAS um JSON puro, sem markdown: 
{
  "loja": "", 
  "data": "", 
  "total": 0, 
  "itens": [
    {"nome": "", "preco": 0, "categoria": ""}
  ]
}`;
        // Atualizado para o modelo gemini-1.5-flash que está ativo na sua lista!
        // Usando o modelo que apareceu como disponível no seu teste anterior
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`;
        const response = await axios.post(url, {
            contents: [{
                parts: [
                    { text: prompt },
                    { inline_data: { mime_type: req.file.mimetype, data: base64Image } }
                ]
            }]
        });

        // Pega o texto da resposta
        let textoResposta = response.data.candidates[0].content.parts[0].text;

        // Limpa possíveis marcações de markdown do JSON
        textoResposta = textoResposta.replace(/```json|```/g, "").trim();

        console.log("Resposta da IA:", textoResposta);
        const dados = JSON.parse(textoResposta);

        // Salva no Banco de Dados SQLite
        db.run(`INSERT INTO compras (loja, data_compra, total) VALUES (?, ?, ?)`,
            [dados.loja, dados.data, dados.total], function (err) {
                if (err) return res.status(500).json({ erro: err.message });

                const compraId = this.lastID;
                const promessasItens = dados.itens.map(item => {
                    return new Promise((resolve, reject) => {
                        db.run(`INSERT INTO itens (compra_id, produto, preco, categoria) VALUES (?, ?, ?, ?)`,
                            [compraId, item.nome, item.preco, item.categoria], (e) => e ? reject(e) : resolve());
                    });
                });

                Promise.all(promessasItens)
                    .then(() => res.json({ mensagem: "Sucesso!", dados }))
                    .catch(e => res.status(500).send("Erro ao salvar itens no banco."));
            });

    } catch (error) {
        console.error("Erro detalhado:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        res.status(500).send("Erro ao processar a nota: " + (error.response?.data?.error?.message || error.message));
    } finally {
        // Apaga o arquivo temporário da pasta uploads
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }
});

app.get('/gastos', (req, res) => {
    db.all(`SELECT categoria, SUM(preco) as total FROM itens GROUP BY categoria`, (err, rows) => {
        if (err) return res.status(500).send(err);
        res.json(rows);
    });
});

app.listen(3000, () => {
    console.log("-----------------------------------------");
    console.log(" Servidor de testes rodando!");
    console.log(" Acesse: http://localhost:3000");
    console.log("-----------------------------------------");
});