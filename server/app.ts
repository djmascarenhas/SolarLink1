import { createServer, IncomingMessage, ServerResponse } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile, stat } from 'fs/promises';
import { performance } from 'perf_hooks';
import { getRequestIdFromHeaders } from './observability/tracing.js';
import { createRequestLogger } from './observability/logger.js';
import { recordRequest, renderPrometheus } from './observability/metrics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parseJsonBody = async (req: IncomingMessage) => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (chunks.length === 0) return undefined;
  const raw = Buffer.concat(chunks).toString('utf-8');
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
};

const sendJson = (res: ServerResponse, status: number, data: unknown) => {
  const payload = JSON.stringify(data);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(payload);
};

const sendText = (res: ServerResponse, status: number, data: string, contentType = 'text/plain') => {
  res.statusCode = status;
  res.setHeader('Content-Type', contentType);
  res.end(data);
};

export const createAppServer = () => {
  const distPath = path.resolve(__dirname, '..', 'dist');

  return createServer(async (req, res) => {
    const start = performance.now();
    const method = req.method || 'GET';
    const url = req.url || '/';
    const requestId = getRequestIdFromHeaders(req.headers);
    const logger = createRequestLogger(requestId);

    if (method === 'GET' && url === '/health') {
      sendJson(res, 200, { status: 'ok', uptime: process.uptime() });
      recordRequest(method, url, res.statusCode, performance.now() - start);
      return;
    }

    if (method === 'GET' && url === '/metrics') {
      const metrics = renderPrometheus();
      sendText(res, 200, metrics);
      recordRequest(method, url, res.statusCode, performance.now() - start);
      return;
    }

    if (method === 'POST' && url === '/events') {
      const body = await parseJsonBody(req);
      logger.info('event_received', { body });
      sendJson(res, 202, { received: true, trace: requestId });
      recordRequest(method, url, res.statusCode, performance.now() - start);
      return;
    }

    // Static file serving
    const filePath = path.join(distPath, url.split('?')[0]);
    try {
      const stats = await stat(filePath);
      if (stats.isFile()) {
        const fileBuffer = await readFile(filePath);
        const ext = path.extname(filePath);
        const contentType = ext === '.html' ? 'text/html' : 'text/plain';
        sendText(res, 200, fileBuffer.toString(), contentType);
      } else {
        throw new Error('not-file');
      }
    } catch {
      // SPA fallback
      try {
        const html = await readFile(path.join(distPath, 'index.html'), 'utf-8');
        sendText(res, 200, html, 'text/html');
      } catch {
        sendText(res, 404, 'Not Found');
      }
    }

    recordRequest(method, url, res.statusCode, performance.now() - start);
  });
};
