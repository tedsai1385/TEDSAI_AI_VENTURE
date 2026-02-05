# Guide d'Implémentation Flutterwave (OM & MTN) 🇨🇲

Ce guide détaille les étapes pour activer les paiements par **Orange Money** et **MTN Mobile Money** sur votre plateforme TEDSAI via Flutterwave.

## 1. Prérequis Flutterwave

1.  **Créer un compte** : Rendez-vous sur [flutterwave.com](https://dashboard.flutterwave.com/signup) et créez un compte "Business".
2.  **Passer en mode Live** : Une fois votre compte vérifié (KYC), vous pourrez obtenir vos clés de production. Pour les tests, utilisez le mode "Test".
3.  **Récupérer les Clés API** :
    *   Allez dans **Settings > API Keys**.
    *   Notez la **Secret Key** (`FLWSECK_...`) et la **Public Key** (`FLWPUBK_...`).

## 2. Configuration d'Environnement

Ajoutez ces variables dans votre fichier `.env.local` :

```env
# Flutterwave Credentials
FLW_PUBLIC_KEY=FLWPUBK_test_xxxxxxxxxxxxxxxx
FLW_SECRET_KEY=FLWSECK_test_xxxxxxxxxxxxxxxx
FLW_WEBHOOK_SECRET=votre_secret_webhook_personnalise

# URL de base pour les redirections
NEXT_PUBLIC_URL=http://localhost:3000
```

## 3. Logique d'Implémentation (Standard Checkout)

La méthode la plus simple et sécurisée est le **Redirect Checkout**. L'utilisateur est envoyé sur une page sécurisée Flutterwave pour valider son paiement MoMo.

### flux de Paiement :
1.  **Frontend** : L'utilisateur remplit son panier et choisit "Mobile Money".
2.  **Backend (API)** : Appel à `https://api.flutterwave.com/v3/payments`.
3.  **Redirection** : L'utilisateur valide la transaction sur son téléphone (Push USSD).
4.  **Retour** : L'utilisateur revient sur `/vitedia/checkout/success`.

### Exemple de corps de requête API :
```json
{
  "tx_ref": "ID_UNIQUE_COMMANDE",
  "amount": "5000",
  "currency": "XAF",
  "redirect_url": "https://tedsai.cm/vitedia/checkout/success",
  "payment_options": "mobilemoneyfrancophone",
  "customer": {
    "email": "client@email.com",
    "phonenumber": "2376xxxxxxxx",
    "name": "Nom Client"
  }
}
```

## 4. Vérification Webhook (Crucial)

Pour que votre dashboard soit mis à jour automatiquement même si le client ferme son navigateur, vous devez configurer un Webhook :

1.  Dans Flutterwave : **Settings > Webhooks**.
2.  URL du Webhook : `https://votre-domaine.com/api/webhooks/flutterwave`.
3.  Sélectionnez l'événement `charge.completed`.

## 5. Frais Flutterwave au Cameroun
*   **Paiements Locaux** : Environ 1.4% à 2.5% par transaction.
*   **Délai de Virement** : Les fonds sont généralement disponibles sur votre compte bancaire ou compte MoMo sous 24h à 48h.

> [!TIP]
> En mode test, Flutterwave propose des numéros de téléphone de simulation pour tester le succès ou l'échec des paiements Orange et MTN sans dépenser d'argent réel.
