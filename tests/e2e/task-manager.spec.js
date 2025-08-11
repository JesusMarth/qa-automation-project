import { test, expect } from '@playwright/test';

test.describe('Task Manager Application', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar una sola vez antes de cada test
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded'); // Más rápido que networkidle
  });

  test('debería mostrar la página principal con formulario y lista vacía', async ({ page }) => {
    // Verificar elementos principales
    await expect(page.locator('h1, .navbar-brand')).toContainText('Gestor de Tareas');
    await expect(page.locator('h5').filter({ hasText: 'Nueva Tarea' })).toBeVisible();
    await expect(page.locator('h5').filter({ hasText: 'Lista de Tareas (0)' })).toBeVisible();
    
    // Verificar formulario
    await expect(page.locator('input[placeholder="Título de la tarea"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder="Descripción de la tarea"]')).toBeVisible();
    await expect(page.locator('select[name="priority"]')).toBeVisible();
    await expect(page.locator('button:has-text("Crear Tarea")')).toBeVisible();
  });

  test('debería crear una nueva tarea', async ({ page }) => {
    // Llenar formulario
    await page.fill('input[placeholder="Título de la tarea"]', 'Tarea de prueba E2E');
    await page.fill('textarea[placeholder="Descripción de la tarea"]', 'Descripción de prueba');
    await page.selectOption('select[name="priority"]', 'high');
    
    // Crear tarea
    await page.click('button:has-text("Crear Tarea")');
    
    // Esperar a que aparezca en la lista
    await expect(page.locator('h6').filter({ hasText: 'Tarea de prueba E2E' })).toBeVisible();
    
    // Verificar que el contador se actualizó
    await expect(page.locator('h5').filter({ hasText: 'Lista de Tareas (1)' })).toBeVisible();
  });

  test('debería validar campos requeridos', async ({ page }) => {
    // Intentar crear tarea sin título
    await page.click('button:has-text("Crear Tarea")');
    
    // Verificar mensaje de error
    await expect(page.locator('.alert-danger')).toContainText('El título es requerido');
    
    // Verificar que no se creó ninguna tarea
    await expect(page.locator('h5').filter({ hasText: 'Lista de Tareas (0)' })).toBeVisible();
  });

  test('debería editar una tarea existente', async ({ page }) => {
    // Crear tarea para editar
    await page.fill('input[placeholder="Título de la tarea"]', 'Tarea para editar');
    await page.fill('textarea[placeholder="Descripción de la tarea"]', 'Descripción original');
    await page.selectOption('select[name="priority"]', 'medium');
    await page.click('button:has-text("Crear Tarea")');
    
    // Esperar a que aparezca la tarea
    await expect(page.locator('h6').filter({ hasText: 'Tarea para editar' }).first()).toBeVisible();
    
    // Hacer clic en editar
    await page.click('button[title="Editar"]').first();
    
    // Modificar título
    await page.fill('input[placeholder="Título de la tarea"]', 'Tarea editada');
    await page.click('button:has-text("Actualizar")');
    
    // Verificar que se actualizó
    await expect(page.locator('h6').filter({ hasText: 'Tarea editada' })).toBeVisible();
  });

  test('debería eliminar una tarea', async ({ page }) => {
    // Crear tarea para eliminar
    await page.fill('input[placeholder="Título de la tarea"]', 'Tarea para eliminar');
    await page.fill('textarea[placeholder="Descripción de la tarea"]', 'Descripción');
    await page.selectOption('select[name="priority"]', 'low');
    await page.click('button:has-text("Crear Tarea")');
    
    // Esperar a que aparezca
    await expect(page.locator('h6').filter({ hasText: 'Tarea para eliminar' }).first()).toBeVisible();
    
    // Eliminar la tarea
    await page.click('button[title="Eliminar"]').first();
    
    // Confirmar eliminación
    await page.click('button:has-text("Confirmar")');
    
    // Verificar que se eliminó
    await expect(page.locator('h6').filter({ hasText: 'Tarea para eliminar' })).not.toBeVisible();
    
    // Verificar que el contador se actualizó
    await expect(page.locator('h5').filter({ hasText: 'Lista de Tareas (0)' })).toBeVisible();
  });

  test('debería navegar a la página de autenticación', async ({ page }) => {
    // Navegar a autenticación
    await page.click('a:has-text("Autenticación")');
    
    // Verificar que estamos en la página correcta
    await expect(page.locator('h2')).toContainText('Autenticación');
    await expect(page.locator('input[placeholder="Nombre de usuario"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Contraseña"]')).toBeVisible();
  });

  test('debería cambiar entre modo login y registro', async ({ page }) => {
    // Ir directamente a la página de autenticación
    await page.goto('/auth');
    await page.waitForLoadState('domcontentloaded');
    
    // Verificar que está en modo login por defecto
    await expect(page.locator('h2')).toContainText('Autenticación');
    
    // Cambiar a modo registro
    await page.click('button:has-text("Registrarse")');
    
    // Verificar que apareció el campo email
    await expect(page.locator('input[placeholder="Email"]')).toBeVisible();
    
    // Volver a modo login
    await page.click('button:has-text("Iniciar Sesión")');
    
    // Verificar que desapareció el campo email
    await expect(page.locator('input[placeholder="Email"]')).not.toBeVisible();
  });

  test('debería manejar errores de validación en autenticación', async ({ page }) => {
    // Ir directamente a la página de autenticación
    await page.goto('/auth');
    await page.waitForLoadState('domcontentloaded');
    
    // Cambiar a modo registro
    await page.click('button:has-text("Registrarse")');
    
    // Intentar enviar formulario vacío
    await page.click('button:has-text("Registrarse")');
    
    // Verificar mensajes de error específicos
    await expect(page.locator('.invalid-feedback').filter({ hasText: 'El nombre de usuario es requerido' })).toBeVisible();
    await expect(page.locator('.invalid-feedback').filter({ hasText: 'La contraseña es requerida' })).toBeVisible();
    await expect(page.locator('.invalid-feedback').filter({ hasText: 'El email es requerido' })).toBeVisible();
  });

  test('debería ser responsive en dispositivos móviles', async ({ page }) => {
    // Configurar viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verificar que los elementos principales son visibles
    await expect(page.locator('h1, .navbar-brand')).toContainText('Gestor de Tareas');
    await expect(page.locator('input[placeholder="Título de la tarea"]')).toBeVisible();
    
    // Verificar que el navbar se adapta
    await expect(page.locator('.navbar-toggler')).toBeVisible();
  });
}); 