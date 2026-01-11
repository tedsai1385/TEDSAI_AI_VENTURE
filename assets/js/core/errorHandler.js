/**
 * Système de gestion des erreurs centralisé pour TEDSAI
 */

class ErrorHandler {
  constructor() {
    this.listeners = [];
    this.setupGlobalErrorHandler();
  }

  /**
   * Gestionnaire d'erreur global pour capturer toutes les erreurs non gérées
   */
  setupGlobalErrorHandler() {
    // Gestion des erreurs JavaScript non gérées
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'javascript_error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString()
      });
    });

    // Gestion des promesses non gérées
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'promise_rejection',
        message: event.reason?.message || event.reason,
        stack: event.reason?.stack,
        timestamp: new Date().toISOString()
      });
    });
  }

  /**
   * Méthode principale pour gérer les erreurs
   */
  handleError(error) {
    // Formatage de l'erreur
    const formattedError = this.formatError(error);

    // Journalisation de l'erreur
    this.logError(formattedError);

    // Affichage d'un message convivial à l'utilisateur si nécessaire
    this.showUserFriendlyMessage(formattedError);

    // Notification aux écouteurs
    this.notifyListeners(formattedError);

    // Envoi à un service de suivi des erreurs (optionnel)
    this.sendToErrorTracking(formattedError);
  }

  /**
   * Formatage de l'erreur pour un traitement uniforme
   */
  formatError(error) {
    return {
      id: this.generateErrorId(),
      type: error.type || 'generic_error',
      message: error.message || 'Une erreur inconnue s\'est produite',
      details: error.details || {},
      severity: error.severity || 'medium', // low, medium, high, critical
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: error.timestamp || new Date().toISOString(),
      stack: error.stack || new Error().stack
    };
  }

  /**
   * Génération d'un ID unique pour chaque erreur
   */
  generateErrorId() {
    return 'error_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Journalisation de l'erreur dans la console et dans un système de stockage
   */
  logError(error) {
    // Journalisation dans la console avec différentes couleurs selon la gravité
    switch (error.severity) {
      case 'critical':
      case 'high':
        console.error(`[CRITICAL ERROR] ${error.id}: ${error.message}`, error);
        break;
      case 'medium':
        console.warn(`[ERROR] ${error.id}: ${error.message}`, error);
        break;
      case 'low':
      default:
        console.info(`[INFO] ${error.id}: ${error.message}`, error);
        break;
    }

    // Sauvegarde dans LocalStorage pour un suivi ultérieur
    try {
      const logs = JSON.parse(localStorage.getItem('tedsai_error_logs') || '[]');
      logs.unshift(error);
      
      // Limiter à 100 dernières erreurs pour éviter de surcharger le stockage
      if (logs.length > 100) {
        logs.splice(100);
      }
      
      localStorage.setItem('tedsai_error_logs', JSON.stringify(logs));
    } catch (e) {
      console.error('Impossible de sauvegarder l\'erreur dans le stockage local:', e);
    }
  }

  /**
   * Affichage d'un message convivial à l'utilisateur
   */
  showUserFriendlyMessage(error) {
    // Ne pas afficher d'erreurs critiques pendant le développement
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    // Afficher un message d'erreur convivial selon le type d'erreur
    let userMessage = '';
    
    switch (error.type) {
      case 'network_error':
        userMessage = 'Un problème de connexion est survenu. Veuillez vérifier votre connexion internet.';
        break;
      case 'database_error':
        userMessage = 'Un problème avec nos services est survenu. Nos équipes sont informées.';
        break;
      case 'permission_error':
        userMessage = 'Vous n\'avez pas les autorisations nécessaires pour effectuer cette action.';
        break;
      default:
        userMessage = 'Une erreur inattendue s\'est produite. Nos équipes sont informées.';
        break;
    }

    // Affichage d'une notification discrète
    this.createNotification(userMessage, error.severity);
  }

  /**
   * Création d'une notification utilisateur
   */
  createNotification(message, severity = 'medium') {
    // Vérifier si les notifications sont supportées
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('TEDSAI - Erreur', {
          body: message,
          icon: '/assets/images/logos/tedsai_logo.jpg'
        });
      }
    }

    // Sinon, afficher une notification dans la page
    this.createInlineNotification(message, severity);
  }

  /**
   * Création d'une notification dans la page
   */
  createInlineNotification(message, severity) {
    // Supprimer les notifications précédentes
    const existingNotifications = document.querySelectorAll('.tedsai-error-notification');
    existingNotifications.forEach(notification => notification.remove());

    // Créer un élément de notification
    const notification = document.createElement('div');
    notification.className = `tedsai-error-notification tedsai-error-${severity}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    // Styles pour la notification
    const style = document.createElement('style');
    if (!document.querySelector('#tedsai-error-notifications-style')) {
      style.id = 'tedsai-error-notifications-style';
      style.textContent = `
        .tedsai-error-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          max-width: 400px;
          padding: 15px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          animation: slideInRight 0.3s ease-out;
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .tedsai-error-notification.tedsai-error-critical {
          background-color: #fee2e2;
          border-left: 4px solid #ef4444;
          color: #dc2626;
        }
        
        .tedsai-error-notification.tedsai-error-high {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          color: #d97706;
        }
        
        .tedsai-error-notification.tedsai-error-medium {
          background-color: #dbeafe;
          border-left: 4px solid #3b82f6;
          color: #2563eb;
        }
        
        .tedsai-error-notification.tedsai-error-low {
          background-color: #ecfccb;
          border-left: 4px solid #84cc16;
          color: #65a30d;
        }
        
        .notification-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        
        .notification-message {
          flex-grow: 1;
          font-size: 14px;
          line-height: 1.4;
        }
        
        .notification-close {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: inherit;
          padding: 0;
          margin-left: 10px;
          line-height: 1;
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Supprimer automatiquement la notification après 5 secondes
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }

  /**
   * Envoi de l'erreur à un service de suivi (simulé)
   */
  sendToErrorTracking(error) {
    // Dans une implémentation réelle, cela enverrait l'erreur à un service comme Sentry, LogRocket, etc.
    // Pour l'instant, nous simulons cela en l'enregistrant dans la console
    console.groupCollapsed(`[ERROR TRACKING] Sending error to monitoring service: ${error.id}`);
    console.log('Error details:', error);
    console.groupEnd();
    
    // Si Firebase est disponible, on pourrait envoyer l'erreur à Firestore
    if (window.TedDB && window.TedDB.add) {
      try {
        window.TedDB.add('error_logs', error);
      } catch (e) {
        console.error('Erreur lors de l\'envoi à la base de données:', e);
      }
    }
  }

  /**
   * Ajout d'un écouteur d'erreurs
   */
  addListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * Notification aux écouteurs
   */
  notifyListeners(error) {
    this.listeners.forEach(listener => {
      try {
        listener(error);
      } catch (e) {
        console.error('Erreur dans un écouteur d\'erreurs:', e);
      }
    });
  }

  /**
   * Récupération des erreurs depuis le stockage local
   */
  getStoredErrors() {
    try {
      const logs = localStorage.getItem('tedsai_error_logs');
      return logs ? JSON.parse(logs) : [];
    } catch (e) {
      console.error('Erreur lors de la récupération des erreurs stockées:', e);
      return [];
    }
  }

  /**
   * Nettoyage des erreurs stockées
   */
  clearStoredErrors() {
    try {
      localStorage.removeItem('tedsai_error_logs');
    } catch (e) {
      console.error('Erreur lors du nettoyage des erreurs stockées:', e);
    }
  }
}

// Initialisation du gestionnaire d'erreurs global
const errorHandler = new ErrorHandler();

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { errorHandler, ErrorHandler };
} else {
  window.TedAPI = window.TedAPI || {};
  window.TedAPI.ErrorHandler = errorHandler;
}
