import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TaskForm from '../TaskForm'

// Mock de la función onSubmit
const mockOnSubmit = jest.fn()

describe('TaskForm Component', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  test('renderiza el formulario correctamente', () => {
    render(<TaskForm onSubmit={mockOnSubmit} />)
    
    expect(screen.getByText('Nueva Tarea')).toBeInTheDocument()
    expect(screen.getByLabelText(/título/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/prioridad/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /crear tarea/i })).toBeInTheDocument()
  })

  test('valida campos requeridos', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} />)
    
    const submitButton = screen.getByRole('button', { name: /crear tarea/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('El título es requerido')).toBeInTheDocument()
    })
    
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  test('envía el formulario con datos válidos', async () => {
    mockOnSubmit.mockResolvedValue(true)
    render(<TaskForm onSubmit={mockOnSubmit} />)
    
    // Llenar el formulario
    fireEvent.change(screen.getByLabelText(/título/i), {
      target: { value: 'Nueva tarea de prueba' }
    })
    
    fireEvent.change(screen.getByLabelText(/descripción/i), {
      target: { value: 'Descripción de prueba' }
    })
    
    fireEvent.change(screen.getByLabelText(/prioridad/i), {
      target: { value: 'high' }
    })
    
    // Enviar formulario
    const submitButton = screen.getByRole('button', { name: /crear tarea/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Nueva tarea de prueba',
        description: 'Descripción de prueba',
        priority: 'high'
      })
    })
  })

  test('valida longitud máxima del título', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} />)
    
    // Crear un título muy largo
    const longTitle = 'a'.repeat(101)
    
    fireEvent.change(screen.getByLabelText(/título/i), {
      target: { value: longTitle }
    })
    
    const submitButton = screen.getByRole('button', { name: /crear tarea/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('El título es muy largo')).toBeInTheDocument()
    })
    
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  test('limpia el formulario después de envío exitoso', async () => {
    mockOnSubmit.mockResolvedValue(true)
    render(<TaskForm onSubmit={mockOnSubmit} />)
    
    // Llenar y enviar formulario
    fireEvent.change(screen.getByLabelText(/título/i), {
      target: { value: 'Tarea de prueba' }
    })
    
    const submitButton = screen.getByRole('button', { name: /crear tarea/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/título/i)).toHaveValue('')
      expect(screen.getByLabelText(/descripción/i)).toHaveValue('')
      expect(screen.getByLabelText(/prioridad/i)).toHaveValue('medium')
    })
  })

  test('no limpia el formulario si hay error', async () => {
    mockOnSubmit.mockResolvedValue(false)
    render(<TaskForm onSubmit={mockOnSubmit} />)
    
    // Llenar formulario
    fireEvent.change(screen.getByLabelText(/título/i), {
      target: { value: 'Tarea de prueba' }
    })
    
    const submitButton = screen.getByRole('button', { name: /crear tarea/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/título/i)).toHaveValue('Tarea de prueba')
    })
  })
}) 