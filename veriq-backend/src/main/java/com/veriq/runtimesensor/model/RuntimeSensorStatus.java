package com.veriq.runtimesensor.model;

public enum RuntimeSensorStatus {
    PROVISIONED("Provisioned", "Commissioning Service", "Generated from Commissioning, no telemetry received yet"),
    ACTIVE("Active", "Commissioning Service", "Operational and enabled, waiting for first telemetry packet"),
    RECEIVING_TELEMETRY("Receiving Telemetry", "Telemetry Service", "Continuously receiving valid telemetry stream"),
    COMMUNICATION_LOST("Communication Lost", "Runtime Monitoring Service", "No telemetry received within configured timeout"),
    FAULT("Fault", "Telemetry Validation Service", "Telemetry validation or engineering fault detected"),
    MAINTENANCE("Maintenance", "Maintenance Module", "Under inspection, calibration, repair or replacement"),
    RETIRED("Retired", "Decommission Service", "Permanently decommissioned, historical telemetry preserved");

    private final String displayName;
    private final String stateOwner;
    private final String description;

    RuntimeSensorStatus(String displayName, String stateOwner, String description) {
        this.displayName = displayName;
        this.stateOwner = stateOwner;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getStateOwner() {
        return stateOwner;
    }

    public String getDescription() {
        return description;
    }

    public boolean canTransitionTo(RuntimeSensorStatus target) {
        if (this == RETIRED) {
            return false; // Retired state is terminal and immutable
        }
        if (this == target) {
            return true;
        }

        switch (this) {
            case PROVISIONED:
                return target == ACTIVE || target == RETIRED;
            case ACTIVE:
                return target == RECEIVING_TELEMETRY || target == COMMUNICATION_LOST || target == MAINTENANCE || target == RETIRED;
            case RECEIVING_TELEMETRY:
                return target == COMMUNICATION_LOST || target == FAULT || target == MAINTENANCE || target == RETIRED;
            case COMMUNICATION_LOST:
                return target == RECEIVING_TELEMETRY || target == FAULT || target == MAINTENANCE || target == RETIRED;
            case FAULT:
                return target == RECEIVING_TELEMETRY || target == MAINTENANCE || target == RETIRED;
            case MAINTENANCE:
                return target == RECEIVING_TELEMETRY || target == ACTIVE || target == RETIRED;
            default:
                return false;
        }
    }
}
