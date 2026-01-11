/**
 * Système de notation et d'avis pour TEDSAI
 * Ce module gère les évaluations et commentaires des utilisateurs
 */

class RatingSystem {
  constructor() {
    this.reviews = new Map();
    this.ratings = new Map();
    this.categories = new Set(['service', 'product', 'restaurant', 'garden', 'experience']);
    this.maxRating = 5;
    this.minReviewLength = 10;
    this.maxReviewLength = 1000;
    
    this.init();
  }

  /**
   * Initialise le système de notation
   */
  init() {
    // Charger les avis depuis le stockage local
    this.loadReviews();
    
    // Activer la surveillance des interactions
    this.setupReviewMonitoring();
  }

  /**
   * Charge les avis depuis le stockage local
   */
  loadReviews() {
    try {
      const storedReviews = localStorage.getItem('tedsai_reviews');
      if (storedReviews) {
        const parsedReviews = JSON.parse(storedReviews);
        for (const [id, reviewData] of Object.entries(parsedReviews)) {
          this.reviews.set(id, new Review(reviewData));
        }
      }
    } catch (e) {
      console.warn('Impossible de charger les avis depuis le stockage local:', e);
    }
  }

  /**
   * Sauvegarde les avis dans le stockage local
   */
  saveReviews() {
    try {
      const serializedReviews = {};
      for (const [id, review] of this.reviews.entries()) {
        serializedReviews[id] = review.toJSON();
      }
      localStorage.setItem('tedsai_reviews', JSON.stringify(serializedReviews));
    } catch (e) {
      console.error('Impossible de sauvegarder les avis dans le stockage local:', e);
    }
  }

  /**
   * Met en place la surveillance des interactions
   */
  setupReviewMonitoring() {
    // Observer les formulaires d'avis
    document.addEventListener('submit', (event) => {
      if (event.target.classList.contains('review-form')) {
        event.preventDefault();
        this.handleSubmitReview(event.target);
      }
    });
  }

  /**
   * Génère un ID unique pour un avis
   */
  generateReviewId() {
    return 'review_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Soumet un avis
   */
  async submitReview(reviewData) {
    // Valider les données d'entrée
    const validation = this.validateReviewData(reviewData);
    if (!validation.isValid) {
      throw new Error(`Données d'avis invalides: ${validation.errors.join(', ')}`);
    }
    
    // Vérifier si l'utilisateur est authentifié
    if (!window.TedAPI || !window.TedAPI.isAuthenticated()) {
      throw new Error('Vous devez être connecté pour soumettre un avis');
    }
    
    // Créer un nouvel avis
    const currentUser = window.TedAPI.getCurrentUser();
    const review = new Review({
      id: this.generateReviewId(),
      userId: currentUser.id,
      userName: currentUser.fullName,
      ...reviewData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending' // En attente de modération
    });
    
    // Ajouter l'avis à la collection
    this.reviews.set(review.id, review);
    
    // Sauvegarder les avis
    this.saveReviews();
    
    // Calculer les statistiques mises à jour
    this.updateRatingStats(review.itemId, review.itemType);
    
    // Émettre un événement
    this.dispatchReviewEvent('reviewSubmitted', review);
    
    return review;
  }

  /**
   * Valide les données d'un avis
   */
  validateReviewData(reviewData) {
    const errors = [];
    
    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > this.maxRating) {
      errors.push(`La note doit être comprise entre 1 et ${this.maxRating}`);
    }
    
    if (!reviewData.itemId) {
      errors.push('ID de l\'élément requis');
    }
    
    if (!reviewData.itemType || !this.categories.has(reviewData.itemType)) {
      errors.push(`Type d'élément invalide: ${reviewData.itemType}. Types valides: ${Array.from(this.categories).join(', ')}`);
    }
    
    if (reviewData.comment) {
      if (reviewData.comment.length < this.minReviewLength) {
        errors.push(`Le commentaire doit contenir au moins ${this.minReviewLength} caractères`);
      }
      if (reviewData.comment.length > this.maxReviewLength) {
        errors.push(`Le commentaire ne doit pas dépasser ${this.maxReviewLength} caractères`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Modère un avis (approuve ou rejette)
   */
  moderateReview(reviewId, status, moderatorNote = '') {
    const review = this.reviews.get(reviewId);
    if (!review) {
      throw new Error('Avis non trouvé');
    }
    
    // Vérifier les droits de modération
    if (!window.TedAPI || !window.TedAPI.hasRole('moderator')) {
      throw new Error('Permissions insuffisantes pour modérer cet avis');
    }
    
    review.status = status;
    review.moderatedAt = new Date().toISOString();
    review.moderatorNote = moderatorNote;
    review.updatedAt = new Date().toISOString();
    
    this.saveReviews();
    this.dispatchReviewEvent('reviewModerated', { review, status });
    
    // Mettre à jour les statistiques si l'avis est approuvé
    if (status === 'approved') {
      this.updateRatingStats(review.itemId, review.itemType);
    }
    
    return review;
  }

  /**
   * Met à jour les statistiques de notation pour un élément
   */
  updateRatingStats(itemId, itemType) {
    const itemReviews = this.getReviewsByItem(itemId, itemType);
    const approvedReviews = itemReviews.filter(r => r.status === 'approved');
    
    if (approvedReviews.length === 0) {
      this.ratings.delete(`${itemType}:${itemId}`);
      return;
    }
    
    const totalRating = approvedReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / approvedReviews.length;
    
    const ratingStats = {
      itemId: itemId,
      itemType: itemType,
      averageRating: Math.round(averageRating * 100) / 100, // Arrondir à 2 décimales
      totalReviews: approvedReviews.length,
      distribution: this.calculateRatingDistribution(approvedReviews),
      lastUpdated: new Date().toISOString()
    };
    
    this.ratings.set(`${itemType}:${itemId}`, ratingStats);
  }

  /**
   * Calcule la distribution des notes
   */
  calculateRatingDistribution(reviews) {
    const distribution = {};
    for (let i = 1; i <= this.maxRating; i++) {
      distribution[i] = reviews.filter(r => r.rating === i).length;
    }
    return distribution;
  }

  /**
   * Obtient les statistiques de notation pour un élément
   */
  getRatingStats(itemId, itemType) {
    return this.ratings.get(`${itemType}:${itemId}`) || null;
  }

  /**
   * Obtient les avis pour un élément spécifique
   */
  getReviewsByItem(itemId, itemType, options = {}) {
    const { status = 'approved', sortBy = 'createdAt', sortOrder = 'desc', limit = null } = options;
    
    let itemReviews = Array.from(this.reviews.values())
      .filter(review => review.itemId === itemId && review.itemType === itemType);
    
    // Filtrer par statut si spécifié
    if (status) {
      itemReviews = itemReviews.filter(review => review.status === status);
    }
    
    // Trier les résultats
    itemReviews.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    // Limiter les résultats si spécifié
    if (limit) {
      itemReviews = itemReviews.slice(0, limit);
    }
    
    return itemReviews;
  }

  /**
   * Obtient les avis d'un utilisateur
   */
  getReviewsByUser(userId) {
    return Array.from(this.reviews.values())
      .filter(review => review.userId === userId);
  }

  /**
   * Obtient tous les avis (avec options de filtrage)
   */
  getAllReviews(options = {}) {
    const { status = null, itemType = null, sortBy = 'createdAt', sortOrder = 'desc', limit = null } = options;
    
    let allReviews = Array.from(this.reviews.values());
    
    // Filtrer par statut
    if (status) {
      allReviews = allReviews.filter(review => review.status === status);
    }
    
    // Filtrer par type d'élément
    if (itemType) {
      allReviews = allReviews.filter(review => review.itemType === itemType);
    }
    
    // Trier les résultats
    allReviews.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    // Limiter les résultats
    if (limit) {
      allReviews = allReviews.slice(0, limit);
    }
    
    return allReviews;
  }

  /**
   * Met à jour un avis (seulement par l'auteur ou un modérateur)
   */
  async updateReview(reviewId, updateData) {
    const review = this.reviews.get(reviewId);
    if (!review) {
      throw new Error('Avis non trouvé');
    }
    
    // Vérifier les permissions
    const currentUser = window.TedAPI?.getCurrentUser();
    const isOwner = currentUser && currentUser.id === review.userId;
    const isModerator = currentUser && window.TedAPI.hasRole('moderator');
    
    if (!isOwner && !isModerator) {
      throw new Error('Permissions insuffisantes pour modifier cet avis');
    }
    
    // Ne pas permettre la mise à jour de certains champs
    const protectedFields = ['id', 'userId', 'userName', 'itemId', 'itemType', 'createdAt'];
    for (const field of protectedFields) {
      if (updateData.hasOwnProperty(field)) {
        delete updateData[field];
      }
    }
    
    // Mettre à jour les propriétés de l'avis
    Object.assign(review, updateData);
    review.updatedAt = new Date().toISOString();
    
    // Si l'avis est modifié par l'auteur, le remettre en attente de modération
    if (isOwner && !isModerator) {
      review.status = 'pending';
    }
    
    this.saveReviews();
    
    // Recalculer les statistiques
    this.updateRatingStats(review.itemId, review.itemType);
    
    this.dispatchReviewEvent('reviewUpdated', review);
    
    return review;
  }

  /**
   * Supprime un avis (seulement par l'auteur ou un modérateur)
   */
  async deleteReview(reviewId) {
    const review = this.reviews.get(reviewId);
    if (!review) {
      throw new Error('Avis non trouvé');
    }
    
    // Vérifier les permissions
    const currentUser = window.TedAPI?.getCurrentUser();
    const isOwner = currentUser && currentUser.id === review.userId;
    const isModerator = currentUser && window.TedAPI.hasRole('moderator');
    
    if (!isOwner && !isModerator) {
      throw new Error('Permissions insuffisantes pour supprimer cet avis');
    }
    
    // Supprimer l'avis
    this.reviews.delete(reviewId);
    this.saveReviews();
    
    // Recalculer les statistiques
    this.updateRatingStats(review.itemId, review.itemType);
    
    this.dispatchReviewEvent('reviewDeleted', review);
    
    return true;
  }

  /**
   * Calcule la note moyenne pour un élément
   */
  getAverageRating(itemId, itemType) {
    const stats = this.getRatingStats(itemId, itemType);
    return stats ? stats.averageRating : 0;
  }

  /**
   * Obtient le nombre total d'avis pour un élément
   */
  getTotalReviews(itemId, itemType) {
    const stats = this.getRatingStats(itemId, itemType);
    return stats ? stats.totalReviews : 0;
  }

  /**
   * Vérifie si un utilisateur a déjà noté un élément
   */
  hasUserReviewed(userId, itemId, itemType) {
    const userReviews = this.getReviewsByUser(userId);
    return userReviews.some(review => 
      review.itemId === itemId && 
      review.itemType === itemType && 
      review.status === 'approved'
    );
  }

  /**
   * Génère un élément d'interface pour afficher une note
   */
  renderRating(rating, options = {}) {
    const { size = 'medium', showValue = true, interactive = false } = options;
    
    const starSize = {
      small: '16px',
      medium: '20px',
      large: '24px'
    }[size] || '20px';
    
    let starsHtml = '';
    for (let i = 1; i <= this.maxRating; i++) {
      const filled = i <= Math.floor(rating);
      const halfFilled = i - rating > 0 && i - rating < 1;
      
      starsHtml += `
        <span class="star ${filled ? 'filled' : ''} ${halfFilled ? 'half-filled' : ''}" 
              style="font-size: ${starSize}; cursor: ${interactive ? 'pointer' : 'default'};"
              data-rating="${i}">
          ${filled ? '★' : halfFilled ? '☆' : '☆'}
        </span>
      `;
    }
    
    if (showValue) {
      starsHtml += `<span class="rating-value">${rating.toFixed(1)}/5</span>`;
    }
    
    return starsHtml;
  }

  /**
   * Génère un formulaire d'avis
   */
  renderReviewForm(itemId, itemType, options = {}) {
    const { title = 'Donnez votre avis', submitLabel = 'Soumettre', showAnonymousOption = false } = options;
    
    return `
      <div class="review-form-container">
        <h3>${title}</h3>
        <form class="review-form" data-item-id="${itemId}" data-item-type="${itemType}">
          <div class="rating-selector">
            <label>Note: *</label>
            <div class="stars" id="rating-stars">
              ${this.renderRating(0, { interactive: true })}
            </div>
            <input type="hidden" name="rating" id="rating-input" required>
          </div>
          
          <div class="review-comment">
            <label for="review-comment">Votre commentaire: *</label>
            <textarea 
              id="review-comment" 
              name="comment" 
              placeholder="Partagez votre expérience..." 
              maxlength="${this.maxReviewLength}" 
              required
            ></textarea>
            <div class="char-counter">${this.minReviewLength} caractères minimum</div>
          </div>
          
          ${showAnonymousOption ? `
          <div class="anonymous-option">
            <label>
              <input type="checkbox" name="anonymous"> Publier anonymement
            </label>
          </div>
          ` : ''}
          
          <button type="submit">${submitLabel}</button>
        </form>
      </div>
    `;
  }

  /**
   * Génère une interface d'affichage pour les avis
   */
  renderReviewsList(itemId, itemType, options = {}) {
    const { limit = 10, showPagination = true } = options;
    const reviews = this.getReviewsByItem(itemId, itemType, { limit });
    
    let reviewsHtml = '<div class="reviews-list">';
    
    if (reviews.length === 0) {
      reviewsHtml += '<p>Aucun avis pour le moment.</p>';
    } else {
      reviews.forEach(review => {
        reviewsHtml += `
          <div class="review-item" data-review-id="${review.id}">
            <div class="review-header">
              <div class="reviewer-info">
                <strong>${review.anonymous ? 'Utilisateur anonyme' : review.userName}</strong>
                <div class="review-date">${new Date(review.createdAt).toLocaleDateString()}</div>
              </div>
              <div class="review-rating">
                ${this.renderRating(review.rating, { showValue: false })}
              </div>
            </div>
            <div class="review-body">
              <p>${review.comment}</p>
            </div>
          </div>
        `;
      });
    }
    
    reviewsHtml += '</div>';
    
    return reviewsHtml;
  }

  /**
   * Gère la soumission d'un formulaire d'avis
   */
  async handleSubmitReview(form) {
    try {
      // Récupérer les données du formulaire
      const formData = new FormData(form);
      const itemId = form.dataset.itemId;
      const itemType = form.dataset.itemType;
      const rating = parseInt(formData.get('rating'));
      const comment = formData.get('comment');
      const anonymous = formData.get('anonymous') === 'on';
      
      // Valider les données
      if (!rating || rating < 1 || rating > 5) {
        throw new Error('Veuillez sélectionner une note entre 1 et 5');
      }
      
      if (!comment || comment.length < this.minReviewLength) {
        throw new Error(`Le commentaire doit contenir au moins ${this.minReviewLength} caractères`);
      }
      
      // Soumettre l'avis
      const reviewData = {
        itemId,
        itemType,
        rating,
        comment,
        anonymous
      };
      
      const review = await this.submitReview(reviewData);
      
      // Réinitialiser le formulaire
      form.reset();
      
      // Mettre à jour l'interface
      this.updateReviewInterface(itemId, itemType);
      
      // Afficher un message de succès
      this.showMessage('Merci pour votre avis ! Il est en attente de modération.', 'success');
      
    } catch (error) {
      this.showMessage(error.message, 'error');
    }
  }

  /**
   * Met à jour l'interface des avis
   */
  updateReviewInterface(itemId, itemType) {
    // Mettre à jour les statistiques d'évaluation
    const stats = this.getRatingStats(itemId, itemType);
    if (stats) {
      const avgRatingElement = document.querySelector(`[data-rating-avg="${itemId}"]`);
      if (avgRatingElement) {
        avgRatingElement.innerHTML = this.renderRating(stats.averageRating);
      }
      
      const totalReviewsElement = document.querySelector(`[data-total-reviews="${itemId}"]`);
      if (totalReviewsElement) {
        totalReviewsElement.textContent = `${stats.totalReviews} avis`;
      }
    }
    
    // Mettre à jour la liste des avis
    const reviewsListElement = document.querySelector(`[data-reviews-list="${itemId}"]`);
    if (reviewsListElement) {
      reviewsListElement.innerHTML = this.renderReviewsList(itemId, itemType);
    }
  }

  /**
   * Affiche un message
   */
  showMessage(message, type = 'info') {
    // Créer un élément de message
    const messageElement = document.createElement('div');
    messageElement.className = `review-message review-message-${type}`;
    messageElement.textContent = message;
    
    // Ajouter un peu de style
    messageElement.style.cssText = `
      padding: 10px 15px;
      margin: 10px 0;
      border-radius: 4px;
      ${type === 'success' ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' :
        type === 'error' ? 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;' :
        'background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb;'}
    `;
    
    // Ajouter le message au début du corps
    document.body.insertBefore(messageElement, document.body.firstChild);
    
    // Supprimer le message après quelques secondes
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.remove();
      }
    }, 5000);
  }

  /**
   * Émet un événement d'avis
   */
  dispatchReviewEvent(eventName, data) {
    const event = new CustomEvent(`tedsaiReview_${eventName}`, { detail: data });
    document.dispatchEvent(event);
  }

  /**
   * Exporte les données d'avis
   */
  exportReviewData() {
    const reviewsData = Array.from(this.reviews.values()).map(review => review.toJSON());
    const ratingsData = Array.from(this.ratings.values());
    
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      reviews: reviewsData,
      ratings: ratingsData
    };
  }

  /**
   * Importe des données d'avis
   */
  importReviewData(data) {
    if (!data || !Array.isArray(data.reviews)) {
      throw new Error('Format de données invalide pour l\'importation');
    }
    
    // Effacer les données existantes
    this.reviews.clear();
    this.ratings.clear();
    
    // Importer les avis
    for (const reviewData of data.reviews) {
      this.reviews.set(reviewData.id, new Review(reviewData));
    }
    
    // Recalculer toutes les statistiques
    for (const review of this.reviews.values()) {
      this.updateRatingStats(review.itemId, review.itemType);
    }
    
    // Sauvegarder
    this.saveReviews();
    
    return {
      success: true,
      importedReviews: data.reviews.length,
      message: `${data.reviews.length} avis importés avec succès`
    };
  }
}

/**
 * Classe représentant un avis
 */
class Review {
  constructor(data = {}) {
    this.id = data.id || null;
    this.userId = data.userId || null;
    this.userName = data.userName || '';
    this.itemId = data.itemId || '';
    this.itemType = data.itemType || 'service';
    this.rating = data.rating || 0;
    this.comment = data.comment || '';
    this.anonymous = data.anonymous || false;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.status = data.status || 'pending'; // pending, approved, rejected
    this.moderatedAt = data.moderatedAt || null;
    this.moderatorNote = data.moderatorNote || '';
  }

  /**
   * Convertit l'avis en objet JSON
   */
  toJSON() {
    return { ...this };
  }
}

// Initialiser le système de notation
const ratingSystem = new RatingSystem();

// Fonctions utilitaires pour l'extérieur
async function submitReview(reviewData) {
  return ratingSystem.submitReview(reviewData);
}

function getRatingStats(itemId, itemType) {
  return ratingSystem.getRatingStats(itemId, itemType);
}

function getAverageRating(itemId, itemType) {
  return ratingSystem.getAverageRating(itemId, itemType);
}

function getTotalReviews(itemId, itemType) {
  return ratingSystem.getTotalReviews(itemId, itemType);
}

function getReviewsByItem(itemId, itemType, options) {
  return ratingSystem.getReviewsByItem(itemId, itemType, options);
}

function hasUserReviewed(userId, itemId, itemType) {
  return ratingSystem.hasUserReviewed(userId, itemId, itemType);
}

function renderRating(rating, options) {
  return ratingSystem.renderRating(rating, options);
}

function renderReviewForm(itemId, itemType, options) {
  return ratingSystem.renderReviewForm(itemId, itemType, options);
}

function renderReviewsList(itemId, itemType, options) {
  return ratingSystem.renderReviewsList(itemId, itemType, options);
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    RatingSystem, 
    Review, 
    ratingSystem, 
    submitReview,
    getRatingStats,
    getAverageRating,
    getTotalReviews,
    getReviewsByItem,
    hasUserReviewed,
    renderRating,
    renderReviewForm,
    renderReviewsList
  };
} else {
  window.TedAPI = window.TedAPI || {};
  window.TedAPI.RatingSystem = ratingSystem;
  window.TedAPI.Review = Review;
  window.TedAPI.submitReview = submitReview;
  window.TedAPI.getRatingStats = getRatingStats;
  window.TedAPI.getAverageRating = getAverageRating;
  window.TedAPI.getTotalReviews = getTotalReviews;
  window.TedAPI.getReviewsByItem = getReviewsByItem;
  window.TedAPI.hasUserReviewed = hasUserReviewed;
  window.TedAPI.renderRating = renderRating;
  window.TedAPI.renderReviewForm = renderReviewForm;
  window.TedAPI.renderReviewsList = renderReviewsList;
}