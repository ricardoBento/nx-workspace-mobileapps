const LoginPage = require("../../pages/login.page");
const loginPage = new LoginPage();
const assert = require("assert");
const actionHelper = require('../../helpers/actionHelpers');

const CelsiusToFahrenheitConvertorPage = require('./../../pages/celsiusToFahrenheitConvertor.page');
const celsiusToFahrenheitConvertorPage = new CelsiusToFahrenheitConvertorPage();

describe("Login testing", () => {
    beforeEach(() => {
        actionHelper.launchApp();
    });
    it("should", () => {
        let email = 'ricardo@flowhospitalitytraining.co.uk';
        let pass = 'Rwbento123';
        loginPage.login(email, pass);
        loginPage.submitButtonPress();
        // loginPage.forward('/#new-dashboard');
    });
    // it('should try login email not registered', () => {
    //     // let email = 'notregisteredemail@flow.co.uk';
    //     // let pass = 'Rwbento';
    //     // loginPage.login(email, pass);
    //     // loginPage.submitButtonPress();
    // });
    // it('should try login with wrong password', () => {
    //     let email = 'ricardo@flowhospitalitytraining.co.uk';
    //     let pass = 'Rwbento';
    //     loginPage.login(email, pass);
    // });
    // it('should try login with wrong email format ', () => {
    //     let email = 'ricardo';
    //     let pass = 'Rwbento123';
    //     loginPage.login(email, pass);
    // });
});