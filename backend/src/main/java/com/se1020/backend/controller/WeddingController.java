package com.se1020.backend.controller;

import com.se1020.backend.model.Wedding;
import com.se1020.backend.service.WeddingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/wedding")
public class WeddingController {

    @Autowired
    private WeddingService weddingService;

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

    @PostMapping
    public ResponseEntity<Wedding> createWedding(@RequestBody Wedding wedding) throws IOException {
        weddingService.createWedding(wedding);
        return ResponseEntity.status(HttpStatus.CREATED).body(wedding);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Wedding> updateWedding(@PathVariable String id, @RequestBody Wedding wedding) throws IOException {
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
