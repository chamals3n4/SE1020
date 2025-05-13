package com.se1020.backend.controller;

import com.se1020.backend.model.Task;
import com.se1020.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        try {
            return ResponseEntity.ok(taskService.getAllTasks());
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Task>> getPendingTasks() {
        try {
            return ResponseEntity.ok(taskService.getPendingTasks());
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable String id) {
        try {
            Task task = taskService.getTaskById(id);
            if (task != null) {
                return ResponseEntity.ok(task);
            }
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/wedding/{weddingId}")
    public ResponseEntity<List<Task>> getTasksByWeddingId(@PathVariable String weddingId) {
        try {
            List<Task> tasks = taskService.getTasksByWeddingId(weddingId);
            return ResponseEntity.ok(tasks);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        try {
            taskService.createTask(task);
            return ResponseEntity.ok(task);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable String id, @RequestBody Task task) {
        try {
            task.setTaskId(id);
            taskService.updateTask(task);
            return ResponseEntity.ok(task);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable String id) {
        try {
            taskService.deleteTask(id);
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Void> markTaskCompleted(@PathVariable String id) {
        try {
            taskService.markTaskCompleted(id);
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
