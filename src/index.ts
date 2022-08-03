#! /usr/bin/env node
import { program } from 'commander';

import { list } from './command/list.js';
program
  .command('list')
  .argument('<dir>', 'Directory to list recursively all files')
  .option('--delete', 'executes the deletion of the duplicated files', false)
  .description('list all the duplicated files')
  .action(list);

program.parse();
