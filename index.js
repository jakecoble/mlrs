#!/usr/bin/env node

const figlet = require('figlet');
const gradient = require('gradient-string');

const fetch = require('./fetch.js');
const apply = require('./apply.js');

const argv = require('yargs')
      .usage('Usage: $0 [command] <options>')
      .command(fetch)
      .command(apply)
      .argv;

var banner = figlet.textSync('MLRS', {
  font: 'Poison'
});

banner = gradient(['red', 'yellow']).multiline(banner);
console.log(banner);
console.log(gradient(['red', 'yellow'])('FIRE EVERYTHING'));

