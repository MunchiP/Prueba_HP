import { test, expect } from "@playwright/test";

import LoginPage from "../pages/LoginPage.js";
import InventoryPage from "../pages/InventoryPage.js";
import CartPage from "../pages/CarPage.js";

test("Verificar que los productos seleccionados estén en el carrito", async ({
  page,
}) => {
  // Creamos los objetos que necesitamos para la prueba.
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await loginPage.navigate();
  await loginPage.login("standard_user", "secret_sauce");

  // Definimos los productos que queremos seleccionar.
  const products = ["Sauce Labs Backpack", "Sauce Labs Bike Light"];

  // Agregamos los productos al carrito.
  await inventoryPage.addMultipleProductsToCart(products);

  // Abrimos la página del carrito.
  await inventoryPage.openCart();

  // Verificamos que estamos en la URL correcta.
  await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");

  await page.locator("#checkout").click();

  await expect(page).toHaveURL(
    "https://www.saucedemo.com/checkout-step-one.html",
  );

  // Proceso para terminar la compra - datos de compra
  await page.locator("#first-name").fill("Paula");
  await page.locator("#last-name").fill("Amaya");
  await page.locator("#postal-code").fill("11111");

  // Valido la confirmación

  await page.locator("#continue").click();

  await expect(page).toHaveURL(
    "https://www.saucedemo.com/checkout-step-two.html",
  );

  await page.locator("#finish").click();

  await expect(page).toHaveURL(
    "https://www.saucedemo.com/checkout-complete.html",
  );

  // await expect( page.pageByText('Tank you for you order!')).toBiVisible();

  // Paso de descarga en el botón

  await page.locator("#generate-pdf-order").click();

  // Varificación de que es PDF
  const downloadPromise = page.waitForEvent("download");
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toMatch(/\.pdf$/); // valido la extensión del archivo

  expect(await download.failure()).toBeNull(); // y valido que la descarga no haya fallado
});
