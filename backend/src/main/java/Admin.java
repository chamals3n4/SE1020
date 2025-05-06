class Admin extends User{
    private String accessLevel;

    public String getAccessLevel() {
        return accessLevel;
    }

    public void setAccessLevel(String accessLevel) {
        this.accessLevel = accessLevel;
    }

    public Admin(String accessLevel) {
        this.accessLevel = accessLevel;
    }
}