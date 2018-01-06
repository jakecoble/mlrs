const figlet = require('figlet');
const gradient = require('gradient-string');

function apply (argv) {
  var banner = figlet.textSync('Indeed Apply', {
    font: 'Poison'
  });

  banner = gradient(['green', 'yellow']).multiline(banner);
  console.log(banner);
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
