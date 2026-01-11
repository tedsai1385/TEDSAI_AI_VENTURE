/**
 * Système d'optimisation des images pour TEDSAI
 * Ce module gère l'optimisation des images pour améliorer les performances
 */

class ImageOptimizer {
  constructor() {
    this.cache = new Map();
    this.supportedFormats = ['jpeg', 'jpg', 'png', 'webp', 'gif', 'svg'];
    this.maxSize = 2 * 1024 * 1024; // 2MB
    this.quality = 0.8;
  }

  /**
   * Optimise une image donnée
   */
  async optimizeImage(src, options = {}) {
    const cacheKey = `${src}_${JSON.stringify(options)}`;
    
    // Vérifier le cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Créer un objet image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      return new Promise((resolve, reject) => {
        img.onload = async () => {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calculer les dimensions optimales
            const { width, height } = this.calculateOptimalDimensions(
              img.width, 
              img.height, 
              options.maxWidth || 1920, 
              options.maxHeight || 1080
            );
            
            canvas.width = width;
            canvas.height = height;
            
            // Dessiner l'image redimensionnée
            ctx.drawImage(img, 0, 0, width, height);
            
            // Obtenir le blob optimisé
            const optimizedBlob = await this.canvasToOptimizedBlob(canvas, options);
            const optimizedUrl = URL.createObjectURL(optimizedBlob);
            
            // Mettre en cache
            this.cache.set(cacheKey, optimizedUrl);
            
            resolve(optimizedUrl);
          } catch (error) {
            reject(error);
          }
        };
        
        img.onerror = reject;
        img.src = src;
      });
    } catch (error) {
      console.error('Erreur lors de l\'optimisation de l\'image:', error);
      return src; // Retourner l'original en cas d'erreur
    }
  }

  /**
   * Calcule les dimensions optimales pour une image
   */
  calculateOptimalDimensions(originalWidth, originalHeight, maxWidth, maxHeight) {
    let width = originalWidth;
    let height = originalHeight;
    
    // Redimensionner proportionnellement si nécessaire
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }
    
    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }
    
    return { width: Math.round(width), height: Math.round(height) };
  }

  /**
   * Convertit un canvas en blob optimisé
   */
  async canvasToOptimizedBlob(canvas, options = {}) {
    const mimeType = options.mimeType || 'image/webp';
    const quality = options.quality || this.quality;
    
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        mimeType,
        quality
      );
    });
  }

  /**
   * Charge et optimise une image pour un élément DOM
   */
  async loadImageIntoElement(imageElement, src, options = {}) {
    try {
      // Afficher un indicateur de chargement
      this.showLoadingIndicator(imageElement);
      
      // Optimiser l'image
      const optimizedSrc = await this.optimizeImage(src, options);
      
      // Charger l'image optimisée
      imageElement.src = optimizedSrc;
      
      // Masquer l'indicateur de chargement
      this.hideLoadingIndicator(imageElement);
      
      // Ajouter une classe pour les effets de transition
      imageElement.classList.add('loaded');
    } catch (error) {
      console.error('Erreur lors du chargement de l\'image:', error);
      
      // Charger l'image originale en cas d'erreur
      imageElement.src = src;
      this.hideLoadingIndicator(imageElement);
    }
  }

  /**
   * Affiche un indicateur de chargement
   */
  showLoadingIndicator(element) {
    element.classList.add('loading');
    
    // Ajouter un indicateur visuel si ce n'est pas déjà fait
    if (!element.nextElementSibling || !element.nextElementSibling.classList.contains('loading-spinner')) {
      const spinner = document.createElement('div');
      spinner.className = 'loading-spinner';
      spinner.innerHTML = `
        <style>
          .loading-spinner {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid var(--color-primary, #0A2463);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
          
          .image-container {
            position: relative;
            display: inline-block;
          }
          
          img.loading {
            opacity: 0.3;
          }
          
          img.loaded {
            opacity: 1;
            transition: opacity 0.3s ease-in-out;
          }
        </style>
      `;
      element.parentNode.insertBefore(spinner, element.nextSibling);
    }
  }

  /**
   * Masque l'indicateur de chargement
   */
  hideLoadingIndicator(element) {
    element.classList.remove('loading');
    element.classList.add('loaded');
    
    const spinner = element.nextElementSibling;
    if (spinner && spinner.classList.contains('loading-spinner')) {
      spinner.remove();
    }
  }

  /**
   * Initialise l'optimisation automatique pour toutes les images de la page
   */
  initAutoOptimization() {
    // Observer les images ajoutées dynamiquement
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            if (node.tagName === 'IMG') {
              this.processImage(node);
            } else {
              const images = node.querySelectorAll && node.querySelectorAll('img');
              if (images) {
                images.forEach(img => this.processImage(img));
              }
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Traiter les images existantes
    const allImages = document.querySelectorAll('img[data-optimize], img[data-src]');
    allImages.forEach(img => this.processImage(img));
  }

  /**
   * Traite une image spécifique pour l'optimisation
   */
  processImage(img) {
    if (img.dataset.optimized) return; // Déjà traitée
    
    const originalSrc = img.src || img.dataset.src;
    if (!originalSrc) return;
    
    // Marquer comme traitée
    img.dataset.optimized = 'true';
    
    // Déterminer les options d'optimisation
    const options = {
      maxWidth: parseInt(img.dataset.maxWidth) || 1920,
      maxHeight: parseInt(img.dataset.maxHeight) || 1080,
      quality: parseFloat(img.dataset.quality) || this.quality
    };
    
    // Charger l'image de manière optimisée
    this.loadImageIntoElement(img, originalSrc, options);
  }

  /**
   * Précharge une image pour une utilisation future
   */
  async preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }
}

// Initialiser l'optimiseur d'images
const imageOptimizer = new ImageOptimizer();

// Activer l'optimisation automatique au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  imageOptimizer.initAutoOptimization();
});

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ImageOptimizer, imageOptimizer };
} else {
  window.TedAPI = window.TedAPI || {};
  window.TedAPI.ImageOptimizer = imageOptimizer;
}

// Ajouter les styles CSS nécessaires
const style = document.createElement('style');
style.textContent = `
  /* Styles pour les images optimisées */
  img[data-optimize] {
    transition: opacity 0.3s ease-in-out;
  }
  
  .image-container {
    position: relative;
    display: inline-block;
  }
  
  /* Lazy loading placeholder */
  .lazy-image {
    background-color: #f0f0f0;
    display: block;
  }
  
  /* Effet de transition pour les images chargées */
  img.loaded {
    opacity: 1;
  }
  
  /* Indicateur de chargement */
  .loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
document.head.appendChild(style);
