package com.se1020.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.se1020.backend.enums.WeddingStyle;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Wedding class that combines the functionality of Wedding entity and WeddingProfileRequest.
 * Contains wedding details and provides methods for managing tasks and handling profile requests.
 */
public class Wedding {
    private String weddingId;
    private String coupleId;  // Reference to the couple who owns this wedding
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private Date date;
    
    private String location;
    private String address;
    private WeddingStyle style;
    private double budget;
    private List<Task> tasks = new ArrayList<>();  // Composition relationship
    
    // Flag to determine if this is used as a request object or an entity
    private transient boolean isRequestObject = false;
    
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
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public WeddingStyle getStyle() {
        return style;
    }
    
    public void setStyle(WeddingStyle style) {
        if (style == null) {
            this.style = WeddingStyle.TRADITIONAL; // Default style
        } else {
            this.style = style;
        }
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
    
    
    public void updateBudget(double amount) {
        this.budget = amount;
    }
    
    public void generateTimeline() {
        // Implementation to generate a timeline for the wedding
    }
    
    /**
     * Mark this Wedding object as a request object.
     * This is useful when using the same class for both entity and request purposes.
     * 
     * @return this Wedding object for method chaining
     */
    public Wedding asRequestObject() {
        this.isRequestObject = true;
        return this;
    }
    
    /**
     * Check if this Wedding object is being used as a request object.
     * 
     * @return true if this is a request object, false otherwise
     */
    public boolean isRequestObject() {
        return isRequestObject;
    }
    
    /**
     * Replace all tasks with a new list of tasks.
     * This is particularly useful when updating a wedding profile with a completely new set of tasks.
     * 
     * @param tasks the new list of tasks to set
     */
    public void replaceTasks(List<Task> tasks) {
        this.tasks.clear();
        if (tasks != null) {
            this.tasks.addAll(tasks);
        }
    }
    
    /**
     * Create a Wedding entity from this request object.
     * If this is not a request object (isRequestObject is false), it returns itself.
     * 
     * @return a Wedding entity populated with data from this request
     */
    public Wedding toEntity() {
        if (!isRequestObject) {
            return this;
        }
        
        Wedding entity = new Wedding();
        entity.setWeddingId(this.weddingId);
        entity.setCoupleId(this.coupleId);
        entity.setDate(this.date);
        entity.setLocation(this.location);
        entity.setStyle(this.style);
        entity.setBudget(this.budget);
        entity.replaceTasks(this.tasks);
        
        return entity;
    }
}
