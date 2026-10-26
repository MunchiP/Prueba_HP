class InventoryPage {
    constructor(page) {
        this.page = page;
        this.pageTitle = page.locator('.title'); // Guardo el título de la página para verificar que estoy en Productos - verifico si cargó
        this.cartLink = page.locator('[data-test="shopping-cart-link"]'); //
    }

    async addProductToCart(productName) {
        const product = this.page.locator(
            '[data-test="inventory-item"]'
        ).filter({
            has: this.page.getByText(productName, { exact: true })
        });

        await product.locator('button').click();
    }

        // Agrego varios productos a partir de un arreglo de nombres...
    async addMultipleProductsToCart(productNames) {

        for (const productName of productNames) {
            await this.addProductToCart(productName);
        }
    }
    
    async openCart() {
        await this.cartLink.click();
    }
}

export default InventoryPage;