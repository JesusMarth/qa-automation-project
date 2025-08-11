import { test, expect } from '@playwright/test';

test.describe('Task Manager Application', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar una sola vez antes de cada test
    await page.goto('/');
    // Esperar a que la página se cargue completamente
    await page.waitForLoadState('networkidle');
  });

  test('debería cargar la página principal', async ({ page }) => {
    // Verificar que la página se cargó
    await expect(page).toHaveTitle(/Gestor de Tareas/);
    
    // Verificar elementos básicos del navbar
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('a:has-text("Inicio")')).toBeVisible();
    await expect(page.locator('a:has-text("Autenticación")')).toBeVisible();
  });

  test('debería mostrar el título principal', async ({ page }) => {
    // Verificar título principal
    await expect(page.locator('h1, .navbar-brand')).toContainText('Gestor de Tareas');
  });

  test('debería mostrar la estructura básica', async ({ page }) => {
    // Verificar que hay contenido en la página
    await expect(page.locator('body')).toContainText('Gestor de Tareas');
    await expect(page.locator('body')).toContainText('Inicio');
    await expect(page.locator('body')).toContainText('Autenticación');
  });

  test('debería navegar a autenticación', async ({ page }) => {
    // Navegar a autenticación
    await page.click('a:has-text("Autenticación")');
    
    // Esperar a que la página se cargue
    await page.waitForLoadState('networkidle');
    
    // Verificar que estamos en la página correcta
    await expect(page.locator('body')).toContainText('Autenticación');
  });

  test('debería ser responsive', async ({ page }) => {
    // Configurar viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verificar que la página sigue funcionando
    await expect(page.locator('body')).toContainText('Gestor de Tareas');
  });
}); 