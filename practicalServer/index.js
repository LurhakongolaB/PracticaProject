require('dotenv').config()
const express = require('express')
const Note = require('./models/note')
const morgan = require('morgan')
const path = require('path')
const mongoose = require('mongoose')



const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// CLEAN CONNECTION STRING

  const url = process.env.MONGODB_URI

if (!url) {
  console.error('❌ Missing MONGODB_URI in .env')
  process.exit(1)
}

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

// DELETE
app.delete('/api/notes/:id', (request, response) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
})

// POST
app.post('/api/notes', (request, response) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(saved => response.json(saved))
})

// PUT
app.put('/api/notes/:id', (request, response) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updated => response.json(updated))
})

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})

