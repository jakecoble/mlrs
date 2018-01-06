const figlet = require('figlet');
const gradient = require('gradient-string');

const Promise = require('bluebird');
const fs = require('fs');
const puppeteer = require('puppeteer');
const parse = Promise.promisify(require('csv-parse'));

const readFile = Promise.promisify(fs.readFile);

const config = require('./config.js');

var browserLoad = null;

function applyToRecord (record, interactive) {
  var url = record[2];

  browserLoad
    .then(async browser => {
      const page = await browser.newPage();
      await page.goto(url);
      page.click(config.applyButtonSelector);
    });
}

function apply (argv) {
  var banner = figlet.textSync('Indeed Apply', {
    font: 'Poison'
  });

  banner = gradient(['green', 'yellow']).multiline(banner);
  console.log(banner);

  browserLoad = puppeteer.launch({ headless: !argv.i });

  readFile(argv.o || 'jobs.csv')
    .then(contents => parse(contents, { delimiter: ',' }))
    .then(records => records.forEach(record => applyToRecord(record, argv.i)));
}

module.exports = {
  command: 'apply [file]',
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
