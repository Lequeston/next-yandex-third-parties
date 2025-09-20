import React from 'react';
import { render } from '@testing-library/react';
import { YandexMetrika, sendYAEvent, userParams, setUserID, reachGoal, notBounce } from './YandexMetrika';
import '@testing-library/jest-dom';

describe('YandexMetrika', () => {
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    // Clear window.ym before each test
    delete (window as any).ym;
    // Reset performance.mark mock
    jest.clearAllMocks();
    // Mock console.warn
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('YandexMetrika Component', () => {
    it('should render with required props', () => {
      const { container } = render(
        <YandexMetrika tagId={12345678} />
      );

      // Check that script element is rendered
      const script = container.querySelector('script#_next-yandex-metrica-init');
      expect(script).toBeInTheDocument();

      // Check that noscript element is rendered
      const noscript = container.querySelector('noscript#_next-yandex-metrica-pixel');
      expect(noscript).toBeInTheDocument();
    });

    it('should include tagId in script content', () => {
      const tagId = 87654321;
      const { container } = render(
        <YandexMetrika tagId={tagId} />
      );

      const script = container.querySelector('script#_next-yandex-metrica-init');
      expect(script?.innerHTML).toContain(`ym(${tagId}, "init"`);
    });

    it('should include custom scriptSrc when provided', () => {
      const customSrc = 'https://custom-domain.com/metrika.js';
      const { container } = render(
        <YandexMetrika tagId={12345678} scriptSrc={customSrc} />
      );

      const script = container.querySelector('script#_next-yandex-metrica-init');
      expect(script?.innerHTML).toContain(customSrc);
    });

    it('should include initParameters when provided', () => {
      const initParams = {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
      };

      const { container } = render(
        <YandexMetrika tagId={12345678} initParameters={initParams} />
      );

      const script = container.querySelector('script#_next-yandex-metrica-init');
      expect(script?.innerHTML).toContain(JSON.stringify(initParams));
    });

    it('should use default script src when not provided', () => {
      const { container } = render(
        <YandexMetrika tagId={12345678} />
      );

      const script = container.querySelector('script#_next-yandex-metrica-init');
      expect(script?.innerHTML).toContain('https://mc.yandex.ru/metrika/tag.js');
    });

    it('should include empty init parameters when not provided', () => {
      const { container } = render(
        <YandexMetrika tagId={12345678} />
      );

      const script = container.querySelector('script#_next-yandex-metrica-init');
      expect(script?.innerHTML).toContain('"init", {}');
    });

    it('should mark feature usage with performance.mark', () => {
      const performanceMarkSpy = jest.spyOn(performance, 'mark');

      render(<YandexMetrika tagId={12345678} />);

      expect(performanceMarkSpy).toHaveBeenCalledWith('mark_feature_usage', {
        detail: {
          feature: 'next-yandex-third-parties',
        },
      });
    });

    it('should include noscript fallback with correct tagId', () => {
      const tagId = 99999999;
      const { container } = render(
        <YandexMetrika tagId={tagId} />
      );

      const noscript = container.querySelector('noscript#_next-yandex-metrica-pixel');
      expect(noscript?.innerHTML).toContain(`https://mc.yandex.ru/watch/${tagId}`);
    });
  });

  describe('Event Functions', () => {
    describe('sendYAEvent', () => {
      it('should call ym with correct parameters when available', () => {
        const mockYm = jest.fn();
        (window as any).ym = mockYm;

        // Initialize YandexMetrika to set currTagId
        render(<YandexMetrika tagId={12345678} />);

        // Send event
        sendYAEvent('reachGoal', 'test-goal', { value: 100 });

        expect(mockYm).toHaveBeenCalledWith(12345678, 'reachGoal', 'test-goal', { value: 100 });
      });

      it('should not call ym if window.ym is not available', () => {
        // Initialize YandexMetrika to set currTagId
        render(<YandexMetrika tagId={12345678} />);

        // window.ym is not set yet
        sendYAEvent('reachGoal', 'test-goal');

        // Should not throw error
        expect(() => sendYAEvent('reachGoal', 'test-goal')).not.toThrow();
      });
    });

    describe('userParams', () => {
      it('should call sendYAEvent with userParams', () => {
        const mockYm = jest.fn();
        (window as any).ym = mockYm;

        render(<YandexMetrika tagId={12345678} />);

        const params = { UserID: 123, Age: 25 };
        userParams(params);

        expect(mockYm).toHaveBeenCalledWith(12345678, 'userParams', params);
      });
    });

    describe('setUserID', () => {
      it('should call sendYAEvent with setUserID', () => {
        const mockYm = jest.fn();
        (window as any).ym = mockYm;

        render(<YandexMetrika tagId={12345678} />);

        const userId = 'user-123';
        setUserID(userId);

        expect(mockYm).toHaveBeenCalledWith(12345678, 'setUserID', userId);
      });
    });

    describe('reachGoal', () => {
      it('should call sendYAEvent with reachGoal and target', () => {
        const mockYm = jest.fn();
        (window as any).ym = mockYm;

        render(<YandexMetrika tagId={12345678} />);

        reachGoal('purchase');

        expect(mockYm).toHaveBeenCalledWith(12345678, 'reachGoal', 'purchase', undefined, undefined);
      });

      it('should call sendYAEvent with reachGoal, target, and params', () => {
        const mockYm = jest.fn();
        (window as any).ym = mockYm;

        render(<YandexMetrika tagId={12345678} />);

        const params = { order_price: 1000, currency: 'RUB' };
        reachGoal('purchase', params);

        expect(mockYm).toHaveBeenCalledWith(12345678, 'reachGoal', 'purchase', params, undefined);
      });

      it('should call sendYAEvent with reachGoal, target, params, and callback', () => {
        const mockYm = jest.fn();
        (window as any).ym = mockYm;

        render(<YandexMetrika tagId={12345678} />);

        const params = { order_price: 1000 };
        const callback = jest.fn();
        reachGoal('purchase', params, callback);

        expect(mockYm).toHaveBeenCalledWith(12345678, 'reachGoal', 'purchase', params, callback);
      });
    });

    describe('notBounce', () => {
      it('should call sendYAEvent with notBounce without options', () => {
        const mockYm = jest.fn();
        (window as any).ym = mockYm;

        render(<YandexMetrika tagId={12345678} />);

        notBounce();

        expect(mockYm).toHaveBeenCalledWith(12345678, 'notBounce', undefined);
      });

      it('should call sendYAEvent with notBounce and options', () => {
        const mockYm = jest.fn();
        (window as any).ym = mockYm;

        render(<YandexMetrika tagId={12345678} />);

        const options = { callback: jest.fn() };
        notBounce(options);

        expect(mockYm).toHaveBeenCalledWith(12345678, 'notBounce', options);
      });
    });
  });
});

// Test for isolated module behavior to test uninitialized state
describe('YandexMetrika - Isolated Tests', () => {
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it('should warn if Yandex Metrika is not initialized', () => {
    jest.isolateModules(() => {
      const { sendYAEvent } = require('./YandexMetrika');
      sendYAEvent('reachGoal', 'test-goal');

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'next-yandex-third-parties: Yandex Metrika has not been initialized'
      );
    });
  });

});