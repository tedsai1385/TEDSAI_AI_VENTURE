/**
 * Système de recherche puissant pour TEDSAI
 * Ce module gère la recherche de contenu à travers le site
 */

class SearchEngine {
  constructor() {
    this.index = new Map();
    this.searchCache = new Map();
    this.searchHistory = [];
    this.maxHistorySize = 50;
    this.init();
  }

  /**
   * Initialise le moteur de recherche
   */
  async init() {
    // Indexer le contenu de la page actuelle
    this.indexCurrentPage();
    
    // Observer les changements de contenu dynamique
    this.setupContentObserver();
    
    // Charger les données de recherche précédentes si elles existent
    this.loadSearchData();
  }

  /**
   * Indexe le contenu de la page actuelle
   */
  indexCurrentPage() {
    const title = document.title || '';
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.textContent.trim());
    const paragraphs = Array.from(document.querySelectorAll('p')).map(p => p.textContent.trim()).slice(0, 20); // Limiter pour performance
    const links = Array.from(document.querySelectorAll('a[href]')).map(a => ({
      text: a.textContent.trim(),
      href: a.getAttribute('href')
    })).filter(link => link.text && link.href);
    
    // Extraire le contenu principal
    const mainContent = document.querySelector('main') || document.querySelector('body');
    const textContent = mainContent ? mainContent.textContent.trim() : '';
    
    // Créer un document d'index pour cette page
    const pageUrl = window.location.href;
    const pageDoc = {
      url: pageUrl,
      title: title,
      headings: headings,
      content: textContent.substring(0, 1000), // Limiter la longueur
      paragraphs: paragraphs,
      links: links,
      createdAt: new Date().toISOString()
    };
    
    this.index.set(pageUrl, pageDoc);
  }

  /**
   * Configure l'observateur de contenu dynamique
   */
  setupContentObserver() {
    // Observer les changements dans le DOM pour indexer le nouveau contenu
    const observer = new MutationObserver((mutations) => {
      let shouldReindex = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldReindex = true;
        }
      });
      
      if (shouldReindex) {
        // Décaler la réindexation pour éviter les appels fréquents
        setTimeout(() => {
          this.indexCurrentPage();
        }, 1000);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Effectue une recherche dans l'index
   */
  search(query, options = {}) {
    if (!query || query.trim().length === 0) {
      return { results: [], query: '', took: 0 };
    }
    
    const startTime = performance.now();
    query = query.trim().toLowerCase();
    
    // Vérifier le cache
    const cacheKey = `${query}_${JSON.stringify(options)}`;
    if (this.searchCache.has(cacheKey)) {
      return this.searchCache.get(cacheKey);
    }
    
    // Tokeniser la requête
    const tokens = this.tokenize(query);
    
    // Résultats de recherche
    let results = [];
    
    // Parcourir l'index
    for (const [url, doc] of this.index.entries()) {
      const score = this.calculateScore(doc, tokens);
      
      if (score > 0) {
        // Extraire un extrait pertinent
        const excerpt = this.extractExcerpt(doc.content, tokens);
        
        results.push({
          url: doc.url,
          title: doc.title,
          headings: doc.headings,
          excerpt: excerpt,
          score: score,
          lastUpdated: doc.createdAt
        });
      }
    }
    
    // Trier par score (descendant)
    results.sort((a, b) => b.score - a.score);
    
    // Limiter les résultats si spécifié
    if (options.limit) {
      results = results.slice(0, options.limit);
    }
    
    const endTime = performance.now();
    const took = endTime - startTime;
    
    // Créer le résultat final
    const searchResult = {
      results: results,
      query: query,
      took: took,
      totalResults: results.length
    };
    
    // Mettre en cache
    this.searchCache.set(cacheKey, searchResult);
    
    // Ajouter à l'historique
    this.addToSearchHistory(query, results.length);
    
    return searchResult;
  }

  /**
   * Tokenise une chaîne de recherche
   */
  tokenize(text) {
    // Retirer les mots vides et les caractères spéciaux
    const stopwords = new Set([
      'le', 'la', 'les', 'de', 'des', 'du', 'en', 'et', 'ou', 'dans', 'sur', 'pour', 'avec', 'un', 'une', 'est', 'sont', 'son', 'sa', 'se', 'que', 'qui', 'quoi', 'où', 'quand', 'comment', 'pourquoi', 'par', 'à', 'au', 'aux', 'a', 'ai', 'as', 'avons', 'avez', 'ont', 'étais', 'était', 'étions', 'étiez', 'étaient', 'eut', 'eûmes', 'eûtes', 'eurent', 'aie', 'aies', 'ait', 'ayons', 'ayez', 'aient', 'eusse', 'eusses', 'eût', 'eussions', 'eussiez', 'eussent', 'ce', 'ces', 'cette', 'cet', 'd', 'l', 'm', 'n', 's', 't', 'j', 'c'
    ]);
    
    return text
      .split(/[^\w\u00C0-\u017F]+/) // Support des caractères accentués
      .map(token => token.trim())
      .filter(token => token.length > 2 && !stopwords.has(token))
      .filter((token, index, arr) => arr.indexOf(token) === index); // Supprimer les doublons
  }

  /**
   * Calcule le score de pertinence d'un document pour une requête
   */
  calculateScore(doc, tokens) {
    let score = 0;
    
    // Score pour le titre
    if (doc.title) {
      const titleLower = doc.title.toLowerCase();
      tokens.forEach(token => {
        const occurrences = this.countOccurrences(titleLower, token);
        score += occurrences * 10; // Poids plus élevé pour le titre
      });
    }
    
    // Score pour les titres de section
    if (doc.headings && doc.headings.length > 0) {
      const headingsText = doc.headings.join(' ').toLowerCase();
      tokens.forEach(token => {
        const occurrences = this.countOccurrences(headingsText, token);
        score += occurrences * 5; // Poids moyen pour les titres de section
      });
    }
    
    // Score pour le contenu
    if (doc.content) {
      const contentLower = doc.content.toLowerCase();
      tokens.forEach(token => {
        const occurrences = this.countOccurrences(contentLower, token);
        score += occurrences * 1; // Poids de base pour le contenu
      });
    }
    
    // Bonus pour la correspondance exacte
    tokens.forEach(token => {
      if (doc.title && doc.title.toLowerCase().includes(token)) {
        score += 2;
      }
      if (doc.content && doc.content.toLowerCase().includes(token)) {
        score += 1;
      }
    });
    
    return score;
  }

  /**
   * Compte les occurrences d'un token dans un texte
   */
  countOccurrences(text, token) {
    const regex = new RegExp('\\b' + this.escapeRegExp(token) + '\\b', 'gi');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  }

  /**
   * Échappe les caractères spéciaux pour une expression régulière
   */
  escapeRegExp(string) {
    return string.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Extrait un extrait pertinent du contenu
   */
  extractExcerpt(content, tokens) {
    if (!content || tokens.length === 0) {
      return '';
    }
    
    const excerptLength = 160;
    const contentLower = content.toLowerCase();
    
    // Trouver la première occurrence d'un token
    let bestPosition = -1;
    let bestScore = -1;
    
    for (let i = 0; i < tokens.length; i++) {
      const pos = contentLower.indexOf(tokens[i]);
      if (pos !== -1) {
        // Calculer un score basé sur la position et la rareté du token
        const score = (tokens.length - i) * 10; // Tokens plus précoces ont plus de poids
        if (score > bestScore) {
          bestScore = score;
          bestPosition = pos;
        }
      }
    }
    
    if (bestPosition === -1) {
      // Si aucun token trouvé, prendre le début du contenu
      return content.substring(0, excerptLength) + (content.length > excerptLength ? '...' : '');
    }
    
    // Calculer la position de départ de l'extrait
    let start = Math.max(0, bestPosition - Math.floor(excerptLength / 3));
    let end = Math.min(content.length, start + excerptLength);
    
    // Ajuster pour ne pas couper les mots
    if (start > 0) {
      const prevSpace = content.lastIndexOf(' ', start);
      if (prevSpace !== -1 && prevSpace > bestPosition - excerptLength) {
        start = prevSpace + 1;
      }
    }
    
    if (end < content.length) {
      const nextSpace = content.indexOf(' ', end);
      if (nextSpace !== -1 && nextSpace < start + excerptLength + 50) {
        end = nextSpace;
      }
    }
    
    let excerpt = content.substring(start, end);
    if (start > 0) excerpt = '...' + excerpt;
    if (end < content.length) excerpt += '...';
    
    // Mettre en évidence les tokens trouvés
    tokens.forEach(token => {
      const regex = new RegExp('(' + this.escapeRegExp(token) + ')', 'gi');
      excerpt = excerpt.replace(regex, '<mark>$1</mark>');
    });
    
    return excerpt;
  }

  /**
   * Ajoute une recherche à l'historique
   */
  addToSearchHistory(query, resultCount) {
    const entry = {
      query: query,
      resultCount: resultCount,
      timestamp: new Date().toISOString(),
      id: Date.now() + Math.random().toString(36).substr(2, 9)
    };
    
    this.searchHistory.unshift(entry);
    
    // Limiter la taille de l'historique
    if (this.searchHistory.length > this.maxHistorySize) {
      this.searchHistory = this.searchHistory.slice(0, this.maxHistorySize);
    }
    
    // Sauvegarder dans le stockage local
    this.saveSearchData();
  }

  /**
   * Sauvegarde les données de recherche dans le stockage local
   */
  saveSearchData() {
    try {
      localStorage.setItem('tedsai_search_history', JSON.stringify(this.searchHistory));
    } catch (e) {
      console.warn('Impossible de sauvegarder l\'historique de recherche:', e);
    }
  }

  /**
   * Charge les données de recherche depuis le stockage local
   */
  loadSearchData() {
    try {
      const saved = localStorage.getItem('tedsai_search_history');
      if (saved) {
        this.searchHistory = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Impossible de charger l\'historique de recherche:', e);
    }
  }

  /**
   * Récupère l'historique des recherches
   */
  getSearchHistory(limit = 10) {
    return this.searchHistory.slice(0, limit);
  }

  /**
   * Efface l'historique des recherches
   */
  clearSearchHistory() {
    this.searchHistory = [];
    this.searchCache.clear();
    try {
      localStorage.removeItem('tedsai_search_history');
    } catch (e) {
      console.warn('Impossible de supprimer l\'historique de recherche:', e);
    }
  }

  /**
   * Indexe un document spécifique
   */
  addDocument(url, title, content, metadata = {}) {
    const doc = {
      url: url,
      title: title,
      headings: metadata.headings || [],
      content: content,
      paragraphs: metadata.paragraphs || [],
      links: metadata.links || [],
      createdAt: new Date().toISOString(),
      ...metadata
    };
    
    this.index.set(url, doc);
  }

  /**
   * Supprime un document de l'index
   */
  removeDocument(url) {
    this.index.delete(url);
  }

  /**
   * Met à jour un document dans l'index
   */
  updateDocument(url, updates) {
    if (this.index.has(url)) {
      const doc = this.index.get(url);
      Object.assign(doc, updates, { updatedAt: new Date().toISOString() });
      this.index.set(url, doc);
    }
  }

  /**
   * Récupère les suggestions de recherche
   */
  getSuggestions(query, limit = 5) {
    if (!query) return [];
    
    const lowerQuery = query.toLowerCase();
    const suggestions = [];
    
    // Chercher dans les titres
    for (const [, doc] of this.index.entries()) {
      if (doc.title && doc.title.toLowerCase().includes(lowerQuery)) {
        suggestions.push({
          text: doc.title,
          url: doc.url,
          type: 'title'
        });
      }
      
      // Chercher dans les titres de section
      if (doc.headings) {
        doc.headings.forEach(heading => {
          if (heading.toLowerCase().includes(lowerQuery)) {
            suggestions.push({
              text: heading,
              url: doc.url,
              type: 'heading'
            });
          }
        });
      }
    }
    
    // Retirer les doublons et limiter
    const uniqueSuggestions = [...new Map(suggestions.map(s => [s.text, s])).values()];
    return uniqueSuggestions.slice(0, limit);
  }

  /**
   * Effectue une recherche avancée avec filtres
   */
  advancedSearch(query, filters = {}) {
    const basicResults = this.search(query);
    
    let filteredResults = basicResults.results;
    
    // Filtrer par date
    if (filters.dateFrom) {
      const dateFrom = new Date(filters.dateFrom);
      filteredResults = filteredResults.filter(r => new Date(r.lastUpdated) >= dateFrom);
    }
    
    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo);
      filteredResults = filteredResults.filter(r => new Date(r.lastUpdated) <= dateTo);
    }
    
    // Filtrer par type de contenu
    if (filters.types && filters.types.length > 0) {
      // Cette fonctionnalité nécessiterait des métadonnées supplémentaires
      // Pour l'instant, nous retournons les résultats filtrés
    }
    
    // Appliquer les limites
    if (filters.offset !== undefined) {
      filteredResults = filteredResults.slice(filters.offset);
    }
    
    if (filters.limit !== undefined) {
      filteredResults = filteredResults.slice(0, filters.limit);
    }
    
    return {
      results: filteredResults,
      query: basicResults.query,
      took: basicResults.took,
      totalResults: filteredResults.length
    };
  }
}

// Initialiser le moteur de recherche
const searchEngine = new SearchEngine();

// Fonction utilitaire pour effectuer une recherche
function performSearch(query, options = {}) {
  return searchEngine.search(query, options);
}

// Fonction utilitaire pour obtenir des suggestions
function getSuggestions(query, limit = 5) {
  return searchEngine.getSuggestions(query, limit);
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SearchEngine, searchEngine, performSearch, getSuggestions };
} else {
  window.TedAPI = window.TedAPI || {};
  window.TedAPI.SearchEngine = searchEngine;
  window.TedAPI.performSearch = performSearch;
  window.TedAPI.getSuggestions = getSuggestions;
}

// Ajouter les styles CSS nécessaires pour les résultats de recherche
const style = document.createElement('style');
style.textContent = `
  /* Styles pour les résultats de recherche */
  .search-results-container {
    position: fixed;
    top: 100px;
    right: 20px;
    width: 400px;
    max-height: 70vh;
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    z-index: 10000;
    overflow-y: auto;
    display: none;
    padding: 20px;
  }
  
  .search-result-item {
    padding: 12px 0;
    border-bottom: 1px solid #eee;
  }
  
  .search-result-item:last-child {
    border-bottom: none;
  }
  
  .search-result-title {
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 4px;
    font-size: 16px;
  }
  
  .search-result-excerpt {
    color: #7f8c8d;
    font-size: 14px;
    line-height: 1.4;
  }
  
  .search-result-excerpt mark {
    background: #f1c40f;
    padding: 0 2px;
    font-weight: bold;
  }
  
  .search-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-top: none;
    border-radius: 0 0 4px 4px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    display: none;
  }
  
  .search-suggestion-item {
    padding: 10px 15px;
    cursor: pointer;
    border-bottom: 1px solid #f5f5f5;
  }
  
  .search-suggestion-item:hover {
    background-color: #f8f9fa;
  }
  
  .search-suggestion-item:last-child {
    border-bottom: none;
  }
  
  .search-history-item {
    padding: 8px 0;
    border-bottom: 1px solid #eee;
    font-size: 14px;
  }
  
  .search-history-item:last-child {
    border-bottom: none;
  }
  
  .search-stats {
    font-size: 12px;
    color: #95a5a6;
    margin-top: 5px;
  }
  
  @media (max-width: 768px) {
    .search-results-container {
      width: calc(100% - 40px);
      left: 20px;
      right: 20px;
      top: 80px;
    }
  }
`;
document.head.appendChild(style);
