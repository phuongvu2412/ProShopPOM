import LoginPage from "../../pageobjects/auth/login.page.js";
import ProfilePage from "../../pageobjects/auth/profile.page.js";
import OrdersSummaryPage from "../../pageobjects/orders/ordersSummary.page.js";

describe("EPIC 3.2: View Order History", () => {
    before(async () => {
        await LoginPage.open("/login");
        await LoginPage.login("group5@gmail.com", "123456");

        await browser.waitUntil(
            async () =>
                (await browser.execute(() =>
                    localStorage.getItem("userInfo")
                )) !== null,
            { timeout: 2000 }
        );
    });

    beforeEach(async () => {
        await browser.url("/profile");
    });

    it("EP03.2_01 - Verify list of existing and past orders", async () => {
        await ProfilePage.ordersTable.waitForDisplayed({ timeout: 5000 });
        await expect(ProfilePage.ordersTable).toBeDisplayed();
    });
    it("EP03.2_02 - Verify working of detail button", async () => {
        await ProfilePage.ordersTable.waitForDisplayed({ timeout: 5000 });
        await expect(ProfilePage.ordersTable).toBeDisplayed();
        await ProfilePage.clickFirstDetails();
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes("/order/"),
            {
                timeout: 5000,
                timeoutMsg: "Not redirect to Order Details page",
            }
        );
        const currentUrl = await browser.getUrl();
        expect(currentUrl).toContain("/order/");
        // Check heading
        // await OrdersSummaryPage.heading.waitForDisplayed({ timeout: 5000 });
        // const headingText = await OrdersSummaryPage.heading.getText();
        // expect(headingText).toMatch(/Order\s+[a-f0-9]+/i);
    });
    it("EP03.2_03 - Verify the order is delivered and paid", async () => {
        await ProfilePage.clickFirstDetails();
        await OrdersSummaryPage.heading.waitForDisplayed({ timeout: 5000 });
        const paidText = await OrdersSummaryPage.getPaidText();
        expect(paidText).toMatch(/Paid/);
        const deliveredText = await OrdersSummaryPage.getDeliveredText();
        expect(deliveredText).toMatch(/Delivered/);
    });

    it("EP03.2_04 - Verify the order is paid but not delivered", async () => {
        await ProfilePage.waitForOrders(8);
        await ProfilePage.clickDetailsByIndex(4);
        await OrdersSummaryPage.heading.waitForDisplayed({ timeout: 5000 });
        expect(await OrdersSummaryPage.isPaid()).toBe(true);
        expect(await OrdersSummaryPage.isNotDelivered()).toBe(true);
    });
    it("EP03.2_05 - Verify the payment is not delivered and not paid", async () => {
        await ProfilePage.waitForOrders(8);
        await ProfilePage.clickDetailsByIndex(5);
        await OrdersSummaryPage.heading.waitForDisplayed({ timeout: 5000 });
        await expect(await OrdersSummaryPage.isNotPaid()).toBe(true);
        await expect(await OrdersSummaryPage.isNotDelivered()).toBe(true);
    });
});
