const ActionHelper = require('../helpers/actionHelpers');

class LoginPage {
    getLoginObjectLocator() {
        return require(`./../screens/native/${browser.capabilities.platformName.toLowerCase()}/` +
            'login.screen.js');
    }
    submitButtonPress() {
        ActionHelper.click(this.getLoginObjectLocator().loginBtn);
    }
    forward(url) {
        ActionHelper.launchBrowserUrl(url);
    }
    login(email, pass) {
            ActionHelper.waitForElement(this.getLoginObjectLocator().emailTextField, 4);
            ActionHelper.sendText(this.getLoginObjectLocator().emailTextField, email);
            ActionHelper.waitForElement(this.getLoginObjectLocator().passwordTextField, 4);
            ActionHelper.sendText(this.getLoginObjectLocator().passwordTextField, pass);
            ActionHelper.waitForElement(this.getLoginObjectLocator().passwordTextField, 4);
            // ActionHelper.click(this.getObjectLocator().loginBtn);
        }
        // getErrorMessage() {
        //     ActionHelper.waitForElement(this.getObjectLocator().fahrenheitTextField, 4);
        //     return ActionHelper.getText(this.getObjectLocator().fahrenheitTextField);
        // }
        // launchApp() {
        //     ActionHelper.launchApp();
        //     ActionHelper.switchToWebviewContext();
        //     ActionHelper.pause(10);
        // }
}

module.exports = LoginPage;