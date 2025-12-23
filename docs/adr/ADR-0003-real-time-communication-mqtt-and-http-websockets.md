# ADR-0003: Real-Time Communication – MQTT and HTTP/WebSockets

## Status
Accepted

## Context

The system requires real-time communication for multiple, fundamentally different consumers:

- IoT devices (thermostats, sensors)
- Home automation systems
- Backend services
- Web applications requiring responsive user interfaces

A single transport mechanism cannot optimally serve all these use cases.

MQTT is well-suited for low-bandwidth, event-driven, and loosely coupled systems, while web applications typically rely on HTTP and WebSockets due to browser constraints and ecosystem compatibility.

## Decision

The system will implement **both MQTT and HTTP/WebSockets**, each serving distinct and complementary roles:

- **MQTT**
    - Primary transport for IoT devices
    - Integration with existing home automation systems
    - Event-driven automation and extensibility
    - Backend subscription and state updates

- **HTTP / WebSockets**
    - Primary interface for web applications
    - Low-latency, responsive UI updates
    - Browser-compatible real-time communication
    - Auth0-secured user interactions

These transports are **not interchangeable** and are intentionally used side-by-side.

## Rationale

### MQTT Strengths
- Lightweight and efficient
- Designed for unreliable networks
- Native fit for IoT and automation ecosystems
- Pub/sub model supports extensibility without tight coupling

### HTTP / WebSockets Strengths
- Universally supported by browsers
- Simpler authentication flows for user-facing applications
- Easier debugging and observability
- Lower integration friction for frontend teams

### Why Not Choose One
- MQTT is poorly supported in browsers without workarounds
- WebSockets are inefficient and fragile for constrained IoT devices
- Forcing either transport to serve all consumers would introduce unnecessary complexity and fragility

## Implementation Notes

- MQTT will be treated as the **source of real-time device and automation events**
- Backend services will subscribe to MQTT topics and:
    - Persist relevant state changes
    - Translate events into API-level representations
- Web applications will consume real-time updates via:
    - WebSockets where appropriate
    - HTTP polling or ser
