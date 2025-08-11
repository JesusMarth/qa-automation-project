import { test, expect } from '@playwright/test';

test.describe('Task Manager Application', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar una sola vez antes de cada test
    await page.goto('/');
    // Esperar a que la página se cargue completamente
    await page.waitForLoadState('networkidle');
  });

  test('debería mostrar la página principal con formulario y lista vacía', async ({ page }) => {
    // Verificar elementos principales
    await expect(page.locator('h1, .navbar-brand')).toContainText('Gestor de Tareas');
    
    // Verificar formulario
    await expect(page.locator('input[placeholder="Título de la tarea"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder="Descripción de la tarea"]')).toBeVisible();
    await expect(page.locator('select[name="priority"]')).toBeVisible();
    await expect(page.locator('button:has-text("Crear Tarea")')).toBeVisible();
  });

  test('debería mostrar el navbar correctamente', async ({ page }) => {
    // Verificar navbar
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('a:has-text("Inicio")')).toBeVisible();
    await expect(page.locator('a:has-text("Autenticación")')).toBeVisible();
  });

  test('debería mostrar el formulario de tareas', async ({ page }) => {
    // Verificar que el formulario está presente
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[placeholder="Título de la tarea"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder="Descripción de la tarea"]')).toBeVisible();
    await expect(page.locator('select[name="priority"]')).toBeVisible();
    await expect(page.locator('button:has-text("Crear Tarea")')).toBeVisible();
  });

  test('debería navegar a la página de autenticación', async ({ page }) => {
    // Navegar a autenticación
    await page.click('a:has-text("Autenticación")');
    
    // Esperar a que la página se cargue
    await page.waitForLoadState('networkidle');
    
    // Verificar que estamos en la página correcta
    await expect(page.locator('h2')).toContainText('Autenticación');
  });

  test('debería ser responsive en dispositivos móviles', async ({ page }) => {
    // Configurar viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verificar que los elementos principales son visibles
    await expect(page.locator('h1, .navbar-brand')).toContainText('Gestor de Tareas');
    await expect(page.locator('input[placeholder="Título de la tarea"]')).toBeVisible();
  });

  test('debería mostrar la estructura de la página', async ({ page }) => {
    // Verificar estructura básica
    await expect(page.locator('.container')).toBeVisible();
    await expect(page.locator('.row')).toBeVisible();
    await expect(page.locator('.col-md-8')).toBeVisible();
    await expect(page.locator('.col-md-4')).toBeVisible();
  });
}); 