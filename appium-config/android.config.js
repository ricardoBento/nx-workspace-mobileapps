const { config } = require('./wdio.conf');
const androidInfo = require('./android.info');
const path = require('path');

// appium capabilities
config.capabilities = [{
    platformName: 'Android',
    automationName: 'uiautomator2',
    maxInstances: 1,
    // noReset: true,
    // fullReset: false,
    deviceName: androidInfo.deviceName,
    platformVersion: androidInfo.platformVersion,
    app: path.resolve('testing-apk/' + androidInfo.app)
}];

config.specs = [
    './appium-tests/specs/androidNative/**/*.js'
];

exports.config = config;
