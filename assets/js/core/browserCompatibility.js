/**
 * Module d'amélioration de la compatibilité avec les navigateurs anciens pour TEDSAI
 * Ce module fournit des polyfills et des ajustements pour assurer la compatibilité
 */

class BrowserCompatibility {
  constructor() {
    this.polyfills = {
      fetch: false,
      promises: false,
      es6: false,
      css: false
    };
    
    this.browserInfo = this.detectBrowser();
    this.features = {};
    
    this.init();
  }

  /**
   * Initialise le module de compatibilité
   */
  init() {
    // Détecter les fonctionnalités manquantes
    this.detectMissingFeatures();
    
    // Charger les polyfills nécessaires
    this.loadRequiredPolyfills();
    
    // Appliquer les ajustements de compatibilité
    this.applyCompatibilityAdjustments();
    
    // Vérifier la compatibilité
    this.checkCompatibility();
  }

  /**
   * Détecte le navigateur et ses capacités
   */
  detectBrowser() {
    const ua = navigator.userAgent;
    const browserInfo = {
      name: 'Unknown',
      version: '0',
      isSupported: true,
      features: {}
    };
    
    // Détecter le navigateur
    if (ua.indexOf('Firefox') > -1) {
      browserInfo.name = 'Firefox';
      browserInfo.version = ua.match(/Firefox\/(\d+)/)?.[1] || '0';
    } else if (ua.indexOf('Chrome') > -1) {
      browserInfo.name = 'Chrome';
      browserInfo.version = ua.match(/Chrome\/(\d+)/)?.[1] || '0';
    } else if (ua.indexOf('Safari') > -1) {
      browserInfo.name = 'Safari';
      browserInfo.version = ua.match(/Version\/(\d+)/)?.[1] || '0';
    } else if (ua.indexOf('Edge') > -1) {
      browserInfo.name = 'Edge';
      browserInfo.version = ua.match(/Edge\/(\d+)/)?.[1] || '0';
    } else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) {
      browserInfo.name = 'Internet Explorer';
      browserInfo.version = ua.match(/(?:MSIE |rv:)(\d+)/)?.[1] || '0';
      browserInfo.isSupported = parseInt(browserInfo.version) >= 11;
    }
    
    return browserInfo;
  }

  /**
   * Détecte les fonctionnalités manquantes
   */
  detectMissingFeatures() {
    // Vérifier les fonctionnalités ES6+
    this.features.arrowFunctions = typeof (() => {}) === 'function';
    this.features.promises = typeof Promise !== 'undefined';
    this.features.fetch = typeof fetch !== 'undefined';
    this.features.asyncAwait = this.testAsyncAwait();
    this.features.modules = typeof import !== 'undefined';
    this.features.classes = this.testClasses();
    this.features.spreadOperator = this.testSpreadOperator();
    this.features.templateLiterals = this.testTemplateLiterals();
    
    // Vérifier les fonctionnalités DOM
    this.features.customElements = 'customElements' in window;
    this.features.shadowDom = 'attachShadow' in Element.prototype;
    this.features.webComponents = this.features.customElements && this.features.shadowDom;
    
    // Vérifier les fonctionnalités CSS
    this.features.flexbox = this.testCSSFeature('display', 'flex');
    this.features.grid = this.testCSSFeature('display', 'grid');
    this.features.cssVariables = this.testCSSFeature('color', 'var(--test)');
    this.features.mediaQueries = this.testMediaQuery();
    
    // Vérifier les fonctionnalités de stockage
    this.features.localStorage = typeof Storage !== 'undefined' && 'localStorage' in window;
    this.features.indexedDB = 'indexedDB' in window;
    this.features.webWorkers = 'Worker' in window;
    this.features.serviceWorkers = 'serviceWorker' in navigator;
    
    // Vérifier les fonctionnalités de sécurité
    this.features.crypto = 'crypto' in window;
    this.features.subtleCrypto = 'subtle' in (window.crypto || {});
    this.features.csp = this.testCSP();
  }

  /**
   * Teste la prise en charge d'async/await
   */
  testAsyncAwait() {
    try {
      // Créer une fonction async pour tester
      new Function('return async function() {}')();
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Teste la prise en charge des classes ES6
   */
  testClasses() {
    try {
      // Créer une classe pour tester
      new Function('class TestClass {}')();
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Teste la prise en charge de l'opérateur spread
   */
  testSpreadOperator() {
    try {
      // Tester l'opérateur spread
      new Function('return [...[1, 2, 3]].length === 3')();
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Teste la prise en charge des template literals
   */
  testTemplateLiterals() {
    try {
      // Tester les template literals
      return new Function('return `test` === "test"')();
    } catch (e) {
      return false;
    }
  }

  /**
   * Teste la prise en charge d'une fonctionnalité CSS
   */
  testCSSFeature(property, value) {
    const testElement = document.createElement('div');
    testElement.style[property] = value;
    return testElement.style[property] === value;
  }

  /**
   * Teste la prise en charge des media queries
   */
  testMediaQuery() {
    return window.matchMedia && window.matchMedia('(min-width: 1px)').matches;
  }

  /**
   * Teste la prise en charge de CSP (Content Security Policy)
   */
  testCSP() {
    // Vérifier si CSP est pris en charge
    return document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null ||
           document.querySelector('meta[http-equiv="content-security-policy"]') !== null;
  }

  /**
   * Charge les polyfills nécessaires
   */
  loadRequiredPolyfills() {
    // Charger fetch polyfill si nécessaire
    if (!this.features.fetch) {
      this.loadFetchPolyfill();
      this.polyfills.fetch = true;
    }
    
    // Charger Promise polyfill si nécessaire
    if (!this.features.promises) {
      this.loadPromisePolyfill();
      this.polyfills.promises = true;
    }
    
    // Charger les polyfills ES6+ si nécessaire
    if (!this.features.arrowFunctions || !this.features.classes || !this.features.spreadOperator) {
      this.loadES6Polyfill();
      this.polyfills.es6 = true;
    }
    
    // Charger les ajustements CSS si nécessaire
    if (!this.features.flexbox || !this.features.grid || !this.features.cssVariables) {
      this.loadCSSPolyfill();
      this.polyfills.css = true;
    }
  }

  /**
   * Charge le polyfill pour fetch
   */
  loadFetchPolyfill() {
    if (typeof fetch === 'undefined') {
      // Implémentation simplifiée de fetch
      window.fetch = function(url, options = {}) {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          
          xhr.open(options.method || 'GET', url);
          
          // Définir les en-têtes
          if (options.headers) {
            for (const [key, value] of Object.entries(options.headers)) {
              xhr.setRequestHeader(key, value);
            }
          }
          
          xhr.onload = function() {
            resolve({
              ok: xhr.status >= 200 && xhr.status < 300,
              status: xhr.status,
              statusText: xhr.statusText,
              text: () => Promise.resolve(xhr.responseText),
              json: () => Promise.resolve(JSON.parse(xhr.responseText)),
              headers: {
                get: (name) => xhr.getResponseHeader(name)
              }
            });
          };
          
          xhr.onerror = function() {
            reject(new TypeError('Network request failed'));
          };
          
          xhr.send(options.body || null);
        });
      };
    }
  }

  /**
   * Charge le polyfill pour les Promises
   */
  loadPromisePolyfill() {
    if (typeof Promise === 'undefined') {
      // Implémentation simplifiée de Promise
      window.Promise = function(executor) {
        const self = this;
        self.state = 'pending';
        self.value = undefined;
        self.handlers = [];
        
        function resolve(value) {
          if (self.state === 'pending') {
            self.state = 'fulfilled';
            self.value = value;
            self.handlers.forEach(handle);
            self.handlers = [];
          }
        }
        
        function reject(reason) {
          if (self.state === 'pending') {
            self.state = 'rejected';
            self.value = reason;
            self.handlers.forEach(handle);
            self.handlers = [];
          }
        }
        
        try {
          executor(resolve, reject);
        } catch (e) {
          reject(e);
        }
        
        function handle(handler) {
          if (self.state === 'pending') {
            self.handlers.push(handler);
          } else {
            if (self.state === 'fulfilled' && typeof handler.onFulfilled === 'function') {
              handler.onFulfilled(self.value);
            }
            if (self.state === 'rejected' && typeof handler.onRejected === 'function') {
              handler.onRejected(self.value);
            }
          }
        }
        
        this.then = function(onFulfilled, onRejected) {
          return new Promise(function(resolve, reject) {
            handle({
              onFulfilled: function(result) {
                try {
                  const returnValue = onFulfilled ? onFulfilled(result) : result;
                  resolve(returnValue);
                } catch (e) {
                  reject(e);
                }
              },
              onRejected: function(error) {
                try {
                  const returnValue = onRejected ? onRejected(error) : error;
                  resolve(returnValue);
                } catch (e) {
                  reject(e);
                }
              }
            });
          });
        };
      };
    }
  }

  /**
   * Charge le polyfill pour ES6+
   */
  loadES6Polyfill() {
    // Polyfill pour Object.assign
    if (typeof Object.assign !== 'function') {
      Object.assign = function(target) {
        if (target == null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }
        
        const to = Object(target);
        
        for (let index = 1; index < arguments.length; index++) {
          const nextSource = arguments[index];
          
          if (nextSource != null) {
            for (const nextKey in nextSource) {
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      };
    }
    
    // Polyfill pour Array.includes
    if (!Array.prototype.includes) {
      Array.prototype.includes = function(searchElement, fromIndex) {
        const o = Object(this);
        const len = parseInt(o.length) || 0;
        
        if (len === 0) return false;
        
        const n = fromIndex || 0;
        let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        
        while (k < len) {
          if (k in o && o[k] === searchElement) {
            return true;
          }
          k++;
        }
        return false;
      };
    }
    
    // Polyfill pour String.includes
    if (!String.prototype.includes) {
      String.prototype.includes = function(search, start) {
        'use strict';
        if (typeof start !== 'number') {
          start = 0;
        }
        
        if (start + search.length > this.length) {
          return false;
        } else {
          return this.indexOf(search, start) !== -1;
        }
      };
    }
  }

  /**
   * Charge les ajustements CSS
   */
  loadCSSPolyfill() {
    // Ajouter des classes pour la détection des fonctionnalités CSS
    const html = document.documentElement;
    
    if (!this.features.flexbox) {
      html.classList.add('no-flexbox');
    } else {
      html.classList.add('flexbox');
    }
    
    if (!this.features.grid) {
      html.classList.add('no-grid');
    } else {
      html.classList.add('grid');
    }
    
    if (!this.features.cssVariables) {
      html.classList.add('no-cssvariables');
    } else {
      html.classList.add('cssvariables');
    }
    
    // Charger les styles alternatifs pour les navigateurs anciens
    this.loadAlternativeStyles();
  }

  /**
   * Charge les styles alternatifs pour les navigateurs anciens
   */
  loadAlternativeStyles() {
    // Créer une feuille de style pour les ajustements de compatibilité
    const style = document.createElement('style');
    style.id = 'compatibility-styles';
    style.textContent = `
      /* Ajustements pour les navigateurs sans flexbox */
      .no-flexbox .flex-container {
        display: block !important;
      }
      
      .no-flexbox .flex-item {
        float: left;
        display: inline-block;
      }
      
      /* Ajustements pour les navigateurs sans grid */
      .no-grid .grid-container {
        display: block !important;
      }
      
      .no-grid .grid-item {
        float: left;
        display: inline-block;
      }
      
      /* Ajustements pour les navigateurs sans variables CSS */
      .no-cssvariables {
        /* Définir des valeurs par défaut pour les propriétés CSS importantes */
        color: #333;
        background-color: #fff;
      }
      
      /* Ajustements pour IE spécifique */
      .ie-specific {
        /* Styles spécifiques pour IE */
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Applique les ajustements de compatibilité
   */
  applyCompatibilityAdjustments() {
    // Ajouter des classes au HTML pour la détection du navigateur
    const html = document.documentElement;
    html.classList.add(`browser-${this.browserInfo.name.toLowerCase()}`);
    html.classList.add(`browser-version-${this.browserInfo.version}`);
    
    if (!this.browserInfo.isSupported) {
      html.classList.add('unsupported-browser');
      this.showBrowserWarning();
    }
    
    // Ajuster les fonctionnalités selon la prise en charge
    this.adjustFunctionality();
  }

  /**
   * Ajuste les fonctionnalités selon la prise en charge du navigateur
   */
  adjustFunctionality() {
    // Désactiver les fonctionnalités non prises en charge
    if (!this.features.serviceWorkers) {
      // Désactiver les fonctionnalités liées aux service workers
      if (window.tedFirebase) {
        window.tedFirebase.offlineEnabled = false;
      }
    }
    
    if (!this.features.indexedDB) {
      // Utiliser localStorage comme solution de repli
      if (window.TedDB) {
        window.TedDB.fallbackToLocalStorage = true;
      }
    }
    
    if (!this.features.crypto) {
      // Désactiver les fonctionnalités de sécurité avancées
      if (window.TedAPI && window.TedAPI.SecurityManager) {
        window.TedAPI.SecurityManager.advancedEncryption = false;
      }
    }
  }

  /**
   * Affiche un avertissement pour les navigateurs non supportés
   */
  showBrowserWarning() {
    const warning = document.createElement('div');
    warning.id = 'browser-warning';
    warning.className = 'browser-warning unsupported-browser-message';
    warning.innerHTML = `
      <div class="warning-content">
        <h3>Navigateur non supporté</h3>
        <p>Vous utilisez une version ancienne de ${this.browserInfo.name} qui n'est plus supportée.</p>
        <p>Pour une meilleure expérience, veuillez mettre à jour votre navigateur ou utiliser un navigateur moderne.</p>
        <div class="browser-suggestions">
          <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer">Chrome</a>
          <a href="https://www.mozilla.org/firefox/" target="_blank" rel="noopener noreferrer">Firefox</a>
          <a href="https://www.microsoft.com/edge" target="_blank" rel="noopener noreferrer">Edge</a>
        </div>
        <button class="dismiss-warning" onclick="this.parentElement.parentElement.remove()">Fermer</button>
      </div>
    `;
    
    // Ajouter un peu de style
    warning.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #f8d7da;
      color: #721c24;
      padding: 15px;
      text-align: center;
      z-index: 10000;
      font-family: Arial, sans-serif;
    `;
    
    document.body.insertBefore(warning, document.body.firstChild);
  }

  /**
   * Vérifie la compatibilité et affiche un rapport
   */
  checkCompatibility() {
    const report = {
      browser: this.browserInfo,
      features: this.features,
      polyfills: this.polyfills,
      overallCompatibility: this.calculateCompatibilityScore(),
      recommendations: this.getCompatibilityRecommendations()
    };
    
    console.log('Rapport de compatibilité navigateur:', report);
    
    // Sauvegarder le rapport dans les données de session
    sessionStorage.setItem('tedsai_browser_compatibility_report', JSON.stringify(report));
    
    return report;
  }

  /**
   * Calcule le score de compatibilité
   */
  calculateCompatibilityScore() {
    let score = 0;
    let total = 0;
    
    // Évaluer chaque fonctionnalité
    for (const [feature, supported] of Object.entries(this.features)) {
      total++;
      if (supported) score++;
    }
    
    return Math.round((score / total) * 100);
  }

  /**
   * Obtient les recommandations de compatibilité
   */
  getCompatibilityRecommendations() {
    const recommendations = [];
    
    if (!this.browserInfo.isSupported) {
      recommendations.push({
        priority: 'high',
        message: 'Mettre à jour votre navigateur pour une meilleure expérience',
        action: 'update-browser'
      });
    }
    
    if (!this.features.fetch) {
      recommendations.push({
        priority: 'medium',
        message: 'Le navigateur ne supporte pas fetch API, polyfill chargé',
        action: 'polyfill-loaded'
      });
    }
    
    if (!this.features.promises) {
      recommendations.push({
        priority: 'medium',
        message: 'Le navigateur ne supporte pas les Promises, polyfill chargé',
        action: 'polyfill-loaded'
      });
    }
    
    if (!this.features.serviceWorkers) {
      recommendations.push({
        priority: 'low',
        message: 'Fonctionnalités hors-ligne limitées',
        action: 'offline-limitations'
      });
    }
    
    return recommendations;
  }

  /**
   * Force le chargement d'un polyfill spécifique
   */
  forceLoadPolyfill(polyfillType) {
    switch (polyfillType) {
      case 'fetch':
        this.loadFetchPolyfill();
        break;
      case 'promises':
        this.loadPromisePolyfill();
        break;
      case 'es6':
        this.loadES6Polyfill();
        break;
      case 'css':
        this.loadCSSPolyfill();
        break;
      default:
        console.warn(`Polyfill non reconnu: ${polyfillType}`);
    }
  }

  /**
   * Vérifie si une fonctionnalité spécifique est supportée
   */
  isFeatureSupported(feature) {
    return this.features[feature] === true;
  }

  /**
   * Obtient les informations de compatibilité
   */
  getCompatibilityInfo() {
    return {
      browserInfo: this.browserInfo,
      features: this.features,
      polyfillsLoaded: this.polyfills,
      compatibilityScore: this.calculateCompatibilityScore()
    };
  }

  /**
   * Exporte les données de compatibilité
   */
  exportCompatibilityData() {
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      browserInfo: this.browserInfo,
      features: this.features,
      polyfills: this.polyfills,
      compatibilityReport: this.checkCompatibility()
    };
  }

  /**
   * Applique des ajustements spécifiques pour IE
   */
  applyIESpecificAdjustments() {
    if (this.browserInfo.name === 'Internet Explorer' && parseInt(this.browserInfo.version) < 11) {
      // Ajustements spécifiques pour IE < 11
      const ieStyle = document.createElement('style');
      ieStyle.textContent = `
        /* Ajustements pour IE */
        .modern-feature {
          display: none;
        }
        
        .legacy-fallback {
          display: block;
        }
        
        /* Correction des problèmes de box-sizing */
        *, *:before, *:after {
          box-sizing: border-box;
        }
        
        /* Correction des problèmes de positionnement */
        .fixed-position {
          position: absolute;
        }
      `;
      
      document.head.appendChild(ieStyle);
    }
  }
}

// Initialiser le module de compatibilité navigateur
const browserCompatibility = new BrowserCompatibility();

// Fonctions utilitaires pour l'extérieur
function checkBrowserCompatibility() {
  return browserCompatibility.checkCompatibility();
}

function getCompatibilityInfo() {
  return browserCompatibility.getCompatibilityInfo();
}

function isFeatureSupported(feature) {
  return browserCompatibility.isFeatureSupported(feature);
}

function forceLoadPolyfill(polyfillType) {
  return browserCompatibility.forceLoadPolyfill(polyfillType);
}

function calculateCompatibilityScore() {
  return browserCompatibility.calculateCompatibilityScore();
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    BrowserCompatibility, 
    browserCompatibility, 
    checkBrowserCompatibility,
    getCompatibilityInfo,
    isFeatureSupported,
    forceLoadPolyfill,
    calculateCompatibilityScore
  };
} else {
  window.TedAPI = window.TedAPI || {};
  window.TedAPI.BrowserCompatibility = browserCompatibility;
  window.TedAPI.checkBrowserCompatibility = checkBrowserCompatibility;
  window.TedAPI.getCompatibilityInfo = getCompatibilityInfo;
  window.TedAPI.isFeatureSupported = isFeatureSupported;
  window.TedAPI.forceLoadPolyfill = forceLoadPolyfill;
  window.TedAPI.calculateCompatibilityScore = calculateCompatibilityScore;
}