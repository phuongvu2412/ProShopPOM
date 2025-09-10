import LoginPage from "../../pageobjects/auth/login.page.js";
import ProductListPage from "../../pageobjects/products/productList.page.js";
import ProductDetailsPage from "../../pageobjects/products/productDetails.page.js";
import CartPage from "../../pageobjects/orders/cart.page.js";
import HeaderPage from "../../pageobjects/common/header.page.js";

describe("EPIC 3.1: Place an Order", () => {
    before(async () => {
        await LoginPage.open("/login");
        await LoginPage.login("seves2@gmail.com", "123456As");

        await browser.waitUntil(
            async () =>
                (await browser.execute(() =>
                    localStorage.getItem("userInfo")
                )) !== null,
            { timeout: 2000 }
        );
    });

    beforeEach(async () => {
        await browser.url("/");
    });

    it("EP03.1_01 - Verify adding products to cart successfully", async () => {
        await ProductListPage.openFirstProduct();
        await ProductDetailsPage.selectQuantity(5);
        await ProductDetailsPage.addToCart();

        const url = await browser.getUrl();
        expect(url).toContain("/cart");

        expect(await CartPage.cartItems[0].isDisplayed()).toBe(true);
        expect(await CartPage.quantitySelects[0].getValue()).toBe("5");
        await browser.pause(30000);
    });

    it("EP03.1_02 - Verify Cart button can be clicked", async () => {
        await ProductListPage.cartIcon.click();
        const url = await browser.getUrl();
        expect(url).toContain("/cart");
        expect(await CartPage.subtotalText.isDisplayed()).toBe(true);
        await browser.pause(30000); // Testing
    });

    it("EP03.1_03 - Verify product quantity displays on Cart icon", async () => {
        await ProductListPage.openFirstProduct();
        await ProductDetailsPage.selectQuantity(2);
        await ProductDetailsPage.addToCart();

        await browser.url("/");
        const cartText = await ProductListPage.getCartIconText();
        expect(cartText).toContain("2");
        await browser.pause(30000); // Testing
    });
    it.only("EP03.1_04 - Verify cart is cleared after logout & login", async () => {
        // Step 1: Add product vào cart (qty = 2)
        await ProductListPage.openFirstProduct();
        await ProductDetailsPage.selectQuantity(2);
        await ProductDetailsPage.addToCart();

        // Lấy số lượng trước khi logout
        await browser.url("/");
        let cartTextBefore = await ProductListPage.getCartIconText();
        expect(cartTextBefore).toContain("2");

        // Step 2: Logout
        await HeaderPage.logout();
        expect(await HeaderPage.isLoggedOut()).toBe(true);

        // Step 3: Login lại
        await LoginPage.open("/login");
        await LoginPage.login("seves2@gmail.com", "123456As");
        await browser.waitUntil(async () => await HeaderPage.isLoggedIn(), {
            timeout: 10000,
        });

        // Step 4: Check giỏ hàng sau login lại (expect rỗng)
        await browser.url("/");
        let cartTextAfter = await ProductListPage.getCartIconText();
        expect(cartTextAfter).toBe("Cart");
    });
});
