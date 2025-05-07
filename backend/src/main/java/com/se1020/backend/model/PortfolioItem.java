package com.se1020.backend.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * Represents a portfolio item for vendors to showcase their previous work
 */
public class PortfolioItem {
    private String id;
    private String title;
    private String description;
    private Date eventDate;
    private List<String> imageUrls;
    private String eventType;
    private String clientTestimonial;
    
    public PortfolioItem() {
        this.id = UUID.randomUUID().toString();
        this.imageUrls = new ArrayList<>();
    }
    
    public PortfolioItem(String title, String description, Date eventDate) {
        this();
        this.title = title;
        this.description = description;
        this.eventDate = eventDate;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getEventDate() {
        return eventDate;
    }

    public void setEventDate(Date eventDate) {
        this.eventDate = eventDate;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
    
    public void addImageUrl(String imageUrl) {
        if (this.imageUrls == null) {
            this.imageUrls = new ArrayList<>();
        }
        this.imageUrls.add(imageUrl);
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getClientTestimonial() {
        return clientTestimonial;
    }

    public void setClientTestimonial(String clientTestimonial) {
        this.clientTestimonial = clientTestimonial;
    }
}
