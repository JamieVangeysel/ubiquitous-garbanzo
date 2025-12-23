# ADR-0001: Staged Architecture and Unified Platform Scope

## Status

Accepted

## Context

The project aims to evolve from simple log ingestion into a unified platform combining:

- Historical analytics
- Real-time data
- Backend APIs
- Frontend dashboards
- Thermostat control logic

Attempting to build all components simultaneously would increase complexity, risk, and duplication.

## Decision

The system will be developed in clearly defined stages:

1. Log ingestion and data structuring
2. Backend query and analytics API
3. Thermostat functionality integration
4. Frontend and full system unification

Each stage must deliver a stable, usable subset of functionality and build upon the previous one.

## Consequences

- Architecture decisions prioritize extensibility over premature optimization
- Temporary duplication may exist between stages but must be resolved before advancing
- The roadmap becomes a first-class architectural constraint
- Contributors must align changes with the current stage
