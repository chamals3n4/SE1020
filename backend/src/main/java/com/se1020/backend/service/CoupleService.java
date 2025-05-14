package com.se1020.backend.service;

import com.se1020.backend.model.Couple;
import com.se1020.backend.model.User;
import com.se1020.backend.repository.CoupleRepository;
import com.se1020.backend.repository.UserRepository;
import com.se1020.backend.enums.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class CoupleService {

    @Autowired
    private CoupleRepository coupleRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<Couple> getAllCouples() throws IOException {
        return coupleRepository.findAll();
    }

    public Couple getCoupleById(String id) throws IOException {
        return coupleRepository.findById(id);
    }

    public void createCouple(Couple couple) throws IOException {
        // Generate ID for the couple if not provided
        if (couple.getId() == null || couple.getId().isEmpty()) {
            couple.setId("couple-" + System.currentTimeMillis());
        }
        
        // Set the role as COUPLE
        couple.setRole(UserRole.COUPLE);
        
        // If partner information is provided, create a User for the partner
        if (couple.getPartner() != null) {
            User partner = couple.getPartner();
            
            // Generate ID for the partner if not provided
            if (partner.getId() == null || partner.getId().isEmpty()) {
                partner.setId("user-" + UUID.randomUUID().toString());
            }
            
            // Set partner's role as COUPLE
            partner.setRole(UserRole.COUPLE);
            
            // Save the partner
            userRepository.save(partner);
            
            // Link the partner to the couple
            couple.setPartnerId(partner.getId());
        }
        
        // Save the couple
        coupleRepository.save(couple);
    }

    public void updateCouple(Couple couple) throws IOException {
        coupleRepository.update(couple);
    }

    public void deleteCouple(String coupleId) throws IOException {
        coupleRepository.delete(coupleId);
    }
}
