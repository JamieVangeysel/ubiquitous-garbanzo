# ADR-0014: Analytics Aggregation and Archival Workflow

## Status
Accepted

## Context

The system collects and persists:

- Raw ingestion data from logs
- MQTT-derived device state
- Automation events

To provide meaningful insights, analytics processing is required. Without a defined aggregation and archival workflow, risks include:

- Large unaggregated datasets causing slow queries
- High storage costs due to raw data retention
- Difficulty in reproducing historical analytics
- Inconsistent analytics across time periods

## Decision

The system will implement a structured **analytics aggregation and archival workflow**:

### Aggregation

- **Frequency**
    - Raw data aggregated hourly, daily, and monthly
    - Granularity depends on data type (e.g., temperature readings hourly, energy consumption daily)
- **Metrics**
    - Summarize critical KPIs (min, max, average, counts)
    - Maintain historical snapshots for trends
- **Storage**
    - Aggregated results stored in MSSQL tables optimized for query performance
    - Indexed for analytics queries

### Archival

- **Retention**
    - Aggregated analytics stored for 1 year (can be extended)
    - Raw ingestion data retained per ADR-0010 (Data Retention and Archival Policy)
- **Export**
    - Older aggregated datasets are exported to archival storage (S3, Azure Blob, or equivalent)
    - Format: compressed, queryable (Parquet, CSV, or JSON)
- **Access**
    - Archived data remains queryable for audits, trend analysis, or historical reporting
    - Retrieval scripts or tools documented and version-controlled

### Operational Considerations

- Aggregation jobs run in the backend on a scheduled basis
- Failures trigger alerts and automatic retry
- Aggregation scripts are versioned alongside application code
- Archival processes validate data integrity before deletion from primary storage

## Rationale

- Reduces database load and improves query performance
- Balances retention of raw data and cost-effective archival
- Supports reproducible historical analytics
- Maintains alignment with event-driven architecture and eventual consistency

## Consequences

### Positive
- Efficient storage and performance for analytics queries
- Historical data preserved for compliance and trend analysis
- Clear, automated process for aggregation and archival

### Negative
- Slightly more complex backend operations
- Requires monitoring and alerting for aggregation and archival failures
- Retrieval of archived data adds operational overhead

### Mitigations
- Automated tests and monitoring of aggregation jobs
- Documentation of archival retrieval process
- Version-controlled aggregation scripts for reproducibility
