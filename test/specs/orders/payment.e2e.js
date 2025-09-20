import LoginPage from "../../pageobjects/auth/login.page.js";
import ProductListPage from "../../pageobjects/products/productList.page.js";
import CartPage from "../../pageobjects/orders/cart.page.js";
import ShippingPage from "../../pageobjects/orders/shipping.page.js";
import PlaceOrderPage from "../../pageobjects/orders/placeOrder.page.js";
import PaymentPage from "../../pageobjects/orders/payment.page.js";

const user = { email: "group5@gmail.com", password: "123456" };
const shipping = {
    address: "123 Cong Hoa",
    city: "Tan Binh",
    postalCode: "70000",
    country: "Vietnam",
};

describe("EPIC 3.4: PAYMENT PROCESS", () => {
    beforeEach(async () => {
        await LoginPage.open("/login");
        await LoginPage.login(user.email, user.password);
        await ProductListPage.addFirstProductToCart();
        await CartPage.proceedToCheckout();
        await ShippingPage.fillShippingForm(
            shipping.address,
            shipping.city,
            shipping.postalCode,
            shipping.country
        );
        await ShippingPage.continueToPayment();
        await PaymentPage.continue();
    });

    it("3.4_01. SUCCESSFUL PAYMENT WITH PAYPAL", async () => {
        await PlaceOrderPage.placeOrder();
        await PaymentPage.openOrderDetails();
        await PaymentPage.switchToPaypalFrame();

        // Complete PayPal payment
        await PaymentPage.fillPaypalEmail("seves2@gmail.com");
        await PaymentPage.clickNextPaypal();
        await PaymentPage.fillPaypalPassword("123456As");
        await PaymentPage.clickLoginPaypal();
        await PaymentPage.clickCompletePaypal();
        await browser.pause(5000);

        // Switch back to original window
        await PaymentPage.switchToOriginalWindow();
        await PaymentPage.backtoOrderDetails();

        // Verify Payment Status
        const paidText = await $("div=Paid on");
        await paidText.waitForExist({ timeout: 25000 });
        await expect(paidText).toBeExisting();
    });

    it("3.4_04. FAILED PAYMENT WITH USER CANCEL PAYPAL PAYMENT", async () => {
        await PlaceOrderPage.placeOrder();
        await PaymentPage.openOrderDetails();
        await PaymentPage.switchToPaypalFrame();

        // Fill in PayPal login details
        await PaymentPage.fillPaypalEmail("seves2@gmail.com");
        await PaymentPage.clickNextPaypal();
        await PaymentPage.fillPaypalPassword("123456As");
        await PaymentPage.clickLoginPaypal();
        await browser.pause(10000);

        // User cancels payment by clicking the close button on the PayPal window
        await browser.closeWindow();

        // Verify that the order is marked as not paid (has text "Not Paid")
        await PaymentPage.switchToOriginalWindow();
        await PaymentPage.backtoOrderDetails();
        const notPaidText = await $("div=Not Paid");
        await notPaidText.waitForExist({ timeout: 10000 });
        await expect(notPaidText).toBeExisting();
    });
    it("3.4_02. FAILED PAYMENT WITH PAYPAL (INVALID CREDENTIALS: WRONG EMAIL FORMAT)", async () => {
        await PlaceOrderPage.placeOrder();
        await PaymentPage.openOrderDetails();
        await PaymentPage.switchToPaypalFrame();

        // Fill in invalid email format
        await PaymentPage.fillPaypalEmail("notkimchiii");
        await PaymentPage.clickNextPaypal();
        await browser.pause(5000);

        // Verify error message
        const wrongPaypalEmailFormat = await $(
            "#emailErrorMessage .invalidError"
        );
        await wrongPaypalEmailFormat.waitForDisplayed({ timeout: 10000 });
        const text = await wrongPaypalEmailFormat.getText();
        expect(text).toContain(
            "That email or mobile number format isn’t right"
        );
        await browser.pause(5000);
        // Close PayPal window
        await browser.closeWindow();
        // Verify that the order is marked as not paid (has text "Not Paid")
        await PaymentPage.switchToOriginalWindow();
        await PaymentPage.backtoOrderDetails();
        const notPaidText = await $("div=Not Paid");
        await notPaidText.waitForExist({ timeout: 10000 });
        await expect(notPaidText).toBeExisting();
    });
    it("3.4_05. PAYPAL AMOUNT MATCHES ORDER TOTAL)", async () => {
        await PlaceOrderPage.placeOrder();
        await PaymentPage.openOrderDetails();
        await browser.pause(20000);

        // Get the order total from the order details page
        const totalValue = await $(
            "//div[text()='Total']/following-sibling::div"
        );
        const totalText = await totalValue.getText();

        await PaymentPage.switchToPaypalFrame();

        // Login to PayPal:
        await PaymentPage.fillPaypalEmail("seves2@gmail.com");
        await PaymentPage.clickNextPaypal();
        await PaymentPage.fillPaypalPassword("123456As");
        await PaymentPage.clickLoginPaypal();
        await browser.pause(5000);

        // switch to the amount element in PayPal window
        const priceElement = await $('[data-testid="fi-amount"] span');
        const priceText = await priceElement.getText();
        console.log("Price text: " + priceText);

        // Verify that the amount in PayPal matches the order total
        expect(priceText).toEqual(totalText);
        await browser.pause(5000);
    });

    afterEach(async () => {
        const handles = await browser.getWindowHandles();

        if (handles.length > 1) {
            // Still on PayPal window → clean & close it
            await browser.switchToWindow(handles[1]);
            await browser.deleteCookies();
            await browser.execute(() => {
                localStorage.clear();
                sessionStorage.clear();
            });
            await browser.closeWindow();
        }
        // Always ensure we end up on the main app window
        const finalHandles = await browser.getWindowHandles();
        await browser.switchToWindow(finalHandles[0]);
        // Defensive cleanup on main app as well
        await browser.deleteCookies();
        await browser.execute(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
    });
});
