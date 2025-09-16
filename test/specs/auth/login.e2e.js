import LoginPage from "../../pageobjects/auth/login.page.js";
import NotificationPage from "../../pageobjects/common/notification.page.js";

describe("EP01.2: Account Login - Proshop v2", () => {
    beforeEach(async () => {
        await browser.reloadSession();
        await LoginPage.open("/login");
    });

    it("EP01.2_1: Valid Login", async () => {
        await LoginPage.login("group5@gmail.com", "123456");
        await browser.waitUntil(
            async () =>
                (await browser.execute(() =>
                    localStorage.getItem("userInfo")
                )) !== null,
            { timeout: 5000, timeoutMsg: "Login failed - userInfo not found" }
        );
        expect(await browser.getUrl()).toContain("localhost:3000");
    });

    it("EP01.2_2: Log in with Invalid Email", async () => {
        const invalidEmails = [
            "@missingusername.com", // Missing username
            "user@.com", // Wrong domain format
            "user@domain..com", // Consecutive dots
            "user@domain,com", // Comma instead of dot
            "user@@domain.com", // Another '@' after '@'
            "user@.domain.com", // Wrong dot position usage
            "user @domain.com", // Space before '@'
            "user@", // Incomplete email
            "user.domain.com", // Missing '@'
            "user???@domain.com", // Invalid special characters
            "username", // Missing '@' and domain
        ];

        for (const sampleemails of invalidEmails) {
            await LoginPage.loginfailed(sampleemails, "Hgri@120");
            await browser.waitUntil(
                async () =>
                    await NotificationPage.hasErrorMessage(
                        "Invalid email or password"
                    ),
                {
                    timeout: 5000,
                    timeoutMsg: "Unsuccessful",
                }
            );

            expect(await browser.getUrl()).toContain("/login");
        }
    });

    it("EP01.2_3: Log in with Unregistered Email", async () => {
        await LoginPage.loginfailed("unregistered@mail.com", "Hgri@120");
        await browser.waitUntil(
            async () =>
                await NotificationPage.hasErrorMessage(
                    "Invalid email or password"
                ),
            {
                timeout: 5000,
                timeoutMsg: "Unsuccessful",
            }
        );

        expect(await browser.getUrl()).toContain("/login");
    });

    it("EP01.2_4: Log in with Incorrect Password", async () => {
        await LoginPage.loginfailed("john@email.com", "Wrong@123");
        await browser.waitUntil(
            async () =>
                await NotificationPage.hasErrorMessage(
                    "Invalid email or password"
                ),
            {
                timeout: 5000,
                timeoutMsg: "Unsuccessful",
            }
        );

        expect(await browser.getUrl()).toContain("/login");
    });

    it("EP01.2_5: Log in with Empty Fields", async () => {
        await LoginPage.loginfailed("", "");
        await browser.waitUntil(
            async () =>
                await NotificationPage.hasErrorMessage(
                    "Invalid email or password"
                ),
            {
                timeout: 5000,
                timeoutMsg: "Unsuccessful",
            }
        );

        expect(await browser.getUrl()).toContain("/login");
    });
});
