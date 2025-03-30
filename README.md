# Task Manager API



# Installation a effectuer 





## Description
Cette application est une API REST pour la gestion des tâches. Elle permet de créer, modifier, supprimer et filtrer des tâches en utilisant une base de données MongoDB.

## Installation
### Prérequis
- Node.js installé
- MongoDB installé et en cours d'exécution

### Étapes d'installation
1. Cloner le dépôt :
   ```bash
   git clone https://github.com/anonyme56/taskManager.git
   cd task-manager-api
   ```
2. Installer les dépendances :
   ```bash
   installer expresse : npm install express 
   installer mongoose : npm install mangoose
   installer npm init -y dépendance
   ```
3. Configurer la bdd :
   - Dans TaskManagerAPI.js modifier la l'url de la base de donnée si besoin 'mongodb://localhost:27017/taskmanager'
    
     MONGO_URI=mongodb://localhost:27017/taskmanager
     PORT=5000
   
4. Lancer le serveur en mode développement :
  mode production :
   ```bash
      node TaskManagerAPI.js
   ```

 

   ouvrir l'url localhost:5000 pour accéder au site 

## Documentation API

### Accueil
- **GET /** : Renvoie la page d'accueil

### Gestion des tâches
- **GET /tasks** : Récupère toutes les tâches avec filtres et tri
  - Paramètres optionnels : `statut`, `priorite`, `categorie`, `etiquettes`, `avant`, `apres`, `q`, `tri`, `ordre`
- **POST /tasks** : Crée une nouvelle tâche
  - Corps de requête (JSON) :
    ```json
    {
      "titre": "Nom de la tâche",
      "description": "Description de la tâche",
      "echeance": "2025-12-31",
      "statut": "à faire",
      "priorite": "haute",
      "auteur": {
        "nom": "Nom",
        "prenom": "Prénom",
        "email": "email@example.com"
      }
    }
    ```
- **GET /tasks/:id** : Récupère une tâche spécifique par ID
- **PUT /tasks/:id** : Met à jour une tâche existante
- **DELETE /tasks/:id** : Supprime une tâche

### Gestion des commentaires
- **POST /tasks/:id/comments** : Ajoute un commentaire à une tâche
  - Corps de requête (JSON) :
    ```json
    {
      "auteur": "Nom de l'auteur",
      "contenu": "Texte du commentaire"
    }
    ```
- **DELETE /tasks/:taskId/comments/:commentId** : Supprime un commentaire spécifique d'une tâche

### Gestion des sous-tâches
- **POST /tasks/:id/subtasks** : Ajoute une sous-tâche à une tâche
  - Corps de requête (JSON) :
    ```json
    {
      "titre": "Titre de la sous-tâche",
      "statut": "à faire",
      "echeance": "2025-12-31"
    }
    ```
- **DELETE /tasks/:id/subtasks/:index** : Supprime une sous-tâche d'une tâche

### Exemples d'utilisation

#### Récupérer toutes les tâches avec `fetch` en JavaScript
```js
fetch('http://localhost:3000/tasks')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Erreur:', error));

## Mode d’emploi

### Accéder à l'API
L'API tourne sur `http://localhost:3000`.

## Technologies utilisées
- Node.js
- Express.js
- MongoDB avec Mongoose

## Auteur
**ALI Yohan** - Développeur Backend



