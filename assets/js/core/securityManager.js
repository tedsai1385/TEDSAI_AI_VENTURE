/**
 * Système de sécurité pour TEDSAI
 * Ce module renforce la sécurité des formulaires et des transactions
 */

class SecurityManager {
  constructor() {
    this.csrfToken = null;
    this.rateLimits = new Map();
    this.securityHeaders = new Map();
    this.xssProtection = true;
    this.cspEnabled = true;
    this.hstsEnabled = true;
    this.initializeSecurity();
  }

  /**
   * Initialise les fonctionnalités de sécurité
   */
  initializeSecurity() {
    // Générer un jeton CSRF
    this.generateCSRFToken();
    
    // Activer les protections XSS
    this.enableXSSProtection();
    
    // Mettre en place la surveillance des événements
    this.setupEventMonitoring();
    
    // Activer la validation des entrées
    this.enableInputValidation();
    
    // Mettre en place la protection contre les attaques de type clickjacking
    this.enableClickjackingProtection();
  }

  /**
   * Génère un jeton CSRF
   */
  generateCSRFToken() {
    // Générer un jeton aléatoire sécurisé
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    this.csrfToken = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    
    // Stocker le jeton dans un cookie HttpOnly si possible
    // ou dans sessionStorage pour les besoins immédiats
    sessionStorage.setItem('csrf_token', this.csrfToken);
  }

  /**
   * Obtient le jeton CSRF
   */
  getCSRFToken() {
    if (!this.csrfToken) {
      this.csrfToken = sessionStorage.getItem('csrf_token');
      if (!this.csrfToken) {
        this.generateCSRFToken();
      }
    }
    return this.csrfToken;
  }

  /**
   * Valide un jeton CSRF
   */
  validateCSRFToken(token) {
    return token && this.getCSRFToken() === token;
  }

  /**
   * Active la protection XSS
   */
  enableXSSProtection() {
    // Définir les en-têtes de sécurité
    this.securityHeaders.set('X-XSS-Protection', '1; mode=block');
    this.securityHeaders.set('X-Content-Type-Options', 'nosniff');
    this.securityHeaders.set('X-Frame-Options', 'DENY');
    
    // Mettre en place un filtre de contenu pour les entrées
    this.setupContentFilter();
  }

  /**
   * Met en place un filtre de contenu pour prévenir XSS
   */
  setupContentFilter() {
    // Fonction pour nettoyer le HTML dangereux
    this.sanitizeHTML = (unsafeHTML) => {
      const div = document.createElement('div');
      div.textContent = unsafeHTML;
      return div.innerHTML;
    };
    
    // Fonction pour échapper les caractères spéciaux
    this.escapeHTML = (unsafeText) => {
      if (typeof unsafeText !== 'string') return unsafeText;
      
      return unsafeText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };
  }

  /**
   * Active la protection contre le clickjacking
   */
  enableClickjackingProtection() {
    // Ajouter un style pour empêcher l'intégration dans des iframes
    const style = document.createElement('style');
    style.textContent = `
      body {
        position: relative;
      }
      
      iframe {
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
    
    // Ajouter un script pour détecter et bloquer les iframes
    const script = document.createElement('script');
    script.textContent = `
      if (window.top !== window.self) {
        document.body.style.display = 'none';
        alert('Cette page ne peut pas être affichée dans une iframe pour des raisons de sécurité.');
      }
    `;
    document.head.appendChild(script);
  }

  /**
   * Met en place la surveillance des événements suspects
   */
  setupEventMonitoring() {
    // Surveiller les tentatives d'injection de script
    document.addEventListener('DOMContentLoaded', () => {
      // Surveiller les changements dans le DOM
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) { // Élément HTML
                this.scanForMaliciousContent(node);
              }
            });
          }
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
    
    // Surveiller les soumissions de formulaires
    document.addEventListener('submit', (event) => {
      if (event.target.tagName === 'FORM') {
        this.validateFormSubmission(event.target);
      }
    });
  }

  /**
   * Active la validation des entrées
   */
  enableInputValidation() {
    // Surveiller les saisies dans les champs de formulaire
    document.addEventListener('input', (event) => {
      if (event.target.type !== 'password') { // Ne pas valider les mots de passe pour des raisons de confidentialité
        this.validateInput(event.target);
      }
    });
  }

  /**
   * Scanne un nœud pour détecter du contenu malveillant
   */
  scanForMaliciousContent(node) {
    // Vérifier les attributs dangereux
    if (node.attributes) {
      for (let attr of node.attributes) {
        if (this.isDangerousAttribute(attr.name, attr.value)) {
          console.warn('Attribut potentiellement dangereux détecté:', attr.name, attr.value);
          node.removeAttribute(attr.name);
        }
      }
    }
    
    // Vérifier le contenu HTML
    if (node.innerHTML) {
      const cleanHTML = this.sanitizeHTML(node.innerHTML);
      if (cleanHTML !== node.innerHTML) {
        console.warn('Code HTML potentiellement dangereux détecté et nettoyé');
        node.innerHTML = cleanHTML;
      }
    }
  }

  /**
   * Vérifie si un attribut est dangereux
   */
  isDangerousAttribute(name, value) {
    const dangerousAttrs = [
      'onclick', 'ondblclick', 'onmousedown', 'onmouseup', 'onmouseover', 
      'onmousemove', 'onmouseout', 'onkeypress', 'onkeydown', 'onkeyup',
      'onload', 'onunload', 'onabort', 'onerror', 'onresize', 'onscroll',
      'onblur', 'onchange', 'onfocus', 'onreset', 'onselect', 'onsubmit'
    ];
    
    return dangerousAttrs.includes(name.toLowerCase()) || 
           (name.toLowerCase().startsWith('on') && value.toLowerCase().includes('javascript:'));
  }

  /**
   * Valide une soumission de formulaire
   */
  validateFormSubmission(form) {
    // Vérifier le jeton CSRF
    const csrfInput = form.querySelector('input[name="csrf_token"]');
    if (csrfInput) {
      if (!this.validateCSRFToken(csrfInput.value)) {
        console.error('Jeton CSRF invalide');
        alert('Erreur de sécurité : jeton de validation invalide. Veuillez actualiser la page.');
        return false;
      }
    }
    
    // Valider tous les champs du formulaire
    const inputs = form.querySelectorAll('input, textarea, select');
    for (let input of inputs) {
      if (!this.validateInput(input)) {
        return false;
      }
    }
    
    // Vérifier les limites de débit
    if (this.isRateLimited(form.action || window.location.href)) {
      console.error('Limite de débit dépassée');
      alert('Trop de requêtes envoyées. Veuillez patienter avant de réessayer.');
      return false;
    }
    
    // Marquer cette action pour la limitation de débit
    this.recordAction(form.action || window.location.href);
    
    return true;
  }

  /**
   * Valide une entrée utilisateur
   */
  validateInput(input) {
    const value = input.value;
    
    // Vérifier les injections de script
    if (this.containsScriptTags(value)) {
      console.warn('Balises de script détectées dans l\'entrée:', value);
      input.value = this.sanitizeHTML(value);
      return false;
    }
    
    // Vérifier les injections SQL (patterns simples)
    if (this.containsSQLInjection(value)) {
      console.warn('Potentielle injection SQL détectée:', value);
      return false;
    }
    
    // Vérifier les caractères spéciaux non autorisés selon le type de champ
    if (!this.validateByInputType(input)) {
      console.warn('Caractères non autorisés dans le champ:', input.name || input.id);
      return false;
    }
    
    return true;
  }

  /**
   * Vérifie si une chaîne contient des balises de script
   */
  containsScriptTags(str) {
    if (typeof str !== 'string') return false;
    
    const scriptPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    return scriptPattern.test(str);
  }

  /**
   * Vérifie si une chaîne contient des motifs d'injection SQL
   */
  containsSQLInjection(str) {
    if (typeof str !== 'string') return false;
    
    const sqlPatterns = [
      /(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT|MERGE|SELECT|UPDATE|UNION( ALL){0,1})\b)/gi,
      /(;|\-\-|\#|\%27|\%22)/g,
      /('|")\s*(OR|AND)\s*('|")/gi
    ];
    
    return sqlPatterns.some(pattern => pattern.test(str));
  }

  /**
   * Valide une entrée selon son type
   */
  validateByInputType(input) {
    const value = input.value;
    const type = input.type.toLowerCase();
    
    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      
      case 'url':
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      
      case 'tel':
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
      
      case 'number':
        return !isNaN(value) && isFinite(value);
      
      default:
        // Pour les autres types, vérifier les caractères dangereux
        return !this.containsDangerousCharacters(value);
    }
  }

  /**
   * Vérifie si une chaîne contient des caractères dangereux
   */
  containsDangerousCharacters(str) {
    if (typeof str !== 'string') return false;
    
    // Caractères pouvant être utilisés dans des attaques
    const dangerousChars = /[<>'"&;]/g;
    return dangerousChars.test(str);
  }

  /**
   * Vérifie si une action est limitée par débit
   */
  isRateLimited(action) {
    const now = Date.now();
    const limit = 10; // Nombre maximum d'actions
    const windowMs = 60000; // Fenêtre de temps en ms (1 minute)
    
    if (!this.rateLimits.has(action)) {
      return false;
    }
    
    const records = this.rateLimits.get(action);
    const recentRecords = records.filter(time => now - time < windowMs);
    
    return recentRecords.length >= limit;
  }

  /**
   * Enregistre une action pour la limitation de débit
   */
  recordAction(action) {
    const now = Date.now();
    
    if (!this.rateLimits.has(action)) {
      this.rateLimits.set(action, []);
    }
    
    const records = this.rateLimits.get(action);
    records.push(now);
    
    // Nettoyer les anciens enregistrements
    const windowMs = 60000; // 1 minute
    const cleanedRecords = records.filter(time => now - time < windowMs);
    this.rateLimits.set(action, cleanedRecords);
  }

  /**
   * Encode une chaîne pour une utilisation sécurisée dans une URL
   */
  encodeForURL(str) {
    if (typeof str !== 'string') return str;
    return encodeURIComponent(str);
  }

  /**
   * Encode une chaîne pour une utilisation sécurisée dans un contexte HTML
   */
  encodeForHTML(str) {
    return this.escapeHTML(str);
  }

  /**
   * Encode une chaîne pour une utilisation sécurisée dans un contexte JavaScript
   */
  encodeForJS(str) {
    if (typeof str !== 'string') return str;
    
    return str
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
      .replace(/\f/g, '\\f')
      .replace(/\b/g, '\\b')
      .replace(/\0/g, '\\0');
  }

  /**
   * Vérifie la force d'un mot de passe
   */
  validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      score: (password.length >= minLength ? 1 : 0) + 
             (hasUpperCase ? 1 : 0) + 
             (hasLowerCase ? 1 : 0) + 
             (hasNumbers ? 1 : 0) + 
             (hasSpecialChar ? 1 : 0),
      requirements: {
        length: password.length >= minLength,
        upperCase: hasUpperCase,
        lowerCase: hasLowerCase,
        numbers: hasNumbers,
        specialChar: hasSpecialChar
      }
    };
  }

  /**
   * Hash un mot de passe (simulation côté client - NE DOIT PAS ÊTRE UTILISÉ EN PRODUCTION)
   */
  hashPassword(password) {
    // ATTENTION : Ceci est une simulation pour des besoins de démonstration
    // En production, le hachage des mots de passe doit être fait côté serveur
    return btoa(encodeURIComponent(password).replace(/%([0-9A-F]{2})/g, function(match, p1) {
      return String.fromCharCode('0x' + p1);
    }));
  }

  /**
   * Génère un mot de passe sécurisé
   */
  generateSecurePassword(length = 12) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let password = "";
    const values = new Uint32Array(length);
    crypto.getRandomValues(values);
    
    for (let i = 0; i < length; i++) {
      password += charset[values[i] % charset.length];
    }
    
    return password;
  }

  /**
   * Active la politique de sécurité de contenu (CSP)
   */
  enableCSP() {
    if (!this.cspEnabled) return;
    
    // Créer une politique CSP
    const cspPolicy = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.gstatic.com/ https://*.firebase.com https://*.firebaseio.com",
      "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://*.firebase.com https://*.firebaseio.com",
      "frame-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ');
    
    // Ajouter la politique CSP
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = cspPolicy;
    document.head.appendChild(meta);
  }

  /**
   * Active HSTS (HTTP Strict Transport Security)
   */
  enableHSTS() {
    if (!this.hstsEnabled) return;
    
    // Ajouter un en-tête HSTS via meta tag (moins efficace que via serveur, mais utile pour le navigateur)
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Strict-Transport-Security';
    meta.content = 'max-age=31536000; includeSubDomains; preload';
    document.head.appendChild(meta);
  }

  /**
   * Initialise toutes les protections de sécurité
   */
  initializeAllSecurityFeatures() {
    this.enableCSP();
    this.enableHSTS();
    console.log('Toutes les fonctionnalités de sécurité ont été activées');
  }

  /**
   * Vérifie la sécurité d'une transaction
   */
  async verifyTransactionSecurity(transactionData) {
    // Vérifier l'intégrité des données
    if (!transactionData || typeof transactionData !== 'object') {
      throw new Error('Données de transaction invalides');
    }
    
    // Vérifier la présence de champs obligatoires
    const requiredFields = ['amount', 'recipient', 'timestamp'];
    for (const field of requiredFields) {
      if (!(field in transactionData)) {
        throw new Error(`Champ obligatoire manquant: ${field}`);
      }
    }
    
    // Vérifier la validité du montant
    if (typeof transactionData.amount !== 'number' || transactionData.amount <= 0) {
      throw new Error('Montant de transaction invalide');
    }
    
    // Vérifier le format du destinataire
    if (typeof transactionData.recipient !== 'string' || transactionData.recipient.length === 0) {
      throw new Error('Destinataire invalide');
    }
    
    // Vérifier l'horodatage (pas dans le futur, pas trop vieux)
    const now = Date.now();
    const timestamp = new Date(transactionData.timestamp).getTime();
    const maxAge = 5 * 60 * 1000; // 5 minutes
    
    if (isNaN(timestamp) || timestamp > now || (now - timestamp) > maxAge) {
      throw new Error('Horodatage de transaction invalide');
    }
    
    // Vérifier le jeton CSRF si présent
    if (transactionData.csrfToken && !this.validateCSRFToken(transactionData.csrfToken)) {
      throw new Error('Jeton CSRF invalide');
    }
    
    // Vérifier la limite de débit pour ce type d'opération
    if (this.isRateLimited('transaction')) {
      throw new Error('Limite de transactions dépassée');
    }
    
    // Enregistrer l'action pour la limitation de débit
    this.recordAction('transaction');
    
    return { valid: true, message: 'Transaction sécurisée' };
  }
}

// Initialiser le gestionnaire de sécurité
const securityManager = new SecurityManager();

// Activer toutes les fonctionnalités de sécurité
securityManager.initializeAllSecurityFeatures();

// Fonctions utilitaires pour l'extérieur
function sanitizeHTML(html) {
  return securityManager.sanitizeHTML(html);
}

function escapeHTML(text) {
  return securityManager.escapeHTML(text);
}

function validateCSRFToken(token) {
  return securityManager.validateCSRFToken(token);
}

function validateInput(input) {
  return securityManager.validateInput(input);
}

function validatePasswordStrength(password) {
  return securityManager.validatePasswordStrength(password);
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    SecurityManager, 
    securityManager, 
    sanitizeHTML, 
    escapeHTML, 
    validateCSRFToken, 
    validateInput,
    validatePasswordStrength
  };
} else {
  window.TedAPI = window.TedAPI || {};
  window.TedAPI.SecurityManager = securityManager;
  window.TedAPI.sanitizeHTML = sanitizeHTML;
  window.TedAPI.escapeHTML = escapeHTML;
  window.TedAPI.validateCSRFToken = validateCSRFToken;
  window.TedAPI.validateInput = validateInput;
  window.TedAPI.validatePasswordStrength = validatePasswordStrength;
}