package com.se1020.backend.controller;

import com.se1020.backend.model.Vendor;
import com.se1020.backend.model.VendorSearchCriteria;
import com.se1020.backend.model.VendorType;
import com.se1020.backend.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

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

    /**
     * Advanced search endpoint with all filter criteria in request body
     */
    @PostMapping("/search")
    public List<Vendor> searchVendors(@RequestBody VendorSearchCriteria criteria) throws IOException {
        return vendorService.searchVendors(criteria);
    }

    /**
     * Simple search endpoint with most common filter criteria as query parameters
     */
    @GetMapping("/search")
    public List<Vendor> searchVendors(
            @RequestParam(required = false) VendorType type,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Double maxRating,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date availableDate,
            @RequestParam(required = false) String keyword) throws IOException {

        VendorSearchCriteria criteria = new VendorSearchCriteria();
        criteria.setVendorType(type);
        criteria.setMinRating(minRating);
        criteria.setMaxRating(maxRating);
        criteria.setAvailabilityDate(availableDate);

        if (keyword != null && !keyword.isEmpty()) {
            criteria.setKeywords(Arrays.asList(keyword.split(",")));
        }

        return vendorService.searchVendors(criteria);
    }

    /**
     * Get vendors sorted by rating (highest first)
     */
    @GetMapping("/top-rated")
    public List<Vendor> getTopRatedVendors() throws IOException {
        return vendorService.getVendorsSortedByRating();
    }

    /**
     * Get vendors by price range
     */
    @GetMapping("/price-range")
    public List<Vendor> getVendorsByPriceRange(
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) throws IOException {
        return vendorService.getVendorsByPriceRange(minPrice, maxPrice);
    }
}
