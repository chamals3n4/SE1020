package com.se1020.backend.service;

import com.se1020.backend.model.Task;
import com.se1020.backend.util.TaskList;
import com.se1020.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TaskService {
    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);

    @Autowired
    private TaskRepository taskRepository;
    
    private TaskList taskList = new TaskList();
    
    public List<Task> getAllTasks() throws IOException {
        logger.info("Fetching all tasks");
        List<Task> tasks = taskRepository.findAll();
        taskList.setTasks(tasks);
        logger.info("Found {} tasks", tasks.size());
        return tasks;
    }
    
    public Task getTaskById(String id) throws IOException {
        logger.info("Fetching task with ID: {}", id);
        Task task = taskRepository.findById(id);
        if (task != null) {
            logger.info("Found task: {}", task.getName());
        } else {
            logger.warn("No task found with ID: {}", id);
        }
        return task;
    }

    public List<Task> getTasksByWeddingId(String weddingId) throws IOException {
        logger.info("Fetching tasks for wedding ID: {}", weddingId);
        List<Task> tasks = taskRepository.findAll();
        List<Task> weddingTasks = tasks.stream()
                .filter(task -> task.getWeddingId().equals(weddingId))
                .collect(Collectors.toList());
        logger.info("Found {} tasks for wedding ID: {}", weddingTasks.size(), weddingId);
        return weddingTasks;
    }
    
    public void createTask(Task task) throws IOException {
        logger.info("Creating new task: {}", task.getName());
        if (task.getTaskId() == null || task.getTaskId().isEmpty()) {
            task.setTaskId(UUID.randomUUID().toString());
            logger.debug("Generated new task ID: {}", task.getTaskId());
        }
        taskRepository.save(task);
        taskList.addTask(task);
        logger.info("Successfully created task with ID: {}", task.getTaskId());
    }
    
    public void updateTask(Task task) throws IOException {
        logger.info("Updating task with ID: {}", task.getTaskId());
        taskRepository.update(task);
        
        // Update in the task list as well
        List<Task> currentTasks = getAllTasks();
        taskList.setTasks(currentTasks);
        logger.info("Successfully updated task: {}", task.getName());
    }
    
    public void deleteTask(String taskId) throws IOException {
        logger.info("Deleting task with ID: {}", taskId);
        taskRepository.delete(taskId);
        taskList.removeTask(taskId);
        logger.info("Successfully deleted task with ID: {}", taskId);
    }
    
    public List<Task> getPendingTasks() throws IOException {
        logger.info("Fetching pending tasks");
        // First make sure our task list is up to date
        getAllTasks();
        List<Task> pendingTasks = taskList.getPendingTasks();
        logger.info("Found {} pending tasks", pendingTasks.size());
        return pendingTasks;
    }
    
    public void markTaskCompleted(String taskId) throws IOException {
        logger.info("Marking task as completed: {}", taskId);
        Task task = getTaskById(taskId);
        if (task != null) {
            task.markCompleted();
            updateTask(task);
            logger.info("Successfully marked task as completed: {}", task.getName());
        } else {
            logger.warn("Could not mark task as completed - task not found: {}", taskId);
        }
    }
}
