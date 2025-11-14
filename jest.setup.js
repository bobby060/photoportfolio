// Add custom jest matchers from jest-dom
require('@testing-library/jest-dom');

// Suppress expected console errors in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    const message = args[0]?.toString() || '';

    // Suppress expected error messages from our tests
    const expectedErrors = [
      'JSON parse error:',
      'Image upload failed:',
      'Image deletion failed:',
      'Upload failed, rolling back',
      'Failed to load user:',
      'Failed to fetch albums:',
      'Failed to fetch album:',
      'Failed to fetch tags:',
      'Sign out failed:',
      'Error fetching current user:',
      'Error signing out:',
      'GraphQL query error:',
      'GraphQL mutation error:',
      'S3 file deletion error:',
    ];

    // Suppress React act() warnings (these are expected in async tests)
    if (message.includes('Warning: An update to') && message.includes('not wrapped in act')) {
      return;
    }

    // Don't suppress if it's an unexpected error
    if (!expectedErrors.some(expected => message.includes(expected))) {
      originalError(...args);
    }
  };

  console.warn = (...args) => {
    const message = args[0]?.toString() || '';

    // Suppress React act() warnings
    if (message.includes('not wrapped in act')) {
      return;
    }

    originalWarn(...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;
