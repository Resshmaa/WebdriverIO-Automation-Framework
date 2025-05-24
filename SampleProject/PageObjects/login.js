const ElementUtil = require("../../CommonUtils/ElementUtil")
const { error } = require("../../CommonUtils/Log")
const testData = require("../TestData/loginData.json")
const context = require("../../CommonUtils/ScenarioContext")
const BrowserUtil = require("../../CommonUtils/BrowserUtil")


class Login {

    get btnSignIn() {
        return $('//a[contains(@class,"header_account")]')
    }

    get dlgWithTitle() {
        return $('//div[@class="modal-content"]//h5')
    }

    get txtMobileNumber() {
        return $('//input[@name="mobile_no"]')
    }

    get btnSubmitLogin() {
        return $('//div[contains(@class,"login")]/button[@type="submit"]')
    }

    get txtaEnterOTP() {
        return $$('//input[contains(@name,"otp_")]')
    }

    get btnCloseRandomOfferAlert() {
        return $$('//div[@data-id="CONTAINER"]//button[@data-id="CLOSE"]')
    }

    get dlgNotificationsAlert() {
        return $('//div[@id="desktopBannerWrapped"]')
    }

    get btnDontAllowNotifications() {
        return $('//button[@id="moe-dontallow_button"]')
    }

    get menuMyAccount() {
        return $('//a[contains(@class,"My_Account")]')
    }

    get ddlMyAccount() {
        return $('//div[contains(@class,"dropdown-menu show")]')
    }

    get lnkMyProfile() {
        return $('//a[@href="/my-account"]')
    }

    get sctnMyProfileDetails() {
        return $('//a[@href="/my-account"]/parent::li[contains(@class,"account_active")]')
    }

    get lblFirstName() {
        return $('//label[text()="First Name"]/following-sibling::input')
    }

    get lblLastName() {
        return $('//label[text()="Last Name"]/following-sibling::input')
    }

    get lblPhoneNumber() {
        return $('//label[text()="Phone No."]/following-sibling::input')
    }

    get lblEmail() {
        return $('//label[text()="Email"]/following-sibling::input')
    }

    get btnLogout() {
        return $('//a[contains(@class,"account_loguot-btn")]')
    }



    async clickSignIn() {
        await ElementUtil.waitForClickable(this.btnSignIn, 5, "Sign in button");
        await ElementUtil.click(this.btnSignIn, "Sign in button");
    }

    async verifySignInModal() {
        await BrowserUtil.wait(3)
        let modalAppears = await ElementUtil.isDisplayed(this.dlgWithTitle);

        if (!modalAppears) {
            console.log("Modal not found. Retrying click on sign-in button...");
            await this.clickSignIn();


            await BrowserUtil.wait(2);
            modalAppears = await ElementUtil.isDisplayed(this.dlgWithTitle);

            if (!modalAppears) {
                throw new Error("Sign-in modal did not appear after retry");
            }
        }

        const modalTitle = await ElementUtil.getText(this.dlgWithTitle);
        expect(modalTitle).toEqual(testData.Modal.Title);
        console.log("Modal title matches expected data");
    }


    async enterMobileNumber() {
        await ElementUtil.sendText(this.txtMobileNumber, testData.Modal.RegisteredNumber);
    }

    async clickSubmit() {
        if (await ElementUtil.isEnabled(this.btnSubmitLogin)) {
            await ElementUtil.click(this.btnSubmitLogin, "Continue button");
        } 

        else {
            throw new Error(`Continue button is disabled even after entering a registered mobile number`);
        }
    }

    async enterOTP() {
        let extractedOTP = context.getValue('OTP');
        const otpFields = await this.txtaEnterOTP;

        if (extractedOTP.length !== 6) {
            throw new Error("OTP is invalid or not available in context");
        }

        await BrowserUtil.wait(2)

        if (otpFields.length !== 6) {
            throw new Error("OTP input fields are not available or incomplete");
        }

        for (let i = 0; i < extractedOTP.length; i++) {
            await ElementUtil.sendText(this.txtaEnterOTP[i], extractedOTP[i])
        }

        console.log("OTP entered successfully");
    }

    async handleRandomOfferAlerts() {
        try {
            const closeButtons = await this.btnCloseRandomOfferAlert();
            console.log(`Found ${closeButtons.length} random offer alerts`);

            for (const btn of closeButtons) {
                if (await ElementUtil.isDisplayed(btn)) {
                    await ElementUtil.click(btn, "close button")
                    await BrowserUtil.wait(3)
                }
            }
        }
        catch (err) {
            console.warn("Random offer alerts not found or error occurred, continuing...");
        }
    }

    async handleNotificationsAlert() {
        try {
            const notificationsBanner = await this.dlgNotificationsAlert();

            if (await ElementUtil.isDisplayed(notificationsBanner)) {
                const dontAllowBtn = await this.btnDontAllowNotifications();
                if (await ElementUtil.isDisplayed(dontAllowBtn)) {
                    console.log("Notifications banner displayed - clicking Don't Allow");
                    await ElementUtil.click(dontAllowBtn, "Don't Allow button")
                }
            }
        }

        catch (err) {
            console.warn("Notifications alert not found or error occurred, continuing...")
        }
    }

    async handleRandomModals() {
        await this.handleRandomOfferAlerts();
        await this.handleNotificationsAlert();
    }

    async navigateToMyProfile() {
        await ElementUtil.click(this.menuMyAccount, "My Account menu");
        await ElementUtil.mouseHover(this.ddlMyAccount, "My Account dropdown list");
        await ElementUtil.waitForClickable(this.lnkMyProfile, 5, "My Profile link")
        await ElementUtil.click(this.lnkMyProfile, "My Profile link")
        await ElementUtil.waitForDisplayed(this.sctnMyProfileDetails, 10, "My Profile Details section")
    }

    async clickLogout() {
        await ElementUtil.scrollIntoView(this.btnLogout);
        await ElementUtil.click(this.btnLogout, "Logoout button");
    }
}

module.exports = Login;