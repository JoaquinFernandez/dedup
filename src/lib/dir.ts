import { Parser } from 'json2csv';
import fs from 'fs';
import { FileInfo } from './hash';

export const getFileList = (dir: string): string[] => {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...getFileList(`${dir}/${item.name}`)];
    } else {
      files.push(`${dir}/${item.name}`);
    }
  }
  return files;
};

export const deleteFileList = (paths: string[]): void => {
  for (const path of paths) {
    fs.rmSync(path);
  }
};

export const exportFileList = (path: string, filesInfo: FileInfo[]): void => {
  const headers = Object.keys(filesInfo[0]);
  const parser = new Parser({ fields: headers });
  const csv = parser.parse(filesInfo);
  fs.writeFileSync(path, csv);
};
