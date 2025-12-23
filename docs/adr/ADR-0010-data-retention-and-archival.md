# ADR-0010: Data Retention and Archival Policy

## Status
Accepted

## Context

The system persists:

- Historical log data from ingestion scripts
- MQTT-derived state
- Analytics results
- Thermostat control state

Unbounded data growth may lead to:

- Storage bloat
- Slower queries
- Increased backup and restore times
- Higher operational cost

A clear retention and archival strategy is required.

## Decision

- **Retention**
    - Short-term operational data (e.g., device state, high-frequency events): keep 30 days
    - Analytics-ready aggregated data: keep 1 year
    - Control and configuration data: indefinite retention

- **Archival**
    - Older data is exported to an archival storage system (e.g., S3, Azure Blob Storage)
    - Archival format is compressed and queryable (e.g., Parquet or CSV)
    - Retention and archival policies configurable per table/topic

- **Deletion**
    - Expired operational data is purged automatically
    - Archival copies remain for compliance and historical analysis

- **Monitoring**
    - Track retention and archival jobs via metrics
    - Alert on failed purges or archive uploads

## Rationale

- Limits database growth and operational costs
- Maintains sufficient history for analytics
- Supports compliance and audit requirements
- Preserves long-term historical data without overloading MSSQL

## Consequences

### Positive
- Predictable database size
- Improved query performance
- Reduced backup footprint
- Clear operational expectations

### Negative
- Accessing archived data requires additional tooling
- Potential data gaps if retention policy is misconfigured
- Complexity in managing multiple storage systems

### Mitigations
- Provide scripts and tooling for retrieving archived data
- Document retention and archival policies clearly
- Include automated tests for retention and archival jobs
