const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes')
const cors = require('cors')
const http = require('http')
const { setupWebsocket } = require('./websocket')

const app = express()
const server = http.Server(app)

setupWebsocket(server)

mongoose.connect('mongodb://localhost:27017/radardev', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.use(express.json())
app.use(cors())
app.use(routes)


server.listen(3333)

