/**
 * Mock LLM Metrics Exporter
 *
 * Generates realistic-looking LLM service metrics for demonstration.
 * Replace with actual metrics from your LLM service in production.
 */

const http = require('http');

const PORT = 9091;

// Simulated metrics state
let requestCount = { success: 0, error: 0 };
let tokenCount = { input: 0, output: 0 };
let costTotal = 0;
let latencyBuckets = {
  '0.1': 0,
  '0.5': 0,
  '1': 0,
  '2': 0,
  '5': 0,
  '10': 0,
  '+Inf': 0,
};

// Models we're "serving"
const models = ['gpt-4o', 'gpt-4o-mini', 'claude-3-sonnet'];

// Simulate requests
setInterval(() => {
  // Simulate 1-5 requests per interval
  const numRequests = Math.floor(Math.random() * 5) + 1;

  for (let i = 0; i < numRequests; i++) {
    const model = models[Math.floor(Math.random() * models.length)];
    const isError = Math.random() < 0.02; // 2% error rate

    if (isError) {
      requestCount.error++;
    } else {
      requestCount.success++;

      // Token simulation
      const inputTokens = Math.floor(Math.random() * 500) + 100;
      const outputTokens = Math.floor(Math.random() * 1000) + 50;
      tokenCount.input += inputTokens;
      tokenCount.output += outputTokens;

      // Cost simulation (rough)
      const cost = (inputTokens * 0.00001) + (outputTokens * 0.00003);
      costTotal += cost;

      // Latency simulation
      const latency = Math.random() * 3 + 0.1;
      if (latency <= 0.1) latencyBuckets['0.1']++;
      else if (latency <= 0.5) latencyBuckets['0.5']++;
      else if (latency <= 1) latencyBuckets['1']++;
      else if (latency <= 2) latencyBuckets['2']++;
      else if (latency <= 5) latencyBuckets['5']++;
      else if (latency <= 10) latencyBuckets['10']++;
      latencyBuckets['+Inf']++;
    }
  }
}, 1000);

// Generate Prometheus metrics output
function generateMetrics() {
  let output = '';

  // Request counter
  output += '# HELP llm_requests_total Total number of LLM requests\n';
  output += '# TYPE llm_requests_total counter\n';
  output += `llm_requests_total{status="success",model="gpt-4o"} ${Math.floor(requestCount.success * 0.4)}\n`;
  output += `llm_requests_total{status="success",model="gpt-4o-mini"} ${Math.floor(requestCount.success * 0.5)}\n`;
  output += `llm_requests_total{status="success",model="claude-3-sonnet"} ${Math.floor(requestCount.success * 0.1)}\n`;
  output += `llm_requests_total{status="error",model="gpt-4o"} ${Math.floor(requestCount.error * 0.5)}\n`;
  output += `llm_requests_total{status="error",model="gpt-4o-mini"} ${Math.floor(requestCount.error * 0.4)}\n`;
  output += `llm_requests_total{status="error",model="claude-3-sonnet"} ${Math.floor(requestCount.error * 0.1)}\n`;

  // Token counter
  output += '\n# HELP llm_tokens_total Total number of tokens processed\n';
  output += '# TYPE llm_tokens_total counter\n';
  output += `llm_tokens_total{type="input"} ${tokenCount.input}\n`;
  output += `llm_tokens_total{type="output"} ${tokenCount.output}\n`;

  // Cost counter
  output += '\n# HELP llm_cost_usd_total Total cost in USD\n';
  output += '# TYPE llm_cost_usd_total counter\n';
  output += `llm_cost_usd_total ${costTotal.toFixed(6)}\n`;

  // Latency histogram
  output += '\n# HELP llm_request_duration_seconds Request duration in seconds\n';
  output += '# TYPE llm_request_duration_seconds histogram\n';
  let cumulative = 0;
  for (const [le, count] of Object.entries(latencyBuckets)) {
    cumulative += count;
    output += `llm_request_duration_seconds_bucket{le="${le}"} ${cumulative}\n`;
  }
  output += `llm_request_duration_seconds_sum ${(requestCount.success + requestCount.error) * 1.2}\n`;
  output += `llm_request_duration_seconds_count ${requestCount.success + requestCount.error}\n`;

  // Active requests gauge
  output += '\n# HELP llm_active_requests Current number of active requests\n';
  output += '# TYPE llm_active_requests gauge\n';
  output += `llm_active_requests ${Math.floor(Math.random() * 10)}\n`;

  // Model info
  output += '\n# HELP llm_model_info Information about available models\n';
  output += '# TYPE llm_model_info gauge\n';
  output += 'llm_model_info{model="gpt-4o",provider="openai",context_window="128000"} 1\n';
  output += 'llm_model_info{model="gpt-4o-mini",provider="openai",context_window="128000"} 1\n';
  output += 'llm_model_info{model="claude-3-sonnet",provider="anthropic",context_window="200000"} 1\n';

  return output;
}

// HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/metrics') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(generateMetrics());
  } else if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`LLM Metrics Exporter running on http://0.0.0.0:${PORT}`);
  console.log(`Metrics: http://0.0.0.0:${PORT}/metrics`);
  console.log(`Health: http://0.0.0.0:${PORT}/health`);
});
