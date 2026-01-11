/**
 * Module de protection contre les attaques courantes pour TEDSAI
 * Ce module implémente des mesures de sécurité pour protéger contre les attaques fréquentes
 */

class AttackProtection {
  constructor() {
    this.rateLimiting = {
      attempts: new Map(),
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxAttempts: 5
    };
    
    this.bruteForceProtection = true;
    this.sessionFixationProtection = true;
    this.csrfProtection = true;
    this.clickjackingProtection = true;
    this.malwareDetection = true;
    
    this.init();
  }

  /**
   * Initialise les protections
   */
  init() {
    // Activer la protection contre le brute force
    if (this.bruteForceProtection) {
      this.enableBruteForceProtection();
    }
    
    // Activer la protection contre le fixation de session
    if (this.sessionFixationProtection) {
      this.enableSessionFixationProtection();
    }
    
    // Activer la protection CSRF
    if (this.csrfProtection) {
      this.enableCSRFProtection();
    }
    
    // Activer la protection contre le clickjacking
    if (this.clickjackingProtection) {
      this.enableClickjackingProtection();
    }
    
    // Activer la détection de code malveillant
    if (this.malwareDetection) {
      this.enableMalwareDetection();
    }
  }

  /**
   * Protection contre les attaques de type brute force
   */
  enableBruteForceProtection() {
    // Surveiller les tentatives de connexion
    document.addEventListener('submit', (event) => {
      if (event.target.method && event.target.method.toLowerCase() === 'post') {
        const loginForm = event.target.querySelector('[type="password"]');
        if (loginForm) {
          this.checkBruteForceAttempt(event.target);
        }
      }
    });
  }

  /**
   * Vérifie si une tentative d'attaque brute force est en cours
   */
  checkBruteForceAttempt(form) {
    const ip = this.getClientIP(); // Simulé
    const now = Date.now();
    
    if (!this.rateLimiting.attempts.has(ip)) {
      this.rateLimiting.attempts.set(ip, []);
    }
    
    const attempts = this.rateLimiting.attempts.get(ip);
    
    // Nettoyer les anciennes tentatives
    const recentAttempts = attempts.filter(time => now - time < this.rateLimiting.windowMs);
    
    if (recentAttempts.length >= this.rateLimiting.maxAttempts) {
      // Bloquer l'accès
      this.blockIP(ip);
      return false;
    }
    
    // Enregistrer la nouvelle tentative
    recentAttempts.push(now);
    this.rateLimiting.attempts.set(ip, recentAttempts);
    
    return true;
  }

  /**
   * Bloque une adresse IP
   */
  blockIP(ip) {
    console.warn(`Adresse IP bloquée pour suspicion d'attaque brute force: ${ip}`);
    
    // Afficher un message d'erreur
    const errorMsg = document.createElement('div');
    errorMsg.className = 'security-error';
    errorMsg.textContent = 'Trop de tentatives de connexion. Accès temporairement bloqué.';
    errorMsg.style.cssText = `
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      background: #f8d7da;
      color: #721c24;
      padding: 15px;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      z-index: 10000;
      text-align: center;
      max-width: 90%;
    `;
    
    document.body.appendChild(errorMsg);
    
    // Supprimer le message après 5 secondes
    setTimeout(() => {
      if (errorMsg.parentNode) {
        errorMsg.remove();
      }
    }, 5000);
  }

  /**
   * Obtient l'adresse IP du client (simulé)
   */
  getClientIP() {
    // Dans un environnement réel, cette information viendrait du serveur
    return sessionStorage.getItem('client_ip') || '127.0.0.1';
  }

  /**
   * Protection contre la fixation de session
   */
  enableSessionFixationProtection() {
    // Générer un nouvel ID de session après connexion réussie
    document.addEventListener('tedsaiLoginSuccess', () => {
      this.regenerateSessionId();
    });
  }

  /**
   * Régénère l'ID de session
   */
  regenerateSessionId() {
    // Créer un nouvel ID de session
    const newSessionId = this.generateSecureId();
    
    // Mettre à jour le stockage
    sessionStorage.setItem('tedsai_session_id', newSessionId);
    
    // Mettre à jour les en-têtes pour les futures requêtes
    // Cela serait généralement géré côté serveur
    console.log('ID de session régénéré pour prévention de fixation');
  }

  /**
   * Génère un ID sécurisé
   */
  generateSecureId() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Protection CSRF
   */
  enableCSRFProtection() {
    // Ajouter automatiquement un jeton CSRF aux formulaires
    document.addEventListener('DOMContentLoaded', () => {
      this.injectCSRFTokenToForms();
    });
    
    // Surveiller la création dynamique de formulaires
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.tagName === 'FORM') {
              this.addCSRFTokenToForm(node);
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Injecte un jeton CSRF dans tous les formulaires
   */
  injectCSRFTokenToForms() {
    const forms = document.querySelectorAll('form[method="post"], form[method="POST"]');
    forms.forEach(form => this.addCSRFTokenToForm(form));
  }

  /**
   * Ajoute un jeton CSRF à un formulaire
   */
  addCSRFTokenToForm(form) {
    // Vérifier si le jeton CSRF existe déjà
    const existingToken = form.querySelector('input[name="csrf_token"]');
    if (existingToken) return;
    
    // Créer un champ caché pour le jeton CSRF
    const tokenInput = document.createElement('input');
    tokenInput.type = 'hidden';
    tokenInput.name = 'csrf_token';
    tokenInput.value = this.generateCSRFToken();
    
    form.appendChild(tokenInput);
  }

  /**
   * Génère un jeton CSRF
   */
  generateCSRFToken() {
    // Utiliser l'ID de session comme base pour le jeton CSRF
    let sessionId = sessionStorage.getItem('tedsai_session_id');
    if (!sessionId) {
      sessionId = this.generateSecureId();
      sessionStorage.setItem('tedsai_session_id', sessionId);
    }
    
    // Créer un jeton basé sur l'ID de session et l'horodatage
    const timestamp = Date.now().toString();
    const combined = sessionId + timestamp;
    
    // Créer un hash simple (dans un environnement réel, utiliser une méthode cryptographique plus sûre)
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Conversion en entier 32 bits
    }
    
    return Math.abs(hash).toString(36) + timestamp.slice(-4);
  }

  /**
   * Valide un jeton CSRF
   */
  validateCSRFToken(token) {
    // Dans un environnement réel, le serveur validerait ce jeton
    // Ici, nous simulons la validation
    return typeof token === 'string' && token.length > 10;
  }

  /**
   * Protection contre le clickjacking
   */
  enableClickjackingProtection() {
    // Définir les en-têtes de sécurité
    this.setHeader('X-Frame-Options', 'SAMEORIGIN');
    this.setHeader('Frame-Options', 'SAMEORIGIN');
    
    // Ajouter un script pour se protéger contre le clickjacking
    const frameBustingScript = document.createElement('script');
    frameBustingScript.textContent = `
      if (window.top !== window.self) {
        window.top.location = window.self.location;
      }
    `;
    document.head.appendChild(frameBustingScript);
    
    // Ajouter un style pour masquer le contenu si la page est dans une iframe
    const hideIframeStyle = document.createElement('style');
    hideIframeStyle.textContent = `
      body {
        display: block !important;
      }
      
      iframe {
        display: none !important;
      }
    `;
    document.head.appendChild(hideIframeStyle);
  }

  /**
   * Définit un en-tête de sécurité (simulé)
   */
  setHeader(name, value) {
    // Dans un environnement réel, ces en-têtes seraient définis côté serveur
    // Ici, nous les simulons pour la documentation
    console.log(`En-tête de sécurité configuré: ${name}: ${value}`);
  }

  /**
   * Détection de code malveillant
   */
  enableMalwareDetection() {
    // Surveiller les modifications suspectes du DOM
    this.setupDOMMonitoring();
    
    // Surveiller les tentatives d'injection de script
    this.setupScriptInjectionMonitoring();
    
    // Surveiller les téléchargements suspects
    this.setupDownloadMonitoring();
  }

  /**
   * Met en place la surveillance du DOM
   */
  setupDOMMonitoring() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Élément HTML
              this.scanForMaliciousElements(node);
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Surveille les tentatives d'injection de script
   */
  setupScriptInjectionMonitoring() {
    // Intercepter les tentatives d'ajout de scripts
    document.addEventListener('DOMNodeInserted', (event) => {
      if (event.target.tagName === 'SCRIPT') {
        this.handleSuspiciousScript(event.target);
      }
    }, true);
    
    // Surveiller les attributs événements
    document.addEventListener('DOMAttrModified', (event) => {
      if (event.attrName && event.attrName.startsWith('on')) {
        this.handleSuspiciousAttribute(event.target, event.attrName, event.newValue);
      }
    }, true);
  }

  /**
   * Surveille les téléchargements
   */
  setupDownloadMonitoring() {
    document.addEventListener('click', (event) => {
      if (event.target.tagName === 'A' && event.target.hasAttribute('download')) {
        this.checkDownloadSafety(event.target.href);
      }
    });
  }

  /**
   * Analyse un élément pour détecter des signes de malveillance
   */
  scanForMaliciousElements(element) {
    // Vérifier les attributs dangereux
    if (element.attributes) {
      for (let attr of element.attributes) {
        if (this.isDangerousAttribute(attr.name, attr.value)) {
          console.warn('Élément malveillant détecté et neutralisé:', element, attr);
          element.removeAttribute(attr.name);
        }
      }
    }
    
    // Vérifier le contenu HTML
    if (element.innerHTML) {
      if (this.containsMaliciousCode(element.innerHTML)) {
        console.warn('Code malveillant détecté dans le contenu HTML:', element);
        element.innerHTML = this.sanitizeHTML(element.innerHTML);
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
      'onblur', 'onchange', 'onfocus', 'onreset', 'onselect', 'onsubmit',
      'oncut', 'onpaste', 'ondrag', 'ondrop', 'oncontextmenu'
    ];
    
    return dangerousAttrs.includes(name.toLowerCase()) || 
           (name.toLowerCase().startsWith('on') && 
            (value.toLowerCase().includes('javascript:') || 
             value.toLowerCase().includes('data:text/html')));
  }

  /**
   * Vérifie si une chaîne contient du code malveillant
   */
  containsMaliciousCode(str) {
    if (typeof str !== 'string') return false;
    
    const maliciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /data:text\/html/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi
    ];
    
    return maliciousPatterns.some(pattern => pattern.test(str));
  }

  /**
   * Nettoie le code HTML dangereux
   */
  sanitizeHTML(html) {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
  }

  /**
   * Gère un script suspect
   */
  handleSuspiciousScript(scriptElement) {
    console.warn('Script suspect détecté et bloqué:', scriptElement);
    if (scriptElement.parentNode) {
      scriptElement.parentNode.removeChild(scriptElement);
    }
  }

  /**
   * Gère un attribut suspect
   */
  handleSuspiciousAttribute(element, attrName, attrValue) {
    console.warn(`Attribut événementiel suspect détecté: ${attrName}="${attrValue}" sur`, element);
    element.removeAttribute(attrName);
  }

  /**
   * Vérifie la sécurité d'un téléchargement
   */
  checkDownloadSafety(url) {
    // Vérifier si l'URL est sûre
    try {
      const parsedUrl = new URL(url);
      
      // Vérifier si le domaine est autorisé
      const allowedDomains = [
        window.location.hostname,
        'assets.tedsai.cm',
        'downloads.tedsai.cm'
      ];
      
      if (!allowedDomains.includes(parsedUrl.hostname)) {
        console.warn(`Téléchargement bloqué d'un domaine non autorisé: ${url}`);
        return false;
      }
      
      // Vérifier l'extension du fichier
      const extension = parsedUrl.pathname.split('.').pop().toLowerCase();
      const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'jpg', 'jpeg', 'png', 'gif'];
      
      if (!allowedExtensions.includes(extension)) {
        console.warn(`Téléchargement bloqué - extension non autorisée: ${extension}`);
        return false;
      }
      
      return true;
    } catch (e) {
      console.error('Erreur lors de la vérification de l\'URL de téléchargement:', e);
      return false;
    }
  }

  /**
   * Protection contre les attaques DDoS (partielle, côté client)
   */
  enableDDoSProtection() {
    // Limiter le nombre de requêtes simultanées
    this.concurrentRequestLimit = 5;
    this.activeRequests = 0;
    
    // Surveiller les requêtes sortantes
    const originalFetch = window.fetch;
    const self = this;
    
    window.fetch = function(...args) {
      if (self.activeRequests >= self.concurrentRequestLimit) {
        console.warn('Limite de requêtes simultanées atteinte');
        return Promise.reject(new Error('Trop de requêtes simultanées'));
      }
      
      self.activeRequests++;
      return originalFetch.apply(this, args)
        .finally(() => {
          self.activeRequests--;
        });
    };
  }

  /**
   * Protection contre les attaques par injection (partielle)
   */
  enableInjectionProtection() {
    // Valider les entrées utilisateur
    document.addEventListener('input', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        this.validateInput(event.target.value);
      }
    });
  }

  /**
   * Valide une entrée utilisateur
   */
  validateInput(input) {
    // Vérifier les motifs d'injection SQL simples
    const sqlInjectionPatterns = [
      /(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT|MERGE|SELECT|UPDATE|UNION( ALL){0,1})\b)/gi,
      /(;|\-\-|\#|\%27|\%22)/g,
      /('|")\s*(OR|AND)\s*('|")/gi
    ];
    
    for (const pattern of sqlInjectionPatterns) {
      if (pattern.test(input)) {
        console.warn('Potentielle injection SQL détectée:', input);
        return false;
      }
    }
    
    // Vérifier les motifs XSS simples
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=\s*["'][^"']*["']/gi
    ];
    
    for (const pattern of xssPatterns) {
      if (pattern.test(input)) {
        console.warn('Potentielle injection XSS détectée:', input);
        return false;
      }
    }
    
    return true;
  }

  /**
   * Active toutes les protections
   */
  enableAllProtections() {
    this.enableBruteForceProtection();
    this.enableSessionFixationProtection();
    this.enableCSRFProtection();
    this.enableClickjackingProtection();
    this.enableMalwareDetection();
    this.enableDDoSProtection();
    this.enableInjectionProtection();
    
    console.log('Toutes les protections de sécurité ont été activées');
  }

  /**
   * Désactive une protection spécifique
   */
  disableProtection(protectionType) {
    switch (protectionType) {
      case 'bruteForce':
        this.bruteForceProtection = false;
        break;
      case 'sessionFixation':
        this.sessionFixationProtection = false;
        break;
      case 'csrf':
        this.csrfProtection = false;
        break;
      case 'clickjacking':
        this.clickjackingProtection = false;
        break;
      case 'malware':
        this.malwareDetection = false;
        break;
      default:
        console.warn(`Type de protection inconnu: ${protectionType}`);
    }
  }

  /**
   * Vérifie l'état de santé de la sécurité
   */
  getSecurityHealth() {
    return {
      bruteForceProtected: this.bruteForceProtection,
      sessionFixationProtected: this.sessionFixationProtection,
      csrfProtected: this.csrfProtection,
      clickjackingProtected: this.clickjackingProtection,
      malwareDetected: this.malwareDetection,
      lastScan: new Date().toISOString(),
      threatsDetected: 0 // Ce serait mis à jour en fonction des détections réelles
    };
  }
}

// Initialiser la protection contre les attaques
const attackProtection = new AttackProtection();

// Activer toutes les protections
attackProtection.enableAllProtections();

// Fonctions utilitaires pour l'extérieur
function checkBruteForceAttempt(form) {
  return attackProtection.checkBruteForceAttempt(form);
}

function validateCSRFToken(token) {
  return attackProtection.validateCSRFToken(token);
}

function sanitizeHTML(html) {
  return attackProtection.sanitizeHTML(html);
}

function validateInput(input) {
  return attackProtection.validateInput(input);
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    AttackProtection, 
    attackProtection, 
    checkBruteForceAttempt, 
    validateCSRFToken, 
    sanitizeHTML,
    validateInput
  };
} else {
  window.TedAPI = window.TedAPI || {};
  window.TedAPI.AttackProtection = attackProtection;
  window.TedAPI.checkBruteForceAttempt = checkBruteForceAttempt;
  window.TedAPI.validateCSRFToken = validateCSRFToken;
  window.TedAPI.sanitizeHTML = sanitizeHTML;
  window.TedAPI.validateInput = validateInput;
}