require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function list() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // Isso vai listar exatamente o que a sua chave PODE usar
        const fetch = require('node-fetch'); // Se der erro aqui, ignore o script e vá para o passo 3
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        console.log("Modelos disponíveis para você:", data.models.map(m => m.name));
    } catch (e) {
        console.log("Use o modelo: gemini-1.5-flash");
    }
}
list();