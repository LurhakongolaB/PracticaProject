const express = require('express')
const morgan = require('morgan')
// const cors = require('cors')
const path = require('path')
const app = express() 

// app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let notes = [
  {
    id: "1",
    content: "Welcome to my site, esteemed colleagues of the Full Stack Web Development/K-NODE/SIR! I am thrilled to share my progress with you.",
    important: true
  },
  {
    id: "2",
    content: "Asset Management: High-performance engine block currently listed as a spare part.",
    important: false
  },
  {
    id: "3",
    content: "Asset Management: Office space in the downtown sector available for rent.",
    important: true
  },
  {
    id: "4",
    content: "Technical Note: The backend is housed in practicalServer while the frontend lives in PracticalFrontend.",
    important: true
  },
  {
    id: "5",
    content: "Git Practice: All configuration changes are being tracked with specific commit messages like 'step1'.",
    important: false
  },
  { id: "1", content: "HTML is easy", important: true },
  { id: "2", content: "Browser can execute only JavaScript", important: true },
  { id: "3", content: "GET and POST are the most important methods of HTTP protocol", important: false }
]

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

// FIXED: Removed Number() conversion to match the string IDs in your array
app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id    
  const note = notes.find(note => note.id === id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

// FIXED: Removed Number() conversion
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id
  notes = notes.filter(note => note.id !== id)
  res.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/notes', (req, res) => {
  const body = req.body
  if (!body.content) {
    return res.status(400).json({ error: 'content missing' })
  }

  const note = {
    content: body.content,
    important: body.important || true,
    id: generateId(),
  }
  notes = notes.concat(note)
  res.json(note)
})

app.put('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const body = request.body
  const note = notes.find(n => n.id === id)
  
  if (note) {
    const updatedNote = { ...note, important: body.important }
    notes = notes.map(n => n.id !== id ? n : updatedNote)
    response.json(updatedNote)
  } else {
    response.status(404).end()
  }
})

app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})