const Promise = require('bluebird');
const fs = require('fs');
const puppeteer = require('puppeteer');
const parse = Promise.promisify(require('csv-parse'));

const readFile = Promise.promisify(fs.readFile);

const config = require('./config.js');

var browserLoad = null;

async function getField (page, label) {
  return page.evaluate(l => l.getAttribute('for'), label)
    .then(forId => {
      if (forId) {
        return page.$('input#' + forId);
      } else {
        return label.$('input[type=text]');
      }
    });
}

async function getFieldValue (labelText) {
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

async function fillFormFields (page, labels) {
  var p = new Promise.resolve();

  labels.forEach(label => {
    p = p.then(() => page.evaluate(l => l.innerText, label))
      .then(labelText => Promise.all([getField(page, label), getFieldValue(labelText)]))
      .then(([input, value]) => input.type(value))
      .catch(err => console.log(err));
  });

  return p;
}

async function fillForm (page) {
  return page.waitForSelector(config.formSelector)
    .then(() => page.$$(config.formSelector + ' label'))
    .then(labels => fillFormFields(page, labels))
    .then(() => page.$(config.resumeSelector))
    .then(upload => upload.uploadFile(config.user.resume));
}

async function applyToRecord (record, interactive) {
  var url = record[2];

  return browserLoad
    .then(async browser => {
      const page = await browser.newPage();
      return page.goto(url)
        .then(() => fillForm(page));
        // .then(() => page.waitForSelector(config.submitSelector + ':enabled'))
        // .then(() => page.click(config.submitSelector))
        // .then(() => page.waitForSelector(config.completionSelector))
        // .catch(err => console.log('Failed to submit application. %s', err));
    });
}

function apply (argv) {
  browserLoad = puppeteer.launch({ headless: !argv.i });

  readFile(argv.o || 'jobs.csv')
    .then(contents => parse(contents, { delimiter: ',' }))
    .then(records => records.reduce((p, record) => {
      return p.then(() => applyToRecord(record, argv.i));
    }, new Promise.resolve()));
}

module.exports = {
  command: 'fire [file]',
  describe: 'submit applications for compatible job listings',
  builder: yargs => {
    yargs
      .alias({
        'n': 'dry-run',
        'i': 'interactive'
      })
      .positional('file', {
        describe: 'CSV file to read listings from',
        type: 'string'
      });
  },
  handler: apply
};
