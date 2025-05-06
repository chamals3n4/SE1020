package com.se1020.backend.model;

import java.util.Date;

public class Review {
    private String reviewId;
    private String vendorId;     // Vendor being reviewed
    private String coupleId;     // Couple who left the review
    private String bookingId;    // Related booking
    private int rating;          // Rating (1-5)
    private String comment;      // Detailed feedback
    private Date reviewDate;     // When the review was submitted
    private boolean isVerified;  // If this is from a verified booking
    
    public Review() {
    }
    
    public Review(String reviewId, String vendorId, String coupleId, String bookingId, 
                 int rating, String comment, Date reviewDate, boolean isVerified) {
        this.reviewId = reviewId;
        this.vendorId = vendorId;
        this.coupleId = coupleId;
        this.bookingId = bookingId;
        this.rating = rating;
        this.comment = comment;
        this.reviewDate = reviewDate;
        this.isVerified = isVerified;
    }
    
    public String getReviewId() {
        return reviewId;
    }
    
    public void setReviewId(String reviewId) {
        this.reviewId = reviewId;
    }
    
    public String getVendorId() {
        return vendorId;
    }
    
    public void setVendorId(String vendorId) {
        this.vendorId = vendorId;
    }
    
    public String getCoupleId() {
        return coupleId;
    }
    
    public void setCoupleId(String coupleId) {
        this.coupleId = coupleId;
    }
    
    public String getBookingId() {
        return bookingId;
    }
    
    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }
    
    public int getRating() {
        return rating;
    }
    
    public void setRating(int rating) {
        this.rating = rating;
    }
    
    public String getComment() {
        return comment;
    }
    
    public void setComment(String comment) {
        this.comment = comment;
    }
    
    public Date getReviewDate() {
        return reviewDate;
    }
    
    public void setReviewDate(Date reviewDate) {
        this.reviewDate = reviewDate;
    }
    
    public boolean isVerified() {
        return isVerified;
    }
    
    public void setVerified(boolean verified) {
        isVerified = verified;
    }
}
