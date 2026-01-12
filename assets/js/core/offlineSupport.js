/**
 * Module de support hors-ligne amélioré pour TEDSAI
 * Ce module gère la mise en place et la gestion du mode hors-ligne
 */

class OfflineSupport {
  constructor() {
    this.isOnline = navigator.onLine;
    this.offlineData = {};
    this.syncQueue = [];
    this.serviceWorkerRegistration = null;
    this.cacheName = 'tedsai-cache-v1';
    this.assetsToCache = [
      '/',
      '/index.html',
      '/assets/css/style.css',
      '/assets/js/main.js',
      '/assets/js/core/db.js',
      '/assets/images/logo.png'
    ];
    
    this.init();
  }

  /**
   * Initialise le support hors-ligne
   */
  async init() {
    // Vérifier si le service worker est supporté
    if ('serviceWorker' in navigator) {
      await this.registerServiceWorker();
    }
    
    // Écouter les changements de connectivité
    this.setupConnectivityListeners();
    
    // Initialiser le stockage hors-ligne
    this.initOfflineStorage();
    
    // Charger les données sauvegardées
    this.loadOfflineData();
    
    // Démarrer la synchronisation automatique
    this.startAutoSync();
  }

  /**
   * Enregistre le service worker
   */
  async registerServiceWorker() {
    try {
      if ('serviceWorker' in navigator) {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker enregistré avec succès');
        
        // Activer les fonctionnalités de cache
        this.setupCacheManagement();
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
    }
  }

  /**
   * Crée le fichier de service worker
   */
  createServiceWorkerFile() {
    const swContent = `
      const CACHE_NAME = '${this.cacheName}';
      const urlsToCache = ${JSON.stringify(this.assetsToCache)};

      self.addEventListener('install', (event) => {
        event.waitUntil(
          caches.open(CACHE_NAME)
            .then((cache) => {
              console.log('Cache ouvert');
              return cache.addAll(urlsToCache);
            })
        );
      });

      self.addEventListener('fetch', (event) => {
        event.respondWith(
          caches.match(event.request)
            .then((response) => {
              // Retourner la réponse du cache si disponible
              if (response) {
                return response;
              }
              
              // Sinon, effectuer la requête réseau
              return fetch(event.request)
                .then((response) => {
                  // Vérifier si la réponse est valide
                  if(!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                  }

                  // Cloner la réponse pour la mettre en cache
                  const responseToCache = response.clone();

                  caches.open(CACHE_NAME)
                    .then((cache) => {
                      cache.put(event.request, responseToCache);
                    });

                  return response;
                });
            })
        );
      });

      self.addEventListener('activate', (event) => {
        event.waitUntil(
          caches.keys().then((cacheNames) => {
            return Promise.all(
              cacheNames.map((cacheName) => {
                if (cacheName !== CACHE_NAME) {
                  return caches.delete(cacheName);
                }
              })
            );
          })
        );
      });
    `;
    
    // Créer le fichier service worker
    const blob = new Blob([swContent], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(blob);
    
    // Enregistrer le service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('Service Worker enregistré avec succès:', registration);
          this.serviceWorkerRegistration = registration;
        })
        .catch(error => {
          console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
        });
    }
  }

  /**
   * Met en place la gestion du cache
   */
  setupCacheManagement() {
    // Mettre en place la stratégie de cache
    this.setupCacheStrategy();
  }

  /**
   * Configure la stratégie de cache
   */
  setupCacheStrategy() {
    // Stratégie Cache-First pour les ressources statiques
    // Stratégie Network-First pour les données dynamiques
    console.log('Stratégie de cache configurée');
  }

  /**
   * Écoute les changements de connectivité
   */
  setupConnectivityListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.handleOnline();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.handleOffline();
    });
  }

  /**
   * Gère le passage en ligne
   */
  handleOnline() {
    console.log('Connexion rétablie');
    
    // Afficher un message de statut
    this.showConnectionStatus('online');
    
    // Démarrer la synchronisation des données
    this.syncOfflineData();
    
    // Émettre un événement
    this.dispatchOfflineEvent('online');
  }

  /**
   * Gère le passage hors-ligne
   */
  handleOffline() {
    console.log('Mode hors-ligne activé');
    
    // Afficher un message de statut
    this.showConnectionStatus('offline');
    
    // Émettre un événement
    this.dispatchOfflineEvent('offline');
  }

  /**
   * Affiche le statut de connexion
   */
  showConnectionStatus(status) {
    // Créer ou mettre à jour l'indicateur de statut
    let statusElement = document.getElementById('connection-status');
    
    if (!statusElement) {
      statusElement = document.createElement('div');
      statusElement.id = 'connection-status';
      statusElement.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: 10px;
        text-align: center;
        z-index: 10000;
        font-weight: bold;
        transition: all 0.3s ease;
      `;
      document.body.appendChild(statusElement);
    }
    
    if (status === 'online') {
      statusElement.textContent = 'Connexion rétablie';
      statusElement.style.background = '#d4edda';
      statusElement.style.color = '#155724';
    } else {
      statusElement.textContent = 'Mode hors-ligne - Certaines fonctionnalités peuvent être limitées';
      statusElement.style.background = '#f8d7da';
      statusElement.style.color = '#721c24';
    }
    
    // Cacher le message après quelques secondes
    setTimeout(() => {
      if (statusElement.parentNode) {
        statusElement.style.opacity = '0';
        setTimeout(() => {
          if (statusElement.parentNode) {
            statusElement.remove();
          }
        }, 300);
      }
    }, 3000);
  }

  /**
   * Initialise le stockage hors-ligne
   */
  initOfflineStorage() {
    // Initialiser les collections de données hors-ligne
    this.offlineData = {
      userActions: [],
      formSubmissions: [],
      apiCalls: [],
      cachedContent: {},
      pendingSync: []
    };
  }

  /**
   * Charge les données sauvegardées hors-ligne
   */
  loadOfflineData() {
    try {
      const savedData = localStorage.getItem('tedsai_offline_data');
      if (savedData) {
        this.offlineData = { ...this.offlineData, ...JSON.parse(savedData) };
      }
    } catch (e) {
      console.error('Erreur lors du chargement des données hors-ligne:', e);
    }
  }

  /**
   * Sauvegarde les données hors-ligne
   */
  saveOfflineData() {
    try {
      localStorage.setItem('tedsai_offline_data', JSON.stringify(this.offlineData));
    } catch (e) {
      console.error('Erreur lors de la sauvegarde des données hors-ligne:', e);
    }
  }

  /**
   * Enregistre une action utilisateur pour le mode hors-ligne
   */
  recordUserAction(action, data) {
    const actionRecord = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      action: action,
      data: data,
      synced: false
    };
    
    this.offlineData.userActions.push(actionRecord);
    this.saveOfflineData();
    
    return actionRecord.id;
  }

  /**
   * Enregistre une soumission de formulaire pour le mode hors-ligne
   */
  recordFormSubmission(formData, endpoint) {
    const submission = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      endpoint: endpoint,
      data: formData,
      retries: 0,
      maxRetries: 3,
      synced: false
    };
    
    this.offlineData.formSubmissions.push(submission);
    this.saveOfflineData();
    
    return submission.id;
  }

  /**
   * Enregistre un appel API pour le mode hors-ligne
   */
  recordAPICall(method, endpoint, data) {
    const apiCall = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      method: method,
      endpoint: endpoint,
      data: data,
      retries: 0,
      maxRetries: 3,
      synced: false
    };
    
    this.offlineData.apiCalls.push(apiCall);
    this.saveOfflineData();
    
    return apiCall.id;
  }

  /**
   * Démarre la synchronisation automatique
   */
  startAutoSync() {
    // Synchroniser toutes les 30 secondes tant que l'on est en ligne
    setInterval(() => {
      if (this.isOnline) {
        this.syncOfflineData();
      }
    }, 30000); // 30 secondes
  }

  /**
   * Synchronise les données hors-ligne
   */
  async syncOfflineData() {
    if (!this.isOnline) return;
    
    console.log('Démarrage de la synchronisation des données hors-ligne...');
    
    let syncedCount = 0;
    
    // Synchroniser les actions utilisateur
    syncedCount += await this.syncUserActions();
    
    // Synchroniser les soumissions de formulaire
    syncedCount += await this.syncFormSubmissions();
    
    // Synchroniser les appels API
    syncedCount += await this.syncAPICalls();
    
    console.log(`Synchronisation terminée: ${syncedCount} éléments synchronisés`);
    
    // Émettre un événement de synchronisation
    this.dispatchOfflineEvent('syncCompleted', { syncedCount });
    
    return syncedCount;
  }

  /**
   * Synchronise les actions utilisateur
   */
  async syncUserActions() {
    let syncedCount = 0;
    
    for (let i = this.offlineData.userActions.length - 1; i >= 0; i--) {
      const action = this.offlineData.userActions[i];
      
      if (!action.synced) {
        try {
          // Envoyer l'action au serveur
          const response = await fetch('/api/user-actions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(action)
          });
          
          if (response.ok) {
            // Marquer comme synchronisé
            action.synced = true;
            syncedCount++;
          }
        } catch (error) {
          console.error('Erreur lors de la synchronisation de l\'action:', error);
          // Laisser l'action pour une prochaine tentative
        }
      }
    }
    
    // Nettoyer les actions synchronisées
    this.offlineData.userActions = this.offlineData.userActions.filter(action => !action.synced);
    this.saveOfflineData();
    
    return syncedCount;
  }

  /**
   * Synchronise les soumissions de formulaire
   */
  async syncFormSubmissions() {
    let syncedCount = 0;
    
    for (let i = this.offlineData.formSubmissions.length - 1; i >= 0; i--) {
      const submission = this.offlineData.formSubmissions[i];
      
      if (!submission.synced) {
        try {
          // Envoyer la soumission au serveur
          const response = await fetch(submission.endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(submission.data)
          });
          
          if (response.ok) {
            // Marquer comme synchronisé
            submission.synced = true;
            syncedCount++;
          } else {
            // Incrémenter le compteur de tentatives
            submission.retries++;
            
            // Si trop de tentatives, abandonner
            if (submission.retries >= submission.maxRetries) {
              console.error('Trop de tentatives de synchronisation pour la soumission:', submission.id);
            }
          }
        } catch (error) {
          console.error('Erreur lors de la synchronisation de la soumission:', error);
          // Incrémenter le compteur de tentatives
          submission.retries++;
          
          // Si trop de tentatives, abandonner
          if (submission.retries >= submission.maxRetries) {
            console.error('Trop de tentatives de synchronisation pour la soumission:', submission.id);
          }
        }
      }
    }
    
    // Nettoyer les soumissions synchronisées ou abandonnées
    this.offlineData.formSubmissions = this.offlineData.formSubmissions.filter(
      submission => !submission.synced && submission.retries < submission.maxRetries
    );
    this.saveOfflineData();
    
    return syncedCount;
  }

  /**
   * Synchronise les appels API
   */
  async syncAPICalls() {
    let syncedCount = 0;
    
    for (let i = this.offlineData.apiCalls.length - 1; i >= 0; i--) {
      const apiCall = this.offlineData.apiCalls[i];
      
      if (!apiCall.synced) {
        try {
          // Envoyer l'appel API au serveur
          const response = await fetch(apiCall.endpoint, {
            method: apiCall.method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: apiCall.data ? JSON.stringify(apiCall.data) : null
          });
          
          if (response.ok) {
            // Marquer comme synchronisé
            apiCall.synced = true;
            syncedCount++;
          } else {
            // Incrémenter le compteur de tentatives
            apiCall.retries++;
            
            // Si trop de tentatives, abandonner
            if (apiCall.retries >= apiCall.maxRetries) {
              console.error('Trop de tentatives de synchronisation pour l\'appel API:', apiCall.id);
            }
          }
        } catch (error) {
          console.error('Erreur lors de la synchronisation de l\'appel API:', error);
          // Incrémenter le compteur de tentatives
          apiCall.retries++;
          
          // Si trop de tentatives, abandonner
          if (apiCall.retries >= apiCall.maxRetries) {
            console.error('Trop de tentatives de synchronisation pour l\'appel API:', apiCall.id);
          }
        }
      }
    }
    
    // Nettoyer les appels API synchronisés ou abandonnés
    this.offlineData.apiCalls = this.offlineData.apiCalls.filter(
      apiCall => !apiCall.synced && apiCall.retries < apiCall.maxRetries
    );
    this.saveOfflineData();
    
    return syncedCount;
  }

  /**
   * Met en cache du contenu pour le mode hors-ligne
   */
  cacheContent(key, content) {
    this.offlineData.cachedContent[key] = {
      content: content,
      timestamp: new Date().toISOString(),
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 heures
    };
    
    this.saveOfflineData();
  }

  /**
   * Récupère du contenu mis en cache
   */
  getCachedContent(key) {
    const cached = this.offlineData.cachedContent[key];
    
    if (cached) {
      // Vérifier si le cache est expiré
      const now = new Date();
      const expires = new Date(cached.expires);
      
      if (now < expires) {
        return cached.content;
      } else {
        // Supprimer le cache expiré
        delete this.offlineData.cachedContent[key];
        this.saveOfflineData();
      }
    }
    
    return null;
  }

  /**
   * Émet un événement hors-ligne
   */
  dispatchOfflineEvent(eventName, data = {}) {
    const event = new CustomEvent(`tedsaiOffline_${eventName}`, { detail: data });
    document.dispatchEvent(event);
  }

  /**
   * Vérifie si le mode hors-ligne est actif
   */
  isOfflineMode() {
    return !this.isOnline;
  }

  /**
   * Obtient les statistiques hors-ligne
   */
  getOfflineStats() {
    return {
      isOnline: this.isOnline,
      userActionsPending: this.offlineData.userActions.length,
      formSubmissionsPending: this.offlineData.formSubmissions.length,
      apiCallsPending: this.offlineData.apiCalls.length,
      totalPending: (
        this.offlineData.userActions.length +
        this.offlineData.formSubmissions.length +
        this.offlineData.apiCalls.length
      )
    };
  }

  /**
   * Force la synchronisation
   */
  async forceSync() {
    console.log('Synchronisation forcée...');
    return await this.syncOfflineData();
  }

  /**
   * Nettoie les données périmées
   */
  cleanupExpiredData() {
    const now = new Date();
    
    // Nettoyer les données avec expiration
    for (const key in this.offlineData.cachedContent) {
      const cached = this.offlineData.cachedContent[key];
      const expires = new Date(cached.expires);
      
      if (now > expires) {
        delete this.offlineData.cachedContent[key];
      }
    }
    
    // Nettoyer les actions trop anciennes (plus de 7 jours)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    this.offlineData.userActions = this.offlineData.userActions.filter(
      action => new Date(action.timestamp) > sevenDaysAgo
    );
    
    this.offlineData.formSubmissions = this.offlineData.formSubmissions.filter(
      submission => new Date(submission.timestamp) > sevenDaysAgo
    );
    
    this.offlineData.apiCalls = this.offlineData.apiCalls.filter(
      apiCall => new Date(apiCall.timestamp) > sevenDaysAgo
    );
    
    this.saveOfflineData();
  }

  /**
   * Exporte les données hors-ligne
   */
  exportOfflineData() {
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      offlineData: this.offlineData,
      stats: this.getOfflineStats()
    };
  }

  /**
   * Importe des données hors-ligne
   */
  importOfflineData(data) {
    if (!data || !data.offlineData) {
      throw new Error('Données hors-ligne invalides pour l\'importation');
    }
    
    this.offlineData = { ...this.offlineData, ...data.offlineData };
    this.saveOfflineData();
    
    console.log('Données hors-ligne importées avec succès');
  }
}

// Initialiser le support hors-ligne
const offlineSupport = new OfflineSupport();

// Créer le fichier de service worker
offlineSupport.createServiceWorkerFile();

// Fonctions utilitaires pour l'extérieur
function isOfflineMode() {
  return offlineSupport.isOfflineMode();
}

function getOfflineStats() {
  return offlineSupport.getOfflineStats();
}

async function forceSync() {
  return offlineSupport.forceSync();
}

function recordUserAction(action, data) {
  return offlineSupport.recordUserAction(action, data);
}

function recordFormSubmission(formData, endpoint) {
  return offlineSupport.recordFormSubmission(formData, endpoint);
}

function cacheContent(key, content) {
  return offlineSupport.cacheContent(key, content);
}

function getCachedContent(key) {
  return offlineSupport.getCachedContent(key);
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    OfflineSupport, 
    offlineSupport, 
    isOfflineMode,
    getOfflineStats,
    forceSync,
    recordUserAction,
    recordFormSubmission,
    cacheContent,
    getCachedContent
  };
} else {
  window.TedAPI = window.TedAPI || {};
  window.TedAPI.OfflineSupport = offlineSupport;
  window.TedAPI.isOfflineMode = isOfflineMode;
  window.TedAPI.getOfflineStats = getOfflineStats;
  window.TedAPI.forceSync = forceSync;
  window.TedAPI.recordUserAction = recordUserAction;
  window.TedAPI.recordFormSubmission = recordFormSubmission;
  window.TedAPI.cacheContent = cacheContent;
  window.TedAPI.getCachedContent = getCachedContent;
}