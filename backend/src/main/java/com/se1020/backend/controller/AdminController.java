package com.se1020.backend.controller;

import com.se1020.backend.model.User;
import com.se1020.backend.model.Vendor;
import com.se1020.backend.model.Couple;
import com.se1020.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");
            
            User admin = adminService.login(email, password);
            if (admin != null) {
                return ResponseEntity.ok(admin);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            List<User> users = adminService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        try {
            adminService.deleteUser(userId);
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/vendors")
    public ResponseEntity<List<Vendor>> getAllVendors() {
        try {
            List<Vendor> vendors = adminService.getAllVendors();
            return ResponseEntity.ok(vendors);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/vendors/{vendorId}")
    public ResponseEntity<Vendor> getVendorById(@PathVariable String vendorId) {
        try {
            Vendor vendor = adminService.getVendorById(vendorId);
            if (vendor != null) {
                return ResponseEntity.ok(vendor);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/vendors/{vendorId}/approve")
    public ResponseEntity<Void> approveVendor(@PathVariable String vendorId) {
        try {
            adminService.approveVendor(vendorId);
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/vendors/{vendorId}/reject")
    public ResponseEntity<Void> rejectVendor(@PathVariable String vendorId) {
        try {
            adminService.rejectVendor(vendorId);
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/vendors/{vendorId}")
    public ResponseEntity<Void> deleteVendor(@PathVariable String vendorId) {
        try {
            adminService.deleteVendor(vendorId);
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/couples")
    public ResponseEntity<List<Couple>> getAllCouples() {
        try {
            List<Couple> couples = adminService.getAllCouples();
            return ResponseEntity.ok(couples);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/couples/{coupleId}")
    public ResponseEntity<Couple> getCoupleById(@PathVariable String coupleId) {
        try {
            Couple couple = adminService.getCoupleById(coupleId);
            if (couple != null) {
                return ResponseEntity.ok(couple);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/couples/{coupleId}")
    public ResponseEntity<Void> deleteCouple(@PathVariable String coupleId) {
        try {
            adminService.deleteCouple(coupleId);
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        try {
            Map<String, Object> stats = adminService.getStats();
            return ResponseEntity.ok(stats);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 