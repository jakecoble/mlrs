const figlet = require('figlet');
const gradient = require('gradient-string');

const Promise = require('bluebird');
const fs = require('fs');
const puppeteer = require('puppeteer');
const parse = Promise.promisify(require('csv-parse'));

const readFile = Promise.promisify(fs.readFile);

function applyToRecord(record) {
  var url = record[2];

  puppeteer.launch({ headless: false })
    .then(async browser => {
      const page = await browser.newPage();
      await page.goto(url);
      await browser.close();
    });
}

function apply (argv) {
  var banner = figlet.textSync('Indeed Apply', {
    font: 'Poison'
  });

  banner = gradient(['green', 'yellow']).multiline(banner);
  console.log(banner);

  readFile(argv.o || 'jobs.csv')
    .then(contents => parse(contents, { delimiter: ',' }))
    .then(records => records.forEach(applyToRecord));
}

module.exports = {
  command: 'apply [file]',
  describe: 'submit applications for compatible job listings',
  builder: yargs => {
    yargs
      .alias({
        'n': 'dry-run'
      })
      .positional('file', {
        describe: 'CSV file to read listings from',
        type: 'string'
      });
  },
  handler: apply
};
