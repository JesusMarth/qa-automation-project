import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-tasks me-2"></i>
          Gestor de Tareas
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                to="/"
              >
                <i className="fas fa-home me-1"></i>
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/auth' ? 'active' : ''}`} 
                to="/auth"
              >
                <i className="fas fa-user me-1"></i>
                Autenticación
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 