# ADR-0020: Backend/Frontend Integration Patterns

## Status
Proposed

## Context

The system uses:

- Backend: Node.js + Fastify + MSSQL
- Frontend: Angular
- Auth: Auth0
- Real-time updates: MQTT and optional HTTP/WebSockets

Without clear integration patterns, risks include:

- Inconsistent API design
- Tight coupling between frontend and backend
- Difficulties scaling or changing either layer
- Security or data access inconsistencies

## Decision

The integration between frontend and backend will follow these proposed patterns:

- **REST for CRUD operations**
    - Standardized endpoints for database queries, device configuration, and analytics
    - JSON payloads with consistent naming and error conventions
- **WebSockets for real-time updates**
    - Backend pushes event-driven updates to frontend
    - Complements MQTT for frontend clients that cannot consume MQTT directly
- **Auth0 integration**
    - Frontend obtains JWT access tokens
    - Backend validates tokens and enforces role-based access
- **API versioning**
    - All endpoints versioned to ensure backward compatibility
- **Error handling**
    - Standardized error codes and payload structure
    - Logging and monitoring hooks for failures

### Operational Considerations

- Caching strategies (e.g., backend or client-side) to reduce database load
- Pagination and filtering for large query responses
- Graceful degradation for network outages or broker downtime

## Rationale

- Promotes maintainability and scalability
- Separates concerns between frontend and backend
- Enables real-time updates while preserving security
- Provides flexibility to swap backend or frontend implementations if needed

## Consequences

### Positive
- Predictable API contracts
- Frontend developers can work independently
- Easier testing, monitoring, and debugging

### Negative / Unknown
- Requires clear documentation and discipline
- Real-time updates require additional infrastructure (WebSockets or MQTT bridging)
