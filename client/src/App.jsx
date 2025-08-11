import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import UserAuth from './components/UserAuth'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // BUG INTENCIONAL #6: No hay manejo de errores en el useEffect
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/tasks')
      if (!response.ok) {
        throw new Error('Error al cargar tareas')
      }
      const data = await response.json()
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (taskData) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })
      
      if (!response.ok) {
        throw new Error('Error al crear tarea')
      }
      
      const newTask = await response.json()
      setTasks([newTask, ...tasks])
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  const updateTask = async (id, taskData) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })
      
      if (!response.ok) {
        throw new Error('Error al actualizar tarea')
      }
      
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, ...taskData } : task
      ))
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Error al eliminar tarea')
      }
      
      setTasks(tasks.filter(task => task.id !== id))
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError(null)}
              ></button>
            </div>
          )}
          
          <Routes>
            <Route path="/" element={
              <div>
                <div className="row">
                  <div className="col-md-8">
                    <TaskList 
                      tasks={tasks} 
                      loading={loading}
                      onUpdate={updateTask}
                      onDelete={deleteTask}
                    />
                  </div>
                  <div className="col-md-4">
                    <TaskForm onSubmit={addTask} />
                  </div>
                </div>
              </div>
            } />
            <Route path="/auth" element={<UserAuth />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App 