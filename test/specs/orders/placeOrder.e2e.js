import LoginPage from "../../pageobjects/auth/login.page.js";
import ProductListPage from "../../pageobjects/products/productList.page.js";
import ProductDetailsPage from "../../pageobjects/products/productDetails.page.js";
import CartPage from "../../pageobjects/orders/cart.page.js";
import ShippingPage from "../../pageobjects/orders/shipping.page.js";
import PaymentPage from "../../pageobjects/orders/payment.page.js";
import PlaceOrderPage from "../../pageobjects/orders/placeOrder.page.js";
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
            { timeout: 5000, timeoutMsg: "Login failed - userInfo not found" }
        );
    });

    beforeEach(async () => {
        await browser.execute(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
        await browser.url("/");

        const userInfo = await browser.execute(() =>
            localStorage.getItem("userInfo")
        );
        if (!userInfo) {
            await LoginPage.open("/login");
            await LoginPage.login("seves2@gmail.com", "123456As");

            await browser.waitUntil(
                async () =>
                    (await browser.execute(() =>
                        localStorage.getItem("userInfo")
                    )) !== null,
                {
                    timeout: 5000,
                    timeoutMsg: "Login failed - userInfo not found",
                }
            );
        }
    });

    it("EP03.1_01 - Verify adding products to cart successfully", async () => {
        await ProductListPage.openProductByIndex(4);
        await ProductDetailsPage.selectQuantity(5);
        await ProductDetailsPage.addToCart();
        expect(await browser.getUrl()).toContain("/cart");
        expect(await CartPage.cartItems[0].isDisplayed()).toBe(true);
        expect(await CartPage.quantitySelects[0].getValue()).toBe("5");
    });

    it("EP03.1_02 - Verify Cart button can be clicked", async () => {
        await ProductListPage.cartIcon.click();
        expect(await browser.getUrl()).toContain("/cart");
        expect(await CartPage.cartheadingText.isDisplayed()).toBe(true);
    });

    it("EP03.1_03 - Verify product quantity displays on Cart icon", async () => {
        const before = await ProductListPage.getCartCount();
        await ProductListPage.addFirstProductToCart(2);
        await browser.url("/");
        const after = await ProductListPage.getCartCount();
        expect(after).toBe(before + 2);
    });

    it("EP03.1_04 - Verify cart is cleared after logout & login", async () => {
        await ProductListPage.addFirstProductToCart(2);
        await HeaderPage.openCart();
        expect(await CartPage.cartItems.length).toBeGreaterThan(0);

        await HeaderPage.logout();
        expect(await HeaderPage.isLoggedOut()).toBe(true);

        await HeaderPage.login("seves2@gmail.com", "123456As");
        await HeaderPage.openCart();
        expect(await CartPage.isCartEmpty()).toBe(true);
    });

    it("EP03.1_05 - Verify delete product from Cart successfully", async () => {
        await ProductListPage.addFirstProductToCart(2);
        await ProductListPage.cartIcon.click();
        expect(await CartPage.cartItems.length).toBeGreaterThan(0);

        await CartPage.deleteButtons[0].click();
        await browser.waitUntil(async () => await CartPage.isCartEmpty(), {
            timeout: 5000,
            timeoutMsg: "Cart not empty",
        });

        const subtotal = await CartPage.getSubtotal();
        expect(subtotal).toContain("0");
        expect(await ProductListPage.hasCartBadge()).toBe(false);
    });

    it("EP03.1_06 - Verify modify product quantity successfully", async () => {
        await ProductListPage.addFirstProductToCart(2);
        await ProductListPage.cartIcon.click();
        expect(await CartPage.cartItems[0].isDisplayed()).toBe(true);

        const qtyBefore = await CartPage.quantitySelects[0].getValue();
        expect(qtyBefore).toBe("2");

        await CartPage.quantitySelects[0].selectByAttribute("value", "5");
        const qtyAfter = await CartPage.quantitySelects[0].getValue();
        expect(qtyAfter).toBe("5");

        const subtotalText = await CartPage.getSubtotal();
        expect(subtotalText).toContain("(5)");
    });

    it("EP03.1_08 - Verify proceed to checkout successfully", async () => {
        await ProductListPage.addFirstProductToCart(2);
        await ProductListPage.cartIcon.click();
        expect(await CartPage.cartItems[0].isDisplayed()).toBe(true);

        await CartPage.btnProceedToCheckout.click();
        expect(await browser.getUrl()).toContain("/shipping");
    });

    it("EP03.1_09 - Verify cannot checkout when no product in Cart", async () => {
        await browser.execute(() => {
            localStorage.clear();
            sessionStorage.clear();
        });

        await browser.url("/cart");

        await browser.waitUntil(async () => await CartPage.isCartEmpty(), {
            timeout: 5000,
            timeoutMsg: "Cart should be empty but it's not",
        });

        const isEnabled = await CartPage.btnProceedToCheckout.isEnabled();
        expect(isEnabled).toBe(false);
    });

    it("EP03.1_10 - Verify input the shipping information in input field successfully", async () => {
        await ProductListPage.addFirstProductToCart(2);
        await ProductListPage.cartIcon.click();

        await CartPage.btnProceedToCheckout.click();
        expect(await browser.getUrl()).toContain("/shipping");

        await ShippingPage.inputAddress.waitForDisplayed({ timeout: 10000 });

        const shippingData = {
            address:
                "The Hallmark, 15 Tran Bach Dang, Thu Thiem, Thu Duc, HCM city",
            city: "HCM city",
            postalCode: "007000",
            country: "Vietnam",
        };

        await ShippingPage.fillShippingForm(
            shippingData.address,
            shippingData.city,
            shippingData.postalCode,
            shippingData.country
        );

        expect(await ShippingPage.inputAddress.getValue()).toBe(
            shippingData.address
        );
        expect(await ShippingPage.inputCity.getValue()).toBe(shippingData.city);
        expect(await ShippingPage.inputPostalCode.getValue()).toBe(
            shippingData.postalCode
        );
        expect(await ShippingPage.inputCountry.getValue()).toBe(
            shippingData.country
        );
    });

    it("EP03.1_11 - Verify can navigate to Payment", async () => {
        await ProductListPage.addFirstProductToCart(2);
        await ProductListPage.cartIcon.click();

        await CartPage.btnProceedToCheckout.click();
        await ShippingPage.inputAddress.waitForDisplayed({ timeout: 10000 });
        await ShippingPage.fillShippingForm("addr", "HCM", "007000", "Vietnam");
        await ShippingPage.continueToPayment();

        expect(await browser.getUrl()).toContain("/payment");
    });

    it("EP03.1_12 - Verify cannot continue when input field is blank", async () => {
        await ProductListPage.addFirstProductToCart(2);
        await ProductListPage.cartIcon.click();

        await CartPage.btnProceedToCheckout.click();
        await ShippingPage.inputAddress.waitForDisplayed({ timeout: 10000 });
        await ShippingPage.fillShippingForm("addr", "HCM", "007000", "");
        await ShippingPage.btnContinue.click();

        const currentUrl = await browser.getUrl();
        expect(currentUrl).toContain("/shipping");
        expect(currentUrl).not.toContain("/payment");
    });

    it("EP03.1_13 - Verify choose Payment Method successfully", async () => {
        await ProductListPage.addFirstProductToCart(2);
        await ProductListPage.cartIcon.click();

        await CartPage.btnProceedToCheckout.click();
        await ShippingPage.inputAddress.waitForDisplayed({ timeout: 10000 });
        await ShippingPage.fillShippingForm("addr", "HCM", "007000", "Vietnam");
        await ShippingPage.continueToPayment();

        expect(await PaymentPage.heading.isDisplayed()).toBe(true);

        await PaymentPage.selectPaypal();
        expect(await PaymentPage.radioPaypal.isSelected()).toBe(true);
    });

    it("EP03.1_14 - Verify navigate to Place Order successfully", async () => {
        await ProductListPage.addFirstProductToCart(2);
        await ProductListPage.cartIcon.click();

        await CartPage.btnProceedToCheckout.click();
        await ShippingPage.inputAddress.waitForDisplayed({ timeout: 10000 });
        await ShippingPage.fillShippingForm("addr", "HCM", "007000", "Vietnam");
        await ShippingPage.continueToPayment();

        await PaymentPage.selectPaypal();
        await PaymentPage.continue();

        expect(await browser.getUrl()).toContain("/placeorder");
    });

    it("EP03.1_16 - Verify Place Order successfully", async () => {
        await ProductListPage.addFirstProductToCart(2);
        await ProductListPage.cartIcon.click();

        await CartPage.btnProceedToCheckout.click();
        const url = await browser.getUrl();
        expect(url).toContain("/shipping");

        await ShippingPage.inputAddress.waitForDisplayed({ timeout: 10000 });
        await ShippingPage.fillShippingForm("addr", "HCM", "007000", "Vietnam");
        await ShippingPage.continueToPayment();

        await PaymentPage.selectPaypal();
        await PaymentPage.continue();

        await PlaceOrderPage.placeOrder();

        await browser.waitUntil(
            async () => (await browser.getUrl()).includes("/order/"),
            { timeout: 10000, timeoutMsg: "Not navigate to Order Summary page" }
        );

        const headingText = await PlaceOrderPage.heading.getText();
        expect(headingText.includes("Order Summary")).toBe(true);

        const items = await PlaceOrderPage.getOrderSummary();
        expect(items.length).toBeGreaterThan(0);
    });
});
