/**
 * API REST complète pour TEDSAI
 * Ce module gère les communications avec les services externes
 */

class RestAPI {
  constructor(baseURL = '', options = {}) {
    this.baseURL = baseURL || window.location.origin;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    };
    this.timeout = options.timeout || 10000; // 10 secondes par défaut
    this.interceptors = {
      request: [],
      response: []
    };
    
    // Configuration de l'authentification
    this.authToken = null;
    this.refreshToken = null;
    
    this.init();
  }

  /**
   * Initialise l'API
   */
  init() {
    // Charger les jetons d'authentification s'ils existent
    this.loadAuthTokens();
    
    // Configurer les intercepteurs par défaut
    this.setupDefaultInterceptors();
  }

  /**
   * Charge les jetons d'authentification depuis le stockage local
   */
  loadAuthTokens() {
    try {
      const storedAuth = localStorage.getItem('tedsai_auth_tokens');
      if (storedAuth) {
        const tokens = JSON.parse(storedAuth);
        this.authToken = tokens.accessToken;
        this.refreshToken = tokens.refreshToken;
      }
    } catch (e) {
      console.warn('Impossible de charger les jetons d\'authentification:', e);
    }
  }

  /**
   * Sauvegarde les jetons d'authentification dans le stockage local
   */
  saveAuthTokens(accessToken, refreshToken) {
    try {
      const tokens = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('tedsai_auth_tokens', JSON.stringify(tokens));
      this.authToken = accessToken;
      this.refreshToken = refreshToken;
    } catch (e) {
      console.error('Impossible de sauvegarder les jetons d\'authentification:', e);
    }
  }

  /**
   * Supprime les jetons d'authentification
   */
  clearAuthTokens() {
    try {
      localStorage.removeItem('tedsai_auth_tokens');
      this.authToken = null;
      this.refreshToken = null;
    } catch (e) {
      console.error('Impossible de supprimer les jetons d\'authentification:', e);
    }
  }

  /**
   * Configure les intercepteurs par défaut
   */
  setupDefaultInterceptors() {
    // Intercepteur de requête pour ajouter le jeton d'authentification
    this.interceptors.request.push((config) => {
      if (this.authToken) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${this.authToken}`
        };
      }
      return config;
    });

    // Intercepteur de réponse pour gérer les erreurs et le rafraîchissement du jeton
    this.interceptors.response.push(async (response) => {
      if (response.status === 401) {
        // Essayez de rafraîchir le jeton
        const refreshed = await this.refreshAuthToken();
        if (refreshed) {
          // Réessayez la requête originale avec le nouveau jeton
          return this._makeRequest(response.config);
        } else {
          // Redirigez vers la page de connexion
          this.handleAuthFailure();
        }
      }
      return response;
    });
  }

  /**
   * Rafraîchit le jeton d'authentification
   */
  async refreshAuthToken() {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await this._makeRequest({
        method: 'POST',
        endpoint: '/auth/refresh',
        data: { refreshToken: this.refreshToken },
        skipAuth: true
      });

      if (response.ok) {
        const data = await response.json();
        this.saveAuthTokens(data.accessToken, data.refreshToken);
        return true;
      }
    } catch (e) {
      console.error('Erreur lors du rafraîchissement du jeton:', e);
      this.clearAuthTokens();
    }

    return false;
  }

  /**
   * Gère l'échec d'authentification
   */
  handleAuthFailure() {
    // Rediriger vers la page de connexion ou afficher une notification
    console.log('Authentification échouée. Veuillez vous reconnecter.');
    
    // Émettre un événement pour que l'application puisse réagir
    const event = new CustomEvent('authFailed', { detail: {} });
    document.dispatchEvent(event);
  }

  /**
   * Ajoute un intercepteur de requête
   */
  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
  }

  /**
   * Ajoute un intercepteur de réponse
   */
  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
  }

  /**
   * Effectue une requête HTTP
   */
  async request(config) {
    // Appliquer les intercepteurs de requête
    let processedConfig = { ...config };
    for (const interceptor of this.interceptors.request) {
      processedConfig = await interceptor(processedConfig);
    }

    // Effectuer la requête
    const response = await this._makeRequest(processedConfig);

    // Appliquer les intercepteurs de réponse
    let processedResponse = response;
    for (const interceptor of this.interceptors.response) {
      processedResponse = await interceptor(processedResponse);
    }

    return processedResponse;
  }

  /**
   * Méthode interne pour effectuer la requête HTTP
   */
  async _makeRequest(config) {
    const {
      method = 'GET',
      endpoint,
      data,
      params,
      headers = {},
      timeout = this.timeout,
      skipAuth = false
    } = config;

    // Construire l'URL
    let url = this.baseURL + endpoint;

    // Ajouter les paramètres de requête
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url += '?' + queryString;
    }

    // Fusionner les en-têtes
    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers
    };

    // Supprimer l'en-tête d'autorisation si skipAuth est vrai
    if (skipAuth && requestHeaders.Authorization) {
      delete requestHeaders.Authorization;
    }

    // Préparer le corps de la requête
    let body = null;
    if (data) {
      if (requestHeaders['Content-Type'] === 'application/json') {
        body = JSON.stringify(data);
      } else {
        body = data;
      }
    }

    // Créer la requête avec délai d'attente
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Cloner la réponse pour pouvoir la réutiliser dans les intercepteurs
      const clonedResponse = response.clone();
      clonedResponse.config = config; // Ajouter la config originale à la réponse

      return clonedResponse;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('La requête a expiré');
      }
      
      throw error;
    }
  }

  /**
   * Méthodes raccourcies pour les méthodes HTTP courantes
   */
  async get(endpoint, params, options = {}) {
    return this.request({ method: 'GET', endpoint, params, ...options });
  }

  async post(endpoint, data, options = {}) {
    return this.request({ method: 'POST', endpoint, data, ...options });
  }

  async put(endpoint, data, options = {}) {
    return this.request({ method: 'PUT', endpoint, data, ...options });
  }

  async patch(endpoint, data, options = {}) {
    return this.request({ method: 'PATCH', endpoint, data, ...options });
  }

  async delete(endpoint, options = {}) {
    return this.request({ method: 'DELETE', endpoint, ...options });
  }

  /**
   * Méthodes pour les services TEDSAI spécifiques
   */
  
  // Service d'authentification
  async login(credentials) {
    try {
      const response = await this.post('/auth/login', credentials, { skipAuth: true });
      if (response.ok) {
        const data = await response.json();
        this.saveAuthTokens(data.accessToken, data.refreshToken);
        return { success: true, data };
      } else {
        const error = await response.json();
        return { success: false, error: error.message || 'Identifiants incorrects' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async logout() {
    try {
      await this.post('/auth/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      this.clearAuthTokens();
    }
  }

  async register(userData) {
    try {
      const response = await this.post('/auth/register', userData, { skipAuth: true });
      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const error = await response.json();
        return { success: false, error: error.message || 'Erreur lors de l\'inscription' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Service des utilisateurs
  async getUsers(params) {
    return this.get('/users', params);
  }

  async getUser(userId) {
    return this.get(`/users/${userId}`);
  }

  async updateUser(userId, userData) {
    return this.put(`/users/${userId}`, userData);
  }

  async deleteUser(userId) {
    return this.delete(`/users/${userId}`);
  }

  // Service des services IA
  async getAIServices(params) {
    return this.get('/ai-services', params);
  }

  async getAIService(serviceId) {
    return this.get(`/ai-services/${serviceId}`);
  }

  async createAIService(serviceData) {
    return this.post('/ai-services', serviceData);
  }

  async updateAIService(serviceId, serviceData) {
    return this.put(`/ai-services/${serviceId}`, serviceData);
  }

  async deleteAIService(serviceId) {
    return this.delete(`/ai-services/${serviceId}`);
  }

  // Service des produits du jardin
  async getGardenProducts(params) {
    return this.get('/garden-products', params);
  }

  async getGardenProduct(productId) {
    return this.get(`/garden-products/${productId}`);
  }

  async createGardenProduct(productData) {
    return this.post('/garden-products', productData);
  }

  async updateGardenProduct(productId, productData) {
    return this.put(`/garden-products/${productId}`, productData);
  }

  async deleteGardenProduct(productId) {
    return this.delete(`/garden-products/${productId}`);
  }

  // Service des réservations du restaurant
  async getReservations(params) {
    return this.get('/reservations', params);
  }

  async getReservation(reservationId) {
    return this.get(`/reservations/${reservationId}`);
  }

  async createReservation(reservationData) {
    return this.post('/reservations', reservationData);
  }

  async updateReservation(reservationId, reservationData) {
    return this.put(`/reservations/${reservationId}`, reservationData);
  }

  async deleteReservation(reservationId) {
    return this.delete(`/reservations/${reservationId}`);
  }

  // Service des articles de blog
  async getBlogPosts(params) {
    return this.get('/blog-posts', params);
  }

  async getBlogPost(postId) {
    return this.get(`/blog-posts/${postId}`);
  }

  async createBlogPost(postData) {
    return this.post('/blog-posts', postData);
  }

  async updateBlogPost(postId, postData) {
    return this.put(`/blog-posts/${postId}`, postData);
  }

  async deleteBlogPost(postId) {
    return this.delete(`/blog-posts/${postId}`);
  }

  // Service des commentaires
  async getComments(params) {
    return this.get('/comments', params);
  }

  async getComment(commentId) {
    return this.get(`/comments/${commentId}`);
  }

  async createComment(commentData) {
    return this.post('/comments', commentData);
  }

  async updateComment(commentId, commentData) {
    return this.put(`/comments/${commentId}`, commentData);
  }

  async deleteComment(commentId) {
    return this.delete(`/comments/${commentId}`);
  }

  // Service de recherche
  async search(query, params) {
    return this.get('/search', { q: query, ...params });
  }

  // Service des préférences utilisateur
  async getUserPreferences(userId) {
    return this.get(`/users/${userId}/preferences`);
  }

  async updateUserPreferences(userId, preferences) {
    return this.put(`/users/${userId}/preferences`, preferences);
  }

  // Service des statistiques
  async getStats(params) {
    return this.get('/stats', params);
  }

  /**
   * Télécharge un fichier
   */
  async downloadFile(endpoint, filename) {
    try {
      const response = await this.get(endpoint, null, { 
        headers: { 'Accept': '*/*' },
        responseType: 'blob'
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return { success: true };
      } else {
        return { success: false, error: 'Échec du téléchargement' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Téléverse un fichier
   */
  async uploadFile(endpoint, file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Pour le téléversement de fichiers, nous devons utiliser fetch directement
      // car nous ne voulons pas que le Content-Type soit défini sur application/json
      const url = this.baseURL + endpoint;
      const headers = { 'Authorization': `Bearer ${this.authToken}` };
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Effectue une requête GraphQL (si le backend prend en charge GraphQL)
   */
  async graphql(query, variables = {}) {
    return this.post('/graphql', { query, variables });
  }
}

// Initialiser l'API REST
const restAPI = new RestAPI();

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RestAPI, restAPI };
} else {
  window.TedAPI = window.TedAPI || {};
  window.TedAPI.RestAPI = restAPI;
}

// Ajouter les styles CSS nécessaires
const style = document.createElement('style');
style.textContent = `
  /* Aucun style spécifique requis pour l'API REST */
`;
document.head.appendChild(style);