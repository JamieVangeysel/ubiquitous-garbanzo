# ADR-0009: Auth0 Token Verification Strategy

## Status
Accepted

## Context

The system uses Auth0 for authentication and authorization. Decisions must be made about where and how JWT access tokens are verified:

- Backend APIs need to enforce access control
- Frontend applications may also decode tokens for UI logic
- Security and performance must be balanced

Without a clear verification strategy, risks include:

- Security bypass due to client-only validation
- Inconsistent enforcement across endpoints
- Increased latency or redundant validation

## Decision

- **Backend-first verification**
    - All API requests must have their JWT validated in the backend.
    - Backend validates:
        - Signature
        - Expiration
        - Scopes and roles

- **Frontend**
    - May decode the JWT for UI purposes (e.g., showing/hiding buttons)
    - Frontend does **not** enforce security rules
    - Frontend logic is considered advisory only

- **Token refresh**
    - Backend supports validation of short-lived access tokens
    - Refresh tokens handled securely by the frontend using Auth0 SDK

## Rationale

- Centralized security enforcement reduces risk
- Avoids reliance on potentially compromised clients
- Ensures consistent policy application across all API endpoints
- Allows frontend to remain responsive without compromising security

## Consequences

### Positive
- Single source of truth for authorization
- Minimal chance of client bypass
- Simplifies backend auditing

### Negative
- Backend bears full verification load
- Frontend must be careful not to expose sensitive information based solely on decoded JWT

### Mitigations
- Cache verified tokens in backend for short intervals to reduce verification overhead
- Log all failed token verifications
- Use automated tests for critical endpoints
