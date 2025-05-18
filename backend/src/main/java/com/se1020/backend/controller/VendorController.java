package com.se1020.backend.controller;

import com.se1020.backend.enums.VendorType;
import com.se1020.backend.model.Vendor;
import com.se1020.backend.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/vendor")
public class VendorController {

    @Autowired
    private VendorService vendorService;

    @GetMapping
    public List<Vendor> getAllVendors() throws IOException {
        return vendorService.getAllVendors();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vendor> getVendorById(@PathVariable String id) throws IOException {
        Vendor vendor = vendorService.getVendorById(id);
        if (vendor != null) {
            return ResponseEntity.ok(vendor);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Vendor> createVendor(@RequestBody Vendor vendor) throws IOException {
        vendorService.createVendor(vendor);
        return ResponseEntity.status(HttpStatus.CREATED).body(vendor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vendor> updateVendor(@PathVariable String id, @RequestBody Vendor vendor) throws IOException {
        vendor.setId(id);
        vendorService.updateVendor(vendor);
        return ResponseEntity.ok(vendor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVendor(@PathVariable String id) throws IOException {
        vendorService.deleteVendor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/top-rated")
    public List<Vendor> getTopRatedVendors() throws IOException {
        return vendorService.getVendorsSortedByRating();
    }

    @GetMapping("/price-range")
    public List<Vendor> getVendorsByPriceRange(
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) throws IOException {
        return vendorService.getVendorsByPriceRange(minPrice, maxPrice);
    }

    @GetMapping("/sorted-by-price")
    public List<Vendor> getVendorsSortedByPrice(
            @RequestParam(defaultValue = "true") boolean ascending) throws IOException {
        return vendorService.getVendorsSortedByPrice(ascending);
    }
}
