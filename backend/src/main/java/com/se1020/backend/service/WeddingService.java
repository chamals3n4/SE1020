package com.se1020.backend.service;

import com.se1020.backend.model.Wedding;
import com.se1020.backend.repository.WeddingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class WeddingService {

    @Autowired
    private WeddingRepository weddingRepository;

    public List<Wedding> getAllWeddings() throws IOException {
        return weddingRepository.findAll();
    }

    public Wedding getWeddingById(String id) throws IOException {
        return weddingRepository.findById(id);
    }

    public void createWedding(Wedding wedding) throws IOException {
        weddingRepository.save(wedding);
    }

    public void updateWedding(Wedding wedding) throws IOException {
        weddingRepository.update(wedding);
    }

    public void deleteWedding(String weddingId) throws IOException {
        weddingRepository.delete(weddingId);
    }
}
