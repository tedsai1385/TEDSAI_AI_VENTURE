/**
 * Système de validation des formulaires pour TEDSAI
 * Ce module gère la validation côté client des formulaires
 */

class FormValidator {
  constructor() {
    this.validators = new Map();
    this.setupDefaultValidators();
  }

  /**
   * Configure les validateurs par défaut
   */
  setupDefaultValidators() {
    // Validateur pour les champs requis
    this.addValidator('required', (value) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string') return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      return true;
    }, 'Ce champ est requis.');

    // Validateur pour les adresses email
    this.addValidator('email', (value) => {
      if (!value) return true; // Laisser le validateur 'required' gérer les champs vides
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }, 'Veuillez entrer une adresse email valide.');

    // Validateur pour les numéros de téléphone
    this.addValidator('phone', (value) => {
      if (!value) return true;
      // Accepte plusieurs formats de numéros de téléphone
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
    }, 'Veuillez entrer un numéro de téléphone valide.');

    // Validateur pour la longueur minimale
    this.addValidator('minLength', (value, minLength) => {
      if (!value) return true;
      return value.length >= minLength;
    }, (minLength) => `Le champ doit contenir au moins ${minLength} caractères.`);

    // Validateur pour la longueur maximale
    this.addValidator('maxLength', (value, maxLength) => {
      if (!value) return true;
      return value.length <= maxLength;
    }, (maxLength) => `Le champ ne doit pas dépasser ${maxLength} caractères.`);

    // Validateur pour les nombres
    this.addValidator('number', (value) => {
      if (!value) return true;
      return !isNaN(parseFloat(value)) && isFinite(value);
    }, 'Veuillez entrer un nombre valide.');

    // Validateur pour les nombres positifs
    this.addValidator('positiveNumber', (value) => {
      if (!value) return true;
      const num = parseFloat(value);
      return !isNaN(num) && isFinite(num) && num > 0;
    }, 'Veuillez entrer un nombre positif.');

    // Validateur pour les dates
    this.addValidator('date', (value) => {
      if (!value) return true;
      const date = new Date(value);
      return date instanceof Date && !isNaN(date.getTime());
    }, 'Veuillez entrer une date valide.');

    // Validateur pour les mots de passe forts
    this.addValidator('strongPassword', (value) => {
      if (!value) return true;
      // Au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return strongPasswordRegex.test(value);
    }, 'Le mot de passe doit contenir au moins 8 caractères avec une majuscule, une minuscule, un chiffre et un caractère spécial.');
  }

  /**
   * Ajoute un validateur personnalisé
   */
  addValidator(name, validatorFn, errorMessage) {
    this.validators.set(name, { validator: validatorFn, errorMessage });
  }

  /**
   * Valide une valeur avec un validateur spécifique
   */
  validate(value, validatorName, params) {
    const validator = this.validators.get(validatorName);
    if (!validator) {
      throw new Error(`Validateur '${validatorName}' non trouvé.`);
    }

    const isValid = validator.validator(value, params);
    let message = '';

    if (!isValid) {
      if (typeof validator.errorMessage === 'function') {
        message = validator.errorMessage(params);
      } else {
        message = validator.errorMessage;
      }
    }

    return { isValid, message };
  }

  /**
   * Valide un formulaire complet
   */
  validateForm(formElement) {
    const fields = formElement.querySelectorAll('[data-validate]');
    let isFormValid = true;
    const errors = {};

    fields.forEach(field => {
      const fieldErrors = this.validateField(field);
      if (fieldErrors.length > 0) {
        isFormValid = false;
        errors[field.name || field.id] = fieldErrors;
      }
    });

    return { isFormValid, errors };
  }

  /**
   * Valide un champ individuel
   */
  validateField(field) {
    const validationRules = field.dataset.validate ? JSON.parse(field.dataset.validate) : {};
    const value = this.getFieldValue(field);
    const errors = [];

    for (const [rule, params] of Object.entries(validationRules)) {
      const result = this.validate(value, rule, params);
      if (!result.isValid) {
        errors.push(result.message);
      }
    }

    // Mettre à jour l'affichage du champ
    this.updateFieldDisplay(field, errors);

    return errors;
  }

  /**
   * Obtient la valeur d'un champ
   */
  getFieldValue(field) {
    if (field.type === 'checkbox') {
      return field.checked;
    } else if (field.type === 'radio') {
      const checkedRadio = field.form.querySelector(`input[name=${field.name}]:checked`);
      return checkedRadio ? checkedRadio.value : null;
    } else if (field.multiple) {
      return Array.from(field.selectedOptions).map(option => option.value);
    } else {
      return field.value;
    }
  }

  /**
   * Met à jour l'affichage d'un champ en fonction des erreurs
   */
  updateFieldDisplay(field, errors) {
    // Supprimer les classes d'erreur précédentes
    field.classList.remove('invalid', 'valid');
    
    // Supprimer les messages d'erreur précédents
    const previousError = field.parentNode.querySelector('.field-error-message');
    if (previousError) {
      previousError.remove();
    }

    if (errors.length > 0) {
      // Champ invalide
      field.classList.add('invalid');
      
      // Créer et ajouter le message d'erreur
      const errorDiv = document.createElement('div');
      errorDiv.className = 'field-error-message';
      errorDiv.textContent = errors[0]; // Afficher le premier message d'erreur
      errorDiv.style.color = '#e74c3c';
      errorDiv.style.fontSize = '0.85rem';
      errorDiv.style.marginTop = '0.25rem';
      errorDiv.style.fontWeight = '500';
      
      field.parentNode.appendChild(errorDiv);
    } else if (field.value.trim() !== '') {
      // Champ valide (seulement si non vide)
      field.classList.add('valid');
    }
  }

  /**
   * Attache les gestionnaires d'événements pour la validation automatique
   */
  attachValidationHandlers(formElement) {
    const fields = formElement.querySelectorAll('[data-validate]');
    
    fields.forEach(field => {
      // Valider lors du changement
      field.addEventListener('blur', () => {
        this.validateField(field);
      });

      // Valider en temps réel pour les champs de texte
      if (field.type === 'text' || field.type === 'email' || field.type === 'password' || field.type === 'tel') {
        let timeout;
        field.addEventListener('input', () => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            this.validateField(field);
          }, 500); // Délai pour éviter la validation trop fréquente
        });
      }
    });

    // Valider le formulaire avant soumission
    formElement.addEventListener('submit', (e) => {
      const validationResult = this.validateForm(formElement);
      
      if (!validationResult.isFormValid) {
        e.preventDefault();
        
        // Afficher un message d'erreur global
        this.showGlobalErrorMessage(formElement, 'Veuillez corriger les erreurs dans le formulaire.');
        
        // Défiler vers le premier champ invalide
        const firstInvalidField = formElement.querySelector('.invalid');
        if (firstInvalidField) {
          firstInvalidField.focus();
          firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        return false;
      }
    });
  }

  /**
   * Affiche un message d'erreur global pour le formulaire
   */
  showGlobalErrorMessage(formElement, message) {
    // Supprimer les messages d'erreur globaux précédents
    const previousGlobalError = formElement.querySelector('.global-form-error');
    if (previousGlobalError) {
      previousGlobalError.remove();
    }

    // Créer et ajouter le message d'erreur global
    const errorDiv = document.createElement('div');
    errorDiv.className = 'global-form-error';
    errorDiv.textContent = message;
    errorDiv.style.backgroundColor = '#fee';
    errorDiv.style.border = '1px solid #ecc';
    errorDiv.style.borderRadius = '4px';
    errorDiv.style.padding = '12px';
    errorDiv.style.marginBottom = '16px';
    errorDiv.style.color = '#c33';
    errorDiv.style.fontWeight = '500';
    errorDiv.style.textAlign = 'center';

    formElement.insertBefore(errorDiv, formElement.firstChild);
  }

  /**
   * Initialise la validation automatique pour tous les formulaires de la page
   */
  initAutoValidation() {
    const forms = document.querySelectorAll('form[data-validate-form]');
    forms.forEach(form => {
      this.attachValidationHandlers(form);
    });
  }

  /**
   * Valide un mot de passe et retourne une évaluation de sa force
   */
  evaluatePasswordStrength(password) {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score++;
    else feedback.push('Au moins 8 caractères');

    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Une majuscule');

    if (/[a-z]/.test(password)) score++;
    else feedback.push('Une minuscule');

    if (/\d/.test(password)) score++;
    else feedback.push('Un chiffre');

    if (/[@$!%*?&]/.test(password)) score++;
    else feedback.push('Un caractère spécial (@$!%*?&)');

    const strengthLevels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
    const strength = strengthLevels[Math.min(score, 4)];

    return {
      score,
      strength,
      feedback: feedback.length > 0 ? `Manque: ${feedback.join(', ')}` : 'Mot de passe solide!'
    };
  }
}

// Initialiser le validateur de formulaires
const formValidator = new FormValidator();

// Activer la validation automatique au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  formValidator.initAutoValidation();
});

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FormValidator, formValidator };
} else {
  window.TedAPI = window.TedAPI || {};
  window.TedAPI.FormValidator = formValidator;
}

// Ajouter les styles CSS nécessaires
const style = document.createElement('style');
style.textContent = `
  /* Styles pour la validation des formulaires */
  input.invalid,
  textarea.invalid,
  select.invalid {
    border-color: #e74c3c !important;
    box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2) !important;
  }
  
  input.valid,
  textarea.valid,
  select.valid {
    border-color: #2ecc71 !important;
    box-shadow: 0 0 0 2px rgba(46, 204, 113, 0.2) !important;
  }
  
  .field-error-message {
    color: #e74c3c;
    font-size: 0.85rem;
    margin-top: 0.25rem;
    font-weight: 500;
  }
  
  .global-form-error {
    background-color: #fee;
    border: 1px solid #ecc;
    border-radius: 4px;
    padding: 12px;
    margin-bottom: 16px;
    color: #c33;
    font-weight: 500;
    text-align: center;
  }
  
  /* Indicateur de force du mot de passe */
  .password-strength-meter {
    height: 4px;
    border-radius: 2px;
    margin: 8px 0;
    background-color: #ecf0f1;
    overflow: hidden;
  }
  
  .password-strength-meter-fill {
    height: 100%;
    width: 0%;
    transition: width 0.3s ease, background-color 0.3s ease;
  }
  
  .password-strength-very-weak { background-color: #e74c3c; }
  .password-strength-weak { background-color: #e67e22; }
  .password-strength-medium { background-color: #f1c40f; }
  .password-strength-strong { background-color: #2ecc71; }
  .password-strength-very-strong { background-color: #27ae60; }
  
  .password-strength-feedback {
    font-size: 0.8rem;
    margin-top: 4px;
    font-weight: 500;
  }
  
  .password-strength-very-weak-text { color: #e74c3c; }
  .password-strength-weak-text { color: #e67e22; }
  .password-strength-medium-text { color: #f1c40f; }
  .password-strength-strong-text { color: #2ecc71; }
  .password-strength-very-strong-text { color: #27ae60; }
`;
document.head.appendChild(style);
