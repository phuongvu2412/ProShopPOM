import LoginPage from "../../pageobjects/auth/login.page.js";
import OrdersSummaryPage from "../../pageobjects/orders/ordersSummary.page.js";

describe("EPIC 3.5: Mark as Delivered", () => {
    before(async () => {
        await LoginPage.open("/login");
        await LoginPage.login("admin@email.com", "123456");

        await browser.waitUntil(
            async () =>
                (await browser.execute(() =>
                    localStorage.getItem("userInfo")
                )) !== null,
            { timeout: 3000 }
        );
    });

    it("EP03.5_01 - Paid + Delivered → không hiển thị nút Mark As Delivered", async () => {
        await browser.url("/order/68c95cf54084cdc891d43b36");

        await OrdersSummaryPage.heading.waitForDisplayed({ timeout: 5000 });

        const paid = await OrdersSummaryPage.isPaid();
        const delivered = await OrdersSummaryPage.isDelivered();
        const hasBtn = await OrdersSummaryPage.hasMarkDeliveredBtn();

        expect(paid).toBe(true);
        expect(delivered).toBe(true);
        expect(hasBtn).toBe(false);
    });

    it("EP03.5_02 - Not Paid + Not Delivered → không hiển thị nút Mark As Delivered", async () => {
        await browser.url("/order/68c95d5a4084cdc891d43b5f");

        await OrdersSummaryPage.heading.waitForDisplayed({ timeout: 5000 });

        const notPaid = await OrdersSummaryPage.isNotPaid();
        const notDelivered = await OrdersSummaryPage.isNotDelivered();
        const hasBtn = await OrdersSummaryPage.hasMarkDeliveredBtn();

        expect(notPaid).toBe(true);
        expect(notDelivered).toBe(true);
        expect(hasBtn).toBe(false);
    });

    it("EP03.5_03 - Paid + Not Delivered → admin có thể Mark As Delivered", async () => {
        await browser.url("/order/68c958b34084cdc891d4370f");

        await OrdersSummaryPage.heading.waitForDisplayed({ timeout: 5000 });

        const paid = await OrdersSummaryPage.isPaid();
        const delivered = await OrdersSummaryPage.isNotDelivered();
        const hasBtn = await OrdersSummaryPage.hasMarkDeliveredBtn();

        expect(paid).toBe(true);
        expect(delivered).toBe(true);
        expect(hasBtn).toBe(true);

        await OrdersSummaryPage.clickMarkAsDelivered();

        await browser.waitUntil(
            async () => await OrdersSummaryPage.isDelivered(),
            {
                timeout: 5000,
                timeoutMsg: "Order was not marked as delivered",
            }
        );

        const deliveredText = await OrdersSummaryPage.getDeliveredText();
        expect(deliveredText).toMatch(/Delivered on/i);
    });

    it("EP03.5_04 - Sau khi delivered → admin không thể thay đổi trạng thái nữa", async () => {
        await browser.url("/order/68b023368d07f310e19c48f7");

        await OrdersSummaryPage.heading.waitForDisplayed({ timeout: 5000 });

        const delivered = await OrdersSummaryPage.isDelivered();
        const hasBtn = await OrdersSummaryPage.hasMarkDeliveredBtn();

        expect(delivered).toBe(true);
        expect(hasBtn).toBe(false); 
    });
});
