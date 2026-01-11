/**
 * Système de gestion des utilisateurs pour TEDSAI
 * Ce module gère l'ensemble des fonctionnalités liées aux utilisateurs
 */

class UserManager {
  constructor() {
    this.currentUser = null;
    this.users = new Map();
    this.roles = new Set(['admin', 'moderator', 'user', 'guest']);
    this.permissions = new Map();
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    this.autoSaveInterval = 5 * 60 * 1000; // 5 minutes
    
    this.init();
  }

  /**
   * Initialise le gestionnaire d'utilisateurs
   */
  async init() {
    // Charger les utilisateurs depuis le stockage local
    this.loadUsers();
    
    // Charger l'utilisateur courant s'il existe
    this.loadCurrentUser();
    
    // Démarrer la surveillance de la session
    this.startSessionMonitoring();
    
    // Démarrer la sauvegarde automatique
    this.startAutoSave();
  }

  /**
   * Charge les utilisateurs depuis le stockage local
   */
  loadUsers() {
    try {
      const storedUsers = localStorage.getItem('tedsai_users');
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        for (const [id, userData] of Object.entries(parsedUsers)) {
          this.users.set(id, new User(userData));
        }
      }
    } catch (e) {
      console.warn('Impossible de charger les utilisateurs depuis le stockage local:', e);
    }
  }

  /**
   * Sauvegarde les utilisateurs dans le stockage local
   */
  saveUsers() {
    try {
      const serializedUsers = {};
      for (const [id, user] of this.users.entries()) {
        serializedUsers[id] = user.toJSON();
      }
      localStorage.setItem('tedsai_users', JSON.stringify(serializedUsers));
    } catch (e) {
      console.error('Impossible de sauvegarder les utilisateurs dans le stockage local:', e);
    }
  }

  /**
   * Charge l'utilisateur courant depuis le stockage local
   */
  loadCurrentUser() {
    try {
      const storedUser = localStorage.getItem('tedsai_current_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        this.currentUser = new User(userData);
        
        // Vérifier si la session est toujours valide
        if (this.isSessionExpired(this.currentUser)) {
          this.logout();
        }
      }
    } catch (e) {
      console.warn('Impossible de charger l\'utilisateur courant:', e);
    }
  }

  /**
   * Sauvegarde l'utilisateur courant dans le stockage local
   */
  saveCurrentUser() {
    try {
      if (this.currentUser) {
        localStorage.setItem('tedsai_current_user', JSON.stringify(this.currentUser.toJSON()));
      } else {
        localStorage.removeItem('tedsai_current_user');
      }
    } catch (e) {
      console.error('Impossible de sauvegarder l\'utilisateur courant:', e);
    }
  }

  /**
   * Vérifie si la session d'un utilisateur est expirée
   */
  isSessionExpired(user) {
    if (!user || !user.lastActivity) return true;
    
    const now = new Date().getTime();
    const lastActivity = new Date(user.lastActivity).getTime();
    
    return (now - lastActivity) > this.sessionTimeout;
  }

  /**
   * Démarre la surveillance de la session
   */
  startSessionMonitoring() {
    // Mettre à jour l'activité à chaque interaction
    ['mousedown', 'keydown', 'scroll', 'touchstart', 'pointerdown'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        this.updateUserActivity();
      }, { passive: true });
    });
    
    // Vérifier périodiquement l'expiration de la session
    setInterval(() => {
      if (this.currentUser && this.isSessionExpired(this.currentUser)) {
        this.logout();
      }
    }, 60000); // Vérifier toutes les minutes
  }

  /**
   * Met à jour l'activité de l'utilisateur
   */
  updateUserActivity() {
    if (this.currentUser) {
      this.currentUser.lastActivity = new Date().toISOString();
      this.saveCurrentUser();
    }
  }

  /**
   * Démarre la sauvegarde automatique
   */
  startAutoSave() {
    setInterval(() => {
      this.saveUsers();
    }, this.autoSaveInterval);
  }

  /**
   * Crée un nouvel utilisateur
   */
  async createUser(userData) {
    // Valider les données d'entrée
    const validation = this.validateUserData(userData);
    if (!validation.isValid) {
      throw new Error(`Données utilisateur invalides: ${validation.errors.join(', ')}`);
    }
    
    // Vérifier si l'email existe déjà
    if (this.findByEmail(userData.email)) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }
    
    // Créer un nouvel utilisateur
    const user = new User({
      id: this.generateUserId(),
      ...userData,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      isActive: true
    });
    
    // Hacher le mot de passe
    if (userData.password) {
      user.password = await this.hashPassword(userData.password);
    }
    
    // Ajouter l'utilisateur à la collection
    this.users.set(user.id, user);
    
    // Sauvegarder les utilisateurs
    this.saveUsers();
    
    // Émettre un événement
    this.dispatchUserEvent('userCreated', user);
    
    return user;
  }

  /**
   * Valide les données d'utilisateur
   */
  validateUserData(userData) {
    const errors = [];
    
    if (!userData.email) {
      errors.push('Email requis');
    } else if (!this.isValidEmail(userData.email)) {
      errors.push('Email invalide');
    }
    
    if (!userData.username) {
      errors.push('Nom d\'utilisateur requis');
    } else if (userData.username.length < 3) {
      errors.push('Nom d\'utilisateur trop court (minimum 3 caractères)');
    }
    
    if (userData.password) {
      const passwordValidation = this.validatePassword(userData.password);
      if (!passwordValidation.isValid) {
        errors.push(`Mot de passe faible: ${passwordValidation.requirements.join(', ')}`);
      }
    }
    
    if (userData.role && !this.roles.has(userData.role)) {
      errors.push(`Rôle invalide: ${userData.role}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Vérifie si un email est valide
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valide un mot de passe
   */
  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const requirements = [];
    if (password.length < minLength) requirements.push(`au moins ${minLength} caractères`);
    if (!hasUpperCase) requirements.push('majuscule');
    if (!hasLowerCase) requirements.push('minuscule');
    if (!hasNumbers) requirements.push('chiffre');
    if (!hasSpecialChar) requirements.push('caractère spécial');
    
    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      requirements: requirements
    };
  }

  /**
   * Génère un ID utilisateur unique
   */
  generateUserId() {
    return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Hache un mot de passe
   */
  async hashPassword(password) {
    // Dans un environnement réel, utiliser une bibliothèque comme bcrypt
    // Pour cette implémentation, on utilise une méthode simplifiée
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Compare un mot de passe avec son hash
   */
  async comparePassword(password, hash) {
    const hashedPassword = await this.hashPassword(password);
    return hashedPassword === hash;
  }

  /**
   * Connecte un utilisateur
   */
  async login(email, password) {
    // Trouver l'utilisateur par email
    const user = this.findByEmail(email);
    if (!user) {
      throw new Error('Identifiants incorrects');
    }
    
    // Vérifier si le compte est actif
    if (!user.isActive) {
      throw new Error('Compte désactivé');
    }
    
    // Comparer les mots de passe
    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Identifiants incorrects');
    }
    
    // Mettre à jour l'utilisateur courant
    this.currentUser = user;
    this.currentUser.lastLogin = new Date().toISOString();
    this.currentUser.lastActivity = new Date().toISOString();
    
    // Sauvegarder l'utilisateur courant
    this.saveCurrentUser();
    
    // Émettre un événement
    this.dispatchUserEvent('userLoggedIn', this.currentUser);
    
    return this.currentUser;
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout() {
    if (this.currentUser) {
      // Sauvegarder la dernière activité avant la déconnexion
      this.currentUser.lastActivity = new Date().toISOString();
      
      // Émettre un événement
      this.dispatchUserEvent('userLoggedOut', this.currentUser);
      
      // Réinitialiser l'utilisateur courant
      this.currentUser = null;
      this.saveCurrentUser();
    }
  }

  /**
   * Trouve un utilisateur par email
   */
  findByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return null;
  }

  /**
   * Trouve un utilisateur par ID
   */
  findById(id) {
    return this.users.get(id) || null;
  }

  /**
   * Trouve des utilisateurs par critères
   */
  find(criteria = {}) {
    const results = [];
    
    for (const user of this.users.values()) {
      let match = true;
      
      for (const [key, value] of Object.entries(criteria)) {
        if (user[key] !== value) {
          match = false;
          break;
        }
      }
      
      if (match) {
        results.push(user);
      }
    }
    
    return results;
  }

  /**
   * Met à jour un utilisateur
   */
  async updateUser(userId, updateData) {
    const user = this.findById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    
    // Ne pas permettre la mise à jour de certains champs critiques
    const protectedFields = ['id', 'createdAt'];
    for (const field of protectedFields) {
      if (updateData.hasOwnProperty(field)) {
        delete updateData[field];
      }
    }
    
    // Si un nouveau mot de passe est fourni, le hacher
    if (updateData.password) {
      updateData.password = await this.hashPassword(updateData.password);
    }
    
    // Mettre à jour les propriétés de l'utilisateur
    Object.assign(user, updateData);
    
    // Sauvegarder les utilisateurs
    this.saveUsers();
    
    // Émettre un événement
    this.dispatchUserEvent('userUpdated', user);
    
    return user;
  }

  /**
   * Désactive un utilisateur
   */
  async deactivateUser(userId) {
    const user = this.findById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    
    user.isActive = false;
    user.deactivatedAt = new Date().toISOString();
    
    this.saveUsers();
    this.dispatchUserEvent('userDeactivated', user);
    
    // Si c'est l'utilisateur courant, le déconnecter
    if (this.currentUser && this.currentUser.id === userId) {
      this.logout();
    }
    
    return user;
  }

  /**
   * Supprime un utilisateur
   */
  async deleteUser(userId) {
    const user = this.findById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    
    // Ne pas permettre la suppression de l'administrateur principal
    if (user.role === 'admin' && user.isSuperAdmin) {
      throw new Error('Impossible de supprimer le super administrateur');
    }
    
    this.users.delete(userId);
    this.saveUsers();
    this.dispatchUserEvent('userDeleted', user);
    
    // Si c'est l'utilisateur courant, le déconnecter
    if (this.currentUser && this.currentUser.id === userId) {
      this.logout();
    }
    
    return true;
  }

  /**
   * Change le mot de passe d'un utilisateur
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = this.findById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    
    // Vérifier l'ancien mot de passe
    const isCurrentPasswordValid = await this.comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Mot de passe actuel incorrect');
    }
    
    // Valider le nouveau mot de passe
    const validation = this.validatePassword(newPassword);
    if (!validation.isValid) {
      throw new Error(`Nouveau mot de passe faible: ${validation.requirements.join(', ')}`);
    }
    
    // Mettre à jour le mot de passe
    user.password = await this.hashPassword(newPassword);
    user.passwordChangedAt = new Date().toISOString();
    
    this.saveUsers();
    this.dispatchUserEvent('passwordChanged', user);
    
    return true;
  }

  /**
   * Réinitialise le mot de passe d'un utilisateur
   */
  async resetPassword(email) {
    const user = this.findByEmail(email);
    if (!user) {
      throw new Error('Aucun utilisateur trouvé avec cet email');
    }
    
    // Générer un mot de passe temporaire
    const tempPassword = this.generateSecurePassword();
    
    // Mettre à jour le mot de passe
    user.password = await this.hashPassword(tempPassword);
    user.passwordResetAt = new Date().toISOString();
    
    this.saveUsers();
    this.dispatchUserEvent('passwordReset', user);
    
    // Dans un environnement réel, envoyer le mot de passe par email
    // Ici, on retourne le mot de passe pour démonstration
    return {
      success: true,
      temporaryPassword: tempPassword,
      message: 'Un nouveau mot de passe temporaire a été généré'
    };
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
   * Attribue un rôle à un utilisateur
   */
  async assignRole(userId, role) {
    if (!this.roles.has(role)) {
      throw new Error(`Rôle invalide: ${role}`);
    }
    
    const user = this.findById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    
    user.role = role;
    user.roleAssignedAt = new Date().toISOString();
    
    this.saveUsers();
    this.dispatchUserEvent('roleAssigned', user);
    
    return user;
  }

  /**
   * Vérifie si un utilisateur a une permission spécifique
   */
  hasPermission(user, permission) {
    if (!user || !permission) return false;
    
    // Vérifier les permissions de base selon le rôle
    const rolePermissions = this.getPermissionsForRole(user.role);
    
    return rolePermissions.includes(permission) || user.permissions?.includes(permission);
  }

  /**
   * Obtient les permissions pour un rôle
   */
  getPermissionsForRole(role) {
    const rolePermissions = {
      'admin': ['create', 'read', 'update', 'delete', 'manage_users', 'manage_content'],
      'moderator': ['read', 'update', 'manage_content'],
      'user': ['read'],
      'guest': ['read']
    };
    
    return rolePermissions[role] || rolePermissions['guest'];
  }

  /**
   * Ajoute une permission à un utilisateur
   */
  async addPermission(userId, permission) {
    const user = this.findById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    
    if (!user.permissions) {
      user.permissions = [];
    }
    
    if (!user.permissions.includes(permission)) {
      user.permissions.push(permission);
    }
    
    this.saveUsers();
    this.dispatchUserEvent('permissionAdded', { user, permission });
    
    return user;
  }

  /**
   * Supprime une permission d'un utilisateur
   */
  async removePermission(userId, permission) {
    const user = this.findById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    
    if (user.permissions) {
      user.permissions = user.permissions.filter(p => p !== permission);
    }
    
    this.saveUsers();
    this.dispatchUserEvent('permissionRemoved', { user, permission });
    
    return user;
  }

  /**
   * Vérifie si l'utilisateur courant est connecté
   */
  isAuthenticated() {
    return !!this.currentUser && !this.isSessionExpired(this.currentUser);
  }

  /**
   * Vérifie si l'utilisateur courant a un rôle spécifique
   */
  hasRole(role) {
    return this.isAuthenticated() && this.currentUser.role === role;
  }

  /**
   * Vérifie si l'utilisateur courant est administrateur
   */
  isAdmin() {
    return this.hasRole('admin');
  }

  /**
   * Vérifie si l'utilisateur courant est modérateur
   */
  isModerator() {
    return this.hasRole('moderator');
  }

  /**
   * Obtient la liste de tous les utilisateurs
   */
  getAllUsers() {
    return Array.from(this.users.values());
  }

  /**
   * Obtient le nombre total d'utilisateurs
   */
  getUserCount() {
    return this.users.size;
  }

  /**
   * Obtient les statistiques des utilisateurs
   */
  getUserStats() {
    const stats = {
      total: this.getUserCount(),
      active: 0,
      inactive: 0,
      byRole: {}
    };
    
    for (const user of this.users.values()) {
      if (user.isActive) {
        stats.active++;
      } else {
        stats.inactive++;
      }
      
      if (!stats.byRole[user.role]) {
        stats.byRole[user.role] = 0;
      }
      stats.byRole[user.role]++;
    }
    
    return stats;
  }

  /**
   * Émet un événement utilisateur
   */
  dispatchUserEvent(eventName, data) {
    const event = new CustomEvent(`tedsaiUser_${eventName}`, { detail: data });
    document.dispatchEvent(event);
  }

  /**
   * Exporte les données utilisateur
   */
  exportUserData() {
    const usersData = this.getAllUsers().map(user => user.toJSON());
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      users: usersData
    };
  }

  /**
   * Importe des données utilisateur
   */
  async importUserData(data) {
    if (!data || !Array.isArray(data.users)) {
      throw new Error('Format de données invalide pour l\'importation');
    }
    
    for (const userData of data.users) {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = this.findByEmail(userData.email);
      
      if (existingUser) {
        // Mettre à jour l'utilisateur existant
        await this.updateUser(existingUser.id, userData);
      } else {
        // Créer un nouvel utilisateur
        await this.createUser(userData);
      }
    }
    
    return {
      success: true,
      importedCount: data.users.length,
      message: `${data.users.length} utilisateurs importés avec succès`
    };
  }

  /**
   * Nettoie les sessions expirées
   */
  cleanupExpiredSessions() {
    const now = new Date().getTime();
    
    for (const user of this.users.values()) {
      const lastActivity = new Date(user.lastActivity).getTime();
      if ((now - lastActivity) > this.sessionTimeout) {
        // On ne supprime pas l'utilisateur, mais on peut le marquer comme inactif
        // selon la politique de l'application
      }
    }
  }
}

/**
 * Classe représentant un utilisateur
 */
class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.username = data.username || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.role = data.role || 'user';
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.isVerified = data.isVerified || false;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.lastLogin = data.lastLogin || null;
    this.lastActivity = data.lastActivity || new Date().toISOString();
    this.profilePicture = data.profilePicture || null;
    this.bio = data.bio || '';
    this.phoneNumber = data.phoneNumber || '';
    this.address = data.address || null;
    this.preferences = data.preferences || {};
    this.permissions = data.permissions || [];
    this.isSuperAdmin = data.isSuperAdmin || false;
    this.deactivatedAt = data.deactivatedAt || null;
    this.passwordChangedAt = data.passwordChangedAt || null;
    this.passwordResetAt = data.passwordResetAt || null;
    this.roleAssignedAt = data.roleAssignedAt || null;
  }

  /**
   * Obtient le nom complet de l'utilisateur
   */
  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim() || this.username;
  }

  /**
   * Convertit l'utilisateur en objet JSON
   */
  toJSON() {
    // Ne pas inclure le mot de passe dans la sérialisation
    const json = { ...this };
    delete json.password;
    return json;
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  hasRole(role) {
    return this.role === role;
  }

  /**
   * Vérifie si l'utilisateur a une permission spécifique
   */
  hasPermission(permission) {
    // Permissions de base selon le rôle
    const rolePermissions = {
      'admin': ['create', 'read', 'update', 'delete', 'manage_users', 'manage_content'],
      'moderator': ['read', 'update', 'manage_content'],
      'user': ['read'],
      'guest': ['read']
    };
    
    const basePermissions = rolePermissions[this.role] || rolePermissions['guest'];
    const allPermissions = [...basePermissions, ...(this.permissions || [])];
    
    return allPermissions.includes(permission);
  }
}

// Initialiser le gestionnaire d'utilisateurs
const userManager = new UserManager();

// Fonctions utilitaires pour l'extérieur
async function createUser(userData) {
  return userManager.createUser(userData);
}

async function login(email, password) {
  return userManager.login(email, password);
}

function logout() {
  return userManager.logout();
}

function getCurrentUser() {
  return userManager.currentUser;
}

function isAuthenticated() {
  return userManager.isAuthenticated();
}

function hasRole(role) {
  return userManager.hasRole(role);
}

function hasPermission(permission) {
  return userManager.currentUser?.hasPermission(permission) || false;
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    UserManager, 
    User, 
    userManager, 
    createUser, 
    login, 
    logout,
    getCurrentUser,
    isAuthenticated,
    hasRole,
    hasPermission
  };
} else {
  window.TedAPI = window.TedAPI || {};
  window.TedAPI.UserManager = userManager;
  window.TedAPI.User = User;
  window.TedAPI.createUser = createUser;
  window.TedAPI.login = login;
  window.TedAPI.logout = logout;
  window.TedAPI.getCurrentUser = getCurrentUser;
  window.TedAPI.isAuthenticated = isAuthenticated;
  window.TedAPI.hasRole = hasRole;
  window.TedAPI.hasPermission = hasPermission;
}