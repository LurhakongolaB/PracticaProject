import axios from 'axios'
const baseUrl = '/api/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  
  // This is a "mock" note used to test how the app handles 
  // data that isn't physically in your index.js array yet.
  const nonExisting = {
    id: '10000',
    content: 'This note is not saved to server', 
    important: true, // Fixed: changed 'import' to 'important'
  }
  
  return request.then(response => response.data.concat(nonExisting))
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update }