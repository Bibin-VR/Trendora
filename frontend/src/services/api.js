import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('trendora-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiService = {
  // Products
  getProducts: async (params = {}) => {
    const res = await axios.get(`${API}/products`, { params });
    return res.data;
  },
  getBestDeals: async (gender, limit = 8) => {
    const params = { limit };
    if (gender && gender !== 'all') params.gender = gender;
    const res = await axios.get(`${API}/products/best-deals`, { params });
    return res.data;
  },
  getProduct: async (id) => {
    const res = await axios.get(`${API}/products/${id}`);
    return res.data;
  },

  // Collections
  getCollections: async (gender) => {
    const params = {};
    if (gender && gender !== 'all') params.gender = gender;
    const res = await axios.get(`${API}/collections`, { params });
    return res.data;
  },

  // Brands
  getBrands: async () => {
    const res = await axios.get(`${API}/brands`);
    return res.data;
  },

  // Favorites
  getFavorites: async () => {
    const res = await axios.get(`${API}/favorites`, { headers: getAuthHeaders() });
    return res.data;
  },
  addFavorite: async (productId) => {
    const res = await axios.post(`${API}/favorites/${productId}`, {}, { headers: getAuthHeaders() });
    return res.data;
  },
  removeFavorite: async (productId) => {
    const res = await axios.delete(`${API}/favorites/${productId}`, { headers: getAuthHeaders() });
    return res.data;
  },

  // Cart
  getCart: async () => {
    const res = await axios.get(`${API}/cart`, { headers: getAuthHeaders() });
    return res.data;
  },
  addToCart: async (productId, quantity = 1, size, color) => {
    const res = await axios.post(`${API}/cart/add`, { product_id: productId, quantity, size, color }, { headers: getAuthHeaders() });
    return res.data;
  },
  updateCartItem: async (productId, quantity) => {
    const res = await axios.put(`${API}/cart/${productId}`, { quantity }, { headers: getAuthHeaders() });
    return res.data;
  },
  removeFromCart: async (productId) => {
    const res = await axios.delete(`${API}/cart/${productId}`, { headers: getAuthHeaders() });
    return res.data;
  },
  clearCart: async () => {
    const res = await axios.delete(`${API}/cart`, { headers: getAuthHeaders() });
    return res.data;
  },

  // Shipping
  getShippingMethods: async () => {
    const res = await axios.get(`${API}/shipping-methods`);
    return res.data;
  },

  // Orders
  createOrder: async (shippingMethod, shippingAddress) => {
    const res = await axios.post(`${API}/orders/create`, { shipping_method: shippingMethod, shipping_address: shippingAddress }, { headers: getAuthHeaders() });
    return res.data;
  },
  verifyPayment: async (orderId, paymentId, signature) => {
    const res = await axios.post(`${API}/orders/verify-payment`, { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature }, { headers: getAuthHeaders() });
    return res.data;
  },
  demoPayment: async () => {
    const res = await axios.post(`${API}/orders/demo-payment`, {}, { headers: getAuthHeaders() });
    return res.data;
  },
  getOrders: async () => {
    const res = await axios.get(`${API}/orders`, { headers: getAuthHeaders() });
    return res.data;
  },

  // Config
  getRazorpayConfig: async () => {
    const res = await axios.get(`${API}/config/razorpay`);
    return res.data;
  }
};
