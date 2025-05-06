package com.se1020.backend.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.se1020.backend.model.Review;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class ReviewRepository {
    private static final String FILE_PATH = "src/main/resources/data/reviews.json";
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final File file = new File(FILE_PATH);

    public List<Review> findAll() throws IOException {
        if (!file.exists()) {
            file.getParentFile().mkdirs();
            file.createNewFile();
            objectMapper.writeValue(file, new ArrayList<Review>());
            return new ArrayList<>();
        }
        
        if (file.length() == 0) {
            objectMapper.writeValue(file, new ArrayList<Review>());
            return new ArrayList<>();
        }
        
        return objectMapper.readValue(file, new TypeReference<List<Review>>() {});
    }

    public Review findById(String id) throws IOException {
        List<Review> reviews = findAll();
        return reviews.stream()
                .filter(review -> review.getReviewId().equals(id))
                .findFirst()
                .orElse(null);
    }
    
    public List<Review> findByVendorId(String vendorId) throws IOException {
        List<Review> reviews = findAll();
        return reviews.stream()
                .filter(review -> review.getVendorId().equals(vendorId))
                .collect(Collectors.toList());
    }
    
    public List<Review> findByCoupleId(String coupleId) throws IOException {
        List<Review> reviews = findAll();
        return reviews.stream()
                .filter(review -> review.getCoupleId().equals(coupleId))
                .collect(Collectors.toList());
    }

    public void save(Review review) throws IOException {
        List<Review> reviews = findAll();
        reviews.add(review);
        objectMapper.writeValue(file, reviews);
    }

    public void update(Review review) throws IOException {
        List<Review> reviews = findAll();
        reviews.removeIf(r -> r.getReviewId().equals(review.getReviewId()));
        reviews.add(review);
        objectMapper.writeValue(file, reviews);
    }

    public void delete(String reviewId) throws IOException {
        List<Review> reviews = findAll();
        reviews.removeIf(r -> r.getReviewId().equals(reviewId));
        objectMapper.writeValue(file, reviews);
    }
}
