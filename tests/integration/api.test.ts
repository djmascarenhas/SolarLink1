import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AddressInfo } from 'net';
import { createAppServer } from '../../server/app';
import { resetMetrics } from '../../server/observability/metrics';

let baseUrl: string;
const server = createAppServer();

beforeAll(async () => {
  await new Promise<void>((resolve) => {
    server.listen(0, () => {
      const address = server.address() as AddressInfo;
      baseUrl = `http://127.0.0.1:${address.port}`;
      resolve();
    });
  });
  resetMetrics();
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
  resetMetrics();
});

describe('observability endpoints', () => {
  it('returns health status', async () => {
    const response = await fetch(`${baseUrl}/health`);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe('ok');
    expect(typeof body.uptime).toBe('number');
  });

  it('exposes Prometheus metrics', async () => {
    const response = await fetch(`${baseUrl}/metrics`);
    const text = await response.text();

    expect(response.status).toBe(200);
    expect(text).toContain('solarlink_http_request_duration_seconds');
    expect(text).toContain('solarlink_http_requests_total');
  });

  it('logs incoming events and returns trace id', async () => {
    const response = await fetch(`${baseUrl}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-request-id': 'trace-123' },
      body: JSON.stringify({ source: 'test', payload: true }),
    });
    const body = await response.json();

    expect(response.status).toBe(202);
    expect(body.received).toBe(true);
    expect(body.trace).toBe('trace-123');
  });
});
