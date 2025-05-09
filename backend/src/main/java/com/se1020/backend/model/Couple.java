package com.se1020.backend.model;

import java.util.Date;

public class Couple extends User {
    private double budget;
    private Date weddingDate;
    private String partnerId;
    private User partner;

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

    public void planWedding() {}
    public void requestBooking() {}
    public void reviewVendor() {}
}
