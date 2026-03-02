import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock matchMedia for theme tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage with actual storage
const localStorageStore: Record<string, string> = {}
const localStorageMock = {
  getItem: vi.fn((key: string) => localStorageStore[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageStore[key] = value
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageStore[key]
  }),
  clear: vi.fn(() => {
    Object.keys(localStorageStore).forEach(key => delete localStorageStore[key])
  }),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock IndexedDB
const indexedDBMock = {
  databases: vi.fn(() => Promise.resolve([])),
  open: vi.fn(() => {
    const mockDB = {
      createObjectStore: vi.fn(),
      objectStoreNames: {
        contains: vi.fn(() => false),
      },
      transaction: vi.fn(() => ({
        objectStore: vi.fn(() => ({
          put: vi.fn(() => ({ onsuccess: null, onerror: null })),
          getAll: vi.fn(() => ({ onsuccess: null, onerror: null })),
          add: vi.fn(() => ({ onsuccess: null, onerror: null })),
          get: vi.fn(() => ({ onsuccess: null, onerror: null })),
          index: vi.fn(() => ({
            getAll: vi.fn(() => ({ onsuccess: null, onerror: null })),
          })),
        })),
      })),
    }
    const request = {
      onsuccess: null as ((e: Event) => void) | null,
      onerror: null as ((e: Event) => void) | null,
      onupgradeneeded: null as ((e: Event) => void) | null,
      result: mockDB,
    }
    setTimeout(() => {
      if (request.onsuccess) {
        request.onsuccess(new Event('success'))
      }
    }, 0)
    return request
  }),
  deleteDatabase: vi.fn(() => ({ onsuccess: null, onerror: null })),
}
Object.defineProperty(global, 'indexedDB', {
  value: indexedDBMock,
})
