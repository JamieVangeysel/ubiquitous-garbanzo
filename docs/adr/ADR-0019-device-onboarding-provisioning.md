# ADR-0019: Device Onboarding and Provisioning Workflow

## Status
Proposed

## Context

The system supports IoT devices (thermostats, sensors) connecting via MQTT. Without a formal onboarding and provisioning workflow:

- Devices may fail to connect securely
- Misconfigured devices could compromise security or data integrity
- Scaling device deployments becomes error-prone
- Operational overhead for adding new devices increases

## Decision

The system will implement a structured **device onboarding and provisioning workflow**:

### Provisioning Steps

1. **Device Identity**
    - Each device must have a unique identifier (UUID or serial number)
    - Device metadata stored in MSSQL (type, location, firmware version)
2. **Credentials**
    - Devices receive unique MQTT credentials (username/password or client certificates)
    - Credentials provisioned via secure backend endpoint
3. **Secure Enrollment**
    - Initial connection requires TLS and verification of credentials
    - Optionally, implement mutual TLS for device authentication
4. **Configuration**
    - Default topics, QoS, and retained message policies applied automatically
    - Device receives initial settings (e.g., target temperature, automation rules)
5. **Activation**
    - Backend confirms successful connection and event reporting
    - Device marked as active in inventory

### Operational Considerations

- Onboarding logs captured for auditing and troubleshooting
- Automated scripts to bulk provision multiple devices
- Support firmware updates and configuration changes post-provisioning
- Optional rollback in case of misconfiguration or failed activation

## Rationale

- Ensures secure and consistent device connectivity
- Reduces operational errors during large deployments
- Enables reliable integration with MQTT topics and backend processing
- Supports scaling and automation initiatives

## Consequences

### Positive
- Secure and standardized device onboarding
- Clear traceability for devices in the system
- Reduced operational burden for DevOps and support teams
- Faster time-to-production for new devices

### Negative
- Additional complexity in backend provisioning logic
- Requires secure credential storage and lifecycle management
- Onboarding failures require manual intervention or automated rollback

### Mitigations
- Document provisioning process and error handling
- Automate as much as possible while maintaining security controls
- Monitor onboarding attempts and alert on failures
