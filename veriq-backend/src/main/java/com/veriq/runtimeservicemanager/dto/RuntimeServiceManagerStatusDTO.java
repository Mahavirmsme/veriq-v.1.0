package com.veriq.runtimeservicemanager.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

public class RuntimeServiceManagerStatusDTO {

    private boolean running = true;
    private int intervalSeconds = 15;
    private long totalCyclesExecuted;
    private long totalPacketsProduced;
    private int activeSensorsCount;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime lastCycleTime;

    private List<String> recentExecutionLogs = new ArrayList<>();

    public RuntimeServiceManagerStatusDTO() {}

    public boolean isRunning() {
        return running;
    }

    public void setRunning(boolean running) {
        this.running = running;
    }

    public int getIntervalSeconds() {
        return intervalSeconds;
    }

    public void setIntervalSeconds(int intervalSeconds) {
        this.intervalSeconds = intervalSeconds;
    }

    public long getTotalCyclesExecuted() {
        return totalCyclesExecuted;
    }

    public void setTotalCyclesExecuted(long totalCyclesExecuted) {
        this.totalCyclesExecuted = totalCyclesExecuted;
    }

    public long getTotalPacketsProduced() {
        return totalPacketsProduced;
    }

    public void setTotalPacketsProduced(long totalPacketsProduced) {
        this.totalPacketsProduced = totalPacketsProduced;
    }

    public int getActiveSensorsCount() {
        return activeSensorsCount;
    }

    public void setActiveSensorsCount(int activeSensorsCount) {
        this.activeSensorsCount = activeSensorsCount;
    }

    public OffsetDateTime getLastCycleTime() {
        return lastCycleTime;
    }

    public void setLastCycleTime(OffsetDateTime lastCycleTime) {
        this.lastCycleTime = lastCycleTime;
    }

    public List<String> getRecentExecutionLogs() {
        return recentExecutionLogs;
    }

    public void setRecentExecutionLogs(List<String> recentExecutionLogs) {
        this.recentExecutionLogs = recentExecutionLogs;
    }
}
