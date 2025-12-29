# LLM Observability Dashboards

[![CI](https://github.com/cmangun/llm-observability-dashboards/actions/workflows/ci.yml/badge.svg)](https://github.com/cmangun/llm-observability-dashboards/actions/workflows/ci.yml)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue?style=flat-square&logo=docker)]()
[![Prometheus](https://img.shields.io/badge/Prometheus-latest-orange?style=flat-square&logo=prometheus)]()
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)]()

Prometheus + Grafana observability stack for LLM-powered systems.

---

## 🚀 Run in 60 Seconds

```bash
git clone https://github.com/cmangun/llm-observability-dashboards.git
cd llm-observability-dashboards
docker compose up -d
```

**Expected output:**
```
✔ Container prometheus        Started
✔ Container grafana           Started
✔ Container mock-llm-exporter Started
```

**Access:**
- Grafana: http://localhost:3000 (admin/admin)
- Prometheus: http://localhost:9090

---

## 📊 Customer Value

This pattern typically delivers:
- **5-minute MTTR** (mean time to resolution) with pre-built dashboards
- **Zero blind spots** on LLM costs, latency, error rates
- **Proactive alerts** before SLA breaches (P99 latency, cost ceiling)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 LLM Observability Stack                      │
│                                                              │
│  ┌──────────────┐     ┌──────────────┐     ┌─────────────┐  │
│  │   Your App   │────▶│  Prometheus  │────▶│   Grafana   │  │
│  │  /metrics    │     │   (scrape)   │     │ (dashboards)│  │
│  └──────────────┘     └──────────────┘     └─────────────┘  │
│         │                    │                    │          │
│         │                    ▼                    │          │
│         │           ┌──────────────┐              │          │
│         │           │ Alert Rules  │──────────────┘          │
│         │           │ (P99, costs) │                         │
│         │           └──────────────┘                         │
│         ▼                                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Mock LLM Metrics Exporter               │   │
│  │  llm_requests_total | llm_tokens_total | llm_cost    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Metrics Exported

| Metric | Type | Description |
|--------|------|-------------|
| `llm_requests_total` | Counter | Total LLM API calls |
| `llm_tokens_total` | Counter | Tokens (prompt + completion) |
| `llm_cost_usd_total` | Counter | Estimated cost in USD |
| `llm_request_duration_seconds` | Histogram | Latency distribution |

---

## Pre-built Alerts

| Alert | Condition | Severity |
|-------|-----------|----------|
| LLM High Error Rate | > 5% errors in 5m | Critical |
| LLM High Latency | P99 > 10s | Warning |
| LLM Cost Spike | > $100/hour | Warning |

---

## Dashboard Panels

- Request rate (req/sec)
- Success rate (%)
- P50/P95/P99 latency
- Token usage by model
- Cost tracking (hourly/daily)
- Error breakdown by type

---

## Next Iterations

- [ ] Add Jaeger for distributed tracing
- [ ] Add cost forecasting panel
- [ ] Add per-customer usage tracking
- [ ] Add Slack/PagerDuty alert integrations
- [ ] Add Loki for log aggregation

---

## License

MIT © Christopher Mangun

**Portfolio**: [field-deployed-engineer.vercel.app](https://field-deployed-engineer.vercel.app/)
