import { test, expect } from '@playwright/test'

test.describe('Task Manager Application', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página principal antes de cada prueba
    await page.goto('http://localhost:3000')
  })

  test('debería mostrar la página principal con formulario y lista vacía', async ({ page }) => {
    // Verificar que la página se carga correctamente
    await expect(page).toHaveTitle(/Gestor de Tareas/)
    
    // Verificar elementos principales
    await expect(page.locator('h1, .navbar-brand')).toContainText('Gestor de Tareas')
    await expect(page.locator('h5')).toContainText('Nueva Tarea')
    await expect(page.locator('h5')).toContainText('Lista de Tareas (0)')
    
    // Verificar formulario
    await expect(page.locator('input[name="title"]')).toBeVisible()
    await expect(page.locator('textarea[name="description"]')).toBeVisible()
    await expect(page.locator('select[name="priority"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toContainText('Crear Tarea')
  })

  test('debería crear una nueva tarea exitosamente', async ({ page }) => {
    // Llenar el formulario
    await page.fill('input[name="title"]', 'Tarea de prueba E2E')
    await page.fill('textarea[name="description"]', 'Descripción de prueba E2E')
    await page.selectOption('select[name="priority"]', 'high')
    
    // Enviar formulario
    await page.click('button[type="submit"]')
    
    // Verificar que la tarea aparece en la lista
    await expect(page.locator('h6')).toContainText('Tarea de prueba E2E')
    await expect(page.locator('.badge.bg-danger')).toContainText('Alta')
    await expect(page.locator('.badge.bg-secondary')).toContainText('Pendiente')
    
    // Verificar que el formulario se limpia
    await expect(page.locator('input[name="title"]')).toHaveValue('')
    await expect(page.locator('textarea[name="description"]')).toHaveValue('')
    await expect(page.locator('select[name="priority"]')).toHaveValue('medium')
  })

  test('debería validar campos requeridos', async ({ page }) => {
    // Intentar enviar formulario vacío
    await page.click('button[type="submit"]')
    
    // Verificar mensaje de error
    await expect(page.locator('.invalid-feedback')).toContainText('El título es requerido')
    
    // Verificar que no se creó ninguna tarea
    await expect(page.locator('h5')).toContainText('Lista de Tareas (0)')
  })

  test('debería editar una tarea existente', async ({ page }) => {
    // Crear una tarea primero
    await page.fill('input[name="title"]', 'Tarea para editar')
    await page.fill('textarea[name="description"]', 'Descripción original')
    await page.click('button[type="submit"]')
    
    // Esperar a que aparezca la tarea
    await expect(page.locator('h6')).toContainText('Tarea para editar')
    
    // Hacer clic en editar
    await page.click('button[title="Editar"]')
    
    // Verificar que aparece el modo de edición
    await expect(page.locator('input[type="text"]').first()).toHaveValue('Tarea para editar')
    
    // Cambiar el título y estado
    await page.fill('input[type="text"]', 'Tarea editada')
    await page.selectOption('select', 'completed')
    
    // Guardar cambios
    await page.click('button[title="Guardar"]')
    
    // Verificar que los cambios se aplicaron
    await expect(page.locator('h6')).toContainText('Tarea editada')
    await expect(page.locator('.badge.bg-success')).toContainText('Completada')
  })

  test('debería eliminar una tarea', async ({ page }) => {
    // Crear una tarea
    await page.fill('input[name="title"]', 'Tarea para eliminar')
    await page.click('button[type="submit"]')
    
    // Verificar que aparece
    await expect(page.locator('h6')).toContainText('Tarea para eliminar')
    
    // Eliminar la tarea
    await page.click('button[title="Eliminar"]')
    
    // Verificar que desaparece
    await expect(page.locator('h5')).toContainText('Lista de Tareas (0)')
  })

  test('debería navegar a la página de autenticación', async ({ page }) => {
    // Hacer clic en el enlace de autenticación
    await page.click('text=Autenticación')
    
    // Verificar que estamos en la página correcta
    await expect(page.url()).toContain('/auth')
    await expect(page.locator('h5')).toContainText('Iniciar Sesión')
    
    // Verificar formulario de login
    await expect(page.locator('input[name="username"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toContainText('Iniciar Sesión')
  })

  test('debería cambiar entre modo login y registro', async ({ page }) => {
    // Ir a la página de autenticación
    await page.goto('http://localhost:3000/auth')
    
    // Verificar que empieza en modo login
    await expect(page.locator('h5')).toContainText('Iniciar Sesión')
    
    // Cambiar a modo registro
    await page.click('text=¿No tienes cuenta? Regístrate')
    
    // Verificar que cambió a registro
    await expect(page.locator('h5')).toContainText('Registrarse')
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toContainText('Registrarse')
    
    // Cambiar de vuelta a login
    await page.click('text=¿Ya tienes cuenta? Inicia sesión')
    
    // Verificar que volvió a login
    await expect(page.locator('h5')).toContainText('Iniciar Sesión')
  })

  test('debería manejar errores de validación en autenticación', async ({ page }) => {
    // Ir a la página de autenticación
    await page.goto('http://localhost:3000/auth')
    
    // Cambiar a modo registro
    await page.click('text=¿No tienes cuenta? Regístrate')
    
    // Intentar enviar formulario vacío
    await page.click('button[type="submit"]')
    
    // Verificar mensajes de error
    await expect(page.locator('.invalid-feedback')).toContainText('El nombre de usuario es requerido')
    await expect(page.locator('.invalid-feedback')).toContainText('La contraseña es requerida')
    await expect(page.locator('.invalid-feedback')).toContainText('El email es requerido')
  })

  test('debería ser responsive en dispositivos móviles', async ({ page }) => {
    // Cambiar a vista móvil
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Verificar que el navbar se colapsa
    await expect(page.locator('.navbar-collapse')).toHaveClass(/collapse/)
    
    // Hacer clic en el botón hamburguesa
    await page.click('.navbar-toggler')
    
    // Verificar que el menú se expande
    await expect(page.locator('.navbar-collapse')).toHaveClass(/show/)
    
    // Verificar que los enlaces son visibles
    await expect(page.locator('text=Inicio')).toBeVisible()
    await expect(page.locator('text=Autenticación')).toBeVisible()
  })
}) 