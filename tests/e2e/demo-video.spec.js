import { test, expect } from '@playwright/test';

test.describe('Demo Video Generation', () => {
  test('Generate portfolio demo video', async ({ page }) => {
    // Configurar video y capturas de pantalla
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Navegar a la página principal
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Mostrar la página principal
    await page.waitForTimeout(1000);
    
    // Verificar elementos básicos
    await expect(page.locator('body')).toContainText('Gestor de Tareas');
    await expect(page.locator('body')).toContainText('Inicio');
    await expect(page.locator('body')).toContainText('Autenticación');
    
    // Mostrar formulario
    await page.waitForTimeout(1000);
    
    // Navegar a autenticación
    await page.click('a:has-text("Autenticación")');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText('Autenticación');
    
    // Mostrar página de autenticación
    await page.waitForTimeout(1000);
    
    // Volver a la página principal
    await page.click('a:has-text("Inicio")');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText('Gestor de Tareas');
    
    // Mostrar responsive design
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // Volver a desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(1000);
  });
});
