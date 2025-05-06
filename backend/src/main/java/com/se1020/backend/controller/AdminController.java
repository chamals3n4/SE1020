package com.se1020.backend.controller;

import com.se1020.backend.model.User;
import com.se1020.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    public List<User> getAllUsers() throws IOException {
        return adminService.getAllUsers();
    }
    
    @PutMapping("/vendor/{id}/approve")
    public ResponseEntity<Void> approveVendor(@PathVariable String id) throws IOException {
        adminService.approveVendor(id);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/dispute/{userId}/resolve")
    public ResponseEntity<Void> resolveDispute(
            @PathVariable String userId,
            @RequestBody Map<String, String> resolution) throws IOException {
        adminService.resolveDispute(userId, resolution.get("resolution"));
        return ResponseEntity.ok().build();
    }
}
