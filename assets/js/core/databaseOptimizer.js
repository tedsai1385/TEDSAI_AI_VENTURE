/**
 * Module d'optimisation de la base de données hybride pour TEDSAI
 * Ce module gère l'optimisation du système de base de données hybride (LocalStorage + Firestore)
 */

class DatabaseOptimizer {
  constructor() {
    this.collections = [
      'users', 'menu', 'garden_products', 'ia_services', 
      'content_pages', 'reservations', 'messages', 'media',
      'blog_posts', 'blog_categories', 'blog_comments', 'logs',
      'chatSessions', 'error_logs'
    ];
    
    this.optimizationSettings = {
      maxLocalStorageSize: 5 * 1024 * 1024, // 5MB
      cleanupInterval: 30 * 60 * 1000, // 30 minutes
      syncInterval: 5 * 60 * 1000, // 5 minutes
      batchSize: 100,
      compressionEnabled: true,
      encryptionEnabled: false
    };
    
    this.stats = {
      totalSize: 0,
      collectionSizes: {},
      lastOptimization: null,
      syncStatus: 'idle'
    };
    
    this.init();
  }

  /**
   * Initialise le module d'optimisation
   */
  async init() {
    // Charger les paramètres d'optimisation
    this.loadSettings();
    
    // Démarrer les processus d'optimisation
    this.startOptimizationProcesses();
    
    // Calculer les statistiques initiales
    this.updateStats();
  }

  /**
   * Charge les paramètres d'optimisation depuis le stockage local
   */
  loadSettings() {
    try {
      const settings = localStorage.getItem('tedsai_db_optimizer_settings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        Object.assign(this.optimizationSettings, parsedSettings);
      }
    } catch (e) {
      console.warn('Impossible de charger les paramètres d\'optimisation:', e);
    }
  }

  /**
   * Sauvegarde les paramètres d'optimisation dans le stockage local
   */
  saveSettings() {
    try {
      localStorage.setItem('tedsai_db_optimizer_settings', JSON.stringify(this.optimizationSettings));
    } catch (e) {
      console.error('Impossible de sauvegarder les paramètres d\'optimisation:', e);
    }
  }

  /**
   * Démarrer les processus d'optimisation
   */
  startOptimizationProcesses() {
    // Démarrer le nettoyage automatique
    this.startCleanupProcess();
    
    // Démarrer la synchronisation automatique
    this.startSyncProcess();
    
    // Démarrer la surveillance de la taille
    this.startSizeMonitoring();
  }

  /**
   * Démarrer le processus de nettoyage
   */
  startCleanupProcess() {
    setInterval(() => {
      this.performCleanup();
    }, this.optimizationSettings.cleanupInterval);
  }

  /**
   * Démarrer le processus de synchronisation
   */
  startSyncProcess() {
    setInterval(() => {
      this.syncWithRemote();
    }, this.optimizationSettings.syncInterval);
  }

  /**
   * Démarrer la surveillance de la taille
   */
  startSizeMonitoring() {
    // Vérifier la taille toutes les 10 minutes
    setInterval(() => {
      this.updateStats();
      
      // Vérifier si la taille dépasse la limite
      if (this.stats.totalSize > this.optimizationSettings.maxLocalStorageSize * 0.8) {
        console.warn('La taille du stockage local approche la limite:', this.formatBytes(this.stats.totalSize));
        this.triggerOptimization();
      }
    }, 10 * 60 * 1000);
  }

  /**
   * Effectue un nettoyage des données obsolètes
   */
  async performCleanup() {
    console.log('Démarrage du processus de nettoyage...');
    
    let cleanedCollections = 0;
    let totalCleaned = 0;
    
    for (const collection of this.collections) {
      const cleaned = await this.cleanupCollection(collection);
      if (cleaned > 0) {
        cleanedCollections++;
        totalCleaned += cleaned;
      }
    }
    
    // Nettoyer les données temporaires
    this.cleanupTempData();
    
    // Mettre à jour les statistiques
    this.updateStats();
    
    console.log(`Nettoyage terminé: ${cleanedCollections} collections nettoyées, ${totalCleaned} éléments supprimés`);
    
    return { cleanedCollections, totalCleaned };
  }

  /**
   * Nettoie une collection spécifique
   */
  async cleanupCollection(collection) {
    try {
      const data = this.getLocalCollectionData(collection);
      if (!data || !Array.isArray(data)) return 0;
      
      const originalLength = data.length;
      let cleanedCount = 0;
      
      // Filtrer les données obsolètes
      const cleanedData = data.filter(item => {
        // Vérifier si l'élément a une date d'expiration
        if (item.expiresAt) {
          const now = new Date().getTime();
          const expires = new Date(item.expiresAt).getTime();
          if (now > expires) {
            cleanedCount++;
            return false;
          }
        }
        
        // Vérifier si l'élément est marqué comme supprimé
        if (item.deleted) {
          const deleteTime = new Date(item.deleted).getTime();
          const now = new Date().getTime();
          // Conserver les éléments supprimés pendant 7 jours avant suppression définitive
          if (now - deleteTime > 7 * 24 * 60 * 60 * 1000) {
            cleanedCount++;
            return false;
          }
        }
        
        return true;
      });
      
      // Sauvegarder les données nettoyées
      if (cleanedData.length !== originalLength) {
        this.setLocalCollectionData(collection, cleanedData);
      }
      
      return cleanedCount;
    } catch (e) {
      console.error(`Erreur lors du nettoyage de la collection ${collection}:`, e);
      return 0;
    }
  }

  /**
   * Nettoie les données temporaires
   */
  cleanupTempData() {
    try {
      // Nettoyer les données temporaires avec expiration
      const tempKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('tedsai_temp_') || key.startsWith('tedsai_cache_')
      );
      
      const now = new Date().getTime();
      let cleanedCount = 0;
      
      for (const key of tempKeys) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (data && data.expiresAt) {
            const expires = new Date(data.expiresAt).getTime();
            if (now > expires) {
              localStorage.removeItem(key);
              cleanedCount++;
            }
          }
        } catch (e) {
          // Si la donnée est corrompue, la supprimer
          localStorage.removeItem(key);
          cleanedCount++;
        }
      }
      
      console.log(`Données temporaires nettoyées: ${cleanedCount} éléments supprimés`);
    } catch (e) {
      console.error('Erreur lors du nettoyage des données temporaires:', e);
    }
  }

  /**
   * Synchronise avec la base de données distante
   */
  async syncWithRemote() {
    if (!window.tedFirebase || !window.tedFirebase.loaded) {
      console.warn('Firebase non disponible pour la synchronisation');
      return;
    }
    
    console.log('Démarrage de la synchronisation avec la base de données distante...');
    this.stats.syncStatus = 'syncing';
    
    try {
      const { db } = window.tedFirebase;
      
      for (const collection of this.collections) {
        await this.syncCollection(db, collection);
      }
      
      this.stats.syncStatus = 'completed';
      console.log('Synchronisation terminée avec succès');
    } catch (e) {
      this.stats.syncStatus = 'error';
      console.error('Erreur lors de la synchronisation:', e);
    }
  }

  /**
   * Synchronise une collection spécifique
   */
  async syncCollection(db, collection) {
    try {
      // Obtenir les données locales
      const localData = this.getLocalCollectionData(collection) || [];
      
      // Obtenir les données distantes
      const remoteSnapshot = await db.collection(collection).get();
      const remoteData = [];
      remoteSnapshot.forEach(doc => {
        remoteData.push({ id: doc.id, ...doc.data() });
      });
      
      // Fusionner les données (stratégie de fusion intelligente)
      const mergedData = this.mergeData(localData, remoteData);
      
      // Mettre à jour la base de données distante avec les données fusionnées
      for (const item of mergedData) {
        if (item.id) {
          await db.collection(collection).doc(item.id).set(item, { merge: true });
        } else {
          const newDoc = await db.collection(collection).add(item);
          // Mettre à jour l'ID local avec le nouvel ID Firestore
          const localIndex = localData.findIndex(l => l.localId === item.localId);
          if (localIndex !== -1) {
            localData[localIndex].id = newDoc.id;
            this.setLocalCollectionData(collection, localData);
          }
        }
      }
      
      // Mettre à jour les données locales avec les IDs Firestore
      this.updateLocalIds(collection, mergedData);
      
    } catch (e) {
      console.error(`Erreur lors de la synchronisation de la collection ${collection}:`, e);
    }
  }

  /**
   * Fusionne les données locales et distantes
   */
  mergeData(localData, remoteData) {
    const merged = [...remoteData];
    
    for (const localItem of localData) {
      // Trouver un élément correspondant dans les données distantes
      const remoteIndex = merged.findIndex(remoteItem => 
        remoteItem.id === localItem.id || 
        (localItem.localId && remoteItem.localId === localItem.localId)
      );
      
      if (remoteIndex === -1) {
        // Nouvel élément local, à synchroniser
        merged.push(localItem);
      } else {
        // Fusionner les éléments existants (conserver la version la plus récente)
        const remoteItem = merged[remoteIndex];
        const localModified = new Date(localItem.lastModified || localItem.createdAt || 0);
        const remoteModified = new Date(remoteItem.lastModified || remoteItem.createdAt || 0);
        
        if (localModified > remoteModified) {
          // Les données locales sont plus récentes, les conserver
          merged[remoteIndex] = { ...remoteItem, ...localItem };
        } else {
          // Les données distantes sont plus récentes, les conserver
          merged[remoteIndex] = { ...localItem, ...remoteItem };
        }
      }
    }
    
    return merged;
  }

  /**
   * Met à jour les IDs locaux avec les IDs Firestore
   */
  updateLocalIds(collection, mergedData) {
    const localData = this.getLocalCollectionData(collection) || [];
    const updatedLocalData = [];
    
    for (const mergedItem of mergedData) {
      const localIndex = localData.findIndex(l => 
        l.id === mergedItem.id || l.localId === mergedItem.localId
      );
      
      if (localIndex !== -1) {
        // Mettre à jour l'élément local avec les données fusionnées
        updatedLocalData.push({ ...localData[localIndex], ...mergedItem });
      } else {
        // Nouvel élément, l'ajouter
        updatedLocalData.push(mergedItem);
      }
    }
    
    this.setLocalCollectionData(collection, updatedLocalData);
  }

  /**
   * Obtient les données d'une collection locale
   */
  getLocalCollectionData(collection) {
    try {
      const data = localStorage.getItem(`tedsai_${collection}`);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error(`Erreur lors de la lecture de la collection ${collection}:`, e);
      return [];
    }
  }

  /**
   * Définit les données d'une collection locale
   */
  setLocalCollectionData(collection, data) {
    try {
      localStorage.setItem(`tedsai_${collection}`, JSON.stringify(data));
    } catch (e) {
      console.error(`Erreur lors de l'écriture de la collection ${collection}:`, e);
    }
  }

  /**
   * Compresse les données
   */
  compressData(data) {
    if (!this.optimizationSettings.compressionEnabled) {
      return data;
    }
    
    // Pour une vraie compression, on utiliserait une bibliothèque comme LZ-string
    // Pour cette implémentation, on va simplement supprimer les propriétés inutiles
    return this.removeEmptyProperties(data);
  }

  /**
   * Décompresse les données
   */
  decompressData(compressedData) {
    if (!this.optimizationSettings.compressionEnabled) {
      return compressedData;
    }
    
    return compressedData;
  }

  /**
   * Supprime les propriétés vides des données
   */
  removeEmptyProperties(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.removeEmptyProperties(item));
    }
    
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null && value !== undefined && value !== '') {
        if (typeof value === 'object') {
          cleaned[key] = this.removeEmptyProperties(value);
        } else {
          cleaned[key] = value;
        }
      }
    }
    
    return cleaned;
  }

  /**
   * Chiffre les données (simulé)
   */
  encryptData(data) {
    if (!this.optimizationSettings.encryptionEnabled) {
      return data;
    }
    
    // Pour une vraie implémentation, on utiliserait Crypto API
    // Pour cette simulation, on va juste encoder
    try {
      const jsonString = JSON.stringify(data);
      return btoa(jsonString);
    } catch (e) {
      console.error('Erreur lors du chiffrement des données:', e);
      return data;
    }
  }

  /**
   * Déchiffre les données (simulé)
   */
  decryptData(encryptedData) {
    if (!this.optimizationSettings.encryptionEnabled) {
      return encryptedData;
    }
    
    // Pour une vraie implémentation, on utiliserait Crypto API
    // Pour cette simulation, on va juste décoder
    try {
      const jsonString = atob(encryptedData);
      return JSON.parse(jsonString);
    } catch (e) {
      console.error('Erreur lors du déchiffrement des données:', e);
      return encryptedData;
    }
  }

  /**
   * Met à jour les statistiques
   */
  updateStats() {
    let totalSize = 0;
    const collectionSizes = {};
    
    for (const collection of this.collections) {
      const data = this.getLocalCollectionData(collection);
      if (data) {
        const size = JSON.stringify(data).length;
        totalSize += size;
        collectionSizes[collection] = size;
      }
    }
    
    // Ajouter la taille des autres données de stockage
    for (const key in localStorage) {
      if (key.startsWith('tedsai_') && !this.collections.some(col => key === `tedsai_${col}`)) {
        const value = localStorage.getItem(key);
        if (value) {
          const size = value.length;
          totalSize += size;
          collectionSizes[key] = size;
        }
      }
    }
    
    this.stats.totalSize = totalSize;
    this.stats.collectionSizes = collectionSizes;
    this.stats.lastOptimization = new Date().toISOString();
  }

  /**
   * Déclenche une optimisation manuelle
   */
  async triggerOptimization() {
    console.log('Démarrage de l\'optimisation manuelle...');
    
    const results = {
      cleanup: await this.performCleanup(),
      sync: await this.syncWithRemote(),
      stats: this.updateStats()
    };
    
    console.log('Optimisation manuelle terminée:', results);
    return results;
  }

  /**
   * Optimise une collection spécifique
   */
  async optimizeCollection(collection) {
    console.log(`Optimisation de la collection: ${collection}`);
    
    try {
      // Nettoyer la collection
      const cleaned = await this.cleanupCollection(collection);
      
      // Compresser les données si activé
      if (this.optimizationSettings.compressionEnabled) {
        const data = this.getLocalCollectionData(collection);
        const compressedData = this.compressData(data);
        this.setLocalCollectionData(collection, compressedData);
      }
      
      // Mettre à jour les statistiques
      this.updateStats();
      
      console.log(`Collection ${collection} optimisée: ${cleaned} éléments nettoyés`);
      return { success: true, cleaned: cleaned };
    } catch (e) {
      console.error(`Erreur lors de l'optimisation de la collection ${collection}:`, e);
      return { success: false, error: e.message };
    }
  }

  /**
   * Effectue une migration de données
   */
  async migrateData(migrationPlan) {
    console.log('Démarrage de la migration des données...');
    
    try {
      for (const migration of migrationPlan) {
        await this.executeMigration(migration);
      }
      
      console.log('Migration des données terminée avec succès');
      return { success: true };
    } catch (e) {
      console.error('Erreur lors de la migration des données:', e);
      return { success: false, error: e.message };
    }
  }

  /**
   * Exécute une migration spécifique
   */
  async executeMigration(migration) {
    const { fromCollection, toCollection, transformer } = migration;
    
    const sourceData = this.getLocalCollectionData(fromCollection);
    if (!sourceData) return;
    
    const transformedData = sourceData.map(item => {
      if (transformer) {
        return transformer(item);
      }
      return item;
    });
    
    // Sauvegarder les données transformées
    this.setLocalCollectionData(toCollection, transformedData);
    
    // Supprimer les anciennes données si spécifié
    if (migration.deleteSource) {
      localStorage.removeItem(`tedsai_${fromCollection}`);
    }
  }

  /**
   * Sauvegarde les données
   */
  async backupData() {
    console.log('Création d\'une sauvegarde des données...');
    
    try {
      const backup = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        collections: {}
      };
      
      for (const collection of this.collections) {
        const data = this.getLocalCollectionData(collection);
        if (data) {
          backup.collections[collection] = data;
        }
      }
      
      // Sauvegarder dans le stockage local
      localStorage.setItem('tedsai_db_backup', JSON.stringify(backup));
      
      console.log('Sauvegarde des données terminée');
      return { success: true, backup };
    } catch (e) {
      console.error('Erreur lors de la sauvegarde des données:', e);
      return { success: false, error: e.message };
    }
  }

  /**
   * Restaure les données depuis une sauvegarde
   */
  async restoreData(backup) {
    console.log('Restauration des données depuis la sauvegarde...');
    
    try {
      if (!backup || !backup.collections) {
        throw new Error('Sauvegarde invalide');
      }
      
      for (const [collection, data] of Object.entries(backup.collections)) {
        this.setLocalCollectionData(collection, data);
      }
      
      // Mettre à jour les statistiques
      this.updateStats();
      
      console.log('Restauration des données terminée');
      return { success: true };
    } catch (e) {
      console.error('Erreur lors de la restauration des données:', e);
      return { success: false, error: e.message };
    }
  }

  /**
   * Formate les octets pour l'affichage
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Obtient les statistiques d'optimisation
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * Obtient les recommandations d'optimisation
   */
  getOptimizationRecommendations() {
    const recommendations = [];
    
    // Vérifier la taille totale
    if (this.stats.totalSize > this.optimizationSettings.maxLocalStorageSize * 0.8) {
      recommendations.push({
        priority: 'high',
        message: 'La taille du stockage local est proche de la limite',
        action: 'Effectuer un nettoyage urgent des données obsolètes'
      });
    }
    
    // Vérifier les collections volumineuses
    for (const [collection, size] of Object.entries(this.stats.collectionSizes)) {
      if (size > 1024 * 100) { // Plus de 100KB
        recommendations.push({
          priority: 'medium',
          message: `La collection ${collection} est volumineuse (${this.formatBytes(size)})`,
          action: `Optimiser la collection ${collection}`
        });
      }
    }
    
    // Vérifier la fréquence de synchronisation
    if (this.optimizationSettings.syncInterval > 10 * 60 * 1000) { // Plus de 10 minutes
      recommendations.push({
        priority: 'low',
        message: 'L\'intervalle de synchronisation est long',
        action: 'Réduire l\'intervalle de synchronisation pour une meilleure cohérence'
      });
    }
    
    return recommendations;
  }

  /**
   * Exporte les statistiques d'optimisation
   */
  exportStats() {
    return {
      ...this.stats,
      recommendations: this.getOptimizationRecommendations(),
      settings: this.optimizationSettings,
      exportedAt: new Date().toISOString()
    };
  }
}

// Initialiser le module d'optimisation de la base de données
const databaseOptimizer = new DatabaseOptimizer();

// Fonctions utilitaires pour l'extérieur
async function performCleanup() {
  return databaseOptimizer.performCleanup();
}

async function syncWithRemote() {
  return databaseOptimizer.syncWithRemote();
}

function getDbStats() {
  return databaseOptimizer.getStats();
}

function getOptimizationRecommendations() {
  return databaseOptimizer.getOptimizationRecommendations();
}

async function optimizeCollection(collection) {
  return databaseOptimizer.optimizeCollection(collection);
}

async function backupData() {
  return databaseOptimizer.backupData();
}

async function restoreData(backup) {
  return databaseOptimizer.restoreData(backup);
}

function formatBytes(bytes) {
  return databaseOptimizer.formatBytes(bytes);
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    DatabaseOptimizer, 
    databaseOptimizer, 
    performCleanup,
    syncWithRemote,
    getDbStats,
    getOptimizationRecommendations,
    optimizeCollection,
    backupData,
    restoreData,
    formatBytes
  };
} else {
  window.TedAPI = window.TedAPI || {};
  window.TedAPI.DatabaseOptimizer = databaseOptimizer;
  window.TedAPI.performCleanup = performCleanup;
  window.TedAPI.syncWithRemote = syncWithRemote;
  window.TedAPI.getDbStats = getDbStats;
  window.TedAPI.getOptimizationRecommendations = getOptimizationRecommendations;
  window.TedAPI.optimizeCollection = optimizeCollection;
  window.TedAPI.backupData = backupData;
  window.TedAPI.restoreData = restoreData;
  window.TedAPI.formatBytes = formatBytes;
}