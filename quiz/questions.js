// MCQs tailored to the provided JD
// fields: id, prompt, options, answer (A-D), explanation
const QUESTIONS = [
  {
    id: 1,
    prompt: 'In a VictoriaMetrics-based stack, which component typically scrapes targets and forwards samples?',
    options: {
      A: 'vmalert',
      B: 'vmagent',
      C: 'vminsert',
      D: 'vmselect',
    },
    answer: 'B',
    explanation: 'vmagent scrapes targets (Prometheus-compatible) and remote-writes to VictoriaMetrics; vminsert ingests; vmselect serves queries; vmalert evaluates rules.'
  },
  {
    id: 2,
    prompt: 'Loki: Parse JSON logs and keep only entries with level="error" for app=api.',
    options: {
      A: '{app="api"} |= "level=error"',
      B: '{app="api"} | json | level="error"',
      C: '{app="api"} |~ "level=error"',
      D: '{app="api"} | json | label_values(level, "error")',
    },
    answer: 'B',
    explanation: 'Use `| json` to parse, then filter by extracted field: `level="error"`.'
  },
  {
    id: 3,
    prompt: 'Grafana alert rule “for: 5m” means:',
    options: {
      A: 'Fire after 5m regardless',
      B: 'Condition must be true continuously for 5m',
      C: 'Delay notification 5m',
      D: 'Evaluate every 5m only',
    },
    answer: 'B',
    explanation: 'The condition must remain true for the duration (no flapping) before alerting.'
  },
  {
    id: 4,
    prompt: 'PromQL: Per-second 5m rate of http_requests_total for job=api, grouped by status.',
    options: {
      A: 'rate(http_requests_total{job="api"}[5m]) by (status)',
      B: 'sum by (status) (rate(http_requests_total{job="api"}[5m]))',
      C: 'increase(http_requests_total{job="api"}[5m])',
      D: 'sum(rate(http_requests_total[5m])) without (status)',
    },
    answer: 'B',
    explanation: 'Use rate() on the counter and then group/sum by status across series.'
  },
  {
    id: 5,
    prompt: 'To reduce metric cardinality, which label is most risky to keep?',
    options: {
      A: 'status',
      B: 'method',
      C: 'instance',
      D: 'request_id',
    },
    answer: 'D',
    explanation: '`request_id` explodes series due to high uniqueness; others have bounded sets.'
  },
  {
    id: 6,
    prompt: 'Zabbix active checks:',
    options: {
      A: 'Server polls agent inbound',
      B: 'Agent pushes results; useful behind NAT',
      C: 'No TLS supported',
      D: 'Cannot monitor logs',
    },
    answer: 'B',
    explanation: 'Active checks are agent-initiated; can be TLS-secured; log monitoring supported with log/logrt items.'
  },
  {
    id: 7,
    prompt: 'Send container logs to Loki without sidecar:',
    options: {
      A: 'docker run --log-driver=loki --log-opt loki-url=...'
      ,
      B: 'docker run --log-driver=syslog',
      C: 'Use docker cp to export logs',
      D: 'Set --restart=always',
    },
    answer: 'A',
    explanation: 'Use the Loki Docker logging driver to ship logs directly.'
  },
  {
    id: 8,
    prompt: 'Persist PostgreSQL data across restarts:',
    options: {
      A: 'tmpfs mount',
      B: 'Named volume to /var/lib/postgresql/data',
      C: 'Rely on container layer',
      D: 'ENV VAR only',
    },
    answer: 'B',
    explanation: 'Bind/named volumes persist data outside the container lifecycle.'
  },
  {
    id: 9,
    prompt: 'Best tool to inspect device-level I/O wait and queue depth:',
    options: {
      A: 'vmstat 1',
      B: 'iostat -x 1',
      C: 'free -m',
      D: 'top',
    },
    answer: 'B',
    explanation: 'Extended iostat shows await/svctm/util/queue (aqu-sz) per device.'
  },
  {
    id: 10,
    prompt: 'CMDB: Which is NOT typically stored?',
    options: {
      A: 'CI dependencies',
      B: 'CI owner/team',
      C: 'Time-series CPU metrics',
      D: 'Environment (prod/dev)',
    },
    answer: 'C',
    explanation: 'Time-series metrics live in monitoring; CMDB stores attributes and relationships.'
  },
  {
    id: 11,
    prompt: 'Alert storm from dependent services during DB outage. Best mitigation:',
    options: {
      A: 'Lower all thresholds',
      B: 'Inhibition/dependency rules',
      C: 'Shorter “for” durations',
      D: 'Delete labels',
    },
    answer: 'B',
    explanation: 'Use dependency/inhibit rules so child alerts are silenced when parent/root is firing.'
  },
  {
    id: 12,
    prompt: 'Grafana panel for error rate % from counters http_requests_total and http_requests_errors_total:',
    options: {
      A: 'sum(rate(http_requests_errors_total[5m])) / sum(rate(http_requests_total[5m])) * 100',
      B: 'rate(errors[5m]) / errors[5m] * 100',
      C: 'sum(increase(http_requests_errors_total[5m])) * 100',
      D: 'avg_over_time(http_requests_total[5m]) / sum(rate(http_requests_errors_total[5m]))',
    },
    answer: 'A',
    explanation: 'Use comparable per-second rates of error and total, then multiply by 100.'
  }
];
