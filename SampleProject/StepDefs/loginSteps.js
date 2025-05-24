const {Given, When, Then} = require("@wdio/cucumber-framework");
const ElementUtil = require("../../CommonUtils/ElementUtil");
const BrowserUtil = require("../../CommonUtils/BrowserUtil");
const siteConfig = require('../Configs/TEP_' + global.testEnv + '.js');
const Login = require('../PageObjects/login');
const GmailAPI = require('../../CommonUtils/GmailAPI');
const testData = require('../TestData/loginData.json')

//BACKGROUND:

Given(/^the user is on the Titan Eye Plus homepage$/, async() => {
	await BrowserUtil.browseUrl(siteConfig.config.baseURL, "Titan Eye Plus - Homepage");
    await BrowserUtil.maximizeWindow();
    await BrowserUtil.waitUntil(
        async () => {
        const readyState = await browser.execute(() => document.readyState); 
        return readyState === "complete";
        },
        10, 
        "Page did not load completely within 10 seconds",
        "Waiting for document.readyState to be 'complete'"
    );
});



//SCENARIO 1:

Given(/^the user enters their registered mobile number$/, async() => {
	const login = new Login;
        await login.handleRandomModals();
    await login.clickSignIn();
    await login.verifySignInModal();
        await login.handleRandomModals();
    await login.enterMobileNumber();
    await login.clickSubmit();
});


When(/^the user retrieves the OTP from their Gmail account and submits it$/, async() => {
    const gmailAPI = new GmailAPI;
    const login = new Login;

    await BrowserUtil.wait(5);

    await login.handleRandomModals();

    await gmailAPI.getAccessToken();
    await gmailAPI.getMailList();
    await gmailAPI.getLatestEmail();

    await login.handleRandomModals();

    await login.enterOTP();
});


Then(/^the user should be logged in successfully$/, async() => {
	const login = new Login;
        await login.handleRandomModals();
    expect(login.menuMyAccount).toExist();
});


Then(/^the profile details of the user are verified$/, async() => {
	const login = new Login;
    await login.navigateToMyProfile();

    let firstNameInMyProfile = await ElementUtil.getValue(login.lblFirstName);
    expect(firstNameInMyProfile).toEqual(testData.ProfileDetails.FirstName);

    let LastNameInMyProfile = await ElementUtil.getValue(login.lblLastName);
    expect(LastNameInMyProfile).toEqual(testData.ProfileDetails.LastName);
    
    let PhoneNumberInMyProfile = await ElementUtil.getValue(login.lblPhoneNumber);
    expect(PhoneNumberInMyProfile).toEqual(testData.Modal.RegisteredNumber);
});


When(/^the user logs out$/, async() => {
	const login = new Login;
    await login.clickLogout();
});


Then(/^the user should be logged out successfully$/, async() => {
    const login = new Login;
	await BrowserUtil.wait(3);
    expect(login.btnSignIn).toExist();
    expect(login.menuMyAccount).not.toExist();
});



//SCENARIO 2:

Then(/^the email address details of the user are verified$/, async() => {
	const login = new Login;
    await login.navigateToMyProfile();

    let EmailInMyProfile = await ElementUtil.getValue(login.lblEmail);
    expect(EmailInMyProfile).toEqual(testData.ProfileDetails.RegisteredEmail);
});
