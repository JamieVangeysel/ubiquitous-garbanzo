# Unified Analytics & Control Platform

## Overview

This project is developed in **stages** and evolves from a **log ingestion and analytics system** into a **fully unified
platform** combining:

- Historical log ingestion and analysis
- A structured analytics database
- A backend API for querying and automation
- Real-time data via MQTT
- Thermostat control logic
- A frontend for analytics and control

The long-term objective is to **replace fragmented repositories** with a single, coherent system that owns ingestion,
analytics, control logic, and presentation.

---

## Core Goals

- Convert unstructured log files into structured, queryable data
- Enable meaningful historical and real-time analytics
- Unify backend, frontend, and thermostat logic
- Avoid duplicated business logic across projects
- Provide a scalable foundation for future automation and intelligence

---

## Tech Stack

### Backend

- **Node.js**
- **TypeScript**
- **Fastify**
- **Auth0** for authentication and authorization
- **MQTT** for real-time data ingestion and updates

### Database

- **Microsoft SQL Server (MSSQL)**

### Frontend

- **Angular**

### Ingestion

- Custom-built ingestion scripts for historical log files

---

## Architecture Decisions

All major architectural decisions are documented in the ADRs.  
See the [ADR Index](docs/adr/ADR-INDEX.md) for the full list with statuses and links.

---

## Target Architecture

```pgsql
┌──────────────┐
│ Log Sources  │
└──────┬───────┘
       │
┌──────▼───────┐
│ Ingestion    │
│ & Parsing    │
└──────┬───────┘
       │
┌──────▼───────┐
│ Database     │
│ (Structured) │
└──────┬───────┘
       │
┌──────▼───────┐
│ Backend API  │
│ & Analytics  │
└──────┬───────┘
       │
┌──────▼───────┐
│ Frontend     │
│ Dashboards   │
└──────┬───────┘
       │
┌──────▼───────┐
│ Thermostat   │
│ Core Logic   │
└──────────────┘
```

---

## Roadmap

### Stage 1 – Log Ingestion & Data Structuring

**Objective**  
Transform existing log files into structured data stored in MSSQL.

**Scope**

- Identify supported log formats
- Implement custom ingestion scripts
- Design and create MSSQL schema
- Ensure idempotent imports

**Deliverables**

- Log parsers
- Database schema
- Import tooling (CLI or batch job)
- Validation and error handling

**Success Criteria**

- Logs can be re-imported without duplication
- Data is consistent and queryable
- Schema supports future analytics use cases

---

### Stage 2 – Backend & Query API

**Objective**  
Expose structured data through a Fastify-based backend.

**Scope**

- Backend service in Node.js + TypeScript
- REST API endpoints for analytics queries
- Auth0 integration for authentication and authorization
- Role-based access where applicable

**Deliverables**

- Fastify backend
- Query endpoints
- API documentation

**Success Criteria**

- Backend supports analytics use cases efficiently
- Clean separation between ingestion and querying
- API stable enough for frontend consumption

---

### Stage 3 – Thermostat Functionality Integration

**Objective**  
Migrate and integrate functionality from the existing thermostat server into this project.

**Source**

- https://github.com/JamieVangeysel/neo-thermostat-server

**Scope**

- Port thermostat core logic
- Align data models and configuration
- Integrate real-time state updates via MQTT
- Ensure behavior parity with the existing implementation

**Deliverables**

- Thermostat domain module
- Unified backend logic
- Migration notes and compatibility documentation

**Success Criteria**

- Thermostat features function identically or better
- No duplicated business logic
- Single source of truth for device state

---

### Stage 4 – Frontend & Full Unification

**Objective**  
Deliver a unified user-facing system combining analytics and control.

**Scope**

- Angular frontend
- Analytics dashboards
- Thermostat control UI
- Real-time updates via MQTT
- Auth0-based authentication flow

**Deliverables**

- Frontend application
- Analytics dashboards
- Unified deployment model

**Success Criteria**

- Single project and deployment pipeline
- Shared data model across analytics and control
- Accurate real-time and historical data representation

---

## Real-Time Data Flow

- MQTT is used for:
    - Live thermostat state updates
    - Sensor data
    - Event-driven updates to backend and frontend

- Backend subscribes to relevant topics and:
    - Updates database state
    - Broadcasts updates to connected clients if needed

---

## Non-Goals (For Now)

- Real-time-only ingestion (historical first)
- Machine learning or predictive optimization
- Multi-tenant support unless explicitly required

---

## Development Principles

- Schema-first design
- No duplicated business logic
- Clear separation of concerns
- Observability over assumptions
- Backward compatibility where reasonable

---

## Project Status

🚧 **Early development – Stage 1**

Expect breaking changes and incomplete documentation while the foundation is being built.
