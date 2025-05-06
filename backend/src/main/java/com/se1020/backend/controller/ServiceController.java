package com.se1020.backend.controller;

import com.se1020.backend.model.Service;
import com.se1020.backend.service.ServiceManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/service")
public class ServiceController {

    @Autowired
    private ServiceManagementService serviceManagementService;

    @GetMapping
    public List<Service> getAllServices() throws IOException {
        return serviceManagementService.getAllServices();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable String id) throws IOException {
        Service service = serviceManagementService.getServiceById(id);
        if (service != null) {
            return ResponseEntity.ok(service);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Service> createService(@RequestBody Service service) throws IOException {
        serviceManagementService.createService(service);
        return ResponseEntity.status(HttpStatus.CREATED).body(service);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Service> updateService(@PathVariable String id, @RequestBody Service service) throws IOException {
        service.setServiceId(id);
        serviceManagementService.updateService(service);
        return ResponseEntity.ok(service);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable String id) throws IOException {
        serviceManagementService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}
