import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import path from 'path';
import fs from 'fs';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const mockedCallback = jest.fn();

    jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(mockedCallback, 1);

    expect(setTimeout).toHaveBeenCalledWith(mockedCallback, 1);
  });

  test('should call callback only after timeout', () => {
    const mockedCallback = jest.fn();

    doStuffByTimeout(mockedCallback, 1);

    expect(mockedCallback).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(mockedCallback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const mockedCallback = jest.fn();

    jest.spyOn(global, 'setInterval');
    doStuffByInterval(mockedCallback, 1);

    expect(setInterval).toHaveBeenCalledWith(mockedCallback, 1);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const mockedCallback = jest.fn();

    jest.spyOn(global, 'setInterval');
    doStuffByInterval(mockedCallback, 1);
    jest.advanceTimersByTime(5);

    expect(mockedCallback).toHaveBeenCalledTimes(5);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const spy = jest.spyOn(path, 'join');

    await readFileAsynchronously('file');

    expect(spy).toHaveBeenCalled();
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);

    const fileContent = await readFileAsynchronously('file');

    expect(fileContent).toBeNull();
  });

  test('should return file content if file exists', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
    jest.spyOn(fs.promises, 'readFile').mockResolvedValueOnce('123');

    const fileContent = await readFileAsynchronously('file');

    expect(fileContent).toBe('123');
  });
});
