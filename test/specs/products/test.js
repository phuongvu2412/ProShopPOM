import LoginPage from "../../pageobjects/auth/login.page.js";
import ProductListPage from "../../pageobjects/products/productList.page.js";
import ProductDetailsPage from "../../pageobjects/products/productDetails.page.js";
import CartPage from "../../pageobjects/orders/cart.page.js";
import ShippingPage from "../../pageobjects/orders/shipping.page.js";
import PaymentPage from "../../pageobjects/orders/payment.page.js";
import PlaceOrderPage from "../../pageobjects/orders/placeOrder.page.js";
import OrderDetailsPage from "../../pageobjects/orders/orderDetails.page.js";
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
    it("EP03.1_04 - Verify cart is cleared after logout & login", async () => {
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
    it("EP03.1_05 - Verify delete product from Cart successfully", async () => {
        // Step 1: Add product vào cart
        await ProductListPage.openFirstProduct();
        await ProductDetailsPage.selectQuantity(1);
        await ProductDetailsPage.addToCart();

        // Step 2: Vào giỏ hàng
        await ProductListPage.cartIcon.click();
        expect(await CartPage.cartItems[0].isDisplayed()).toBe(true);

        // Step 3: Delete sản phẩm (nút thùng rác)
        await CartPage.deleteButtons[0].click();

        // Step 4: Verify subtotal về 0
        await browser.waitUntil(
            async () => (await CartPage.getSubtotal()).includes("0"),
            { timeout: 5000, timeoutMsg: "Subtotal chưa về 0 sau khi xóa" }
        );

        // Step 5: Verify badge trên icon cart biến mất
        await browser.url("/");
        const badgeExists = await $(
            "span.badge.rounded-pill.bg-success"
        ).isExisting();
        expect(badgeExists).toBe(false);
    });
    it("EP03.1_06 - Verify modify product quantity successfully", async () => {
        // Step 1: Add product vào cart với qty = 3
        await ProductListPage.openFirstProduct();
        await ProductDetailsPage.selectQuantity(3);
        await ProductDetailsPage.addToCart();

        // Step 2: Vào cart
        await ProductListPage.cartIcon.click();
        expect(await CartPage.cartItems[0].isDisplayed()).toBe(true);

        // Step 3: Lấy giá trị trước khi đổi
        const qtyBefore = await CartPage.quantitySelects[0].getValue();
        console.log("Quantity before:", qtyBefore);
        expect(qtyBefore).toBe("3");

        // Step 4: Modify qty → 5
        await CartPage.quantitySelects[0].selectByAttribute("value", "5");

        // Step 5: Verify qty update
        const qtyAfter = await CartPage.quantitySelects[0].getValue();
        console.log("Quantity after:", qtyAfter);
        expect(qtyAfter).toBe("5");

        // Step 6: Verify subtotal update (giá * 5)
        const subtotalText = await CartPage.getSubtotal();
        expect(subtotalText).toContain("(5)"); // ví dụ: "Subtotal (5) items"
        await browser.pause(30000); // Testing
    });
    it("EP03.1_08 - Verify proceed to checkout successfully", async () => {
        // Step 1: Add product vào cart
        await ProductListPage.openFirstProduct();
        await ProductDetailsPage.selectQuantity(1);
        await ProductDetailsPage.addToCart();

        // Step 2: Vào giỏ hàng
        await ProductListPage.cartIcon.click();
        expect(await CartPage.cartItems[0].isDisplayed()).toBe(true);

        // Step 3: Click nút Proceed to Checkout
        await CartPage.btnProceedToCheckout.click();

        // Step 4: Verify điều hướng đúng trang
        const url = await browser.getUrl();
        expect(url).toContain("/shipping"); // hoặc /login?redirect=shipping nếu chưa login
        await browser.pause(30000); // Testing
        // Optional: Verify cart vẫn có sản phẩm (nếu ở shipping page hiển thị order summary)
    });
    it("EP03.1_09 - Verify cannot checkout when no product in Cart", async () => {
        // Step 1: Vào giỏ hàng
        const cartLink = await $("a.nav-link=Cart"); // link Cart luôn tồn tại
        await cartLink.click();

        // Step 2: Check có message "Your cart is empty"
        const emptyMsg = await $("div.alert-info=Your cart is empty");
        expect(await emptyMsg.isDisplayed()).toBe(true);

        // Step 3: Check nút checkout bị disable
        const isDisabled = await CartPage.btnProceedToCheckout.getAttribute(
            "disabled"
        );
        expect(isDisabled).toBe("true");
    });

    it("EP03.1_10 - Verify input the shipping information in input field successfully", async () => {
        // Step 1: Add sản phẩm vào giỏ để có thể checkout
        await ProductListPage.openFirstProduct();
        await ProductDetailsPage.selectQuantity(1);
        await ProductDetailsPage.addToCart();

        // Step 2: Vào giỏ hàng
        await ProductListPage.cartIcon.click();
        expect(await CartPage.cartItems[0].isDisplayed()).toBe(true);

        // Step 3: Click Proceed to Checkout
        await CartPage.btnProceedToCheckout.waitForClickable({ timeout: 5000 });
        await CartPage.btnProceedToCheckout.click();

        // Step 4: Verify Shipping page đã load
        const url = await browser.getUrl();
        expect(url).toContain("/shipping");

        // Step 5: Fill shipping form với data hợp lệ
        const address =
            "The Hallmark, 15 Tran Bach Dang, Thu Thiem, Thu Duc, HCM city";
        const city = "HCM city";
        const postalCode = "007000";
        const country = "Vietnam";

        await ShippingPage.fillShippingForm(address, city, postalCode, country);

        // Step 6: Verify dữ liệu nhập thành công
        expect(await ShippingPage.inputAddress.getValue()).toBe(address);
        expect(await ShippingPage.inputCity.getValue()).toBe(city);
        expect(await ShippingPage.inputPostalCode.getValue()).toBe(postalCode);
        expect(await ShippingPage.inputCountry.getValue()).toBe(country);
    });

    it("EP03.1_11 - Verify can navigate to Payment", async () => {
        await ProductListPage.openFirstProduct();
        await ProductDetailsPage.selectQuantity(1);
        await ProductDetailsPage.addToCart();

        await ProductListPage.cartIcon.click();
        expect(await CartPage.cartItems[0].isDisplayed()).toBe(true);

        await CartPage.btnProceedToCheckout.waitForClickable({ timeout: 5000 });
        await CartPage.btnProceedToCheckout.click();

        await browser.waitUntil(
            async () => (await browser.getUrl()).includes("/shipping"),
            { timeout: 10000, timeoutMsg: "Không điều hướng đến Shipping page" }
        );

        await ShippingPage.fillShippingForm(
            "The Hallmark, 15 Tran Bach Dang, Thu Thiem, Thu Duc, HCM city",
            "HCM city",
            "007000",
            "Vietnam"
        );

        await ShippingPage.btnContinue.waitForClickable({ timeout: 5000 });
        await ShippingPage.continueToPayment();

        await browser.waitUntil(
            async () => (await browser.getUrl()).includes("/payment"),
            { timeout: 10000, timeoutMsg: "Không điều hướng sang Payment page" }
        );

        const paymentUrl = await browser.getUrl();
        expect(paymentUrl).toContain("/payment");

        await browser.pause(30000);
    });

    it("EP03.1_12 - Verify cannot continue when input field is blank", async () => {
        await ProductListPage.openFirstProduct();
        await ProductDetailsPage.selectQuantity(1);
        await ProductDetailsPage.addToCart();

        await ProductListPage.cartIcon.click();
        expect(await CartPage.cartItems[0].isDisplayed()).toBe(true);

        await CartPage.btnProceedToCheckout.waitForClickable({ timeout: 5000 });
        await CartPage.btnProceedToCheckout.click();

        await browser.waitUntil(
            async () => (await browser.getUrl()).includes("/shipping"),
            { timeout: 10000, timeoutMsg: "Không điều hướng đến Shipping page" }
        );

        await ShippingPage.fillShippingForm(
            "The Hallmark, 15 Tran Bach Dang, Thu Thiem, Thu Duc, HCM city",
            "HCM city",
            "007000",
            "" 
        );

        await ShippingPage.btnContinue.waitForDisplayed({ timeout: 5000 });
        await ShippingPage.btnContinue.click();

        const currentUrl = await browser.getUrl();
        expect(currentUrl).not.toContain("/payment");

        expect(currentUrl).toContain("/shipping");
    });

    it("EP03.1_13 - Verify choose Payment Method successfully", async () => {
        await ProductListPage.openFirstProduct();
        await ProductDetailsPage.selectQuantity(1);
        await ProductDetailsPage.addToCart();

        await ProductListPage.cartIcon.click();
        expect(await CartPage.cartItems[0].isDisplayed()).toBe(true);

        await CartPage.btnProceedToCheckout.waitForClickable({ timeout: 5000 });
        await CartPage.btnProceedToCheckout.click();

        await browser.waitUntil(
            async () => (await browser.getUrl()).includes("/shipping"),
            { timeout: 10000, timeoutMsg: "Không điều hướng đến Shipping page" }
        );

        await ShippingPage.fillShippingForm(
            "The Hallmark, 15 Tran Bach Dang, Thu Thiem, Thu Duc, HCM city",
            "HCM city",
            "007000",
            "Vietnam"
        );
        await ShippingPage.continueToPayment();

        await browser.waitUntil(
            async () => (await browser.getUrl()).includes("/payment"),
            { timeout: 10000, timeoutMsg: "Không điều hướng sang Payment page" }
        );
        expect(await PaymentPage.heading.isDisplayed()).toBe(true);

        await PaymentPage.selectPaypal();
        expect(await PaymentPage.radioPaypal.isSelected()).toBe(true);
    });
    it("EP03.1_14 - Verify navigate to Place Order successfully", async () => {
        await ProductListPage.openFirstProduct();
        await ProductDetailsPage.selectQuantity(1);
        await ProductDetailsPage.addToCart();

        await ProductListPage.cartIcon.click();
        expect(await CartPage.cartItems[0].isDisplayed()).toBe(true);

        await CartPage.btnProceedToCheckout.click();

        await ShippingPage.fillShippingForm(
            "The Hallmark, 15 Tran Bach Dang, Thu Thiem, Thu Duc, HCM city",
            "HCM city",
            "007000",
            "Vietnam"
        );
        await ShippingPage.continueToPayment();

        await PaymentPage.selectPaypal();
        await PaymentPage.continue();

        await browser.waitUntil(
            async () => (await browser.getUrl()).includes("/placeorder"),
            {
                timeout: 10000,
                timeoutMsg: "Không điều hướng sang trang Place Order",
            }
        );

        const url = await browser.getUrl();
        expect(url).toContain("/placeorder");
    });
    it("EP03.1_15 - Verify cannot navigate to Place Order when Payment Method is blank", async () => {
        await ProductListPage.openFirstProduct();
        await ProductDetailsPage.selectQuantity(1);
        await ProductDetailsPage.addToCart();

        await ProductListPage.cartIcon.click();
        expect(await CartPage.cartItems[0].isDisplayed()).toBe(true);

        await CartPage.btnProceedToCheckout.click();

        await ShippingPage.fillShippingForm(
            "The Hallmark, 15 Tran Bach Dang, Thu Thiem, Thu Duc, HCM city",
            "HCM city",
            "007000",
            "Vietnam"
        );
        await ShippingPage.continueToPayment();

        expect(await PaymentPage.radioPaypal.isDisplayed()).toBe(true);

        await PaymentPage.btnContinue.waitForClickable({ timeout: 5000 });
        await PaymentPage.btnContinue.click();

        const url = await browser.getUrl();
        expect(url).not.toContain("/placeorder");

        expect(await PaymentPage.heading.isDisplayed()).toBe(true);

        await browser.pause(30000); 
    });

    it.only("EP03.1_16 - Verify Place Order successfully", async () => {
        await ProductListPage.openFirstProduct();
        await ProductDetailsPage.selectQuantity(1);
        await ProductDetailsPage.addToCart();

        await ProductListPage.cartIcon.waitForClickable({ timeout: 5000 });
        await ProductListPage.cartIcon.click();
        await CartPage.btnProceedToCheckout.waitForClickable({ timeout: 5000 });
        await CartPage.btnProceedToCheckout.click();

        await ShippingPage.fillShippingForm(
            "The Hallmark, 15 Tran Bach Dang, Thu Thiem, Thu Duc, HCM city",
            "HCM",
            "007000",
            "Vietnam"
        );
        await ShippingPage.continueToPayment();

        await PaymentPage.selectPaypal();
        await PaymentPage.continue();

        await PlaceOrderPage.btnPlaceOrder.waitForClickable({ timeout: 10000 });
        await PlaceOrderPage.placeOrder();

        await browser.waitUntil(
            async () => (await browser.getUrl()).includes("/order/"),
            {
                timeout: 10000,
                timeoutMsg: "Không điều hướng sang trang Order Summary",
            }
        );
        const currentUrl = await browser.getUrl();
        expect(currentUrl.includes("/order/")).toBe(true);

        await PlaceOrderPage.heading.waitForDisplayed({ timeout: 10000 });
        const headingText = await PlaceOrderPage.heading.getText();
        expect(headingText.includes("Order Summary")).toBe(true);

        const items = await PlaceOrderPage.getOrderSummary();
        expect(items.length).toBeGreaterThan(0);

        console.log("✅ Order Summary Items:");
        items.forEach((item, idx) => console.log(`  ${idx + 1}. ${item}`));
    });
});
