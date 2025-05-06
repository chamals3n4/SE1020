package com.se1020.backend.service;

import com.se1020.backend.model.Couple;
import com.se1020.backend.repository.CoupleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class CoupleService {

    @Autowired
    private CoupleRepository coupleRepository;

    public List<Couple> getAllCouples() throws IOException {
        return coupleRepository.findAll();
    }

    public Couple getCoupleById(String id) throws IOException {
        return coupleRepository.findById(id);
    }

    public void createCouple(Couple couple) throws IOException {
        coupleRepository.save(couple);
    }

    public void updateCouple(Couple couple) throws IOException {
        coupleRepository.update(couple);
    }

    public void deleteCouple(String coupleId) throws IOException {
        coupleRepository.delete(coupleId);
    }
}
