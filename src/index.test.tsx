import * as index from './index';
import * as YandexMetrikaModule from './YandexMetrika';

describe('index', () => {
  it('should export all functions from YandexMetrika module', () => {
    expect(index.YandexMetrika).toBe(YandexMetrikaModule.YandexMetrika);
    expect(index.sendYAEvent).toBe(YandexMetrikaModule.sendYAEvent);
    expect(index.userParams).toBe(YandexMetrikaModule.userParams);
    expect(index.setUserID).toBe(YandexMetrikaModule.setUserID);
    expect(index.reachGoal).toBe(YandexMetrikaModule.reachGoal);
    expect(index.notBounce).toBe(YandexMetrikaModule.notBounce);
  });

  it('should have all expected exports', () => {
    const expectedExports = [
      'YandexMetrika',
      'sendYAEvent',
      'userParams',
      'setUserID',
      'reachGoal',
      'notBounce',
    ];

    expectedExports.forEach(exportName => {
      expect(index).toHaveProperty(exportName);
      expect(index[exportName as keyof typeof index]).toBeDefined();
    });
  });
});
