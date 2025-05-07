package com.se1020.backend.model;

import com.se1020.backend.enums.WeddingStyle;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Wedding {
    private String weddingId;
    private String coupleId;  // Reference to the couple who owns this wedding
    private Date date;
    private String location;
    private WeddingStyle style;
    private double budget;
    private List<Task> tasks = new ArrayList<>();  // Composition relationship
    
    public Wedding() {
    }
    
    public Wedding(String weddingId, String coupleId, Date date, String location, WeddingStyle style, double budget) {
        this.weddingId = weddingId;
        this.coupleId = coupleId;
        this.date = date;
        this.location = location;
        this.style = style;
        this.budget = budget;
    }
    
    public String getWeddingId() {
        return weddingId;
    }
    
    public void setWeddingId(String weddingId) {
        this.weddingId = weddingId;
    }
    
    public Date getDate() {
        return date;
    }
    
    public void setDate(Date date) {
        this.date = date;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public WeddingStyle getStyle() {
        return style;
    }
    
    public void setStyle(WeddingStyle style) {
        this.style = style;
    }
    
    public double getBudget() {
        return budget;
    }
    
    public void setBudget(double budget) {
        this.budget = budget;
    }
    
    public String getCoupleId() {
        return coupleId;
    }
    
    public void setCoupleId(String coupleId) {
        this.coupleId = coupleId;
    }
    
    // List of tasks (composition)
    public List<Task> getTasks() {
        return tasks;
    }
    
    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
    
    // Methods from UML
    public void addTask(Task task) {
        this.tasks.add(task);
    }
    
    public void removeTask(String taskId) {
        this.tasks.removeIf(task -> task.getTaskId().equals(taskId));
    }
    
    public void addService(Service service) {
        // Implementation would add a service to the wedding
    }
    
    public void updateBudget(double amount) {
        this.budget = amount;
    }
    
    public void generateTimeline() {
        // Implementation to generate a timeline for the wedding
    }
}
