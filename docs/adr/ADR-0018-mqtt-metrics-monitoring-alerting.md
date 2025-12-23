# ADR-0018: MQTT Metrics, Monitoring, and Alerting

## Status

Accepted

## Context

The MQTT broker and connected clients are critical to real-time system operation. Without proper monitoring and
alerting:

- Broker failures may go unnoticed
- Device disconnections may cause missed commands or events
- Performance bottlenecks may degrade system reliability
- SLA objectives for uptime cannot be verified

## Decision

The system will implement structured **metrics, monitoring, and alerting** for MQTT:

### Metrics

- **Broker Metrics**
    - Connected clients
    - Messages per second (incoming/outgoing)
    - Message backlog per QoS level
    - Retained messages count
    - Disk and memory usage
- **Client Metrics**
    - Connection status and uptime
    - Number of messages published/subscribed
    - Reconnection attempts

### Monitoring

- Use Prometheus exporters or native broker metrics endpoints
- Dashboard with Grafana or equivalent for real-time visualization
- Track historical trends for capacity planning

### Alerting

- Critical alerts on:
    - Broker unavailability
    - Persistent message backlog
    - Excessive client disconnects or failed reconnections
    - Resource exhaustion (CPU, memory, disk)
- Notifications sent to DevOps via Slack, email, or PagerDuty
- Thresholds configurable per environment

### Operational Considerations

- Metrics collection must have minimal performance impact
- Alerts must distinguish between transient spikes and persistent issues
- Historical metrics stored to support root-cause analysis

## Rationale

- Proactive detection of issues reduces downtime
- Supports scaling decisions and capacity planning
- Improves reliability for device communications and automation systems
- Enables SLA adherence for real-time system operation

## Consequences

### Positive

- Early detection of operational issues
- Data-driven capacity and scaling decisions
- Reduced risk of missed events and commands

### Negative

- Additional operational overhead for monitoring stack
- Slightly increased broker load due to metrics collection
- Requires DevOps discipline to respond to alerts

### Mitigations

- Configure metrics scraping intervals to balance accuracy and performance
- Document alert thresholds and escalation procedures
- Automate alerts for common recoverable issues where possible
