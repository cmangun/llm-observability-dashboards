# LLM Observability Dashboards

[![CI](https://github.com/cmangun/llm-observability-dashboards/actions/workflows/ci.yml/badge.svg)](https://github.com/cmangun/llm-observability-dashboards/actions/workflows/ci.yml)

A minimal, runnable observability stack for LLM-powered systems.

## Overview

This repository provides a ready-to-run observability stack specifically designed for LLM/AI services:

- **Prometheus**: Metrics collection and alerting
- **Grafana**: Visualization dashboards
- **Mock Exporter**: Simulated LLM metrics for demonstration

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Observability Stack                           │
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │    Grafana      │◄───│   Prometheus    │                    │
│  │  localhost:3000 │    │  localhost:9090 │                    │
│  └─────────────────┘    └────────┬────────┘                    │
│                                  │                              │
│                          Scrapes │ /metrics                     │
│                                  ▼                              │
│                    ┌─────────────────────────┐                  │
│                    │   LLM Metrics Exporter  │                  │
│                    │    localhost:9091       │                  │
│                    └─────────────────────────┘                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Quickstart

```bash
# Clone repository
git clone https://github.com/cmangun/llm-observability-dashboards.git
cd llm-observability-dashboards

# Start the stack
docker compose up -d

# Access dashboards
# Grafana: http://localhost:3000 (admin/admin)
# Prometheus: http://localhost:9090
# Metrics: http://localhost:9091/metrics
```

## Metrics Exposed

The mock exporter generates realistic LLM service metrics:

| Metric | Type | Description |
|--------|------|-------------|
| `llm_requests_total` | Counter | Total requests by status and model |
| `llm_tokens_total` | Counter | Total tokens by type (input/output) |
| `llm_cost_usd_total` | Counter | Cumulative cost in USD |
| `llm_request_duration_seconds` | Histogram | Request latency distribution |
| `llm_active_requests` | Gauge | Current concurrent requests |
| `llm_model_info` | Gauge | Model metadata |

## Dashboards

### LLM Service Overview

Pre-configured dashboard showing:

- **Success Rate**: Percentage of successful requests
- **P99 Latency**: 99th percentile response time
- **Request Rate**: Requests per second by model
- **Hourly Cost**: Estimated cost per hour
- **Token Rate**: Input/output tokens per second

## Alert Rules

Pre-configured alerts for common issues:

| Alert | Condition | Severity |
|-------|-----------|----------|
| `LLMHighErrorRate` | Error rate > 5% for 5m | Critical |
| `LLMHighLatency` | P99 > 5s for 5m | Warning |
| `LLMCostCeilingApproaching` | Hourly cost > $80 | Warning |
| `LLMTokenUsageSpike` | Token rate > 1000/s | Info |
| `LLMServiceDown` | Exporter unreachable | Critical |

## Integrating Your Service

Replace the mock exporter with metrics from your actual LLM service:

### Option 1: Prometheus Client Library

```python
# Python example using prometheus_client
from prometheus_client import Counter, Histogram, start_http_server

REQUEST_COUNT = Counter(
    'llm_requests_total',
    'Total LLM requests',
    ['status', 'model']
)

REQUEST_LATENCY = Histogram(
    'llm_request_duration_seconds',
    'Request latency',
    buckets=[0.1, 0.5, 1, 2, 5, 10]
)

# In your request handler
REQUEST_COUNT.labels(status='success', model='gpt-4o').inc()
REQUEST_LATENCY.observe(latency_seconds)

# Start metrics server
start_http_server(9091)
```

### Option 2: Update Prometheus Config

Add your service to `prometheus/prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'my-llm-service'
    static_configs:
      - targets: ['my-service:8080']
    metrics_path: '/metrics'
```

## File Structure

```
llm-observability-dashboards/
├── docker-compose.yml          # Stack definition
├── prometheus/
│   ├── prometheus.yml          # Prometheus configuration
│   └── alerts.yml              # Alert rules
├── grafana/
│   └── provisioning/
│       ├── dashboards/         # Dashboard provisioning
│       └── datasources/        # Datasource provisioning
├── dashboards/
│   └── llm-overview.json       # Pre-built dashboard
└── exporters/
    ├── Dockerfile              # Exporter container
    └── mock-llm-metrics.js     # Mock metrics generator
```

## Next Iterations

- [ ] Add Jaeger for distributed tracing
- [ ] Add Loki for log aggregation
- [ ] Add cost tracking dashboard
- [ ] Add model comparison dashboard
- [ ] Add alertmanager integration
- [ ] Add OpenTelemetry collector

## Commands

```bash
# Start stack
docker compose up -d

# View logs
docker compose logs -f

# Stop stack
docker compose down

# Reset (remove volumes)
docker compose down -v

# Rebuild exporter
docker compose build llm-exporter
```

## License

MIT © Christopher Mangun

---

**Portfolio**: [field-deployed-engineer.vercel.app](https://field-deployed-engineer.vercel.app/)  
**Contact**: Christopher Mangun — Brooklyn, NY
