import { useState, useEffect } from 'react'
import axios from 'axios'
import noteService from './services/notes'

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

  useEffect(() => {
  noteService
    .getAll()
    .then(initialNotes => {
      setNotes(initialNotes)
    })
}, [])

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

 
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(n => n.id !== id ? n : returnedNote))
      })
  }

  
  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    }
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
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
  <br />
  <strong>Developed by <h3>Mr. Balazire</h3></strong>
</footer>
    </div>
  )
}

export default App