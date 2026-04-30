const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
// Remove: const { request } = require('http') - Not needed for Express
const app = express() 

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Replace the old Luba/Sombi/Henry array with this
let notes = [
  { id: "1", content: "HTML is easy", important: true },
  { id: "2", content: "Browser can execute only JavaScript", important: true },
  { id: "3", content: "GET and POST are the most important methods of HTTP protocol", important: false }
]

// GET ALL
app.get('/api/notes', (req, res)=>{
    res.json(notes)
})

// GET BY ID - Fixed to use String comparison
app.get('/api/notes/:id', (req, res) =>{
    const id = req.params.id    
    const note = notes.find(note => note.id === id)
    if(note) {
        res.json(note)
    } else {
        res.status(404).end()
    }
})

// DELETE - Fixed to use String comparison
app.delete('/api/notes/:id', (req, res)=>{
    const id = req.params.id
    notes = notes.filter(note => note.id !== id)
    res.status(204).end()
})

const generateId = ()=>{
    const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
    return String(maxId + 1)
}

// POST
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

// PUT - Corrected to ensure ID types match
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

// Wildcard route MUST use '/*' for modern Express on Render
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const unknownEndpoint = (request, response) =>{
    response.status(404).send({ error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
    console.log(`the server is running on ${PORT}`)
})