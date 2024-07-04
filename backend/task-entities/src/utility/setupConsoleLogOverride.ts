import { formatDateTime } from './formatDateTime';

const originalConsoleLog = console.log;

console.log = (...args: any[]) => {
  const timestamp = formatDateTime(new Date());
  originalConsoleLog(`[${timestamp}]`, ...args);
};
