type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levelPriority: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const envLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
const minLevel = levelPriority[envLevel] ?? levelPriority.info;

const emitLog = (level: LogLevel, message: string, meta: Record<string, unknown> = {}) => {
  if (levelPriority[level] < minLevel) return;
  const payload = {
    level,
    message,
    service: 'solarlink-app',
    timestamp: new Date().toISOString(),
    ...meta,
  };
  console.log(JSON.stringify(payload));
};

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => emitLog('debug', message, meta),
  info: (message: string, meta?: Record<string, unknown>) => emitLog('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => emitLog('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => emitLog('error', message, meta),
  level: envLevel,
};

export const createRequestLogger = (requestId: string) => ({
  debug: (message: string, meta?: Record<string, unknown>) => emitLog('debug', message, { requestId, ...meta }),
  info: (message: string, meta?: Record<string, unknown>) => emitLog('info', message, { requestId, ...meta }),
  warn: (message: string, meta?: Record<string, unknown>) => emitLog('warn', message, { requestId, ...meta }),
  error: (message: string, meta?: Record<string, unknown>) => emitLog('error', message, { requestId, ...meta }),
  level: envLevel,
  bindings: () => ({ requestId, service: 'solarlink-app' }),
});
