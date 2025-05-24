const api = require('./ApiRequest');
const Log = require('./Log');
const context = require('./ScenarioContext');
const credentials = require('../SampleProject/Configs/credentials.json');
const BrowserUtil = require('./BrowserUtil');
var accessToken, mailID, emailBodyEncrypted, OTP


class GmailApi {

    async getAccessToken() {
        Log.info("Get Gmail API Access Token");

        const gmailAccessTokenURL = credentials.installed.token_uri
        const gmailAccessTokenHeaders = {"Content-Type": "application/x-www-form-urlencoded"}
        const gmailAccessTokenBody = {
            "client_id": credentials.installed.client_id,
            "client_secret": credentials.installed.client_secret,
            "refresh_token": credentials.installed.refresh_token,
            "grant_type": credentials.installed.grant_type
        }

        return browser.call(async () => {
            await api.fetch_post_request(gmailAccessTokenURL, gmailAccessTokenHeaders, gmailAccessTokenBody)

            if (await api.getResponseStatus() !== 200)
                throw new Error('Error: Access Token is not generated')

            const getAccessTokenFromJSON = await api.getResponseJson()
            accessToken = getAccessTokenFromJSON.access_token
            console.log("Access Token: " + accessToken)
        })
    }

    async getMailList() {
        Log.info("Get Gmail API Mail List");

        await BrowserUtil.wait(8);

        const gmailListURL = credentials.installed.mailListUrl
        const gmailListHeader = { 'Authorization': 'Bearer ' + accessToken }

        return browser.call(async () => {
            await api.fetch_get_request(gmailListURL, gmailListHeader)

            if (await api.getResponseStatus() !== 200)
                throw new Error('Error: List is not displayed')

            const getEmailIDFromJSON = await api.getResponseJson()
            mailID = getEmailIDFromJSON.messages[0].id;
            console.log(mailID);
        });
    }


    async getLatestEmail() {
        Log.info("Get Gmail latest Email");

        const latestEmail = credentials.installed.mailListUrl + mailID
        console.log(latestEmail)

        const gmailListHeader = { 'Authorization': 'Bearer ' + accessToken }

        return browser.call(async () => {
            await api.fetch_get_request(latestEmail, gmailListHeader)

            if (await api.getResponseStatus() !== 200)
                throw new Error('Error: Email is not retrieved')
            
            const getEmailFromJSON = await api.getResponseJson()
            emailBodyEncrypted = getEmailFromJSON.snippet

            const codePattern = /\b\d{6}\b/;
            const getOTP = emailBodyEncrypted.match(codePattern);

            if (!getOTP) {
            throw new Error("OTP could not be extracted from email content");
            }

            OTP = getOTP[0]
            context.setValue("OTP", OTP);
            console.log("OTP extracted and stored in context:", OTP);
        });       
    }

}

module.exports = GmailApi;