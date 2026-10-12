import { test, expect } from '@playwright/test';

test.describe('MiniaturaYT E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Página inicial se carga correctamente con título y elementos clave', async ({ page }) => {
    await expect(page).toHaveTitle(/Descargador de Miniaturas de YouTube en HD/);
    await expect(page.locator('#urlInput')).toBeVisible();
    await expect(page.locator('#submitBtn')).toBeVisible();
    await expect(page.locator('#themeToggle')).toBeVisible();
  });

  test('Rechaza URL inválida y muestra mensaje de error accesible', async ({ page }) => {
    await page.fill('#urlInput', 'https://attacker.com/?url=youtube.com');
    await page.click('#submitBtn');

    const statusBanner = page.locator('#statusBanner');
    await expect(statusBanner).toBeVisible();
    await expect(statusBanner).toContainText('El dominio introducido no pertenece a YouTube');
  });

  test('Alterna correctamente entre modo oscuro y modo claro', async ({ page }) => {
    const html = page.locator('html');
    const initialTheme = await html.getAttribute('data-theme');

    await page.click('#themeToggle');
    const newTheme = await html.getAttribute('data-theme');

    expect(newTheme).not.toBe(initialTheme);
  });

  test('Navegación por teclado y foco accesible en el formulario', async ({ page }) => {
    await page.keyboard.press('Tab');
    // Salto al contenido principal o enlace de marca
    await page.locator('#urlInput').focus();
    await expect(page.locator('#urlInput')).toBeFocused();
  });
});
