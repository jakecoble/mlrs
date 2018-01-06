#!/usr/bin/env node

const fetch = require('./fetch.js');
const apply = require('./apply.js');

const argv = require('yargs')
      .usage('Usage: $0 [command] <options>')
      .command(fetch)
      .command(apply)
      .argv;

