# ADR-0011: High-Availability and Failover Strategy for MQTT and Database

## Status
Proposed

## Context

The system depends on:

- An MQTT broker for real-time device communication
- MSSQL database for persistent state, analytics, and configuration

Currently, both components are single-instance deployments. This introduces risks:

- MQTT broker downtime causes missed device events and broken automation
- Database downtime interrupts ingestion, analytics, and UI updates
- Recovery from failures may be manual, slow, and error-prone

We need a high-availability (HA) and failover strategy to reduce downtime and prevent data loss.

## Decision Factors

We have not finalized the implementation, but the following factors will drive the decision:

### MQTT Broker

- **Clustering vs replication**
    - Clustering allows multiple broker nodes to share state and client sessions
    - Replication can provide redundancy, but may introduce latency and conflict resolution issues
- **Persistence**
    - Message persistence ensures QoS 1 and 2 messages are not lost during failover
    - Storage location (local vs shared) impacts recovery time
- **Client reconnection behavior**
    - Devices should reconnect automatically to an available broker node
    - Session resumption strategies must be considered

### MSSQL Database

- **Always-On Availability Groups**
    - Native MSSQL HA option for multiple replicas
    - Provides automatic failover for primary databases
- **Transactional replication**
    - Maintains copies of critical tables on standby servers
    - May not cover all schema changes automatically
- **Cloud vs on-prem**
    - Cloud-managed MSSQL provides built-in HA and geo-redundancy
    - On-prem clusters require additional configuration and monitoring

### General Considerations

- Cost vs reliability: more HA nodes and replication increase cost and complexity
- Recovery Time Objective (RTO) and Recovery Point Objective (RPO) for each component
- Monitoring, alerting, and automatic failover logic
- Testing of failover scenarios to ensure correctness
- Integration with existing backup, retention, and archival policies

## Proposed Approach

- Evaluate MQTT clustering solutions (e.g., EMQX, Mosquitto Cluster, HiveMQ)
- Define persistence and QoS policies for device messages
- Implement MSSQL HA via Always-On Availability Groups or cloud-managed replicas
- Ensure automatic failover with minimal downtime
- Define operational playbooks for manual intervention if automatic failover fails
- Include met
