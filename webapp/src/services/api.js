import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Vendor services
export const vendorService = {
  getAllVendors: () => api.get("/vendor"),
  getVendorById: (id) => api.get(`/vendor/${id}`),
  createVendor: (vendorData) => api.post("/vendor", vendorData),
  updateVendor: (id, vendorData) => api.put(`/vendor/${id}`, vendorData),
  deleteVendor: (id) => api.delete(`/vendor/${id}`),
  searchVendors: (criteria) => api.post("/vendor/search", criteria),
  getTopRatedVendors: () => api.get("/vendor/top-rated"),
  getVendorsByPriceRange: (minPrice, maxPrice) => {
    const params = {};
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    return api.get("/vendor/price-range", { params });
  },
  getVendorsSortedByPrice: (ascending = true) => api.get("/vendor/sorted-by-price", { params: { ascending } }),
  getVendorPackages: (id) => api.get(`/vendor/${id}/packages`),
  addServicePackage: (id, packageData) => api.post(`/vendor/${id}/packages`, packageData),
  removeServicePackage: (vendorId, packageId) => api.delete(`/vendor/${vendorId}/packages/${packageId}`),
  getVendorLocation: (id) => api.get(`/vendor/${id}/location`),
  updateVendorLocation: (id, locationData) => api.put(`/vendor/${id}/location`, null, { params: locationData }),
  getVendorSocialMedia: (id) => api.get(`/vendor/${id}/social-media`),
};

// Couple services
export const coupleService = {
  getAllCouples: () => api.get("/couple"),
  getCoupleById: (id) => api.get(`/couple/${id}`),
  createCouple: (coupleData) => api.post("/couple", coupleData),
  updateCouple: (id, coupleData) => api.put(`/couple/${id}`, coupleData),
  deleteCouple: (id) => api.delete(`/couple/${id}`),
};

// Wedding services
export const weddingService = {
  getAllWeddings: () => api.get("/wedding"),
  getWeddingById: (id) => api.get(`/wedding/${id}`),
  createWedding: (weddingData) => api.post("/wedding/profile", weddingData),
  updateWedding: (id, weddingData) => api.put(`/wedding/${id}`, weddingData),
  deleteWedding: (id) => api.delete(`/wedding/${id}`),
};

// Booking services
export const bookingService = {
  getAllBookings: () => api.get("/booking"),
  getBookingById: (id) => api.get(`/booking/${id}`),
  createBooking: (bookingData) => api.post("/booking", bookingData),
  updateBooking: (id, bookingData) => api.put(`/booking/${id}`, bookingData),
  deleteBooking: (id) => api.delete(`/booking/${id}`),
  confirmBooking: (id) => api.put(`/booking/${id}`, { status: "CONFIRMED" }),
  cancelBooking: (id) => api.put(`/booking/${id}`, { status: "CANCELLED" }),
};

// Task services
export const taskService = {
  getAllTasks: () => api.get("/tasks"),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  getTasksByWeddingId: (weddingId) => api.get(`/tasks/wedding/${weddingId}`),
  createTask: (taskData) => api.post("/tasks", taskData),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

// Review services
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
  login: (email, password) => api.post("/admin/login", { email, password }),
  getAllUsers: () => api.get("/admin/users"),
  getAllVendors: () => api.get("/admin/vendors"),
  getStats: () => api.get("/admin/stats"),
  approveVendor: (vendorId) => api.put(`/admin/vendors/${vendorId}/approve`),
  rejectVendor: (vendorId, reason) => api.put(`/admin/vendors/${vendorId}/reject`, { reason }),
  getAllCouples: () => api.get("/admin/couples"),
  getCoupleById: (coupleId) => api.get(`/admin/couples/${coupleId}`),
  deleteCouple: (coupleId) => api.delete(`/admin/couples/${coupleId}`)
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
