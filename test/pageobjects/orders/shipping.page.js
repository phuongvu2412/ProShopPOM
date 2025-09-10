import Page from "../common/page.js";

class ShippingPage extends Page {
    get inputAddress() {
        return $("#address");
    }

    get inputCity() {
        return $("#city");
    }

    get inputPostalCode() {
        return $("#postalCode"); 
    }

    get inputCountry() {
        return $("#country"); 
    }

    get btnContinue() {
        return $(".btn.btn-primary"); 
    }

    async fillShippingForm(address, city, postalCode, country) {
        await this.setInput(this.inputAddress, address);
        await this.setInput(this.inputCity, city);
        await this.setInput(this.inputPostalCode, postalCode);
        await this.setInput(this.inputCountry, country);
    }

    async continueToPayment() {
        await this.click(this.btnContinue);
    }
}

export default new ShippingPage();
