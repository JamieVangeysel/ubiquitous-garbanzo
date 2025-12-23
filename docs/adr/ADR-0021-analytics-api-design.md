# ADR-0021: Analytics API Design

## Status
Proposed

## Context

The system will provide analytics to the frontend and possibly external consumers. Challenges include:

- Querying large historical datasets efficiently
- Supporting different aggregation levels (hourly, daily, monthly)
- Combining device state, automation events, and ingestion logs
- Handling real-time and batch data

Without a defined API, risks include:

- Inconsistent response structures
- Poor performance for heavy queries
- Limited flexibility for frontend features

## Decision

The analytics API will follow these proposed principles:

- **REST endpoints for aggregated data**
    - Hourly, daily, monthly KPIs
    - Configurable filters (device, date range, event type)
- **Query parameters for flexible aggregation**
    - Support sorting, pagination, and grouping
- **Real-time endpoints**
    - WebSocket or MQTT bridge for streaming data
- **Versioned API**
    - Allows breaking changes while maintaining backward compatibility
- **Authentication & Authorization**
    - JWT-based access control
    - Role-specific access for sensitive analytics

### Operational Considerations

- Cache frequently requested queries to improve performance
- Monitor query execution times and resource usage
- Provide a clear schema for analytics payloads
- Ensure consistency with aggregated and archived data (ADR-0014)

## Rationale

- Flexible API design reduces frontend dependency on raw database
- Supports both batch and real-time analytics
- Enables future extensions (custom metrics, dashboards)
- Aligns with eventual consistency and event-driven model

## Consequences

### Positive
- Predictable, standardized analytics delivery
- Easier frontend integration and dashboard development
- Supports scaling as data volume grows

### Negative / Unknown
- Complexity in query optimization and caching
- Real-time streams require extra infrastructure and monitoring
