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
      .alias({
        'q': 'query',
        'c': 'city',
        'r': 'radius',
        'le': 'level',
        't': 'jobType',
        'm': 'maxAge',
        's': 'sort',
        'li': 'limit',
        'o': 'output'
      })
      .string(['radius', 'maxAge', 'limit'])
      .demandOption(['query']);
  },
  handler: fetch
};
