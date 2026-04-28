const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')

const app = express() 

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))


morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const gatekeeper = (request, response, next) =>{
    const secretCode = 'Jeanne'
    const password = request.query.password

    if(password === secretCode){
        console.log('Access granted!')
        next()
    }
    else {
        console.log('Access Denied')
        response.status(403).json({error: 'You do not know the secret code'})
    }
}

let notes = [
    
    {
        id: 1,
        name: 'Luba',
        location: 'kv3',
        occupation: 'web developement'
    },
    {
        id: 2,
        name: 'Sombi',
        location: 'kv1',
        occupation: ' graphic designer'
    },
    {
        id: 3,
        name: 'Henry',
        location: 'kv2',
        occupation: 'Full stack'
    }

]

// app.get('/',(req,res) => {
// res.send('Hello world')
// })

app.get('/api/notes', (req, res)=>{
    res.json(notes)
})
app.get('/api/notes/:id', (req, res) =>{
    const id =Number(req.params.id)    
    const note = notes.find(note => note.id === id)
    if(note) {
        res.json(note)
    } else {res.status(404).end()}
})

 app.delete('/api/notes/:id', (req, res)=>{
    const id = req.params.id
    notes = notes.filter(note => note.id !== Number (id))
    res.status(204).end()
 })


const generateId = ()=>{
    const maxId = notes.length>0
    ? Math.max(...notes.map(n => Number(n.id)))
    :0
    return String(maxId +1)
}
app.post('/api/notes', (req, res) => {
    const body = req.body
    if (!body.content) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

const note = {
    content: body.content,
    important: body.important || true,
    id: generateId(),
}
notes = notes.concat(note)
res.json(note)

})

const unknownEndpoint = (request, response) =>{
    response.status(404).send({ error: 'unknown endpoint'})
}
app.use(unknownEndpoint)


const PORT = process.env.PORT|| 3001

app.listen(PORT, ()=> {
    console.log(`the server is runing on ${PORT}`)})