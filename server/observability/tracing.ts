import { randomUUID } from 'crypto';
import { IncomingHttpHeaders } from 'http';

export const getRequestIdFromHeaders = (headers: IncomingHttpHeaders) => {
  const incoming = headers['x-request-id'];
  return typeof incoming === 'string' ? incoming : randomUUID();
};
