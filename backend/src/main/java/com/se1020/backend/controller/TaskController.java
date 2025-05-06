package com.se1020.backend.controller;

import com.se1020.backend.model.Task;
import com.se1020.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/task")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public List<Task> getAllTasks() throws IOException {
        return taskService.getAllTasks();
    }

    @GetMapping("/pending")
    public List<Task> getPendingTasks() throws IOException {
        return taskService.getPendingTasks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable String id) throws IOException {
        Task task = taskService.getTaskById(id);
        if (task != null) {
            return ResponseEntity.ok(task);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) throws IOException {
        taskService.createTask(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable String id, @RequestBody Task task) throws IOException {
        task.setTaskId(id);
        taskService.updateTask(task);
        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable String id) throws IOException {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{id}/complete")
    public ResponseEntity<Void> markTaskCompleted(@PathVariable String id) throws IOException {
        taskService.markTaskCompleted(id);
        return ResponseEntity.ok().build();
    }
}
