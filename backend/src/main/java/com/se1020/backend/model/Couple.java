package com.se1020.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.se1020.backend.enums.UserRole;
import java.util.Date;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Couple extends User {
    private double budget;
    private Date weddingDate;
    private String partnerId;
    private User partner;

    public Couple(String id, String email, String password, String name, String phone, UserRole role,
                 double budget, Date weddingDate, String partnerId, User partner) {
        super(id, email, password, name, phone, role);
        this.budget = budget;
        this.weddingDate = weddingDate;
        this.partnerId = partnerId;
        this.partner = partner;
    }

    public Couple() {
        super();
    }

    @Override
    public String getUserType() {
        return "COUPLE";
    }

    public double getBudget() {
        return budget;
    }

    public void setBudget(double budget) {
        this.budget = budget;
    }

    public Date getWeddingDate() {
        return weddingDate;
    }

    public void setWeddingDate(Date weddingDate) {
        this.weddingDate = weddingDate;
    }

    public String getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(String partnerId) {
        this.partnerId = partnerId;
    }

    public User getPartner() {
        return partner;
    }

    public void setPartner(User partner) {
        this.partner = partner;
    }
}
