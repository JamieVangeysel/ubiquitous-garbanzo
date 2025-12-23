# ADR-0013: MQTT QoS and Delivery Guarantees

## Status
Accepted

## Context

The system relies on MQTT for:

- Device communication (thermostats, sensors)
- Automation triggers
- Real-time state updates

Without a clear policy for MQTT Quality of Service (QoS) and delivery guarantees, risks include:

- Lost or duplicated messages
- Inconsistent device and backend state
- Unexpected behavior in automation systems
- Hard-to-debug synchronization issues

## Decision

The system will standardize MQTT QoS and delivery guarantees as follows:

### QoS Levels

1. **QoS 0 (At most once)**
    - Used for non-critical, transient telemetry or informational messages
    - No acknowledgment required
    - Lower overhead, faster delivery

2. **QoS 1 (At least once)**
    - Used for critical state updates or commands where duplicates are tolerable
    - Ensures message delivery, but may result in duplicate messages
    - Consumers must handle idempotency

3. **QoS 2 (Exactly once)**
    - Used for high-criticality events where duplicates are unacceptable (e.g., device control commands)
    - Ensures exactly one delivery
    - Higher latency and overhead, reserved for essential operations

### Delivery Guarantees

- All MQTT messages must include timestamps and versioning (see ADR-0005)
- Backend must enforce idempotency where QoS 1 or 2 is used
- Retained messages are used sparingly, primarily for device state recovery
- Client reconnection strategies must support resending unacknowledged messages

## Rationale

- QoS differentiation balances reliability and performance
- Idempotent handling reduces the risk of state inconsistencies
- Timestamped and versioned messages provide a canonical reference for eventual consistency
- Retained messages support state recovery after broker or device restarts

## Consequences

### Positive
- Predictable message delivery behavior
- Reduced risk of lost or duplicated critical events
- Supports scaling of devices and automation systems
- Aligns with eventual consistency model (ADR-0004)

### Negative
- Higher QoS levels increase network overhead and latency
- Complexity in handling duplicates for QoS 1
- Clients must implement reconnection and resend logic

### Mitigations
- Document recommended QoS per topic or event type
- Provide reusable idempotent handlers for backend processing
- Monitor MQTT delivery failures and latency metrics
