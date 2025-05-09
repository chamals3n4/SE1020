package com.se1020.backend.controller;

import com.se1020.backend.model.Couple;
import com.se1020.backend.service.CoupleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/couple")
public class CoupleController {

    @Autowired
    private CoupleService coupleService;

    @GetMapping
    public List<Couple> getAllCouples() throws IOException {
        return coupleService.getAllCouples();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Couple> getCoupleById(@PathVariable String id) throws IOException {
        Couple couple = coupleService.getCoupleById(id);
        if (couple != null) {
            return ResponseEntity.ok(couple);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Couple> createCouple(@RequestBody Couple couple) throws IOException {
        coupleService.createCouple(couple);
        return ResponseEntity.status(HttpStatus.CREATED).body(couple);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Couple> updateCouple(@PathVariable String id, @RequestBody Couple couple) throws IOException {
        couple.setId(id);
        coupleService.updateCouple(couple);
        return ResponseEntity.ok(couple);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCouple(@PathVariable String id) throws IOException {
        coupleService.deleteCouple(id);
        return ResponseEntity.noContent().build();
    }
}
