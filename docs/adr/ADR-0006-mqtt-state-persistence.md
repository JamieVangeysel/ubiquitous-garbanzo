# ADR-0006: Persistence Strategy for MQTT-Derived State

## Status
Accepted

## Context

The system receives real-time events via MQTT from devices and automation systems. Some events are transient (ephemeral) while others reflect the canonical state that needs to be persisted for analytics, UI, and long-term system integrity.

Without a clear persistence strategy, there is risk of:
- Data loss on system restart
- Inconsistent analytics
- UI state showing stale or missing values

## Decision

The backend will persist MQTT-derived state selectively:

- **Canonical state:** Any event representing a device’s authoritative state (e.g., thermostat temperature setpoint, HVAC mode) is persisted in MSSQL.
- **Ephemeral events:** Purely informational events (e.g., motion detected, instantaneous sensor readings) may be optionally persisted based on analytics requirements.
- **Event timestamping:** All persisted state must include the event timestamp from the device or automation source.
- **Versioning:** Persisted state includes payload version and incremental revision number to support eventual consistency and conflict resolution.

## Rationale

- Ensures the backend remains the single source of truth
- Preserves historical data for analytics and reporting
- Avoids persisting unnecessary transient data to reduce database bloat
- Supports eventual consistency with multiple consumers

## Consequences

### Positive
- Clear separation between transient and persisted data
- Reliable analytics and UI updates
- Easier debugging and recovery

### Negative
- Slightly more complex event processing logic
- Need to define which events are persisted upfront
- Possible lag in reflecting transient events in analytics if not persisted

### Mitigations
- Provide configuration flags to control persistence per topic or event type
- Use background batch inserts or upserts for high-frequency events
- Document the persistence policy for all MQTT topics
