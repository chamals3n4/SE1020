package com.se1020.backend.model;

import java.util.List;

/**
 * Request class for creating or updating a wedding with all related information in a single request.
 * Contains wedding details and associated tasks.
 */
public class WeddingProfileRequest {
    
    private Wedding wedding;
    private List<Task> tasks;
    
    public WeddingProfileRequest() {
    }
    
    public Wedding getWedding() {
        return wedding;
    }
    
    public void setWedding(Wedding wedding) {
        this.wedding = wedding;
    }
    
    public List<Task> getTasks() {
        return tasks;
    }
    
    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
}
