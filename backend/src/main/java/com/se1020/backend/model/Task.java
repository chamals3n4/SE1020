package com.se1020.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Date;

public class Task {
    private String taskId;
    private String weddingId;   // Link to the wedding this task belongs to
    private String name;        // Task name for quick identification
    private String description;
    private Date dueDate;
    private boolean isCompleted;
    
    public Task() {
    }
    
    public Task(String taskId, String weddingId, String name, String description, Date dueDate, boolean isCompleted) {
        this.taskId = taskId;
        this.weddingId = weddingId;
        this.name = name;
        this.description = description;
        this.dueDate = dueDate;
        this.isCompleted = isCompleted;
    }
    
    public String getTaskId() {
        return taskId;
    }
    
    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Date getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }
    
    @JsonProperty("isCompleted")
    public boolean isCompleted() {
        return isCompleted;
    }
    
    @JsonProperty("isCompleted")
    public void setCompleted(boolean completed) {
        isCompleted = completed;
    }
    
    public String getWeddingId() {
        return weddingId;
    }
    
    public void setWeddingId(String weddingId) {
        this.weddingId = weddingId;
    }
    
    public void markCompleted() {
        this.isCompleted = true;
    }
    
    public void updateTask() {
        // Implementation for updating task details
    }
}
