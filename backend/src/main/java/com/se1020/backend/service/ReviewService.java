package com.se1020.backend.service;

import com.se1020.backend.model.Review;
import com.se1020.backend.model.Vendor;
import com.se1020.backend.repository.ReviewRepository;
import com.se1020.backend.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private VendorRepository vendorRepository;

    public List<Review> getAllReviews() throws IOException {
        return reviewRepository.findAll();
    }
    
    public Review getReviewById(String id) throws IOException {
        return reviewRepository.findById(id);
    }
    
    public List<Review> getReviewsByVendorId(String vendorId) throws IOException {
        return reviewRepository.findByVendorId(vendorId);
    }
    
    public List<Review> getReviewsByCoupleId(String coupleId) throws IOException {
        return reviewRepository.findByCoupleId(coupleId);
    }
    
    public Review createReview(Review review) throws IOException {
        // Generate ID if not provided
        if (review.getReviewId() == null || review.getReviewId().isEmpty()) {
            review.setReviewId(UUID.randomUUID().toString());
        }
        
        // Set review date if not provided
        if (review.getReviewDate() == null) {
            review.setReviewDate(new Date());
        }
        
        // Save the review
        reviewRepository.save(review);
        
        // Update vendor's average rating
        updateVendorRating(review.getVendorId());
        
        return review;
    }
    
    public void updateReview(Review review) throws IOException {
        reviewRepository.update(review);
        
        // Update vendor's average rating
        updateVendorRating(review.getVendorId());
    }
    
    public void deleteReview(String reviewId) throws IOException {
        Review review = getReviewById(reviewId);
        if (review != null) {
            String vendorId = review.getVendorId();
            reviewRepository.delete(reviewId);
            
            // Update vendor's average rating
            updateVendorRating(vendorId);
        }
    }
    
    /**
     * Updates the average rating for a vendor based on all their reviews
     */
    private void updateVendorRating(String vendorId) throws IOException {
        List<Review> vendorReviews = getReviewsByVendorId(vendorId);
        
        if (vendorReviews.isEmpty()) {
            return;
        }
        
        // Calculate average rating
        double totalRating = 0;
        for (Review r : vendorReviews) {
            totalRating += r.getRating();
        }
        double averageRating = totalRating / vendorReviews.size();
        
        // Update vendor's rating
        Vendor vendor = vendorRepository.findById(vendorId);
        if (vendor != null) {
            vendor.setRating(averageRating);
            vendorRepository.update(vendor);
        }
    }
}
