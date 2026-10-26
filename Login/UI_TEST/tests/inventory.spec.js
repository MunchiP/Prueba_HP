import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import InventoryPage from '../pages/InventoryPage.js';

test('Agregar varios productos al carrito', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // No usamos la lógica del Logín para respetar el proceso de cada prueba
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(inventoryPage.pageTitle).toHaveText('Products');

    // Variables de prueba para agregar al carro
    const products = [
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light'
    ];

    await inventoryPage.addMultipleProductsToCart(products);

    // Hago una verificación en el contarto del carrito verificando persistencia
    await expect(inventoryPage.cartLink).toHaveAttribute(
        'aria-label',
        'Cart, 2 items'
    );

    await inventoryPage.openCart();

    await expect(page).toHaveURL(
        'https://www.saucedemo.com/cart.html'
    );

    // Recorro el mismo arreglo para evitar repetir aserciones.
    for (const productName of products) {
        await expect(
            page.getByText(productName, { exact: true })
        ).toBeVisible();
    }
});
