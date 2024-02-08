import {
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
  getBankAccount,
} from '.';

describe('BankAccount', () => {
  const someBankAccount = getBankAccount(1);
  const someAnotherBankAccount = getBankAccount(2);

  test('should create account with initial balance', () => {
    expect(someBankAccount.getBalance()).toBe(1);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => someBankAccount.withdraw(2)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => someBankAccount.transfer(2, someAnotherBankAccount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => someBankAccount.transfer(2, someBankAccount)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    expect(someBankAccount.deposit(10).getBalance()).toBe(11);
  });

  test('should withdraw money', () => {
    expect(someBankAccount.withdraw(6).getBalance()).toBe(5);
  });

  test('should transfer money', () => {
    expect(
      someBankAccount.transfer(2, someAnotherBankAccount).getBalance(),
    ).toBe(3);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    let fetchedBalance = null;

    do {
      fetchedBalance = await someBankAccount.fetchBalance();
    } while (!fetchedBalance);

    expect(typeof fetchedBalance).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(someBankAccount, 'fetchBalance').mockResolvedValueOnce(0);
    await someBankAccount.synchronizeBalance();

    expect(someBankAccount.getBalance()).toBe(0);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(someBankAccount, 'fetchBalance').mockResolvedValueOnce(null);

    expect(someBankAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
