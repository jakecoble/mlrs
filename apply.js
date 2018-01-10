const Promise = require('bluebird');
const fs = require('fs');
const puppeteer = require('puppeteer');
const parse = Promise.promisify(require('csv-parse'));

const readFile = Promise.promisify(fs.readFile);

const config = require('./config.js');

var browserLoad = null;

async function getFieldValue (labelText) {
  return new Promise((resolve, reject) => {
    Object.keys(config.regex).forEach(key => {
      var regex = new RegExp(key);

      if (regex.test(labelText)) {
        var userDataKey = config.regex[key];
        return resolve(config.user[userDataKey]);
      }
    });

    reject('no matching user data found');
  });
}

async function fillFormFields (page, labels) {
  var p = new Promise.resolve();

  labels.forEach(label => {
    p.then(() => page.evaluate(l => l.innerText, label))
      .then(labelText => getFieldValue(labelText))
      .then(fieldValue => console.log(fieldValue));
  });

  return p;
}

async function fillForm (page) {
  var p = new Promise.resolve();

  p.then(() => page.waitForSelector(config.formSelector))
    .then(() => page.$$(config.formSelector + ' label'))
    .then(labels => fillFormFields(page, labels));

  return p;
}

function applyToRecord (record, interactive) {
  var url = record[2];

  browserLoad
    .then(async browser => {
      const page = await browser.newPage();
      page.goto(url)
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
    .then(records => records.forEach(record => applyToRecord(record, argv.i)));
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
