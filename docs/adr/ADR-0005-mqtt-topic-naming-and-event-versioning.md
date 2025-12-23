# ADR-0005: MQTT Topic Naming and Event Versioning

## Status
Accepted

## Context

MQTT is used for:
- Device communication
- Real-time state updates
- Automation integration

Without strict conventions, MQTT topics and payloads tend to:
- Drift over time
- Break consumers silently
- Become impossible to evolve safely

A clear strategy for topic naming and event versioning is required to support long-term extensibility.

## Decision

The system adopts **structured topic naming** and **explicit event versioning**.

### Topic Naming Convention

Topics follow this pattern:

`<domain>/<entity>/<entity-id>/<event>`

Examples:
```
thermostat/device/123/state
thermostat/device/123/measurement
sensor/temperature/garage/update
automation/rule/energy_saving/triggered
```

Wildcards are allowed for consumers, not for publishers.

### Event Payload Versioning

All MQTT payloads must include a version field:

```json
{
  "version": 1,
  "timestamp": "2025-01-01T12:00:00Z",
  "data": { }
}
```

Payloads without a version field are considered invalid.

### Versioning Rules

- Additive, backward-compatible changes
  - May increment a minor version
  - Existing consumers must continue to function
- Breaking changes
  - Require a new major version
  - Must not silently replace existing payloads
  - May require parallel topic or payload support
- Field removal
  - Forbidden without a major version bump

## Rationale

- Topic structure communicates intent without external documentation
- Explicit versioning allows:
Safe evolution
Multiple consumer versions
Predictable deprecation paths
- Prevents “just add a field” changes from breaking automation systems

## Consequences

### Positive
- Stable integration surface
- Easier debugging and observability
- Long-term compatibility guarantees
- Reduced risk of silent breakage

### Negative
- Slightly more verbose payloads
- Requires discipline when evolving events

### Mitigations
- Shared schemas for event payloads
- Backend-side payload validation
- Clear documentation of topic contracts

### Notes

MQTT topics and payloads are treated as public APIs.
Breaking them without proper versioning is equivalent to breaking a production API and will be treated accordingly.
