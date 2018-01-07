const Promise = require('bluebird');
const fs = require('fs');
const puppeteer = require('puppeteer');
const parse = Promise.promisify(require('csv-parse'));

const readFile = Promise.promisify(fs.readFile);

const config = require('./config.js');

var browserLoad = null;

async function fillForm (page) {
  var selectors = config.formSelectors;

  var promises = selectors.map(selector => {
    return page.waitForSelector(selector, {
        visible: true,
        timeout: 10000
      })
      .then(() => page.type(selector, config.dataForSelector(selector)));
  });

  return Promise.all(promises).catch(err => console.log(err));
}

function applyToRecord (record, interactive) {
  var url = record[2];

  browserLoad
    .then(async browser => {
      const page = await browser.newPage();
      await page.goto(url);
      page.click(config.applyButtonSelectors.join(', '))
        .then(() => fillForm(page))
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
