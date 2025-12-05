import { describe, expect, it } from 'vitest';
import { createRequestLogger, logger } from '../../server/observability/logger';

describe('logger', () => {
  it('creates child logger with request id', () => {
    const child = createRequestLogger('abc-123');
    const bindings = child.bindings();

    expect(bindings.requestId).toBe('abc-123');
    expect(bindings.service).toBe('solarlink-app');
    expect(logger.level).toBe(child.level);
  });
});
