import { vi } from 'vitest'

import '@testing-library/jest-dom/vitest'
import 'vitest-canvas-mock'

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

vi.stubGlobal('ResizeObserver', ResizeObserverMock)

globalThis.EventSource = require('undici')
