const Promise = require('bluebird');
const fs = require('fs');
const parse = require('csv-parse');
const stringify = require('csv-stringify');
const Applier = require('./Applier.js');

function apply (argv) {
  var applier = new Applier({ argv });
  var parser = parse({ delimiter: ',' });
  var stringifier = stringify();
  var writer = fs.createWriteStream('jobs-processed.csv');

  fs.createReadStream(argv.o || 'jobs.csv')
    .pipe(parser)
    .pipe(applier)
    .pipe(stringifier)
    .pipe(writer);
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
