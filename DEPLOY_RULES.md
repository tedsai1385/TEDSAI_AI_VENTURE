# Guide : Déploiement des Règles Firestore

Si vous voyez toujours le message **"Missing or insufficient permissions"** malgré le nouveau système, c'est que vos règles Firestore sur le serveur ne sont pas à jour. Voici comment les valider en 1 minute :

## Méthode 1 : Via la Console Firebase (Recommandé)

1. Allez sur votre [Console Firebase](https://console.firebase.google.com/).
2. Sélectionnez votre projet **tedsai-prod-dd55f**.
3. Dans le menu de gauche, cliquez sur **Firestore Database**.
4. Cliquez sur l'onglet **Rules** (en haut au centre).
5. Copiez et collez le contenu du fichier `firestore.rules` qui se trouve à la racine de votre projet.
6. Cliquez sur le bouton bleu **Publish**.

### Les règles simplifiées pour le Garden :
Assurez-vous d'avoir ce bloc dans vos règles pour que le catalogue fonctionne sans friction :

```javascript
// Autorise tout le monde à lire et écrire dans le catalogue Garden pour le moment
match /garden_products/{productId} {
  allow read, write: if true;
}
```

---

## Méthode 2 : Via la ligne de commande (CLI)

Si vous avez installé `firebase-tools`, exécutez simplement cette commande à la racine du projet :

```powershell
firebase deploy --only firestore:rules
```

---

## Pourquoi c'est important ?
Le nouveau système "Style Restaurant" utilise **Zustand** pour enregistrer vos produits instantanément dans votre navigateur. Cependant, pour que ces produits soient visibles par tous les clients du site, ils doivent être synchronisés avec la base de données Firestore. Ces règles permettent cette synchronisation sans blocage.
