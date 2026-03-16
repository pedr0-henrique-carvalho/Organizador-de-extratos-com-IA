# Organizador de Extratos com IA

Uma aplicação inteligente que utiliza a **API do Google Gemini** para processar imagens (extratos, notas fiscais, comprovantes)
e transformar dados brutos em um dashboard financeiro com gráficos.

---

## Como configurar o projeto 

Como este projeto utiliza dados sensíveis (sua chave de API), o arquivo `.env` não é enviado para o GitHub. 
Siga estas etapas para rodar o projeto na sua máquina:

### 1. Obter sua Chave de API do Google
1. Acesse o [Google AI Studio](https://aistudio.google.com/).
2. Faça login com sua conta Google.
3. Clique em **"Get API key"** no menu lateral.
4. Clique em **"Create API key in new project"**.
5. **Copie a chave gerada.**

### 2. Configurar Variáveis de Ambiente
Na pasta raiz do projeto, crie um arquivo chamado **`.env`** e cole o seguinte conteúdo, substituindo pelo valor da sua chave:

```env
GOOGLE_API_KEY=COLE_SUA_CHAVE_AQUI
PORT=3000
```

### 3. Instalar Dependências
Certifique-se de ter o Node.js instalado. No terminal do VS Code, rode:

**`npm install`**

### 4. Iniciar o Servidor
Para rodar a aplicação, utilize o comando:

**``node server.js``**

## Funcionalidades

Leitura de Imagens: Upload de fotos de notas e extratos.

Processamento via IA: O Google Gemini analisa a imagem e extrai valores, datas e itens.

Categorização Automática: Classifica os gastos (Ex: Alimentação, Lazer, Saúde).

Dashboard Visual: Gráficos interativos que mostram a distribuição dos seus gastos.

## Tecnologias Utilizadas

Backend: Node.js / Express
Inteligência Artificial: Google Gemini API (Generative AI)
- Banco de Dados: SQLite (arquivo financeiro.db)
- Frontend: HTML5, CSS3 (Flexbox/Grid) e JavaScript
