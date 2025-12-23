# ADR-0007: Error Handling and Retry Semantics for Ingestion

## Status
Accepted

## Context

The system ingests historical logs and real-time data. Failures can occur due to:
- Corrupted log files
- Temporary database unavailability
- Network or MQTT broker issues
- Malformed payloads

Without standardized error handling, ingestion can:
- Stop silently
- Partially process data
- Introduce duplicates or data loss

## Decision

Ingestion will implement the following strategy:

### Historical Log Ingestion

- **Validation:** Each log entry is validated before insertion
- **Retry on transient errors:** Database connection failures trigger configurable retries
- **Skipping irrecoverable entries:** Malformed entries are logged and skipped
- **Idempotency:** Inserts are idempotent to avoid duplicates

### Real-Time Event Ingestion (MQTT)

- **Validation:** All incoming events are schema-validated
- **Retries:** Failed processing (e.g., database write) triggers retries with exponential backoff
- **Dead-letter handling:** Events failing after maximum retries are logged in a dead-letter table/topic for manual inspection
- **Monitoring:** Metrics are emitted for failed, retried, and skipped events

## Rationale

- Prevents ingestion pipeline from crashing due to a single bad record
- Maintains data integrity and idempotency
- Provides observability for failed events
- Supports eventual consistency model

## Consequences

### Positive
- Stable ingestion even with transient errors
- Clear mechanism for detecting and resolving problematic data
- System can recover automatically from temporary failures

### Negative
- Slightly higher complexity in ingestion logic
- Requires configuration for retry counts, backoff, and dead-letter retention
- May introduce lag for high-frequency events under heavy retry

### Mitigations
- Expose metrics and logs for operational monitoring
- Define alert thresholds for repeated ingestion failures
- Document retry and dead-letter policies
