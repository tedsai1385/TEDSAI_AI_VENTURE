/**
 * Module d'intégration des réseaux sociaux pour TEDSAI
 * Ce module gère les fonctionnalités de partage et d'interaction sociale
 */

class SocialIntegration {
  constructor() {
    this.platforms = {
      facebook: {
        appId: null,
        enabled: false,
        shareUrl: 'https://www.facebook.com/sharer/sharer.php?u=',
        likeButton: true
      },
      twitter: {
        apiKey: null,
        enabled: false,
        shareUrl: 'https://twitter.com/intent/tweet?url=',
        tweetButton: true
      },
      linkedin: {
        enabled: false,
        shareUrl: 'https://www.linkedin.com/sharing/share-offsite/?url=',
        shareButton: true
      },
      instagram: {
        enabled: false,
        shareUrl: null,
        followButton: true
      }
    };
    
    this.shareTracking = true;
    this.analyticsEnabled = true;
    
    this.init();
  }

  /**
   * Initialise le module d'intégration sociale
   */
  init() {
    // Charger les configurations depuis le stockage local
    this.loadConfiguration();
    
    // Activer les boutons de partage si activés
    this.setupSocialButtons();
    
    // Activer le tracking des interactions sociales
    if (this.shareTracking) {
      this.setupShareTracking();
    }
  }

  /**
   * Charge la configuration depuis le stockage local
   */
  loadConfiguration() {
    try {
      const config = localStorage.getItem('tedsai_social_config');
      if (config) {
        const parsedConfig = JSON.parse(config);
        this.updateConfiguration(parsedConfig);
      }
    } catch (e) {
      console.warn('Impossible de charger la configuration sociale:', e);
    }
  }

  /**
   * Sauvegarde la configuration dans le stockage local
   */
  saveConfiguration() {
    try {
      localStorage.setItem('tedsai_social_config', JSON.stringify({
        platforms: this.platforms,
        shareTracking: this.shareTracking,
        analyticsEnabled: this.analyticsEnabled
      }));
    } catch (e) {
      console.error('Impossible de sauvegarder la configuration sociale:', e);
    }
  }

  /**
   * Met à jour la configuration
   */
  updateConfiguration(config) {
    if (config.platforms) {
      Object.assign(this.platforms, config.platforms);
    }
    if (config.shareTracking !== undefined) {
      this.shareTracking = config.shareTracking;
    }
    if (config.analyticsEnabled !== undefined) {
      this.analyticsEnabled = config.analyticsEnabled;
    }
  }

  /**
   * Configure une plateforme spécifique
   */
  configurePlatform(platform, config) {
    if (this.platforms[platform]) {
      Object.assign(this.platforms[platform], config);
      this.saveConfiguration();
    } else {
      throw new Error(`Plateforme non supportée: ${platform}`);
    }
  }

  /**
   * Active/désactive une plateforme
   */
  setPlatformEnabled(platform, enabled) {
    if (this.platforms[platform]) {
      this.platforms[platform].enabled = enabled;
      this.saveConfiguration();
    } else {
      throw new Error(`Plateforme non supportée: ${platform}`);
    }
  }

  /**
   * Met en place les boutons de partage sociaux
   */
  setupSocialButtons() {
    // Observer les conteneurs de boutons sociaux
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Élément HTML
              this.processSocialContainer(node);
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Traiter les conteneurs existants
    this.processExistingContainers();
  }

  /**
   * Traite les conteneurs sociaux existants
   */
  processExistingContainers() {
    const containers = document.querySelectorAll('.social-share-container, [data-social-share]');
    containers.forEach(container => this.processSocialContainer(container));
  }

  /**
   * Traite un conteneur de boutons sociaux
   */
  processSocialContainer(container) {
    if (container.dataset.socialProcessed) return;
    
    const url = container.dataset.url || window.location.href;
    const title = container.dataset.title || document.title;
    const description = container.dataset.description || this.getMetaDescription();
    const media = container.dataset.media || this.getPageImage();
    
    // Créer les boutons de partage pour les plateformes activées
    const buttonsHtml = this.generateSocialButtons(url, title, description, media);
    container.innerHTML = buttonsHtml;
    container.dataset.socialProcessed = 'true';
  }

  /**
   * Génère les boutons de partage sociaux
   */
  generateSocialButtons(url, title, description, media) {
    let buttonsHtml = '<div class="social-buttons-wrapper">';
    
    for (const [platform, config] of Object.entries(this.platforms)) {
      if (config.enabled) {
        buttonsHtml += this.generateSocialButton(platform, url, title, description, media);
      }
    }
    
    buttonsHtml += '</div>';
    return buttonsHtml;
  }

  /**
   * Génère un bouton de partage pour une plateforme spécifique
   */
  generateSocialButton(platform, url, title, description, media) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);
    
    let shareUrl = '';
    let buttonClass = `social-button social-button-${platform}`;
    let buttonText = platform.charAt(0).toUpperCase() + platform.slice(1);
    let iconClass = `social-icon social-icon-${platform}`;
    
    switch (platform) {
      case 'facebook':
        shareUrl = `${this.platforms[platform].shareUrl}${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `${this.platforms[platform].shareUrl}${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'linkedin':
        shareUrl = `${this.platforms[platform].shareUrl}${encodedUrl}`;
        break;
      case 'instagram':
        // Instagram n'a pas de bouton de partage direct
        return '';
      default:
        return '';
    }
    
    return `
      <a href="${shareUrl}" 
         class="${buttonClass}" 
         target="_blank" 
         rel="noopener noreferrer"
         onclick="event.preventDefault(); TedAPI.SocialIntegration.openShareWindow('${shareUrl}', '${platform}');"
         title="Partager sur ${buttonText}">
        <span class="${iconClass}"></span>
        <span class="social-button-text">${buttonText}</span>
      </a>
    `;
  }

  /**
   * Ouvre une fenêtre de partage
   */
  openShareWindow(url, platform) {
    // Enregistrer l'événement de partage
    this.trackShareEvent(platform);
    
    // Ouvrir la fenêtre de partage
    const width = 600;
    const height = 400;
    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);
    
    const shareWindow = window.open(
      url,
      `share_${platform}`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
    
    if (shareWindow) {
      shareWindow.focus();
    }
  }

  /**
   * Obtient la description de la page
   */
  getMetaDescription() {
    const metaDesc = document.querySelector('meta[name="description"]');
    return metaDesc ? metaDesc.getAttribute('content') : '';
  }

  /**
   * Obtient l'image de la page
   */
  getPageImage() {
    // Chercher d'abord l'image Open Graph
    let image = document.querySelector('meta[property="og:image"]');
    if (image) return image.getAttribute('content');
    
    // Sinon, chercher une image dans le contenu
    const firstImg = document.querySelector('img');
    if (firstImg) return firstImg.src;
    
    return '';
  }

  /**
   * Met en place le tracking des partages
   */
  setupShareTracking() {
    // Observer les clics sur les boutons de partage
    document.addEventListener('click', (event) => {
      if (event.target.closest('.social-button')) {
        const button = event.target.closest('.social-button');
        const platform = button.className.match(/social-button-(\w+)/)?.[1];
        if (platform) {
          this.trackShareEvent(platform);
        }
      }
    });
  }

  /**
   * Enregistre un événement de partage
   */
  trackShareEvent(platform) {
    if (!this.analyticsEnabled) return;
    
    const eventData = {
      platform: platform,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    // Sauvegarder dans le stockage local
    this.saveShareEvent(eventData);
    
    // Émettre un événement personnalisé
    this.dispatchSocialEvent('shareTracked', eventData);
    
    // Si possible, envoyer au serveur
    this.sendShareEventToServer(eventData);
  }

  /**
   * Sauvegarde un événement de partage
   */
  saveShareEvent(eventData) {
    try {
      const events = JSON.parse(localStorage.getItem('tedsai_share_events') || '[]');
      events.push(eventData);
      
      // Garder seulement les 100 derniers événements
      if (events.length > 100) {
        events.shift();
      }
      
      localStorage.setItem('tedsai_share_events', JSON.stringify(events));
    } catch (e) {
      console.error('Erreur lors de la sauvegarde de l\'événement de partage:', e);
    }
  }

  /**
   * Envoie un événement de partage au serveur
   */
  async sendShareEventToServer(eventData) {
    try {
      // Vérifier si l'API est disponible
      if (window.TedAPI && window.TedAPI.RestAPI) {
        await window.TedAPI.RestAPI.post('/analytics/social-share', eventData);
      }
    } catch (e) {
      console.error('Erreur lors de l\'envoi de l\'événement de partage au serveur:', e);
    }
  }

  /**
   * Obtient les statistiques de partage
   */
  getShareStats() {
    try {
      const events = JSON.parse(localStorage.getItem('tedsai_share_events') || '[]');
      const stats = {
        totalShares: events.length,
        byPlatform: {},
        byPage: {},
        lastUpdated: new Date().toISOString()
      };
      
      events.forEach(event => {
        // Compter par plateforme
        stats.byPlatform[event.platform] = (stats.byPlatform[event.platform] || 0) + 1;
        
        // Compter par page
        stats.byPage[event.url] = (stats.byPage[event.url] || 0) + 1;
      });
      
      return stats;
    } catch (e) {
      console.error('Erreur lors de la récupération des statistiques de partage:', e);
      return {
        totalShares: 0,
        byPlatform: {},
        byPage: {},
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Génère un widget de compteur de partage
   */
  renderShareCounter(itemId, options = {}) {
    const { 
      showTotal = true, 
      showPerPlatform = true, 
      layout = 'horizontal' 
    } = options;
    
    const stats = this.getShareStats();
    const itemShares = stats.byPage[itemId] || 0;
    
    let counterHtml = `<div class="social-share-counter social-layout-${layout}" data-item-id="${itemId}">`;
    
    if (showTotal) {
      counterHtml += `
        <div class="share-total">
          <span class="share-count">${itemShares}</span>
          <span class="share-label">partages</span>
        </div>
      `;
    }
    
    if (showPerPlatform && showTotal) {
      counterHtml += '<div class="share-breakdown">';
      for (const [platform, count] of Object.entries(stats.byPlatform)) {
        if (count > 0) {
          counterHtml += `
            <div class="platform-share platform-${platform}">
              <span class="platform-icon platform-icon-${platform}"></span>
              <span class="platform-count">${count}</span>
            </div>
          `;
        }
      }
      counterHtml += '</div>';
    }
    
    counterHtml += '</div>';
    
    return counterHtml;
  }

  /**
   * Génère un widget de flux social
   */
  renderSocialFeed(options = {}) {
    const { 
      platform = null, 
      limit = 10, 
      showFilters = true 
    } = options;
    
    const stats = this.getShareStats();
    const events = JSON.parse(localStorage.getItem('tedsai_share_events') || '[]');
    
    // Filtrer les événements
    let filteredEvents = events;
    if (platform) {
      filteredEvents = filteredEvents.filter(event => event.platform === platform);
    }
    
    // Limiter les résultats
    filteredEvents = filteredEvents.slice(0, limit);
    
    let feedHtml = '<div class="social-feed-container">';
    
    if (showFilters) {
      feedHtml += this.renderFilterControls();
    }
    
    feedHtml += '<div class="social-feed">';
    
    if (filteredEvents.length === 0) {
      feedHtml += '<div class="no-social-events">Aucune activité sociale récente</div>';
    } else {
      filteredEvents.forEach(event => {
        feedHtml += this.renderSocialEvent(event);
      });
    }
    
    feedHtml += '</div></div>';
    
    return feedHtml;
  }

  /**
   * Rend les contrôles de filtre
   */
  renderFilterControls() {
    return `
      <div class="social-filters">
        <button class="filter-btn active" data-platform="all">Tous</button>
        ${Object.keys(this.platforms).map(platform => 
          `<button class="filter-btn" data-platform="${platform}">
            ${platform.charAt(0).toUpperCase() + platform.slice(1)}
          </button>`
        ).join('')}
      </div>
    `;
  }

  /**
   * Rend un événement social
   */
  renderSocialEvent(event) {
    const date = new Date(event.timestamp);
    const timeAgo = this.getTimeAgo(date);
    
    return `
      <div class="social-event" data-platform="${event.platform}">
        <div class="event-icon">
          <span class="platform-icon platform-icon-${event.platform}"></span>
        </div>
        <div class="event-content">
          <div class="event-header">
            <span class="platform-name">${event.platform}</span>
            <span class="event-time">${timeAgo}</span>
          </div>
          <div class="event-url">
            <a href="${event.url}" target="_blank" rel="noopener noreferrer">
              ${this.truncateUrl(event.url, 50)}
            </a>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Calcule le temps écoulé
   */
  getTimeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'il y a quelques secondes';
    if (seconds < 3600) return `il y a ${Math.floor(seconds / 60)} minutes`;
    if (seconds < 86400) return `il y a ${Math.floor(seconds / 3600)} heures`;
    
    return `il y a ${Math.floor(seconds / 86400)} jours`;
  }

  /**
   * Tronque une URL
   */
  truncateUrl(url, maxLength) {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength - 3) + '...';
  }

  /**
   * Émet un événement social
   */
  dispatchSocialEvent(eventName, data) {
    const event = new CustomEvent(`tedsaiSocial_${eventName}`, { detail: data });
    document.dispatchEvent(event);
  }

  /**
   * Initialise les widgets sociaux présents dans la page
   */
  initializeSocialWidgets() {
    // Initialiser les compteurs de partage
    const shareCounters = document.querySelectorAll('[data-social-counter]');
    shareCounters.forEach(counter => {
      const itemId = counter.dataset.itemId || window.location.href;
      const options = {
        showTotal: counter.dataset.showTotal !== 'false',
        showPerPlatform: counter.dataset.showPerPlatform !== 'false',
        layout: counter.dataset.layout || 'horizontal'
      };
      
      counter.innerHTML = this.renderShareCounter(itemId, options);
    });
    
    // Initialiser les flux sociaux
    const socialFeeds = document.querySelectorAll('[data-social-feed]');
    socialFeeds.forEach(feed => {
      const options = {
        platform: feed.dataset.platform || null,
        limit: parseInt(feed.dataset.limit) || 10,
        showFilters: feed.dataset.showFilters !== 'false'
      };
      
      feed.innerHTML = this.renderSocialFeed(options);
    });
  }

  /**
   * Ajoute un bouton de partage à une page
   */
  addShareButton(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Conteneur non trouvé: ${containerId}`);
    }
    
    const url = options.url || window.location.href;
    const title = options.title || document.title;
    const description = options.description || this.getMetaDescription();
    const media = options.media || this.getPageImage();
    
    const buttonsHtml = this.generateSocialButtons(url, title, description, media);
    container.innerHTML = buttonsHtml;
  }

  /**
   * Ajoute un widget de compteur de partage
   */
  addShareCounter(containerId, itemId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Conteneur non trouvé: ${containerId}`);
    }
    
    container.innerHTML = this.renderShareCounter(itemId, options);
  }

  /**
   * Exporte les données sociales
   */
  exportSocialData() {
    const shareEvents = JSON.parse(localStorage.getItem('tedsai_share_events') || '[]');
    const config = JSON.parse(localStorage.getItem('tedsai_social_config') || '{}');
    
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      configuration: config,
      shareEvents: shareEvents,
      statistics: this.getShareStats()
    };
  }

  /**
   * Importe des données sociales
   */
  importSocialData(data) {
    if (!data || !data.shareEvents) {
      throw new Error('Format de données invalide pour l\'importation');
    }
    
    try {
      // Sauvegarder les événements de partage
      localStorage.setItem('tedsai_share_events', JSON.stringify(data.shareEvents));
      
      // Sauvegarder la configuration si fournie
      if (data.configuration) {
        localStorage.setItem('tedsai_social_config', JSON.stringify(data.configuration));
        this.updateConfiguration(data.configuration);
      }
      
      // Réinitialiser les widgets
      this.initializeSocialWidgets();
      
      return {
        success: true,
        importedEvents: data.shareEvents.length,
        message: `${data.shareEvents.length} événements de partage importés`
      };
    } catch (e) {
      throw new Error(`Erreur lors de l'importation des données sociales: ${e.message}`);
    }
  }
}

// Initialiser le module d'intégration sociale
const socialIntegration = new SocialIntegration();

// Fonctions utilitaires pour l'extérieur
function configureSocialPlatform(platform, config) {
  return socialIntegration.configurePlatform(platform, config);
}

function setPlatformEnabled(platform, enabled) {
  return socialIntegration.setPlatformEnabled(platform, enabled);
}

function trackShareEvent(platform) {
  return socialIntegration.trackShareEvent(platform);
}

function getShareStats() {
  return socialIntegration.getShareStats();
}

function renderShareCounter(itemId, options) {
  return socialIntegration.renderShareCounter(itemId, options);
}

function renderSocialFeed(options) {
  return socialIntegration.renderSocialFeed(options);
}

function addShareButton(containerId, options) {
  return socialIntegration.addShareButton(containerId, options);
}

function addShareCounter(containerId, itemId, options) {
  return socialIntegration.addShareCounter(containerId, itemId, options);
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    SocialIntegration, 
    socialIntegration, 
    configureSocialPlatform,
    setPlatformEnabled,
    trackShareEvent,
    getShareStats,
    renderShareCounter,
    renderSocialFeed,
    addShareButton,
    addShareCounter
  };
} else {
  window.TedAPI = window.TedAPI || {};
  window.TedAPI.SocialIntegration = socialIntegration;
  window.TedAPI.configureSocialPlatform = configureSocialPlatform;
  window.TedAPI.setPlatformEnabled = setPlatformEnabled;
  window.TedAPI.trackShareEvent = trackShareEvent;
  window.TedAPI.getShareStats = getShareStats;
  window.TedAPI.renderShareCounter = renderShareCounter;
  window.TedAPI.renderSocialFeed = renderSocialFeed;
  window.TedAPI.addShareButton = addShareButton;
  window.TedAPI.addShareCounter = addShareCounter;
}

// Initialiser les widgets sociaux quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
  socialIntegration.initializeSocialWidgets();
});