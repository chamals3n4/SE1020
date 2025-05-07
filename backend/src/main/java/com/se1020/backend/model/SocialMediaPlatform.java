package com.se1020.backend.model;

/**
 * Enum representing different social media platforms for vendor profiles
 */
public enum SocialMediaPlatform {
    FACEBOOK("Facebook"),
    INSTAGRAM("Instagram"),
    PINTEREST("Pinterest"),
    TWITTER("Twitter"),
    LINKEDIN("LinkedIn"),
    YOUTUBE("YouTube"),
    TIKTOK("TikTok"),
    WEBSITE("Website");
    
    private final String displayName;
    
    SocialMediaPlatform(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
