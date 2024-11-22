// src/utils/log.js

import loglevel from 'loglevel';

// Configure loglevel
const log = loglevel.getLogger('app');
log.setLevel('debug'); // Set log level globally

// Object to keep track of render counts
const renderCounts = {};

// Helper to get the calling component's filename without extension
const getComponentName = () => {
  const stack = new Error().stack;
  if (!stack) return 'UnknownComponent';
  const lines = stack.split('\n');

  // Define substrings to skip in the stack trace
  const skipSubstrings = [
    'getComponentName',
    'logWithComponentName',
    'logger.',
    'Object.info',
    'Object.warn',
    'Object.error',
    'Object.debug',
    'loglevel',
    'at getComponentName',
    'at logWithComponentName',
    'at logger.info',
    'at logger.warn',
    'at logger.error',
    'at logger.debug',
    'at countRender',
    'countRender',
    'eval',
    'at eval',
  ];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip lines that are part of the logger utility or eval
    if (skipSubstrings.some(sub => line.includes(sub))) {
      continue;
    }

    // Look for 'src/' in the line to identify your components
    const srcIndex = line.indexOf('src/');
    if (srcIndex !== -1) {
      const pathStart = srcIndex; // Start from 'src/'
      const pathEnd = line.indexOf(':', pathStart);
      if (pathEnd === -1) continue;
      const filePath = line.substring(pathStart, pathEnd); // e.g., 'src/layouts/Main.jsx'
      const pathSegments = filePath.split('/');
      const fileNameWithExt = pathSegments[pathSegments.length - 1]; // 'Main.jsx'
      const fileName = fileNameWithExt.split('.')[0]; // 'Main'

      return fileName;
    }
  }

  return 'UnknownComponent';
};

// Logger function
const logWithComponentName = (message, level = 'debug', ...args) => {
  const componentName = getComponentName();
  const formattedMessage = `[${componentName}] ${message}`;

  // Ensure the correct loglevel method is called
  switch (level) {
    case 'info':
      log.info(formattedMessage, ...args);
      break;
    case 'warn':
      log.warn(formattedMessage, ...args);
      break;
    case 'error':
      log.error(formattedMessage, ...args);
      break;
    case 'debug':
    default:
      log.debug(formattedMessage, ...args);
      break;
  }
};

// Count render function
const countRender = () => {
  const componentName = getComponentName();
  if (!renderCounts[componentName]) {
    renderCounts[componentName] = 1;
  } else {
    renderCounts[componentName] += 1;
  }
  log.info(`[${componentName}] RENDER COUNT: ${renderCounts[componentName]}`);
};

// Export the logger
export const logger = {
  info: (message, ...args) => logWithComponentName(message, 'info', ...args),
  warn: (message, ...args) => logWithComponentName(message, 'warn', ...args),
  error: (message, ...args) => logWithComponentName(message, 'error', ...args),
  debug: (message, ...args) => logWithComponentName(message, 'debug', ...args),
  countRender: () => countRender(),
};

export default logger;
