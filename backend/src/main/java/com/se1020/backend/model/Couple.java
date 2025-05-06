package com.se1020.backend.model;

import java.util.Date;

public class Couple extends User {
    private double budget;
    private Date weddingDate;

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
}
