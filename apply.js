const Promise = require('bluebird');
const fs = require('fs');
const puppeteer = require('puppeteer');
const parse = Promise.promisify(require('csv-parse'));

const readFile = Promise.promisify(fs.readFile);

const config = require('./config.js');

var browserLoad = null;

async function fillForm (page) {
  var p = null;

  Object.keys(config.mapping).forEach(selector => {
    var field = config.mapping[selector];
    var data = config.user[field];

    if (field !== 'resume') {
        if (p === null) {
          p = page.waitForSelector(selector)
            .then(() => page.type(selector, data));
        } else {
          p = p.then(() => page.waitForSelector(selector))
            .then(() => page.type(selector, data));
        }
    } else {
      p = p.then(() => page.waitForSelector(selector))
        .then(() => page.$(selector))
        .then(el => el.uploadFile(data));
    }
    });

  return p;
}

function applyToRecord (record, interactive) {
  var url = record[2];

  browserLoad
    .then(async browser => {
      const page = await browser.newPage();
      page.goto(url)
        .then(() => fillForm(page))
        .then(() => page.waitForSelector(config.submitSelector + ':enabled'))
        .then(() => page.click(config.submitSelector))
        .catch(err => console.log(err));
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
