type HistogramBucket = {
  le: number;
  count: number;
};

type Observation = {
  method: string;
  route: string;
  status: number;
  durationMs: number;
};

const buckets: HistogramBucket[] = [0.05, 0.1, 0.3, 0.5, 1, 2, 5].map((le) => ({ le, count: 0 }));
let requestCount = 0;
let observations: Observation[] = [];

export const recordRequest = (method: string, route: string, status: number, durationMs: number) => {
  requestCount += 1;
  observations.push({ method, route, status, durationMs });
  for (const bucket of buckets) {
    if (durationMs / 1000 <= bucket.le) {
      bucket.count += 1;
    }
  }
};

export const resetMetrics = () => {
  requestCount = 0;
  observations = [];
  buckets.forEach((bucket) => (bucket.count = 0));
};

const percentile = (p: number) => {
  if (observations.length === 0) return 0;
  const sorted = [...observations].sort((a, b) => a.durationMs - b.durationMs);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(index, 0)].durationMs / 1000;
};

export const renderPrometheus = () => {
  const lines: string[] = [];
  lines.push('# HELP solarlink_http_requests_total Total count of HTTP requests');
  lines.push('# TYPE solarlink_http_requests_total counter');
  lines.push(`solarlink_http_requests_total ${requestCount}`);

  lines.push('# HELP solarlink_http_request_duration_seconds Duration of HTTP requests');
  lines.push('# TYPE solarlink_http_request_duration_seconds histogram');
  for (const bucket of buckets) {
    lines.push(`solarlink_http_request_duration_seconds_bucket{le="${bucket.le}"} ${bucket.count}`);
  }
  lines.push(`solarlink_http_request_duration_seconds_bucket{le="+Inf"} ${requestCount}`);
  lines.push(`solarlink_http_request_duration_seconds_count ${requestCount}`);
  lines.push(`solarlink_http_request_duration_seconds_sum ${observations.reduce((acc, cur) => acc + cur.durationMs / 1000, 0)}`);

  lines.push('# HELP solarlink_http_request_duration_seconds_quantile Quantiles for http duration');
  lines.push('# TYPE solarlink_http_request_duration_seconds_quantile summary');
  lines.push(`solarlink_http_request_duration_seconds_quantile{quantile="0.5"} ${percentile(50)}`);
  lines.push(`solarlink_http_request_duration_seconds_quantile{quantile="0.9"} ${percentile(90)}`);
  lines.push(`solarlink_http_request_duration_seconds_quantile{quantile="0.99"} ${percentile(99)}`);

  return lines.join('\n');
};
