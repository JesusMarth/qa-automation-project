import React, { useState } from 'react'

const TaskList = ({ tasks, loading, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})

  const handleEdit = (task) => {
    setEditingId(task.id)
    setEditData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority
    })
  }

  const handleSave = async (id) => {
    const success = await onUpdate(id, editData)
    if (success) {
      setEditingId(null)
      setEditData({})
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({})
  }

  const getPriorityBadge = (priority) => {
    const badges = {
      low: 'bg-success',
      medium: 'bg-warning',
      high: 'bg-danger'
    }
    return badges[priority] || 'bg-secondary'
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-secondary',
      in_progress: 'bg-info',
      completed: 'bg-success'
    }
    return badges[status] || 'bg-secondary'
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando tareas...</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-tasks fa-3x text-muted mb-3"></i>
        <h5 className="text-muted">No hay tareas</h5>
        <p className="text-muted">Crea tu primera tarea usando el formulario</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="fas fa-list me-2"></i>
          Lista de Tareas ({tasks.length})
        </h5>
      </div>
      <div className="card-body p-0">
        <div className="list-group list-group-flush">
          {tasks.map(task => (
            <div key={task.id} className="list-group-item">
              {editingId === task.id ? (
                <div className="row">
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editData.title}
                      onChange={(e) => setEditData({...editData, title: e.target.value})}
                    />
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select form-select-sm"
                      value={editData.status}
                      onChange={(e) => setEditData({...editData, status: e.target.value})}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="in_progress">En Progreso</option>
                      <option value="completed">Completada</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select form-select-sm"
                      value={editData.priority}
                      onChange={(e) => setEditData({...editData, priority: e.target.value})}
                    >
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <div className="btn-group btn-group-sm">
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => handleSave(task.id)}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={handleCancel}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="row align-items-center">
                  <div className="col-md-4">
                    <h6 className="mb-1">{task.title}</h6>
                    {task.description && (
                      <small className="text-muted">{task.description}</small>
                    )}
                  </div>
                  <div className="col-md-2">
                    <span className={`badge ${getStatusBadge(task.status)}`}>
                      {task.status === 'pending' && 'Pendiente'}
                      {task.status === 'in_progress' && 'En Progreso'}
                      {task.status === 'completed' && 'Completada'}
                    </span>
                  </div>
                  <div className="col-md-2">
                    <span className={`badge ${getPriorityBadge(task.priority)}`}>
                      {task.priority === 'low' && 'Baja'}
                      {task.priority === 'medium' && 'Media'}
                      {task.priority === 'high' && 'Alta'}
                    </span>
                  </div>
                  <div className="col-md-2">
                    <small className="text-muted">
                      {new Date(task.created_at).toLocaleDateString()}
                    </small>
                  </div>
                  <div className="col-md-2">
                    <div className="btn-group btn-group-sm">
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleEdit(task)}
                        title="Editar"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => onDelete(task.id)}
                        title="Eliminar"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TaskList 