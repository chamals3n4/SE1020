package com.se1020.backend.controller;

import com.se1020.backend.model.Review;
import com.se1020.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public List<Review> getAllReviews() throws IOException {
        return reviewService.getAllReviews();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable String id) throws IOException {
        Review review = reviewService.getReviewById(id);
        if (review != null) {
            return ResponseEntity.ok(review);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/vendor/{vendorId}")
    public List<Review> getReviewsByVendorId(@PathVariable String vendorId) throws IOException {
        return reviewService.getReviewsByVendorId(vendorId);
    }

    @GetMapping("/couple/{coupleId}")
    public List<Review> getReviewsByCoupleId(@PathVariable String coupleId) throws IOException {
        return reviewService.getReviewsByCoupleId(coupleId);
    }

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review) throws IOException {
        Review createdReview = reviewService.createReview(review);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable String id, @RequestBody Review review) throws IOException {
        review.setReviewId(id);
        reviewService.updateReview(review);
        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable String id) throws IOException {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
