const clui      = require('clui');
const util      = require('util');
const indeed    = require('indeed-scraper');
const stringify = require('csv-stringify/lib/sync');
const fs        = require('fs');

const Spinner = clui.Spinner;
var spinner = new Spinner('fetching results...');

function writeToCSV (res, outputFile) {
  var cleanedRes = res.map(row => {
    var newRow = {};

    Object.assign(newRow, row);

    for (let key in newRow) {
      if (typeof newRow[key] === 'string') {
        newRow[key] = newRow[key].trim();
      }
    }

    return newRow;
  });

  var csv = stringify(cleanedRes);

  fs.writeFile(outputFile || 'jobs.csv', csv, err => {
    if (err) {
      console.log('\nwrite failed: %s', err);
    }

    console.log('\nfile saved');
    process.exit(0);
  });
}

function fetch (argv) {
  const queryOpts = {
    query: argv.query,
    city: argv.city,
    radius: argv.radius,
    level: argv.level,
    jobType: argv.jobType,
    maxAge: argv.maxAge,
    sort: argv.sort,
    limit: argv.limit
  };

  spinner.start();
  indeed.query(queryOpts)
    .then(res => {
      spinner.message('writing results to file...');
      writeToCSV(res, argv.o);
    })
    .catch(arg => {
      console.log('\nfetch failed: %s', arg);
      process.exit(0);
    });
}

module.exports = {
  command: 'fetch',
  describe: 'download listings and write to CSV file',
  builder: yargs => {
    yargs
      .options({
        'query': {
          alias: 'q',
          demandOption: true,
          describe: 'search keywords',
          type: 'string'
        },

        'city': {
          alias: 'c',
          describe: 'location to search',
          type: 'string'
        },

        'radius': {
          alias: 'r',
          describe: 'radius of search in miles',
          type: 'number'
        },

        'level': {
          alias: 'l',
          describe: 'job experience-level filter',
          type: 'string',
          choices: ['entry_level', 'mid_level', 'senior_level']
        },

        'jobType': {
          alias: 't',
          describe: 'job type filter',
          type: 'string',
          choices: ['fulltime', 'internship', 'contract', 'temporary', 'parttime']
        },

        'maxAge': {
          alias: 'm',
          describe: 'maximium job-listing age in days',
          type: 'number'
        },

        'sort': {
          alias: 's',
          describe: 'sort results by relevance or date',
          type: 'string',
          choices: ['relevance', 'date']
        },

        'limit': {
          alias: 'li',
          describe: 'limit returned results',
          type: 'number'
        },

        'output': {
          alias: 'o',
          describe: 'output file',
          type: 'string',
          default: './jobs.csv'
        }
      });
  },
  handler: fetch
};
