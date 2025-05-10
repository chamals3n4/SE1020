import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Vendor  services
export const vendorService = {
  getAllVendors: () => api.get("/vendor"),

  getVendorById: (id) => api.get(`/vendor/${id}`),

  createVendor: (vendorData) => api.post("/vendor", vendorData),

  createVendorProfile: (profileData) =>
    api.post("/vendor/profile", profileData),

  updateVendor: (id, vendorData) => api.put(`/vendor/${id}`, vendorData),

  deleteVendor: (id) => api.delete(`/vendor/${id}`),

  searchVendors: (criteria) => api.post("/vendor/search", criteria),

  searchVendorsByParams: (params) => api.get("/vendor/search", { params }),

  getTopRatedVendors: () => api.get("/vendor/top-rated"),

  getVendorsByPriceRange: (minPrice, maxPrice) => {
    const params = {};
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    return api.get("/vendor/price-range", { params });
  },

  getVendorPortfolio: (id) => api.get(`/vendor/${id}/portfolio`),
  addPortfolioItem: (id, item) => api.post(`/vendor/${id}/portfolio`, item),
  removePortfolioItem: (vendorId, itemId) =>
    api.delete(`/vendor/${vendorId}/portfolio/${itemId}`),

  getVendorPackages: (id) => api.get(`/vendor/${id}/packages`),
  addServicePackage: (id, packageData) =>
    api.post(`/vendor/${id}/packages`, packageData),
  removeServicePackage: (vendorId, packageId) =>
    api.delete(`/vendor/${vendorId}/packages/${packageId}`),

  getVendorLocation: (id) => api.get(`/vendor/${id}/location`),
  updateVendorLocation: (id, locationData) =>
    api.put(`/vendor/${id}/location`, null, { params: locationData }),

  getVendorSocialMedia: (id) => api.get(`/vendor/${id}/social-media`),
  addSocialMediaLink: (id, platform, link) =>
    api.post(`/vendor/${id}/social-media`, null, {
      params: { platform, link },
    }),
  removeSocialMediaLink: (id, platform) =>
    api.delete(`/vendor/${id}/social-media/${platform}`),
};

// Couple  services
export const coupleService = {
  getAllCouples: () => api.get("/couple"),

  getCoupleById: (id) => api.get(`/couple/${id}`),

  createCouple: (coupleData) => api.post("/couple", coupleData),

  updateCouple: (id, coupleData) => api.put(`/couple/${id}`, coupleData),

  deleteCouple: (id) => api.delete(`/couple/${id}`),
};

// Wedding  services
export const weddingService = {
  getAllWeddings: () => api.get("/wedding"),

  getWeddingById: (id) => api.get(`/wedding/${id}`),

  createWedding: (weddingData) => api.post("/wedding", weddingData),

  createWeddingProfile: (profileData) =>
    api.post("/wedding/profile", profileData),

  updateWedding: (id, weddingData) => api.put(`/wedding/${id}`, weddingData),

  deleteWedding: (id) => api.delete(`/wedding/${id}`),
};

// Booking services
export const bookingService = {
  getAllBookings: () => api.get("/booking"),

  getBookingById: (id) => api.get(`/booking/${id}`),

  createBooking: (bookingData) => api.post("/booking", bookingData),

  // Enhanced updateBooking that first fetches the current booking data to avoid data loss
  updateBooking: async (id, bookingData) => {
    if (!id || id === 'undefined') {
      throw new Error('Booking ID is required for update and cannot be undefined.');
    }
    console.log(`Enhanced updateBooking for ID ${id}`);
    try {
      // First, get the current booking data
      const currentResponse = await api.get(`/booking/${id}`);
      if (currentResponse.data) {
        console.log('Found existing booking data:', currentResponse.data);
        // Merge current data with update data to preserve all fields
        const updatedData = { 
          ...currentResponse.data,  // Keep all existing fields
          ...bookingData,          // Apply updates
          id: id,                  // Ensure ID is preserved
          bookingId: id            // Ensure bookingId is preserved
        };
        console.log('Sending complete merged data:', updatedData);
        return api.put(`/booking/${id}`, updatedData);
      } else {
        // Fall back to direct update if no current data found
        console.warn('No existing booking found, doing direct update');
        return api.put(`/booking/${id}`, bookingData);
      }
    } catch (error) {
      console.error('Error in enhanced updateBooking:', error);
      // Fall back to direct update if fetch fails
      return api.put(`/booking/${id}`, bookingData);
    }
  },

  deleteBooking: (id) => api.delete(`/booking/${id}`),

  confirmBooking: async (id) => {
    console.log(`API: Confirming booking ${id}`);
    // Use the enhanced updateBooking to preserve all booking data
    return bookingService.updateBooking(id, { status: "CONFIRMED" });
  },

  cancelBooking: async (id) => {
    console.log(`API: Cancelling booking ${id}`);
    // Use the enhanced updateBooking to preserve all booking data
    return bookingService.updateBooking(id, { status: "CANCELLED" });
  },
};

// Task  services
export const taskService = {
  getAllTasks: () => api.get("/task"),

  getTaskById: (id) => api.get(`/task/${id}`),

  getTasksByWeddingId: (weddingId) => api.get(`/task/wedding/${weddingId}`),

  createTask: (taskData) => api.post("/task", taskData),

  updateTask: (id, taskData) => api.put(`/task/${id}`, taskData),

  deleteTask: (id) => api.delete(`/task/${id}`),
};

// Review  services
export const reviewService = {
  getAllReviews: () => api.get("/review"),

  getReviewById: (id) => api.get(`/review/${id}`),

  getReviewsByVendorId: (vendorId) => api.get(`/review/vendor/${vendorId}`),

  createReview: (reviewData) => api.post("/review", reviewData),

  updateReview: (id, reviewData) => api.put(`/review/${id}`, reviewData),

  deleteReview: (id) => api.delete(`/review/${id}`),
};

// Admin services
export const adminService = {
  login: async (email, password) => {
    return api.post("/admin/login", { email, password });
  },
  getAllUsers: () => api.get("/admin/users"),
  getAllVendors: () => api.get("/admin/vendors"),
  getStats: () => api.get("/admin/stats"),
  approveVendor: (vendorId) => api.put(`/admin/vendor/${vendorId}/approve`),
  rejectVendor: (vendorId, reason) => api.put(`/admin/vendor/${vendorId}/reject`, { reason })
};

export default {
  vendorService,
  coupleService,
  weddingService,
  bookingService,
  taskService,
  reviewService,
  adminService
};
