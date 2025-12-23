# ADR-0017: Choosing Mosquitto as MQTT Broker

## Status
Accepted

## Context

The system requires an MQTT broker that supports:

- Device communication with multiple IoT clients
- High reliability and uptime
- Persistent sessions for critical messages
- QoS levels 0, 1, and 2
- Lightweight footprint and ease of deployment

Options considered:

- **Mosquitto**
- HiveMQ
- EMQX
- RabbitMQ (MQTT plugin)
- Custom broker implementations

## Decision

We choose **Mosquitto** as the MQTT broker for the following reasons:

- **Lightweight and performant**
    - Minimal resource usage on server and edge devices
    - Suitable for both small and medium deployments
- **Open-source and widely adopted**
    - Community support and active development
    - No licensing costs
- **Standards-compliant**
    - Full MQTT 3.1.1 and 5 support
    - Supports QoS 0, 1, 2, retained messages, last will
- **Persistence**
    - Supports message persistence for QoS 1/2
    - Compatible with disk-backed storage for critical messages
- **Deployment flexibility**
    - Runs on Linux, Docker, or embedded systems
    - Easy to integrate with HA and monitoring setups
- **Maturity and stability**
    - Battle-tested in IoT applications globally

## Rationale

- Meets all functional and non-functional requirements
- Reduces operational overhead compared to commercial brokers
- Compatible with planned HA and failover strategies (ADR-0011)
- Simplifies client reconnection and session management (ADR-0016)

## Consequences

### Positive
- Stable and reliable broker for production deployment
- Open-source solution with strong community support
- Easy integration with existing infrastructure (Docker, Linux)

### Negative
- Lacks some advanced HA clustering features of EMQX or HiveMQ Enterprise
- Broker-level scaling requires external clustering or load-balancing solutions
- Limited native monitoring features without third-party tooling

### Mitigations
- Use Docker Compose or Kubernetes for broker HA and restart policies
- Integrate with monitoring tools (Prometheus, Grafana)
- Plan for broker scaling if device count grows significantly
