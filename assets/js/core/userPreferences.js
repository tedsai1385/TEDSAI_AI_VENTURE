/**
 * Système de préférences utilisateur pour TEDSAI
 * Ce module gère la personnalisation de l'expérience utilisateur
 */

class UserPreferences {
  constructor() {
    this.preferences = {};
    this.defaultPreferences = {
      theme: 'light', // 'light', 'dark', 'auto'
      language: 'fr-FR',
      fontSize: 'medium', // 'small', 'medium', 'large'
      contrast: 'normal', // 'normal', 'high'
      animations: true,
      notifications: true,
      newsletter: false,
      privacyLevel: 'standard', // 'standard', 'strict'
      homeSections: ['hero', 'choices', 'observatory'],
      dashboardLayout: 'grid', // 'grid', 'list', 'compact'
      accessibility: {
        screenReader: false,
        keyboardNavigation: true,
        reducedMotion: false,
        highContrast: false
      }
    };
    
    this.init();
  }

  /**
   * Initialise le système de préférences
   */
  async init() {
    // Charger les préférences sauvegardées
    this.loadPreferences();
    
    // Appliquer les préférences au chargement
    this.applyPreferences();
    
    // Écouter les changements de préférences système
    this.setupSystemPreferenceListeners();
  }

  /**
   * Charge les préférences depuis le stockage local
   */
  loadPreferences() {
    try {
      const savedPrefs = localStorage.getItem('tedsai_user_preferences');
      if (savedPrefs) {
        this.preferences = { ...this.defaultPreferences, ...JSON.parse(savedPrefs) };
      } else {
        this.preferences = { ...this.defaultPreferences };
      }
    } catch (e) {
      console.warn('Impossible de charger les préférences utilisateur:', e);
      this.preferences = { ...this.defaultPreferences };
    }
  }

  /**
   * Sauvegarde les préférences dans le stockage local
   */
  savePreferences() {
    try {
      localStorage.setItem('tedsai_user_preferences', JSON.stringify(this.preferences));
    } catch (e) {
      console.error('Impossible de sauvegarder les préférences utilisateur:', e);
    }
  }

  /**
   * Met à jour une préférence spécifique
   */
  updatePreference(key, value) {
    // Vérifier si la clé existe dans les préférences par défaut
    if (!(key in this.defaultPreferences) && !this.isNestedKey(key)) {
      console.warn(`Clé de préférence inconnue: ${key}`);
      return false;
    }
    
    // Mettre à jour la préférence
    this.setNestedProperty(this.preferences, key, value);
    
    // Sauvegarder les préférences
    this.savePreferences();
    
    // Appliquer immédiatement la préférence si nécessaire
    this.applySpecificPreference(key, value);
    
    return true;
  }

  /**
   * Vérifie si une clé est imbriquée (ex: 'accessibility.screenReader')
   */
  isNestedKey(key) {
    return key.includes('.');
  }

  /**
   * Définit une propriété imbriquée
   */
  setNestedProperty(obj, key, value) {
    const keys = key.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
  }

  /**
   * Obtient une préférence spécifique
   */
  getPreference(key) {
    return this.getNestedProperty(this.preferences, key);
  }

  /**
   * Obtient une propriété imbriquée
   */
  getNestedProperty(obj, key) {
    const keys = key.split('.');
    let current = obj;
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return undefined;
      }
    }
    
    return current;
  }

  /**
   * Applique toutes les préférences à l'interface
   */
  applyPreferences() {
    // Appliquer le thème
    this.applyTheme();
    
    // Appliquer la langue
    this.applyLanguage();
    
    // Appliquer la taille de police
    this.applyFontSize();
    
    // Appliquer le contraste
    this.applyContrast();
    
    // Appliquer les animations
    this.applyAnimations();
    
    // Appliquer les paramètres d'accessibilité
    this.applyAccessibilitySettings();
    
    // Émettre un événement pour notifier les autres modules
    this.dispatchPreferencesEvent();
  }

  /**
   * Applique une préférence spécifique
   */
  applySpecificPreference(key, value) {
    switch (key) {
      case 'theme':
        this.applyTheme();
        break;
      case 'language':
        this.applyLanguage();
        break;
      case 'fontSize':
        this.applyFontSize();
        break;
      case 'contrast':
        this.applyContrast();
        break;
      case 'animations':
        this.applyAnimations();
        break;
      case 'accessibility.reducedMotion':
      case 'accessibility.highContrast':
      case 'accessibility.screenReader':
      case 'accessibility.keyboardNavigation':
        this.applyAccessibilitySettings();
        break;
      default:
        // Pour les autres préférences, émettre simplement l'événement
        this.dispatchPreferencesEvent();
    }
  }

  /**
   * Applique le thème (clair/sombre)
   */
  applyTheme() {
    const theme = this.getPreference('theme');
    const html = document.documentElement;
    
    // Retirer les classes de thème précédentes
    html.classList.remove('theme-light', 'theme-dark', 'theme-auto');
    
    // Déterminer le thème réel à appliquer
    let actualTheme = theme;
    if (theme === 'auto') {
      actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // Appliquer la classe de thème
    html.classList.add(`theme-${actualTheme}`);
    
    // Appliquer les variables CSS correspondantes
    this.setThemeVariables(actualTheme);
  }

  /**
   * Définit les variables CSS pour un thème spécifique
   */
  setThemeVariables(theme) {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.style.setProperty('--color-primary', '#5AA9E6');
      root.style.setProperty('--color-secondary', '#8B1E3F');
      root.style.setProperty('--color-background', '#1a1a1a');
      root.style.setProperty('--color-surface', '#2d2d2d');
      root.style.setProperty('--color-on-background', '#ffffff');
      root.style.setProperty('--color-on-surface', '#e0e0e0');
      root.style.setProperty('--color-border', '#444');
    } else {
      root.style.setProperty('--color-primary', '#0A2463');
      root.style.setProperty('--color-secondary', '#8B1E3F');
      root.style.setProperty('--color-background', '#ffffff');
      root.style.setProperty('--color-surface', '#f8f9fa');
      root.style.setProperty('--color-on-background', '#000000');
      root.style.setProperty('--color-on-surface', '#333333');
      root.style.setProperty('--color-border', '#ddd');
    }
  }

  /**
   * Applique la langue
   */
  applyLanguage() {
    const language = this.getPreference('language');
    document.documentElement.lang = language;
    
    // Charger dynamiquement les traductions si nécessaire
    this.loadTranslations(language);
  }

  /**
   * Charge les traductions pour une langue spécifique
   */
  async loadTranslations(language) {
    // Cette méthode chargerait dynamiquement les traductions
    // Pour l'instant, nous allons juste établir un mécanisme de base
    try {
      // Charger les traductions depuis un fichier ou une API
      // Exemple: const translations = await fetchTranslations(language);
      // this.translations = translations;
      
      // Pour l'instant, on émet un événement pour que d'autres modules puissent réagir
      const event = new CustomEvent('languageChanged', { detail: { language } });
      document.dispatchEvent(event);
    } catch (e) {
      console.warn('Impossible de charger les traductions:', e);
    }
  }

  /**
   * Applique la taille de police
   */
  applyFontSize() {
    const fontSize = this.getPreference('fontSize');
    const root = document.documentElement;
    
    // Retirer les classes de taille précédentes
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    
    // Appliquer la nouvelle classe
    root.classList.add(`font-size-${fontSize}`);
    
    // Définir les tailles relatives
    switch (fontSize) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
      case 'medium':
      default:
        root.style.fontSize = '16px';
    }
  }

  /**
   * Applique le contraste
   */
  applyContrast() {
    const contrast = this.getPreference('contrast');
    const html = document.documentElement;
    
    // Retirer les classes de contraste précédentes
    html.classList.remove('contrast-normal', 'contrast-high');
    
    // Appliquer la nouvelle classe
    html.classList.add(`contrast-${contrast}`);
    
    // Ajuster les variables CSS pour le contraste
    if (contrast === 'high') {
      html.style.setProperty('--contrast-ratio', '7:1');
      html.style.setProperty('--focus-outline', '3px solid #000');
    } else {
      html.style.setProperty('--contrast-ratio', '4.5:1');
      html.style.setProperty('--focus-outline', '2px solid #0A2463');
    }
  }

  /**
   * Applique les animations
   */
  applyAnimations() {
    const animationsEnabled = this.getPreference('animations');
    const html = document.documentElement;
    
    if (!animationsEnabled) {
      html.classList.add('disable-animations');
      // Désactiver les animations CSS
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
    } else {
      html.classList.remove('disable-animations');
      // Retirer le style de désactivation des animations s'il existe
      const existingStyles = document.querySelectorAll('style');
      existingStyles.forEach(style => {
        if (style.textContent.includes('animation-duration: 0.01ms')) {
          style.remove();
        }
      });
    }
  }

  /**
   * Applique les paramètres d'accessibilité
   */
  applyAccessibilitySettings() {
    const accessibility = this.getPreference('accessibility');
    
    // Réduire les animations
    if (accessibility.reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    
    // Contraste élevé
    if (accessibility.highContrast) {
      document.documentElement.classList.add('high-contrast');
      // Ajouter des styles de contraste élevé
      const style = document.createElement('style');
      style.textContent = `
        * {
          background-color: #000 !important;
          color: #fff !important;
          border-color: #fff !important;
        }
        a, button {
          color: #ffff00 !important;
        }
      `;
      document.head.appendChild(style);
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Activer la navigation clavier
    if (accessibility.keyboardNavigation) {
      document.documentElement.classList.add('keyboard-navigation');
      // Ajouter des styles pour les indicateurs de focus
      const style = document.createElement('style');
      style.textContent = `
        *:focus {
          outline: var(--focus-outline, 2px solid #0A2463) !important;
          outline-offset: 2px;
        }
      `;
      document.head.appendChild(style);
    } else {
      document.documentElement.classList.remove('keyboard-navigation');
    }
  }

  /**
   * Configure les écouteurs pour les préférences système
   */
  setupSystemPreferenceListeners() {
    // Écouter les changements de thème système
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.getPreference('theme') === 'auto') {
        this.applyTheme();
      }
    });
    
    // Écouter les changements de préférence de réduction des motions
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      if (e.matches) {
        // L'utilisateur préfère des motions réduites
        this.updatePreference('accessibility.reducedMotion', true);
      }
    });
  }

  /**
   * Émet un événement de changement de préférences
   */
  dispatchPreferencesEvent() {
    const event = new CustomEvent('userPreferencesChanged', { 
      detail: { preferences: { ...this.preferences } } 
    });
    document.dispatchEvent(event);
  }

  /**
   * Réinitialise les préférences à leurs valeurs par défaut
   */
  resetPreferences() {
    this.preferences = { ...this.defaultPreferences };
    this.savePreferences();
    this.applyPreferences();
  }

  /**
   * Exporte les préférences pour sauvegarde externe
   */
  exportPreferences() {
    return {
      version: '1.0',
      timestamp: new Date().toISOString(),
      preferences: { ...this.preferences }
    };
  }

  /**
   * Importe des préférences depuis une sauvegarde externe
   */
  importPreferences(importedData) {
    if (!importedData || !importedData.preferences) {
      throw new Error('Données de préférences invalides');
    }
    
    // Fusionner les préférences importées avec les valeurs par défaut
    this.preferences = { ...this.defaultPreferences, ...importedData.preferences };
    this.savePreferences();
    this.applyPreferences();
  }

  /**
   * Obtient les préférences utilisateur
   */
  getPreferences() {
    return { ...this.preferences };
  }

  /**
   * Synchronise les préférences avec un service distant (si authentifié)
   */
  async syncWithServer() {
    // Cette méthode synchroniserait les préférences avec un serveur
    // Pour l'instant, nous retournons une promesse résolue
    return Promise.resolve(true);
  }

  /**
   * Charge les préférences depuis un service distant (si authentifié)
   */
  async loadFromServer() {
    // Cette méthode chargerait les préférences depuis un serveur
    // Pour l'instant, nous retournons une promesse résolue
    return Promise.resolve(this.preferences);
  }
}

// Initialiser le système de préférences utilisateur
const userPreferences = new UserPreferences();

// Fonction utilitaire pour accéder aux préférences
function getUserPreference(key) {
  return userPreferences.getPreference(key);
}

function setUserPreference(key, value) {
  return userPreferences.updatePreference(key, value);
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    UserPreferences, 
    userPreferences, 
    getUserPreference, 
    setUserPreference 
  };
} else {
  window.TedAPI = window.TedAPI || {};
  window.TedAPI.UserPreferences = userPreferences;
  window.TedAPI.getUserPreference = getUserPreference;
  window.TedAPI.setUserPreference = setUserPreference;
}

// Ajouter les styles CSS nécessaires pour les préférences
const style = document.createElement('style');
style.textContent = `
  /* Styles pour les thèmes */
  .theme-light {
    --color-primary: #0A2463;
    --color-secondary: #8B1E3F;
    --color-background: #ffffff;
    --color-surface: #f8f9fa;
    --color-on-background: #000000;
    --color-on-surface: #333333;
    --color-border: #ddd;
  }
  
  .theme-dark {
    --color-primary: #5AA9E6;
    --color-secondary: #8B1E3F;
    --color-background: #1a1a1a;
    --color-surface: #2d2d2d;
    --color-on-background: #ffffff;
    --color-on-surface: #e0e0e0;
    --color-border: #444;
  }
  
  /* Styles pour les tailles de police */
  .font-size-small {
    font-size: 14px;
  }
  
  .font-size-large {
    font-size: 18px;
  }
  
  /* Styles pour le contraste */
  .contrast-high {
    --focus-outline: 3px solid #000;
  }
  
  /* Désactiver les animations */
  .disable-animations *,
  .disable-animations *::before,
  .disable-animations *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  /* Réduire les motions */
  .reduce-motion *,
  .reduce-motion *::before,
  .reduce-motion *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  /* Contraste élevé */
  .high-contrast * {
    background-color: #000 !important;
    color: #fff !important;
    border-color: #fff !important;
  }
  
  .high-contrast a,
  .high-contrast button {
    color: #ffff00 !important;
  }
  
  /* Navigation clavier */
  .keyboard-navigation *:focus {
    outline: var(--focus-outline, 2px solid #0A2463) !important;
    outline-offset: 2px;
  }
  
  /* Préférences de disposition */
  .layout-grid {
    display: grid;
  }
  
  .layout-list {
    display: flex;
    flex-direction: column;
  }
  
  /* Sections de la page d'accueil */
  .home-section-hidden {
    display: none !important;
  }
`;
document.head.appendChild(style);
