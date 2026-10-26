import { test, expect } from '@playwright/test';

import LoginPage from '../pages/LoginPage.js';
import InventoryPage from '../pages/InventoryPage.js';
import CartPage from '../pages/CarPage.js';

test('Verificar que los productos seleccionados estén en el carrito', async ({ page }) => {

    // Creamos los objetos que necesitamos para la prueba.
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');

    // Definimos los productos que queremos seleccionar.
    const products = [
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light'
    ];

    // Agregamos los productos al carrito.
    await inventoryPage.addMultipleProductsToCart(products);

    // Abrimos la página del carrito.
    await inventoryPage.openCart();

    // Verificamos que estamos en la URL correcta.
    await expect(page).toHaveURL(
        'https://www.saucedemo.com/cart.html'
    );

    // Comprobamos que todos los productos seleccionados aparezcan.
    await cartPage.expectProductsVisible(products);
});
