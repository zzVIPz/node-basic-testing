import axios from 'axios';
import { throttledGetDataFromApi } from './index';

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    const spy = jest.spyOn(axios, 'create').mockReturnValueOnce({
      get: () => ({ data: 'data' }),
    } as jest.Mocked<never>);

    await throttledGetDataFromApi('/endpoint');

    expect(spy).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const spy = jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockImplementationOnce(() => Promise.resolve({ data: 'data' }));

    await throttledGetDataFromApi('/endpoint');
    jest.runAllTimers();

    expect(spy).toHaveBeenCalledWith('/endpoint');
  });

  test('should return response data', async () => {
    jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockImplementationOnce(() => Promise.resolve({ data: 'data' }));

    const data = await throttledGetDataFromApi('/endpoint');
    jest.runAllTimers();

    expect(data).toBe('data');
  });
});
