package com.se1020.backend.controller;

import com.se1020.backend.model.Admin;
import com.se1020.backend.model.User;
import com.se1020.backend.model.Vendor;
import com.se1020.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");
            Admin admin = adminService.authenticateAdmin(email, password);

            if (admin != null) {
                // Don't return password in the response
                admin.setPassword(null);
                return ResponseEntity.ok(admin);
            } else {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Login failed: " + e.getMessage()));
        }
    }

    @GetMapping("/users")
    public List<User> getAllUsers() throws IOException {
        return adminService.getAllUsers();
    }

    @GetMapping("/vendors")
    public List<Vendor> getAllVendors() throws IOException {
        return adminService.getAllVendors();
    }

    @GetMapping("/stats")
    public Map<String, Object> getAdminStats() throws IOException {
        return adminService.getAdminStats();
    }

    @PutMapping("/vendor/{id}/approve")
    public ResponseEntity<Void> approveVendor(@PathVariable String id) throws IOException {
        adminService.approveVendor(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/vendor/{id}/reject")
    public ResponseEntity<Void> rejectVendor(
            @PathVariable String id,
            @RequestBody Map<String, String> rejection) throws IOException {
        adminService.rejectVendor(id, rejection.get("reason"));
        return ResponseEntity.ok().build();
    }


}
