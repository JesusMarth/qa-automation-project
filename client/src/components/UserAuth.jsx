import React, { useState } from 'react'

const UserAuth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido'
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida'
    }
    
    if (!isLogin && !formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    }
    
    // BUG INTENCIONAL: Validación muy básica de email
    if (!isLogin && formData.email && !formData.email.includes('@')) {
      newErrors.email = 'Formato de email inválido'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    
    if (!validateForm()) {
      return
    }
    
    try {
      const endpoint = isLogin ? '/api/users/login' : '/api/users'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setMessage(isLogin ? 'Login exitoso!' : 'Usuario creado exitosamente!')
        if (isLogin) {
          console.log('Usuario logueado:', data.user)
        }
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({ username: '', password: '', email: '' })
    setErrors({})
    setMessage('')
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        <div className="card">
          <div className="card-header text-center">
            <h5 className="mb-0">
              <i className="fas fa-user me-2"></i>
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </h5>
          </div>
          <div className="card-body">
            {message && (
              <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} alert-dismissible fade show`} role="alert">
                {message}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setMessage('')}
                ></button>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Nombre de Usuario <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Ingresa tu nombre de usuario"
                />
                {errors.username && (
                  <div className="invalid-feedback">{errors.username}</div>
                )}
              </div>
              
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Contraseña <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña"
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>
              
              {!isLogin && (
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ingresa tu email"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
              )}
              
              <button type="submit" className="btn btn-primary w-100 mb-3">
                <i className={`fas fa-${isLogin ? 'sign-in-alt' : 'user-plus'} me-2`}></i>
                {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
              </button>
              
              <div className="text-center">
                <button 
                  type="button" 
                  className="btn btn-link btn-sm"
                  onClick={toggleMode}
                >
                  {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserAuth 