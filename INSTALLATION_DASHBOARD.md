# 🔧 Installation Manuelle Requise

Avant de lancer le site, vous devez installer la dépendance du Kanban Board :

## Étape 1 : Activer l'exécution de scripts PowerShell

Ouvrez PowerShell **en tant qu'administrateur** et exécutez :

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

## Étape 2 : Installer la dépendance

```bash
npm install --save @hello-pangea/dnd
```

## Étape 3 : Installer Gemini SDK (pour le Copilot IA)

```bash
npm install --save @google/generative-ai
```

## Étape 4 : Configurer la clé API Gemini

Créez un fichier `.env.local` à la racine du projet :

```env
GEMINI_API_KEY=votre_cle_api_ici
```

Pour obtenir une clé gratuite : https://aistudio.google.com/app/apikey

## Étape 5 : Lancer le serveur

```bash
npm run dev
```

## Étape 6 : Tester le site

1. Allez sur http://localhost:3000/admin
2. Vous serez redirigé vers /admin/auth/login
3. Connectez-vous avec :
   - Email : `admin@tedsai.cm`
   - Mot de passe : `demo`
4. Testez le Copilot IA (Cmd+J ou bouton flottant)
5. Naviguez vers Restaurant > Orders pour voir le Kanban Board

## Erreurs Potentielles et Solutions

### Erreur : "Cannot find module '@hello-pangea/dnd'"
**Solution :** Exécutez l'étape 1 puis l'étape 2

### Erreur : "Cannot find module '@google/generative-ai'"
**Solution :** Exécutez l'étape 3

### Erreur : "GEMINI_API_KEY is not defined"
**Solution :** Exécutez l'étape 4

### Erreur : Colors Tailwind (cortex-primary, etc.)
**Solution :** Les couleurs sont déjà dans `tailwind.config.ts`, redémarrez le serveur

### Le middleware bloque l'accès même après login
**Solution :** Vérifiez que le cookie `auth-token` est bien créé dans le navigateur (F12 > Application > Cookies)

---

Si vous rencontrez d'autres erreurs, partagez-les moi et je les corrigerai immédiatement.
