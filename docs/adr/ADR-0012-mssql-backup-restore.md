# ADR-0012: Backup and Restore Procedures for MSSQL

## Status
Accepted

## Context

The MSSQL database is the canonical source of truth for:

- Historical ingestion data
- MQTT-derived state
- Analytics and aggregated results
- Thermostat and automation control data

Without a documented backup and restore strategy, risks include:

- Permanent data loss from hardware or software failures
- Extended downtime due to failed restores
- Inconsistent database state after recovery
- Compliance and audit issues

## Decision

We adopt a **regular, versioned, and automated backup strategy**:

### Backup Strategy

1. **Full Backups**
    - Taken nightly for all databases
    - Stored both locally and in off-site/cloud storage for disaster recovery

2. **Differential Backups**
    - Taken every 4–6 hours
    - Capture all changes since the last full backup
    - Reduce recovery time for recent data

3. **Transaction Log Backups**
    - Taken every 15 minutes
    - Ensure point-in-time recovery
    - Support high-availability scenarios

4. **Retention**
    - Keep full backups for 30 days
    - Differential backups for 14 days
    - Transaction logs for 7 days
    - Older backups may be archived per ADR-0010 (Data Retention and Archival Policy)

5. **Backup Verification**
    - Test restore of at least one backup per week in a staging environment
    - Verify integrity and completeness of restored data

### Restore Procedures

1. **Point-in-Time Restore**
    - Restore the last full backup
    - Apply the latest differential backup
    - Apply transaction logs up to the desired recovery point

2. **Disaster Recovery**
    - Use off-site/cloud backup for full environment restoration
    - Follow a documented checklist to restore database, configure network access, and validate connections with the backend and MQTT consumers

3. **Operational Validation**
    - After restore, run integrity checks
    - Verify critical data tables and recent ingestion events
    - Test core application functionality (analytics, frontend queries, device state access)

## Rationale

- Provides a predictable, repeatable process for recovering from failures
- Supports point-in-time recovery to minimize data loss
- Ensures compliance with internal and external audit requirements
- Integrates with the high-availability and retention policies already defined

## Consequences

### Positive
- Reliable disaster recovery capability
- Reduced operational risk and downtime
- Clear documentation for DBA and DevOps teams
- Confidence in production deployments

### Negative
- Storage and operational overhead for backups
- Maintenance and monitoring required to ensure backups are completed successfully
- Recovery procedures require practice and coordination

### Mitigations
- Automate backup jobs and monitoring
- Periodically review retention and storage costs
- Keep a tested, updated restore checklist in a version-controlled repository
