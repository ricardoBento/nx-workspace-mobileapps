const ActionHelper = require('../helpers/actionHelpers');

class ScormPage {
    getObjectLocator() {
        return require('./../screens/web/scorm.screen.js');
    }
    launchScorm() {
        ActionHelper.launchBrowserUrl(this.getObjectLocator().scormUrl);
        ActionHelper.pause(2);
    }
}

module.exports = ScormPage;
