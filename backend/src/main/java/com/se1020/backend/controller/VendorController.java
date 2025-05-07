package com.se1020.backend.controller;

import com.se1020.backend.enums.SocialMediaPlatform;
import com.se1020.backend.enums.VendorType;
import com.se1020.backend.model.PortfolioItem;
import com.se1020.backend.model.ServicePackage;
import com.se1020.backend.model.Vendor;
import com.se1020.backend.service.VendorService;
import com.se1020.backend.util.VendorSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Controller for managing vendor-related operations with support for consolidated API requests
 * that allow creating and updating vendors with complete profiles in a single request.
 */

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

    /**
     * Legacy method for creating a basic vendor
     * @deprecated Use {@link #createVendorProfile(VendorProfileRequest)} instead
     */
    @Deprecated
    @PostMapping
    public ResponseEntity<Vendor> createVendor(@RequestBody Vendor vendor) throws IOException {
        vendorService.createVendor(vendor);
        return ResponseEntity.status(HttpStatus.CREATED).body(vendor);
    }
    
    /**
     * Create a vendor with complete profile details in a single request
     * Supports vendor details, location information, social media links, and service packages
     */
    @PostMapping("/profile")
    public ResponseEntity<Vendor> createVendorProfile(@RequestBody VendorProfileRequest request) throws IOException {
        // Create the base vendor
        Vendor vendor = request.getVendor();
        vendorService.createVendor(vendor);
        
        // Add location if provided
        if (request.getLocation() != null) {
            vendor.setAddress(request.getLocation().getAddress());
            vendor.setCity(request.getLocation().getCity());
            vendor.setState(request.getLocation().getState());
            vendor.setZipCode(request.getLocation().getZipCode());
            vendor.setServiceRadius(request.getLocation().getServiceRadius());
        }
        
        // Add social media links if provided
        if (request.getSocialMediaLinks() != null) {
            for (Map.Entry<SocialMediaPlatform, String> entry : request.getSocialMediaLinks().entrySet()) {
                vendor.addSocialMediaLink(entry.getKey(), entry.getValue());
            }
        }
        
        // Add service packages if provided
        if (request.getServicePackages() != null && !request.getServicePackages().isEmpty()) {
            for (ServicePackage servicePackage : request.getServicePackages()) {
                vendor.addServicePackage(servicePackage);
            }
        }
        
        // Update the vendor with all the new information
        vendorService.updateVendor(vendor);
        
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
    
    /**
     * Portfolio Management Endpoints
     */
    @GetMapping("/{id}/portfolio")
    public ResponseEntity<List<PortfolioItem>> getVendorPortfolio(@PathVariable String id) throws IOException {
        Vendor vendor = vendorService.getVendorById(id);
        if (vendor != null) {
            return ResponseEntity.ok(vendor.getPortfolioItems());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{id}/portfolio")
    public ResponseEntity<PortfolioItem> addPortfolioItem(
            @PathVariable String id,
            @RequestBody PortfolioItem item) throws IOException {
        Vendor vendor = vendorService.getVendorById(id);
        if (vendor != null) {
            vendor.addPortfolioItem(item);
            vendorService.updateVendor(vendor);
            return ResponseEntity.status(HttpStatus.CREATED).body(item);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{vendorId}/portfolio/{itemId}")
    public ResponseEntity<Void> removePortfolioItem(
            @PathVariable String vendorId,
            @PathVariable String itemId) throws IOException {
        Vendor vendor = vendorService.getVendorById(vendorId);
        if (vendor != null) {
            vendor.removePortfolioItem(itemId);
            vendorService.updateVendor(vendor);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Service Package Endpoints
     */
    @GetMapping("/{id}/packages")
    public ResponseEntity<List<ServicePackage>> getVendorPackages(@PathVariable String id) throws IOException {
        Vendor vendor = vendorService.getVendorById(id);
        if (vendor != null) {
            return ResponseEntity.ok(vendor.getServicePackages());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{id}/packages")
    public ResponseEntity<ServicePackage> addServicePackage(
            @PathVariable String id,
            @RequestBody ServicePackage servicePackage) throws IOException {
        Vendor vendor = vendorService.getVendorById(id);
        if (vendor != null) {
            vendor.addServicePackage(servicePackage);
            vendorService.updateVendor(vendor);
            return ResponseEntity.status(HttpStatus.CREATED).body(servicePackage);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{vendorId}/packages/{packageId}")
    public ResponseEntity<Void> removeServicePackage(
            @PathVariable String vendorId,
            @PathVariable String packageId) throws IOException {
        Vendor vendor = vendorService.getVendorById(vendorId);
        if (vendor != null) {
            vendor.removeServicePackage(packageId);
            vendorService.updateVendor(vendor);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Location Management Endpoints
     */
    @GetMapping("/{id}/location")
    public ResponseEntity<Map<String, Object>> getVendorLocation(@PathVariable String id) throws IOException {
        Vendor vendor = vendorService.getVendorById(id);
        if (vendor != null) {
            Map<String, Object> locationInfo = Map.of(
                "address", vendor.getAddress(),
                "city", vendor.getCity(),
                "state", vendor.getState(),
                "zipCode", vendor.getZipCode(),
                "serviceRadius", vendor.getServiceRadius()
            );
            return ResponseEntity.ok(locationInfo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/location")
    public ResponseEntity<Void> updateVendorLocation(
            @PathVariable String id,
            @RequestParam String address,
            @RequestParam String city,
            @RequestParam String state,
            @RequestParam String zipCode,
            @RequestParam(required = false) Double serviceRadius) throws IOException {
        Vendor vendor = vendorService.getVendorById(id);
        if (vendor != null) {
            vendor.setAddress(address);
            vendor.setCity(city);
            vendor.setState(state);
            vendor.setZipCode(zipCode);
            if (serviceRadius != null) {
                vendor.setServiceRadius(serviceRadius);
            }
            vendorService.updateVendor(vendor);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Social Media Endpoints
     */
    @GetMapping("/{id}/social-media")
    public ResponseEntity<Map<SocialMediaPlatform, String>> getVendorSocialMedia(@PathVariable String id) throws IOException {
        Vendor vendor = vendorService.getVendorById(id);
        if (vendor != null) {
            return ResponseEntity.ok(vendor.getSocialMediaLinks());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{id}/social-media")
    public ResponseEntity<Void> addSocialMediaLink(
            @PathVariable String id,
            @RequestParam SocialMediaPlatform platform,
            @RequestParam String link) throws IOException {
        Vendor vendor = vendorService.getVendorById(id);
        if (vendor != null) {
            vendor.addSocialMediaLink(platform, link);
            vendorService.updateVendor(vendor);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}/social-media/{platform}")
    public ResponseEntity<Void> removeSocialMediaLink(
            @PathVariable String id,
            @PathVariable SocialMediaPlatform platform) throws IOException {
        Vendor vendor = vendorService.getVendorById(id);
        if (vendor != null) {
            vendor.removeSocialMediaLink(platform);
            vendorService.updateVendor(vendor);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
