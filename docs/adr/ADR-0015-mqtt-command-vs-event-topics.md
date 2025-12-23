# ADR-0015: Command vs Event Topics for MQTT

## Status

Accepted

## Context

The system uses MQTT to communicate between devices, backend services, and automation systems.

Without a clear distinction between **command topics** (requests sent to devices) and **event topics** (state updates
emitted by devices), risks include:

- Confusing message flow
- Unexpected state updates
- Difficulty handling retries, QoS, and idempotency
- Breaking downstream consumers unintentionally

## Decision

The MQTT architecture will clearly separate **command topics** and **event topics**, with conventions and processing
rules.

### Command Topics

- **Purpose**: Request devices to perform an action (e.g., set temperature, toggle HVAC mode)
- **Direction**: Backend → Device
- **QoS**: Typically QoS 2 (exactly once) to prevent duplicate command execution
- **Payload**: Must include:
    - Command type
    - Command ID (unique per request for idempotency)
    - Timestamp
    - Optional version
- **Retention**: Commands are not retained unless needed for recovery

**Example:**

`thermostat/device/123/command/set_temperature`

### Event Topics

- **Purpose**: Communicate device state, sensor readings, or automation events
- **Direction**: Device → Backend / Device → Automation systems
- **QoS**: QoS 0 for ephemeral telemetry, QoS 1 or 2 for critical state
- **Payload**: Must include:
  - Event type
  - Version
  - Timestamp
  - Data
- **Retention**: Optional retained messages for state recovery

**Example:**

```
thermostat/device/123/state
sensor/temperature/garage/update
automation/rule/energy_saving/triggered
```

### Processing Rules

- **Backend**
  - Consumes events and updates canonical state
  - Publishes commands to devices
  - Handles retries and idempotency for commands
- **Devices**
  - Consume commands, execute, and emit resulting state events
  - Include original command ID in response where applicable
- **Automation Systems**
  - Subscribe to events only
  - Do not send commands unless explicitly authorized

### Naming Conventions

- Command topics end with `/command/<action>`
- Event topics end with `/state` or `/update`
- Supports wildcards for consumers but not for publishers
- Versioning follows ADR-0005

## Rationale

- Clear separation prevents accidental feedback loops
- Command ID + QoS ensures idempotent execution
- Simplifies consumer logic for event subscriptions
- Supports eventual consistency while maintaining reliable control

## Consequences

### Positive
- Reduced risk of duplicated commands or missed events
- Simplified integration for new devices and automation systems
- Consistent patterns across all MQTT topics

### Negative
- Developers must follow naming and topic conventions strictly
- Commands and events must be documented and versioned
- QoS enforcement adds slight overhead for critical messages

### Mitigations
- Provide templates and shared schemas for commands and events
- Automate topic validation during CI/CD
- Monitor failed command delivery and event ingestion
