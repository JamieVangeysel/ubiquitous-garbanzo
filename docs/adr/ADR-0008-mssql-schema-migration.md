# ADR-0008: Migration Strategy for MSSQL Schema Changes

## Status
Accepted

## Context

The system uses MSSQL as the canonical database. As the project evolves, schema changes are inevitable:

- New features require new tables or columns
- Bug fixes may require altering existing tables
- Analytics requirements may require denormalization or indexing changes

Without a defined migration strategy, risks include:

- Data loss or corruption
- Downtime for backend and frontend consumers
- Inconsistent environments between development, staging, and production

## Decision

All MSSQL schema changes will follow a **versioned migration strategy**:

1. **Migration Scripts**
    - Every schema change is implemented as a script.
    - Scripts are versioned sequentially (e.g., `V001_create_thermostat_table.sql`).
    - Scripts include `UP` and `DOWN` logic where feasible.

2. **Migration Tool**
    - Use a migration framework compatible with Node.js/TypeScript (e.g., [node-migrate](https://www.npmjs.com/package/migrate) or [mssql-migrations](https://www.npmjs.com/package/mssql-migrations)) to apply scripts reliably.
    - Tool tracks applied migrations in a dedicated table (`schema_migrations`).

3. **Environment Management**
    - Development, staging, and production environments are kept in sync using migration scripts.
    - No manual changes directly in production.

4. **Testing**
    - All migrations are tested in staging before production deployment.
    - Rollback scripts (`DOWN`) are tested to ensure safe reversions.

5. **Version Control**
    - Migration scripts are stored in the repository alongside application code.
    - Changes to existing scripts are forbidden after being applied in production.

## Rationale

- Ensures deterministic schema evolution
- Supports rollback in case of failures
- Provides an auditable history of all schema changes
- Enables multiple environments to remain consistent

## Consequences

### Positive
- Predictable schema changes
- Safe rollback capability
- Reduced risk of production issues
- Easy onboarding for new developers

### Negative
- Additional discipline required when creating migrations
- Slightly slower iteration in early development due to scripted migrations
- Requires developers to learn and follow the migration tool conventions

### Mitigations
- Documentation of migration process in `CONTRIBUTING.md`
- Automated CI/CD checks for migration script integrity
- Standard naming and versioning conventions for scripts

## Notes

Any schema modification outside this migration process is forbidden.  
Major structural changes must be accompanied by an ADR outlining rationale and impact.
