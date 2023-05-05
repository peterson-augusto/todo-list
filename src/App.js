import './App.css';

import { useState, useEffect } from 'react';
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from 'react-icons/bs'

const API = "http://localhost:5000"

function App() {

  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false
    }

    await fetch(API + '/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    setTitle('')
    setTime('')

    setTodos((prevState) => [...prevState, todo])

  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      const res = await fetch(API + '/todos')
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err))

      setLoading(false)

      setTodos(res)

    }
    loadData()

  }, [])

  const handleEdit = async (todo) => {
    todo.done = !todo.done

    const data = await fetch(API + '/todos/' + todo.id, {
      method: 'PUT',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    setTodos((prevState) => prevState.map((t) => (t.id === t.data ? (t = data) : t)))

  }

  const handleDelete = async (id) => {

    await fetch(API + '/todos/' + id, {
      method: 'DELETE'
    })

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id))

  }

  if (loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className="App">
      <div className='todo-header'>
        <h1>Todo</h1>
      </div>
      <div className='todo-form'>
        <h2>Informe uma tarefa abaixo:</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-control'>
            <label htmlFor='title'>O que você vai fazer?</label>
            <input type='text' name='title' placeholder='Digite uma tarefa' required onChange={(e) => setTitle(e.target.value)} value={title || ''} />
          </div>
          <div className='form-control'>
            <label htmlFor='time'>Duração:</label>
            <input type='text' name='time' placeholder='Informe o tempo (em horas)' required onChange={(e) => setTime(e.target.value)} value={time || ''} />
          </div>
          <input type='submit' value='Criar Tarefa' />
        </form>
      </div>
      <div className='todo-list'>
        <h2>Lista de tarefas</h2>
        {todos.length === 0 && <p>Não há tarefas!</p>}
        {todos.map((todo) => (
          <div className='todo' key={todo.id}>
            <h3 className={todo.done ? 'todo-done' : ''}>{todo.title}</h3>
            <p>Duração: {todo.time} hora(s)</p>
            <div className='actions'>
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
