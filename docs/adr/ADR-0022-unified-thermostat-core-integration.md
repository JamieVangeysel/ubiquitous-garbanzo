# ADR-0022: Unified Thermostat Core Integration

## Status
Proposed

## Context

The project will integrate:

- Existing thermostat core logic from `neo-thermostat-server`
- Backend analytics and control APIs
- Frontend UI and dashboards
- MQTT device communication

Challenges include:

- Merging multiple repositories with overlapping functionality
- Avoiding duplication while preserving tested features
- Maintaining clear boundaries between core logic, backend services, and frontend
- Ensuring state consistency between devices, backend, and UI

## Decision

The unified integration will follow these proposed guidelines:

- **Thermostat Core as a Library**
    - Encapsulate device logic in a reusable module
    - Backend imports the core for state calculation and automation
- **Backend as orchestrator**
    - Handles MQTT messages, API requests, analytics updates
    - Calls thermostat core for decision-making and state management
- **Frontend**
    - Communicates via REST/WebSockets only
    - Does not implement core logic locally
- **Testing**
    - Core logic unit tests preserved
    - Integration tests added for backend + frontend interactions
- **Versioning**
    - Core logic updates follow semantic versioning
    - Backend adapts via strict interface contracts

### Operational Considerations

- Define clear boundaries between core and backend services
- Preserve existing automation rules and user configurations
- Plan migration path for devices already deployed

## Rationale

- Reuse proven thermostat logic while unifying backend and frontend
- Simplifies maintenance and feature additions
- Reduces risk of state inconsistencies
- Enables eventual expansion to new devices or home automation integration

## Consequences

### Positive
- Centralized and maintainable architecture
- Predictable behavior across devices, backend, and frontend
- Easier deployment and updates

### Negative / Unknown
- Merging legacy code may introduce hidden bugs
- Interface contracts between core and backend must be enforced rigorously
- Requires careful migration strategy for deployed devices
