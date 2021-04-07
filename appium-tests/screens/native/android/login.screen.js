class LoginScreen {
    constructor() {
        // this.emailTextField = "//android.widget.EditText[@resource-id='email-input']";
        // this.passwordTextField = "//android.widget.EditText[@resource-id='password-input']";
        // this.loginBtn = "//android.widget.Button[@resource-id='submit']";

        this.emailTextField = "//android.widget.EditText[@resource-id='email-input']";
        this.passwordTextField = "//android.widget.EditText[@resource-id='password-input']";
        this.loginBtn = "//android.widget.Button[@resource-id='submit']";

    }
}

module.exports = new LoginScreen();