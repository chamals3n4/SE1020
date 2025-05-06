package com.se1020.backend.service;

import com.se1020.backend.model.Task;
import com.se1020.backend.model.TaskList;
import com.se1020.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;
    
    private TaskList taskList = new TaskList();
    
    public List<Task> getAllTasks() throws IOException {
        List<Task> tasks = taskRepository.findAll();
        taskList.setTasks(tasks);
        return tasks;
    }
    
    public Task getTaskById(String id) throws IOException {
        return taskRepository.findById(id);
    }
    
    public void createTask(Task task) throws IOException {
        if (task.getTaskId() == null || task.getTaskId().isEmpty()) {
            task.setTaskId(UUID.randomUUID().toString());
        }
        taskRepository.save(task);
        taskList.addTask(task);
    }
    
    public void updateTask(Task task) throws IOException {
        taskRepository.update(task);
        
        // Update in the task list as well
        List<Task> currentTasks = getAllTasks();
        taskList.setTasks(currentTasks);
    }
    
    public void deleteTask(String taskId) throws IOException {
        taskRepository.delete(taskId);
        taskList.removeTask(taskId);
    }
    
    public List<Task> getPendingTasks() throws IOException {
        // First make sure our task list is up to date
        getAllTasks();
        return taskList.getPendingTasks();
    }
    
    public void markTaskCompleted(String taskId) throws IOException {
        Task task = getTaskById(taskId);
        if (task != null) {
            task.markCompleted();
            updateTask(task);
        }
    }
}
