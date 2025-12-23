# ADR-0016: MQTT Client Reconnection and Session Management

## Status
Accepted

## Context

Devices and backend clients rely on MQTT for real-time communication. Network interruptions, broker restarts, or client crashes can disrupt the system.

Without a clear strategy for reconnection and session management:

- Devices may miss critical commands
- Backend may miss state events
- Automation rules may trigger incorrectly
- Eventual consistency may be violated

## Decision

The system will implement structured **reconnection and session management**:

### Reconnection Strategy

- **Automatic Reconnect**: All clients attempt reconnect immediately on disconnect, with exponential backoff (e.g., 1s, 2s, 4s, 8s, max 30s)
- **Max Attempts**: Configurable; alert after repeated failures
- **Session Persistence**: Clients may request clean session = false to preserve subscriptions across reconnects

### Session Management

- **Persistent Sessions**:
    - Maintain subscriptions and unacknowledged messages
    - Ensures no critical messages are lost for QoS 1/2
- **Transient Sessions**:
    - Used for ephemeral telemetry (QoS 0)
    - No state recovery required

### Message Handling

- **Queued Messages**:
    - Broker queues QoS 1/2 messages during client disconnect if session is persistent
- **Duplicate Detection**:
    - Backend consumers must handle potential duplicates for QoS 1
- **Timestamps & Versions**:
    - All messages carry timestamp and version (ADR-0005) to support reconciliation after reconnection

## Rationale

- Guarantees reliable message delivery for critical commands and state
- Preserves subscriptions across temporary network failures
- Supports eventual consistency in the backend
- Enables predictable automation behavior even under intermittent connectivity

## Consequences

### Positive
- Reduced missed events and commands
- Predictable recovery after outages
- Compatible with HA MQTT broker deployments

### Negative
- Slightly more complex client code
- Broker must support persistent sessions
- QoS 1/2 message queuing may increase memory usage during outages

### Mitigations
- Monitor reconnection metrics and session backlogs
- Test reconnection behavior under realistic network failure scenarios
