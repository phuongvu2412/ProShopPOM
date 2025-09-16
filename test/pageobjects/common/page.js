import { browser } from "@wdio/globals";
export default class Page {
    open(path) {
        return browser.url(path);
    }

    async setInput(element, value) {
        const el = await element;
        await el.waitForDisplayed({ timeout: 10000 });
        await el.click();
        await el.clearValue();
        await el.setValue(value);
        await browser.pause(300);
    }

    async click(element) {
        const el = await element;
        await el.waitForClickable({ timeout: 10000 });
        await el.click();
    }

    async getText(element) {
        const el = await element;
        await el.waitForDisplayed({ timeout: 10000 });
        return el.getText();
    }

    async isDisplayed(element) {
        try {
            const el = await element;
            return await el.isDisplayed();
        } catch {
            return false;
        }
    }
}
