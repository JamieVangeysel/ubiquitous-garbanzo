# ADR-0002: Database Choice – Microsoft SQL Server (MSSQL)

## Status
Accepted

## Context

This project requires a database that can reliably support:

- Structured ingestion of historical log data
- Time-series–style queries and aggregations
- Strong schema enforcement
- Integration with a Node.js (TypeScript) backend
- Long-term maintainability and operational stability

The system is expected to evolve from simple analytics into a unified control and analytics platform, making early database decisions difficult and expensive to reverse later.

Several alternatives were considered, including PostgreSQL, MySQL, and time-series–specific databases.

## Decision

Microsoft SQL Server (MSSQL) is selected as the primary database for this project.

## Rationale

MSSQL was chosen for the following reasons:

- **Strong relational guarantees**  
  Schema enforcement, constraints, and transactional integrity are first-class features and align with a schema-first design approach.

- **Time-series–friendly querying**  
  While not a specialized time-series database, MSSQL supports efficient indexing, window functions, and aggregations suitable for analytics workloads.

- **Operational familiarity and tooling**  
  MSSQL offers mature management tooling, monitoring, and backup strategies that reduce operational risk.

- **Excellent Node.js support**  
  Stable drivers and libraries exist for Node.js and TypeScript, enabling reliable backend integration.

- **Future extensibility**  
  MSSQL supports advanced features (partitioning, columnstore indexes, stored procedures) that can be leveraged as the system grows.

## Consequences

### Positive
- Clear, enforced data model
- Predictable query performance for analytics use cases
- Reduced risk of schema drift
- Good long-term operational stability

### Negative
- Higher resource footprint compared to lightweight alternatives
- Less specialized for pure time-series workloads than dedicated TS databases
- Licensing considerations in some deployment scenarios

### Mitigations
- Schema and index design will be optimized for analytics patterns
- Partitioning strategies can be introduced if data volume grows significantly
- If future requirements demand a specialized time-series solution, data export pipelines can be introduced without rewriting core business logic

## Notes

MSSQL is treated as a **core architectural dependency**.  
Any proposal to replace or supplement it must include a new ADR outlining:
- Migration strategy
- Data compatibility
- Operational impact
- Clear justification beyond preference
