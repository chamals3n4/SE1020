package com.se1020.backend.controller;

import com.se1020.backend.model.Task;
import com.se1020.backend.model.Wedding;
import com.se1020.backend.service.TaskService;
import com.se1020.backend.service.WeddingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

/**
 * Controller for managing wedding-related operations with support for
 * consolidated API requests
 * that allow creating and updating weddings with tasks in a single request.
 */

@RestController
@RequestMapping("/api/wedding")
public class WeddingController {

    @Autowired
    private WeddingService weddingService;

    @Autowired
    private TaskService taskService;

    @GetMapping
    public List<Wedding> getAllWeddings() throws IOException {
        return weddingService.getAllWeddings();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Wedding> getWeddingById(@PathVariable String id) throws IOException {
        Wedding wedding = weddingService.getWeddingById(id);
        if (wedding != null) {
            return ResponseEntity.ok(wedding);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Legacy method for creating a basic wedding
     * 
     * @deprecated Use {@link #createWeddingProfile(Wedding)} instead
     */
    @Deprecated
    @PostMapping
    public ResponseEntity<Wedding> createWedding(@RequestBody Wedding wedding) throws IOException {
        weddingService.createWedding(wedding);
        return ResponseEntity.status(HttpStatus.CREATED).body(wedding);
    }

    /**
     * Create a wedding with tasks in a single request
     * This consolidated API allows creating a wedding and its associated tasks in
     * one call
     */
    @PostMapping("/profile")
    public ResponseEntity<Wedding> createWeddingProfile(@RequestBody Wedding wedding) throws IOException {
        // Mark this wedding as a request object
        wedding.asRequestObject();

        // Create a new entity from the request
        Wedding entity = wedding.toEntity();

        // Create the wedding in the system
        weddingService.createWedding(entity);

        // All tasks are already part of the wedding entity from the toEntity()
        // conversion
        // Update any task wedding IDs if needed
        for (Task task : entity.getTasks()) {
            if (task.getWeddingId() == null || task.getWeddingId().isEmpty()) {
                task.setWeddingId(entity.getWeddingId());
            }
        }

        // Update the wedding with the tasks
        if (!entity.getTasks().isEmpty()) {
            weddingService.updateWedding(entity);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Wedding> updateWedding(@PathVariable String id, @RequestBody Wedding wedding)
            throws IOException {
        wedding.setWeddingId(id);
        weddingService.updateWedding(wedding);
        return ResponseEntity.ok(wedding);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWedding(@PathVariable String id) throws IOException {
        weddingService.deleteWedding(id);
        return ResponseEntity.noContent().build();
    }
}
