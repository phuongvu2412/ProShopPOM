import LoginPage from "../../pageobjects/auth/login.page.js";

describe("Login feature", () => {
    it("debug login selectors", async () => {
        await LoginPage.open("/login");

        // Kiểm tra locator có tồn tại không
        console.log("Email exists:", await LoginPage.inputEmail.isExisting());
        console.log("Password exists:", await LoginPage.inputPassword.isExisting());
        console.log("Submit exists:", await LoginPage.btnSubmit.isExisting());

        await browser.pause(5000); // dừng để bạn nhìn browser
    });
});
