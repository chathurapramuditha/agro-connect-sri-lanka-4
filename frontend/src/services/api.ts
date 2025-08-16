// API Service to communicate with SQLite3 backend
const API_BASE_URL = import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Initialize database
  async initDatabase() {
    return this.request('/init-database', { method: 'POST' });
  }

  // Users API
  async getUsers() {
    return this.request('/users');
  }

  async getUser(userId: string) {
    return this.request(`/users/${userId}`);
  }

  async createUser(userData: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId: string, userData: any) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: string) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async searchUsers(query: string) {
    return this.request(`/users/search?q=${encodeURIComponent(query)}`);
  }

  // Products API
  async getProducts() {
    return this.request('/products');
  }

  async getProduct(productId: string) {
    return this.request(`/products/${productId}`);
  }

  async createProduct(productData: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(productId: string, productData: any) {
    return this.request(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(productId: string) {
    return this.request(`/products/${productId}`, {
      method: 'DELETE',
    });
  }

  async getProductsBySeller(sellerId: string) {
    return this.request(`/products/seller/${sellerId}`);
  }

  async getProductsByCategory(categoryId: string) {
    return this.request(`/products/category/${categoryId}`);
  }

  // Categories API
  async getCategories() {
    return this.request('/categories');
  }

  async getCategory(categoryId: string) {
    return this.request(`/categories/${categoryId}`);
  }

  async createCategory(categoryData: any) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  // Orders API
  async getOrders() {
    return this.request('/orders');
  }

  async getOrder(orderId: string) {
    return this.request(`/orders/${orderId}`);
  }

  async createOrder(orderData: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrder(orderId: string, orderData: any) {
    return this.request(`/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  }

  async getOrdersByBuyer(buyerId: string) {
    return this.request(`/orders/buyer/${buyerId}`);
  }

  async getOrdersBySeller(sellerId: string) {
    return this.request(`/orders/seller/${sellerId}`);
  }

  // Profiles API
  async getProfile(userId: string) {
    return this.request(`/profiles/${userId}`);
  }

  async createProfile(profileData: any) {
    return this.request('/profiles', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async updateProfile(userId: string, profileData: any) {
    return this.request(`/profiles/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Conversations API
  async getConversations(userId: string) {
    return this.request(`/conversations/user/${userId}`);
  }

  async getConversation(conversationId: string) {
    return this.request(`/conversations/${conversationId}`);
  }

  async createConversation(conversationData: any) {
    return this.request('/conversations', {
      method: 'POST',
      body: JSON.stringify(conversationData),
    });
  }

  // Messages API
  async getMessages(conversationId: string) {
    return this.request(`/messages/conversation/${conversationId}`);
  }

  async sendMessage(messageData: any) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async markMessageAsRead(messageId: string) {
    return this.request(`/messages/${messageId}/read`, {
      method: 'PUT',
    });
  }

  // Reviews API
  async getReviews() {
    return this.request('/reviews');
  }

  async getReviewsByUser(userId: string) {
    return this.request(`/reviews/user/${userId}`);
  }

  async getReviewsByProduct(productId: string) {
    return this.request(`/reviews/product/${productId}`);
  }

  async createReview(reviewData: any) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // Analytics API
  async getAnalyticsSummary() {
    return this.request('/analytics/summary');
  }

  // System API
  async getOnlineUsers() {
    return this.request('/system/online-users');
  }

  async getUserStatus(userId: string) {
    return this.request(`/system/user-status/${userId}`);
  }
}

export const apiService = new ApiService();
export default apiService;