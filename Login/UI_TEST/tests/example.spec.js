// @ts-check
import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';

// Variuables de prueba
const username = 'standard_user';
const password = 'secret_sauce'

// Inicialización de POM

let loginPage;

test.beforeEach(async ({page}) => {
  loginPage = new LoginPage(page);
  await loginPage.navigate();
});

// Prueba login exitoso
test('Login Exitoso', async ({ page }) => {
  await loginPage.login(username, password);
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

// Prueba login negativo
test('Login Fallido', async ({ page }) => {
  await loginPage.login(username, 'password');
  await expect(loginPage.errorMessage).toBeVisible();
   await expect(page).toHaveURL('https://www.saucedemo.com');
});
