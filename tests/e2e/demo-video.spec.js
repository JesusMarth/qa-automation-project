import { test, expect } from '@playwright/test';

test.describe('Demo Video Generation', () => {
  test('Generate portfolio demo video', async ({ page }) => {
    // Configurar video y capturas de pantalla
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Navegar a la página principal
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Esperar un momento para mostrar la página principal
    await page.waitForTimeout(1000);
    
    // Crear una nueva tarea
    await page.click('button:has-text("Crear Tarea")');
    
    await page.fill('input[placeholder="Título de la tarea"]', 'Demo Task para Portfolio');
    await page.fill('textarea[placeholder="Descripción de la tarea"]', 'Esta es una tarea de demostración para mostrar las funcionalidades de la aplicación en mi portafolio de QA Automation.');
    await page.selectOption('select[name="priority"]', 'high');
    
    await page.click('button:has-text("Crear Tarea")');
    await expect(page.locator('h6').filter({ hasText: 'Demo Task para Portfolio' })).toBeVisible();
    
    // Editar la tarea
    await page.click('button[title="Editar"]').first();
    
    await page.fill('input[placeholder="Título de la tarea"]', 'Demo Task Editada - Portfolio QA');
    
    await page.click('button:has-text("Actualizar")');
    await expect(page.locator('h6').filter({ hasText: 'Demo Task Editada - Portfolio QA' })).toBeVisible();
    
    // Navegar a autenticación
    await page.click('a:has-text("Autenticación")');
    await expect(page.locator('h2')).toContainText('Autenticación');
    
    // Mostrar formulario de registro
    await page.click('button:has-text("Registrarse")');
    
    await page.fill('input[placeholder="Nombre de usuario"]', 'demo_user');
    await page.fill('input[placeholder="Email"]', 'demo@portfolio.com');
    await page.fill('input[placeholder="Contraseña"]', 'demo123');
    
    // Volver a la página principal
    await page.click('a:has-text("Inicio")');
    await expect(page.locator('h1, .navbar-brand')).toContainText('Gestor de Tareas');
    
    // Navegar a la documentación de la API
    await page.goto('/api-docs');
    await expect(page.locator('h1')).toBeVisible();
    
    // Volver a la página principal
    await page.goto('/');
    await expect(page.locator('h1, .navbar-brand')).toContainText('Gestor de Tareas');
    
    // Mostrar responsive design
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('input[placeholder="Título de la tarea"]')).toBeVisible();
    
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('input[placeholder="Título de la tarea"]')).toBeVisible();
    
    // Volver a desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator('input[placeholder="Título de la tarea"]')).toBeVisible();
    
    // Eliminar la tarea demo
    await page.click('button[title="Eliminar"]').first();
    
    // Confirmar eliminación
    await page.click('button:has-text("Confirmar")');
    await expect(page.locator('h6').filter({ hasText: 'Demo Task Editada - Portfolio QA' })).not.toBeVisible();
  });
});
