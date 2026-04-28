import { useState, useEffect } from 'react'
import axios from 'axios'

// 1. Internal Note Component (Since you want it in this file)
const Note = ({ note, toggleImportance }) => {
  return (
    <li className="note">
      {note.content} 
      <button onClick={toggleImportance}>
        {note.important ? 'make not important' : 'make important'}
      </button>
    </li>
  )
}

const App = () => {
  const [notes, setNotes] = useState([]) // Start with empty array
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  // 2. Fetching Data
  useEffect(() => {
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        // Because your db.json is { "notes": [...] }, we need response.data
        // JSON-server usually returns the array directly if you hit /notes
        setNotes(response.data)
      })
  }, [])

  // 3. Toggle Importance Logic
  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    axios.put(url, changedNote).then(response => {
      setNotes(notes.map(n => n.id !== id ? n : response.data))
    })
  }

  // 4. Add Note Logic
  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    }

    axios
      .post('http://localhost:3001/notes', noteObject)
      .then(response => {
        setNotes(notes.concat(response.data))
        setNewNote('')
      })
  }

  // 5. Filter Logic (The "show important" part)
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  return (
    <div>
      <h1 style={{ color: 'green', fontStyle: 'italic' }}>Notes</h1>
      
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>

      <ul>
        {notesToShow.map(note => 
          <Note 
            key={note.id} 
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)} 
          />
        )}
      </ul>

      <form onSubmit={addNote}>
        <input 
          value={newNote} 
          onChange={(e) => setNewNote(e.target.value)} 
        />
        <button type="submit">save</button>
      </form>

      <footer style={{ marginTop: 20, fontStyle: 'italic', color: 'green' }}>
        Note app, Department of Computer Science, University of Helsinki 2026
      </footer>
    </div>
  )
}

export default App