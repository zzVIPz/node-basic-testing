import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  const expectedMatch = {
    next: {
      next: {
        next: {
          next: null,
          value: null,
        },
        value: 3,
      },
      value: 2,
    },
    value: 1,
  };

  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    expect(generateLinkedList([1, 2, 3])).toStrictEqual(expectedMatch);
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    expect(generateLinkedList([1, 2, 3])).toMatchSnapshot();
  });
});
