#!/usr/bin/env node
'use strict';

var program = require('commander');
var chalk = require('chalk');
var init = require('../build/init/init');
var _prompt = require('prompt');
var fs = require('fs');
var path = require('path');

program.usage('[options] [project-name]').option('-c, --config [path]', 'specify the configuration file').on('--help', function () {
  console.log('  Examples:\n');
  console.log(chalk.grey('    # create a standard weex project'));
  console.log('    $ ' + chalk.blue('weex init myProject'));
  console.log();
}).parse(process.argv);
// check if project name exist

if (program.args.length < 1) {
  program.help();
  process.exit();
}
var projectName = program.args[0];
if (!projectName.match(/^[$A-Z_][0-9A-Z_-]*$/i)) {
  var msg = chalk.red('Invalid project name:') + chalk.yellow(projectName);
  console.log(msg);
  process.exit();
}
if (fs.existsSync(path.join(process.cwd(), projectName))) {
  _prompt.start();
  _prompt.message = '';
  _prompt.delimiter = '';
  _prompt.colors = false;
  _prompt.get({
    properties: {
      confirm: {
        pattern: /^(yes|no|y|n)$/gi,
        description: chalk.grey('Directory ' + chalk.white(program.args[0]) + ' already exists. go on?'),
        message: 'yes/no',
        required: true,
        default: 'no'
      }
    }
  }, function (err, result) {
    var c = result.confirm.toLowerCase();
    if (c == 'y' || c == 'yes') {
      init(projectName, program.config);
      return;
    }
    console.log('Cancel Project initialization');
    process.exit();
  });
} else {
  // initialization new project
  init(projectName, program.config);
}