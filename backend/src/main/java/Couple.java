 class Couple extends User{
    protected double budget;
    protected Date weddingDate;

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

    public Couple(double budget, Date weddingDate) {
        this.budget = budget;
        this.weddingDate = weddingDate;
    }
}