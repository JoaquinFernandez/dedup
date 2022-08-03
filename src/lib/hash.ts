/* eslint-disable no-console */
import pLimit from 'p-limit';
import { createHash } from 'crypto';
import fs from 'fs';

const MAX_PARALLEL_FILES = 1024;
const HASH_ALGORITHM = 'sha1';
const HASH_DIGEST = 'hex';
const ENCODING = 'utf8';

export type FileInfo = {
  path: string;
  checksum: string;
  size: number;
  mtime: string;
  ctime: string;
  original: boolean;
};

const getChecksum = (file: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const hash = createHash(HASH_ALGORITHM);
    const stream = fs.createReadStream(file);
    stream.on('data', buff => {
      hash.update(buff as string, ENCODING);
    });
    stream.on('end', () => {
      const checksum = hash.digest(HASH_DIGEST);
      resolve(checksum);
    });
    stream.on('error', reject);
  });
};

const getChecksums = async (files: string[]): Promise<Map<string, string[]>> => {
  const checksumDictionary = new Map<string, string[]>();
  const limit = pLimit(MAX_PARALLEL_FILES);
  const hashPromises = [];
  for (const file of files) {
    hashPromises.push(
      limit(async () => {
        const checksum = await getChecksum(file);
        if (checksumDictionary.has(checksum)) {
          checksumDictionary.get(checksum).push(file);
        } else {
          checksumDictionary.set(checksum, [file]);
        }
      })
    );
  }
  await Promise.all(hashPromises);
  return checksumDictionary;
};

export const getDuplicatedFiles = async (files: string[]): Promise<FileInfo[]> => {
  const checksumDictionary = await getChecksums(files);
  const duplicatedFiles = [];
  for (const [checksum, files] of checksumDictionary) {
    if (files.length > 1) {
      const filesInfo = files
        .sort(
          (fileA, fileB) => fs.statSync(fileA).ctime.getTime() - fs.statSync(fileB).ctime.getTime()
        )
        .map((file, index) => {
          const fileInfo = fs.statSync(file);
          return {
            path: file,
            checksum,
            size: fileInfo.size,
            mtime: fileInfo.mtime,
            ctime: fileInfo.ctime,
            original: index === 0,
          };
        });
      duplicatedFiles.push(...filesInfo);
    }
  }
  return duplicatedFiles;
};
