const { Transform } = require('stream');
const Promise = require('bluebird');
const puppeteer = require('puppeteer');

const config = require('./config.js');

class Applier extends Transform {
  constructor (options) {
    super({ ...options, objectMode: true });
    var argv = options.argv;
    this.interactive = argv.i;

    this.browserLoad = puppeteer.launch({ headless: !this.interactive });
  }

  _transform (chunk, encoding, callback) {
    this.applyToRecord(chunk);
    this.callback = callback;
  }

  async getField (page, label) {
    return page.evaluate(l => l.getAttribute('for'), label)
      .then(forId => {
        if (forId) {
          return page.$('input#' + forId);
        } else {
          return label.$('input[type=text]');
        }
      });
  }

  async getFieldValue (labelText) {
    return new Promise((resolve, reject) => {
      Object.keys(config.regex).forEach(key => {
        var regex = new RegExp(key);

        if (regex.test(labelText)) {
          var userDataKey = config.regex[key];
          return resolve(config.user[userDataKey]);
        }
      });

      reject(`no user data found for form label "${labelText.trim()}"`);
    });
  }

  async fillFormFields (page, labels) {
    var p = new Promise.resolve();

    labels.forEach(label => {
      p = p.then(() => page.evaluate(l => l.innerText, label))
        .then(labelText => Promise.all([this.getField(page, label), this.getFieldValue(labelText)]))
        .then(([input, value]) => input.type(value))
        .catch(err => console.log(err));
    });

    return p;
  }

  async fillForm (page) {
    return page.waitForSelector(config.formSelector)
      .then(() => page.$$(config.formSelector + ' label'))
      .then(labels => this.fillFormFields(page, labels))
      .then(() => page.$(config.resumeSelector))
      .then(upload => upload.uploadFile(config.user.resume));
  }

  async applyToRecord (record) {
    var url = record[2];

    return this.browserLoad
      .then(async browser => {
        browser.on('targetdestroyed', target => {
          if (target.page()) {
            this.resolveWait();
          }
        });
        const page = await browser.newPage();
        return page.goto(url)
          .then(() => this.fillForm(page))
          .then(() => new Promise((resolve, reject) => {
            if (!interactive) resolve();
            this.resolveWait = resolve;
          }))
          .then(() => this.callback());
          // .then(() => page.waitForSelector(config.submitSelector + ':enabled'))
          // .then(() => page.click(config.submitSelector))
          // .then(() => page.waitForSelector(config.completionSelector))
          // .catch(err => console.log('Failed to submit application. %s', err));
      });
  }
}

module.exports = Applier;
