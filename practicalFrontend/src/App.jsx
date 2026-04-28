import { useState, useEffect } from 'react'
import noteService from './services/notes'

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
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    noteService.getAll().then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService.update(id, changedNote).then(returnedNote => {
      setNotes(notes.map(n => n.id !== id ? n : returnedNote))
    })
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    }

    noteService.create(noteObject).then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

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
        <input value={newNote} onChange={(e) => setNewNote(e.target.value)} />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App