import fs from 'fs';
import { deleteFileList } from './dir';

jest.mock('fs');

describe('Test deleteFileList', () => {
  test('When number is floating point above, round to nearest down', () => {
    const path = 'path';
    deleteFileList([path]);
    expect(fs.rmSync).toHaveBeenCalledWith(path);
  });
});
