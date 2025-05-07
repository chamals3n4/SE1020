package com.se1020.backend.util;

import com.se1020.backend.model.Task;
import java.util.ArrayList;
import java.util.List;

public class TaskList {
    private List<Task> tasks;
    
    public TaskList() {
        this.tasks = new ArrayList<>();
    }
    
    public List<Task> getTasks() {
        return tasks;
    }
    
    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
    
    public void addTask(Task task) {
        tasks.add(task);
    }
    
    public void removeTask(String taskId) {
        tasks.removeIf(task -> task.getTaskId().equals(taskId));
    }
    
    public List<Task> getPendingTasks() {
        List<Task> pendingTasks = new ArrayList<>();
        for (Task task : tasks) {
            if (!task.isCompleted()) {
                pendingTasks.add(task);
            }
        }
        return pendingTasks;
    }
}
