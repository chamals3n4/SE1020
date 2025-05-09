package com.se1020.backend.model;

public class PhotographyService extends Service {
    private int hoursOfCoverage;
    private int numberOfPhotos;
    private boolean includesEngagementShoot;
    private boolean includesWeddingAlbum;

    public int getHoursOfCoverage() {
        return hoursOfCoverage;
    }

    public void setHoursOfCoverage(int hoursOfCoverage) {
        this.hoursOfCoverage = hoursOfCoverage;
    }

    public int getNumberOfPhotos() {
        return numberOfPhotos;
    }

    public void setNumberOfPhotos(int numberOfPhotos) {
        this.numberOfPhotos = numberOfPhotos;
    }

    public boolean isIncludesEngagementShoot() {
        return includesEngagementShoot;
    }

    public void setIncludesEngagementShoot(boolean includesEngagementShoot) {
        this.includesEngagementShoot = includesEngagementShoot;
    }

    public boolean isIncludesWeddingAlbum() {
        return includesWeddingAlbum;
    }

    public void setIncludesWeddingAlbum(boolean includesWeddingAlbum) {
        this.includesWeddingAlbum = includesWeddingAlbum;
    }
} 