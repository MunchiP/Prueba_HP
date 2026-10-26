
import { test, expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage.js";
import InventoryPage from "../pages/InventoryPage.js";
import CartPage from "../pages/CarPage.js";
import { readFile, mkdir } from "node:fs/promises";
import { PDFDocument } from "pdf-lib";

test("Completar compra y validar PDF descargado", async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.navigate();
    await loginPage.login("standard_user", "secret_sauce");

    const products = [
        "Sauce Labs Backpack",
        "Sauce Labs Bike Light"
    ];

    await inventoryPage.addMultipleProductsToCart(products);
    await inventoryPage.openCart();

    await expect(page).toHaveURL(
        "https://www.saucedemo.com/cart.html"
    );

    await page.locator("#checkout").click();

    await expect(page).toHaveURL(
        "https://www.saucedemo.com/checkout-step-one.html"
    );

    await page.locator("#first-name").fill("Paula");
    await page.locator("#last-name").fill("Amaya");
    await page.locator("#postal-code").fill("11111");

    await page.locator("#continue").click();

    await expect(page).toHaveURL(
        "https://www.saucedemo.com/checkout-step-two.html"
    );

    await page.locator("#finish").click();

    await expect(page).toHaveURL(
        "https://www.saucedemo.com/checkout-complete.html"
    );

    await expect(
        page.getByText(/thank you for your order/i)
    ).toBeVisible();

    // 1. Preparar la espera ANTES del clic
    const downloadPromise = page.waitForEvent("download");

    // 2. Generar y descargar el PDF desde la aplicación
    await page.locator("#generate-pdf-order").click();

    const download = await downloadPromise;

    console.log("Nombre del archivo:", download.suggestedFilename());

    // 3. Comprobar que la descarga no falló
    expect(await download.failure()).toBeNull();

    // 4. Guardar el archivo descargado
    const outputDirectory = testInfo.outputPath("pdf");
    await mkdir(outputDirectory, { recursive: true });

    const filePath = testInfo.outputPath(
        "pdf",
        download.suggestedFilename()
    );

    await download.saveAs(filePath);

    console.log("Archivo guardado en:", filePath);

    // 5. Leer el archivo descargado, no uno anterior
    const contenido = await readFile(filePath);

    expect(contenido.length).toBeGreaterThan(0);

    // 6. Comprobar la firma interna del PDF
    const firma = contenido.subarray(0, 5).toString("ascii");

    console.log("Firma detectada:", firma);

    expect(firma).toBe("%PDF-");

    // 7. Intentar analizar la estructura del documento
    const documentoPDF = await PDFDocument.load(contenido);

    const numeroPaginas = documentoPDF.getPageCount();

    console.log("PDF válido: el documento se pudo analizar.");
    console.log("Número de páginas:", numeroPaginas);

    expect(numeroPaginas).toBeGreaterThan(0);

    // 8. Adjuntar el PDF al reporte de Playwright
    await testInfo.attach("order.pdf", {
        path: filePath,
        contentType: "application/pdf"
    });
});
