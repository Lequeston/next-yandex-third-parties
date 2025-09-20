// Learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom')

// Add performance.mark polyfill for jsdom
if (!global.performance.mark) {
  global.performance.mark = jest.fn()
}