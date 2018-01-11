const Promise = require('bluebird');
const fs = require('fs');
const parse = require('csv-parse');
const Applier = require('./Applier.js');

function apply (argv) {
  var applier = new Applier({ argv });
  var parser = parse({ delimiter: ',' });

  fs.createReadStream(argv.o || 'jobs.csv')
    .pipe(parser)
    .pipe(applier);
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
