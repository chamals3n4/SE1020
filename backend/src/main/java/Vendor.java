 class Vendor extends User{
    private vendorType vendorType;
    private String businessName;
    private double rating;
    private List<date> availability;

     public vendorType getVendorType() {
         return vendorType;
     }

     public void setVendorType(vendorType vendorType) {
         this.vendorType = vendorType;
     }

     public String getBusinessName() {
         return businessName;
     }

     public void setBusinessName(String businessName) {
         this.businessName = businessName;
     }

     public double getRating() {
         return rating;
     }

     public void setRating(double rating) {
         this.rating = rating;
     }

     public List<date> getAvailability() {
         return availability;
     }

     public void setAvailability(List<date> availability) {
         this.availability = availability;
     }

     public Vendor(vendorType vendorType, String businessName, double rating, List<date> availability) {
         this.vendorType = vendorType;
         this.businessName = businessName;
         this.rating = rating;
         this.availability = availability;
     }
 }