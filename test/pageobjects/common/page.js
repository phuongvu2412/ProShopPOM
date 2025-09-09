import { browser } from "@wdio/globals";

export default class Page {
    open(path) {
        return browser.url(path);
    }

    async setInput(element, value) {
        await element.waitForDisplayed();
        await element.setValue(value);
    }

    async click(element) {
        await element.waitForClickable();
        await element.click();
    }

    async getText(element) {
        await element.waitForDisplayed();
        return element.getText();
    }

    async isDisplayed(element) {
        try {
            return await element.isDisplayed();
        } catch {
            return false;
        }
    }
}
