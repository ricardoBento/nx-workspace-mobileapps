const ScormPage = require('./../../pages/scorm.page');
const scormPage = new ScormPage();
const assert = require('assert');

describe('Scorm test', () => {
    it('one..', () => {
      scormPage.launchScorm();
    });
});
