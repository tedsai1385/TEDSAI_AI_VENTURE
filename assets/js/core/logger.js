/**
 * Système de journalisation pour TEDSAI
 * Ce module gère la journalisation complète des activités
 */

class Logger {
  constructor(options = {}) {
    this.level = options.level || 'info'; // debug, info, warn, error
    this.maxSize = options.maxSize || 1000; // Nombre maximum d'entrées à conserver
    this.logToConsole = options.logToConsole !== false; // Activer par défaut
    this.logToFile = options.logToFile || false; // Désactivé par défaut
    this.logToServer = options.logToServer || false; // Désactivé par défaut
    this.logs = [];
    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    
    this.init();
  }

  /**
   * Initialise le système de journalisation
   */
  init() {
    // Charger les logs précédents du stockage local s'ils existent
    this.loadLogs();
    
    // Mettre en place un gestionnaire d'erreurs global
    this.setupGlobalErrorHandler();
    
    // Mettre en place un gestionnaire de non-responsivité
    this.setupUnresponsiveHandler();
  }

  /**
   * Charge les logs depuis le stockage local
   */
  loadLogs() {
    try {
      const savedLogs = localStorage.getItem('tedsai_logs');
      if (savedLogs) {
        this.logs = JSON.parse(savedLogs);
      }
    } catch (e) {
      console.warn('Impossible de charger les logs depuis le stockage local:', e);
      this.logs = [];
    }
  }

  /**
   * Sauvegarde les logs dans le stockage local
   */
  saveLogs() {
    try {
      // Ne conserver que les logs récents pour éviter de surcharger le stockage
      const recentLogs = this.logs.slice(-this.maxSize);
      localStorage.setItem('tedsai_logs', JSON.stringify(recentLogs));
    } catch (e) {
      console.error('Impossible de sauvegarder les logs dans le stockage local:', e);
    }
  }

  /**
   * Vérifie si un niveau de log est activé
   */
  isLevelEnabled(level) {
    return this.levels[level] >= this.levels[this.level];
  }

  /**
   * Enregistre un message de log
   */
  log(level, message, metadata = {}) {
    if (!this.isLevelEnabled(level)) {
      return;
    }

    const logEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level: level,
      message: message,
      metadata: metadata,
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.getSessionId()
    };

    // Ajouter au tableau des logs
    this.logs.push(logEntry);

    // Limiter la taille du tableau
    if (this.logs.length > this.maxSize) {
      this.logs = this.logs.slice(-this.maxSize);
    }

    // Sauvegarder dans le stockage local
    this.saveLogs();

    // Afficher dans la console si activé
    if (this.logToConsole) {
      this.outputToConsole(logEntry);
    }

    // Envoyer au serveur si activé
    if (this.logToServer) {
      this.sendToServer(logEntry);
    }

    // Émettre un événement pour que d'autres modules puissent réagir
    this.dispatchLogEvent(logEntry);
  }

  /**
   * Génère un ID unique pour une entrée de log
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  /**
   * Obtient l'ID de session actuelle
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('tedsai_session_id');
    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('tedsai_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Affiche le log dans la console
   */
  outputToConsole(logEntry) {
    const { level, message, timestamp } = logEntry;
    const formattedMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    switch (level) {
      case 'debug':
        console.debug(formattedMessage, logEntry.metadata);
        break;
      case 'info':
        console.info(formattedMessage, logEntry.metadata);
        break;
      case 'warn':
        console.warn(formattedMessage, logEntry.metadata);
        break;
      case 'error':
        console.error(formattedMessage, logEntry.metadata);
        break;
      default:
        console.log(formattedMessage, logEntry.metadata);
    }
  }

  /**
   * Envoie le log à un serveur distant
   */
  async sendToServer(logEntry) {
    try {
      // Ici, vous implémenteriez l'appel à votre service de journalisation
      // Par exemple, une requête POST à un endpoint d'API
      // await fetch('/api/logs', { method: 'POST', body: JSON.stringify(logEntry) });
      console.log('Envoi du log au serveur:', logEntry);
    } catch (e) {
      console.error('Erreur lors de l\'envoi du log au serveur:', e);
    }
  }

  /**
   * Émet un événement de log personnalisé
   */
  dispatchLogEvent(logEntry) {
    const event = new CustomEvent('tedsaiLog', { detail: logEntry });
    document.dispatchEvent(event);
  }

  /**
   * Méthodes de niveau spécifique
   */
  debug(message, metadata = {}) {
    this.log('debug', message, metadata);
  }

  info(message, metadata = {}) {
    this.log('info', message, metadata);
  }

  warn(message, metadata = {}) {
    this.log('warn', message, metadata);
  }

  error(message, metadata = {}) {
    this.log('error', message, metadata);
  }

  /**
   * Configure le gestionnaire d'erreurs global
   */
  setupGlobalErrorHandler() {
    // Gestion des erreurs JavaScript non gérées
    window.addEventListener('error', (event) => {
      this.error('Erreur JavaScript non gérée', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        url: event.filename
      });
    });

    // Gestion des promesses non gérées
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Promesse non gérée', {
        reason: event.reason,
        promise: event.promise
      });
    });
  }

  /**
   * Configure le gestionnaire de non-réactivité
   */
  setupUnresponsiveHandler() {
    let lastInteraction = Date.now();
    
    // Mettre à jour le dernier moment d'interaction
    ['mousedown', 'keydown', 'scroll', 'touchstart', 'pointerdown'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        lastInteraction = Date.now();
      }, { passive: true });
    });
    
    // Vérifier périodiquement si la page est devenue non réactive
    setInterval(() => {
      const now = Date.now();
      if (now - lastInteraction > 5000) { // 5 secondes sans interaction
        this.warn('Page potentiellement non réactive', {
          timeSinceLastInteraction: now - lastInteraction,
          url: window.location.href
        });
      }
    }, 1000);
  }

  /**
   * Enregistre une interaction utilisateur
   */
  logInteraction(type, element, additionalData = {}) {
    this.info(`Interaction utilisateur: ${type}`, {
      elementType: element.tagName,
      elementId: element.id,
      elementClass: element.className,
      url: window.location.href,
      ...additionalData
    });
  }

  /**
   * Enregistre une navigation
   */
  logNavigation(from, to) {
    this.info('Navigation', {
      from: from,
      to: to,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Enregistre une performance
   */
  logPerformance(metric, value, additionalData = {}) {
    this.info(`Performance: ${metric}`, {
      value: value,
      url: window.location.href,
      ...additionalData
    });
  }

  /**
   * Enregistre une erreur d'API
   */
  logAPIError(url, method, error, additionalData = {}) {
    this.error(`Erreur API: ${method} ${url}`, {
      url: url,
      method: method,
      error: error,
      ...additionalData
    });
  }

  /**
   * Enregistre une erreur de validation
   */
  logValidationError(field, value, error, additionalData = {}) {
    this.warn(`Erreur de validation: ${field}`, {
      field: field,
      value: value,
      error: error,
      ...additionalData
    });
  }

  /**
   * Obtient les logs pour une période spécifique
   */
  getLogs(fromDate, toDate) {
    if (!fromDate && !toDate) {
      return [...this.logs];
    }

    return this.logs.filter(log => {
      const logDate = new Date(log.timestamp);
      const start = fromDate ? new Date(fromDate) : new Date(0);
      const end = toDate ? new Date(toDate) : new Date();

      return logDate >= start && logDate <= end;
    });
  }

  /**
   * Obtient les logs par niveau
   */
  getLogsByLevel(level) {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Obtient les erreurs récentes
   */
  getRecentErrors(hours = 24) {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - hours);
    
    return this.logs.filter(log => {
      return log.level === 'error' && new Date(log.timestamp) >= cutoff;
    });
  }

  /**
   * Efface les logs
   */
  clearLogs() {
    this.logs = [];
    this.saveLogs();
  }

  /**
   * Exporte les logs
   */
  exportLogs(format = 'json') {
    const logs = this.getLogs();
    
    if (format === 'json') {
      return JSON.stringify(logs, null, 2);
    } else if (format === 'csv') {
      // Convertir en format CSV
      const headers = ['timestamp', 'level', 'message', 'url'];
      const rows = logs.map(log => [
        log.timestamp,
        log.level,
        `"${log.message.replace(/"/g, '""')}"`,
        log.url
      ]);
      
      return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }
    
    return logs;
  }

  /**
   * Analyse les tendances des logs
   */
  analyzeTrends() {
    const trends = {
      totalLogs: this.logs.length,
      byLevel: {},
      byHour: {},
      byDay: {},
      errorRate: 0
    };

    // Compter par niveau
    this.logs.forEach(log => {
      trends.byLevel[log.level] = (trends.byLevel[log.level] || 0) + 1;
      
      // Compter par heure
      const hour = new Date(log.timestamp).getHours();
      trends.byHour[hour] = (trends.byHour[hour] || 0) + 1;
      
      // Compter par jour
      const day = new Date(log.timestamp).toDateString();
      trends.byDay[day] = (trends.byDay[day] || 0) + 1;
    });

    // Calculer le taux d'erreurs
    const totalErrors = trends.byLevel.error || 0;
    trends.errorRate = this.logs.length > 0 ? (totalErrors / this.logs.length) * 100 : 0;

    return trends;
  }

  /**
   * Configure les options de journalisation
   */
  configure(options) {
    if (options.level !== undefined) this.level = options.level;
    if (options.maxSize !== undefined) this.maxSize = options.maxSize;
    if (options.logToConsole !== undefined) this.logToConsole = options.logToConsole;
    if (options.logToFile !== undefined) this.logToFile = options.logToFile;
    if (options.logToServer !== undefined) this.logToServer = options.logToServer;
  }
}

// Initialiser le logger
const logger = new Logger();

// Fonctions utilitaires pour l'extérieur
function debug(message, metadata) {
  logger.debug(message, metadata);
}

function info(message, metadata) {
  logger.info(message, metadata);
}

function warn(message, metadata) {
  logger.warn(message, metadata);
}

function error(message, metadata) {
  logger.error(message, metadata);
}

function logInteraction(type, element, additionalData) {
  logger.logInteraction(type, element, additionalData);
}

function logNavigation(from, to) {
  logger.logNavigation(from, to);
}

function logPerformance(metric, value, additionalData) {
  logger.logPerformance(metric, value, additionalData);
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    Logger, 
    logger, 
    debug, 
    info, 
    warn, 
    error,
    logInteraction,
    logNavigation,
    logPerformance
  };
} else {
  window.TedAPI = window.TedAPI || {};
  window.TedAPI.Logger = logger;
  window.TedAPI.debug = debug;
  window.TedAPI.info = info;
  window.TedAPI.warn = warn;
  window.TedAPI.error = error;
  window.TedAPI.logInteraction = logInteraction;
  window.TedAPI.logNavigation = logNavigation;
  window.TedAPI.logPerformance = logPerformance;
}

// Journaliser le chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  logger.info('Page chargée', {
    url: window.location.href,
    title: document.title,
    userAgent: navigator.userAgent
  });
});