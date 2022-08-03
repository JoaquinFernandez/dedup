/* eslint-disable no-console */
import chalk from 'chalk';
import path from 'path';
import { deleteFileList, exportFileList, getFileList } from '../lib/dir.js';
import { getDuplicatedFiles } from '../lib/hash.js';

const outputPath = `${path.resolve()}/duplicated-files.csv`;

export const list = async (dir: unknown, options?: { delete: boolean }): Promise<void> => {
  if (typeof dir !== 'string') {
    console.error(chalk.red('Error: dir must be a string'));
    process.exit(1);
  }
  const dirValue = dir as string;
  console.log(chalk.bold(`Listing files in ${dirValue}`));
  const files = getFileList(dirValue);
  console.log(chalk.bold(`Listed ${files.length} files`));
  console.log(chalk.bold(`Calculating checksum for ${files.length} files`));
  const duplicatedFiles = await getDuplicatedFiles(files);
  const notOriginal = duplicatedFiles.filter(duplicatedFile => !duplicatedFile.original);
  if (notOriginal.length > 0) {
    console.log(chalk.bold(`There are ${notOriginal.length} duplicated files`));
    console.log(chalk.bold(`Output file list to ${outputPath} duplicated files`));
    exportFileList(outputPath, duplicatedFiles);
    if (options?.delete) {
      console.log(chalk.bold(`Removing ${notOriginal.length} duplicated files`));
      deleteFileList(notOriginal.map(duplicatedFile => duplicatedFile.path));
    }
    return;
  }
  console.log(chalk.bold(`There are no duplicated files`));
};
