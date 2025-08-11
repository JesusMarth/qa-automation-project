import { test, expect } from '@playwright/test';

test.describe('Demo Video Generation', () => {
  test('Generate portfolio demo video', async ({ page }) => {
    // Configurar video y capturas de pantalla
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Navegar a la página principal
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Esperar un momento para mostrar la página principal
    await page.waitForTimeout(2000);
    
    // Crear una nueva tarea
    await page.click('text=Agregar Tarea');
    await page.waitForTimeout(1000);
    
    await page.fill('input[placeholder="Título de la tarea"]', 'Demo Task para Portfolio');
    await page.fill('textarea[placeholder="Descripción de la tarea"]', 'Esta es una tarea de demostración para mostrar las funcionalidades de la aplicación en mi portafolio de QA Automation.');
    await page.selectOption('select[name="priority"]', 'high');
    await page.waitForTimeout(1000);
    
    await page.click('button:has-text("Crear Tarea")');
    await page.waitForTimeout(2000);
    
    // Editar la tarea
    await page.click('text=Editar');
    await page.waitForTimeout(1000);
    
    await page.fill('input[placeholder="Título de la tarea"]', 'Demo Task Editada - Portfolio QA');
    await page.waitForTimeout(1000);
    
    await page.click('button:has-text("Actualizar")');
    await page.waitForTimeout(2000);
    
    // Navegar a autenticación
    await page.click('text=Autenticación');
    await page.waitForTimeout(2000);
    
    // Mostrar formulario de registro
    await page.click('text=Registrarse');
    await page.waitForTimeout(1000);
    
    await page.fill('input[placeholder="Nombre de usuario"]', 'demo_user');
    await page.fill('input[placeholder="Email"]', 'demo@portfolio.com');
    await page.fill('input[placeholder="Contraseña"]', 'demo123');
    await page.waitForTimeout(2000);
    
    // Volver a la página principal
    await page.click('text=Inicio');
    await page.waitForTimeout(2000);
    
    // Mostrar la lista de tareas
    await page.waitForTimeout(2000);
    
    // Navegar a la documentación de la API
    await page.goto('/api-docs');
    await page.waitForTimeout(3000);
    
    // Volver a la página principal
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Mostrar responsive design
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(2000);
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(2000);
    
    // Volver a desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(2000);
    
    // Eliminar la tarea demo
    await page.click('text=Eliminar');
    await page.waitForTimeout(1000);
    
    // Confirmar eliminación
    await page.click('button:has-text("Confirmar")');
    await page.waitForTimeout(2000);
    
    // Mostrar mensaje de éxito
    await page.waitForTimeout(2000);
  });
});
