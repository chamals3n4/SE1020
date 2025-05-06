package com.se1020.backend.service;

import com.se1020.backend.model.Service;
import com.se1020.backend.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.util.List;

@org.springframework.stereotype.Service
public class ServiceManagementService {

    @Autowired
    private ServiceRepository serviceRepository;

    public List<Service> getAllServices() throws IOException {
        return serviceRepository.findAll();
    }

    public Service getServiceById(String id) throws IOException {
        return serviceRepository.findById(id);
    }

    public void createService(Service service) throws IOException {
        serviceRepository.save(service);
    }

    public void updateService(Service service) throws IOException {
        serviceRepository.update(service);
    }

    public void deleteService(String serviceId) throws IOException {
        serviceRepository.delete(serviceId);
    }
}
