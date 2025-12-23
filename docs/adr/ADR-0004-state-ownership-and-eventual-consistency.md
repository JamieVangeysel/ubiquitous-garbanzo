# ADR-0004: State Ownership and Eventual Consistency

## Status
Accepted

## Context

The system uses multiple communication mechanisms (MQTT, HTTP, WebSockets) and serves different types of consumers:

- IoT devices publishing state and events
- Backend services processing and persisting data
- Web applications displaying and controlling state
- External automation systems reacting to events

In such a distributed system, unclear state ownership leads to:
- Conflicting updates
- Race conditions
- Phantom bugs blamed on “timing issues”
- Debugging sessions that solve nothing

A clear model for state ownership and consistency is required.

## Decision

The **backend** is the **single source of truth** for system state.

- Devices and external systems **emit events**
- The backend **validates, processes, and persists state**
- Clients **consume derived state**, not raw events

The system explicitly adopts **eventual consistency** between:
- MQTT events
- Persisted database state
- Web-facing real-time updates

Strong consistency across all transports is **not a goal**.

## State Ownership Rules

- **Devices**
    - Publish measurements, status changes, and commands results
    - Do not own canonical state

- **Backend**
    - Owns canonical system state
    - Resolves conflicts
    - Persists state in MSSQL
    - Translates events into API responses

- **Frontend**
    - Displays backend-provided state
    - Sends user intent, not state mutations

- **Automation Systems**
    - React to events
    - Must not assume immediate global consistency

## Rationale

- IoT and distributed systems are inherently asynchronous
- Forcing strong consistency would:
    - Increase latency
    - Increase coupling
    - Increase failure modes
- Eventual consistency aligns with MQTT’s pub/sub model and real-world device behavior

## Consequences

### Positive
- Clear responsibility boundaries
- Predictable conflict resolution
- Scalable real-time architecture
- Reduced risk of state corruption

### Negative
- Temporary inconsistencies are possible
- UI may briefly display stale data
- Requires discipline in client implementations

### Mitigations
- Backend timestamps and versioning
- Idempotent event handling
- Clear UX signals where real-time accuracy matters

## Notes

Any component attempting to act as an alternative source of truth is a bug, not a feature.

If this model becomes insufficient, the replacement must be documented in a superseding ADR.
