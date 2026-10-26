import { expect } from '@playwright/test';
class CartPage {
    constructor(page) {
        this.page = page;
        this.cartItems = page.locator(
            '[data-test="inventory-item"]'
        );
    }

    async expectProductVisible(productName) {
        const product = this.cartItems.filter({
            has: this.page.getByText(productName, {
                exact: true
            })
        });

        await expect(product).toBeVisible();
    }

    async expectProductsVisible(productNames) {
        for (const productName of productNames) {         // Recorre los nombres y comprueba cada producto.
            await this.expectProductVisible(productName);
        }
    }
}

export default CartPage;
