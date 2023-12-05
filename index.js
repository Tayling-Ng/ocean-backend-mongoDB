const express = require('express')
const { MongoClient } = require('mongodb')

// Overview do MongoDB, copiar a url e substituir <password> pela senha
const dbUrl = "mongodb+srv://admin:yNQ2zWi9cmqfKl4x@cluster0.orfbrt5.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(dbUrl)
const dbName = "ocean-backend"

async function main() {
  console.log("Conectando ao banco de dados...")
  await client.connect()
  console.log("Banco de dados conectado com sucesso!")
  const db = client.db(dbName)
  const collection = db.collection("item")

const app = express()

// Registrar um Middleware de JSON
// Indica que todas as requisições podem receber
// Body em JSON. A partir disso, o Express aplica
// um JSON.parse para o conteúdo recebido
app.use(express.json())

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get("/oi", function (req, res) {
  res.send("Olá, mundo!")
})

const lista = ["Rick Sanchez", "Morty Smith", "Summer Smith"]
//              0               1              2

// Read All - [GET] /item
app.get("/item", async function (req, res) {
  const itens = await collection.find().toArray()
  res.send(itens)
})

// Read by ID - [GET] /item/:id
app.get("/item/:id", function (req, res) {
  // Pegamos o ID de rota e subtraímos 1 para ficar
  // equivalente ao índice da lista que começa em 0
  const id = req.params.id - 1

  // Acessamos o item na lista, usando o índice corrigido
  const item = lista[id]

  // Enviamos o item como resposta do endpoint
  res.send(item)
})

// Create - [POST] /item
app.post("/item", function (req, res) {
  // Extraímos o nome do Body da Requisição
  const item = req.body.nome

  // Adicionamos o item recebido na lista
  lista.push(item)

  // Exibimos uma mensagem de sucesso
  res.send("Item adicionado com sucesso!")
})

// Update - [PUT] /item/:id
app.put("/item/:id", function (req, res) {
  // Obtemos o ID do parâmetro de rota e fazemos
  // a correção de índice
  const id = req.params.id - 1

  // Obtemos o novo item a ser atualizado
  const novoItem = req.body.nome

  // Atualizamos o valor recebido na lista, usando
  // a posição ID para garantir que atualizamos
  // o item correto
  lista[id] = novoItem

  // Enviamos uma mensagem de sucesso
  res.send("Item atualizado com sucesso!")
})

// Delete - [DELETE] /item/:id
app.delete("/item/:id", function (req, res) {
  // Obtemos o ID do Parâmetro de rota
  const id = req.params.id - 1

  // Removemos o item da lista
  delete lista[id]

  // Exibimos uma mensagem de sucesso
  res.send("Item removido com sucesso!")
})

app.listen(3000)

}

main()
