# Projet de Liste de Tâches Dockerisée

Ce projet est une application web simple de type "Liste de Tâches" (To-Do List) conçue pour démontrer la mise en place et l'interaction de plusieurs services conteneurisés avec Docker.

L'application comprend :
- Un **Frontend** développé avec Next.js (React).
- Un **Backend** (API) développé avec Node.js et Express.js.
- Une **Base de données** PostgreSQL.

Chaque composant est dockerisé et l'ensemble est orchestré à l'aide de Docker Compose.

## Architecture

- Le **Frontend** (port `3000`) communique avec le Backend pour afficher et manipuler les tâches.
- Le **Backend** (port `3001`) gère la logique métier, reçoit les requêtes du Frontend, et interagit avec la Base de données pour la persistance des données.
- La **Base de données** (PostgreSQL, port `5434` sur l'hôte) stocke les tâches.

## Prérequis

- Docker Desktop (ou Docker Engine avec Docker Compose) installé et en cours d'exécution.
- Un client Git (si vous clonez le dépôt).

## Démarrage de l'application

1.  **Cloner le dépôt (si ce n'est pas déjà fait) :**
    ```bash
    git clone https://github.com/MaximeBritto/dockerprojetcours.git
    cd dockerprojetcours
    ```

2.  **Lancer tous les services avec Docker Compose :**
    À la racine du projet (où se trouve le fichier `docker-compose.yml`), exécutez :
    ```bash
    docker-compose up --build -d
    ```
    Cette commande effectue plusieurs actions importantes :
    - `--build` : Demande à Docker Compose de (re)construire les images pour les services qui ont un `Dockerfile` (ici, `frontend` et `backend`). Docker suit les instructions de chaque `Dockerfile` pour créer une image spécifique pour ce service.
    - `up` : Crée et démarre les conteneurs à partir des images (celles construites localement ou, comme pour `db`, celle spécifiée dans `docker-compose.yml` et tirée d'un registre comme Docker Hub).
    - `-d` : Lance les conteneurs en mode détaché (en arrière-plan).

    En résumé : les `Dockerfile` définissent *comment construire les images*, et `docker-compose.yml` définit *comment utiliser ces images pour lancer et orchestrer les conteneurs* de votre application.

3.  **Accéder à l'application :**
    - Frontend (Application de liste de tâches) : [http://localhost:3000](http://localhost:3000)
    - Backend API (route de test) : [http://localhost:3001/api](http://localhost:3001/api)
    - Backend API (liste des tâches) : [http://localhost:3001/api/tasks](http://localhost:3001/api/tasks)

4.  **Accéder à la base de données (via pgAdmin ou un autre client SQL) :**
    - **Hôte :** `localhost`
    - **Port :** `5434` (attention, c'est le port exposé sur l'hôte, pas le port interne du conteneur)
    - **Nom de la base de données :** `mydatabase`
    - **Utilisateur :** `user`
    - **Mot de passe :** `password`

## Commandes Docker Compose utiles

(Exécutez ces commandes à la racine du projet)

- **Arrêter tous les services :**
  ```bash
  docker-compose down
  ```
  *(Cela arrête et supprime les conteneurs, mais pas les volumes de données par défaut.)*

- **Arrêter les services et supprimer les volumes de données (pour une réinitialisation complète) :**
  ```bash
  docker-compose down -v
  ```
  *(Attention : cela supprime les données de la base de données.)*

- **Voir les logs des services :**
  ```bash
  docker-compose logs
  ```
  Pour suivre les logs en direct :
  ```bash
  docker-compose logs -f
  ```
  Pour voir les logs d'un service spécifique (ex: backend) :
  ```bash
  docker-compose logs backend
  docker-compose logs -f backend
  ```

- **Lister les conteneurs en cours d'exécution gérés par Compose :**
  ```bash
  docker-compose ps
  ```

- **Reconstruire les images sans lancer les conteneurs :**
  ```bash
  docker-compose build
  ```
  Pour reconstruire une image spécifique sans cache :
  ```bash
  docker-compose build --no-cache frontend
  ```

- **Redémarrer un service spécifique :**
  ```bash
  docker-compose restart backend
  ```

## Structure du projet

```
dockerprojetcours/
├── backend/                # Code source et Dockerfile du service backend (Node.js/Express)
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
│   └── ...
├── database/               # Scripts d'initialisation pour la base de données
│   └── init.sql
├── frontend/               # Code source et Dockerfile du service frontend (Next.js)
│   ├── Dockerfile
│   ├── package.json
│   └── ...
├── .gitignore              # Fichiers et dossiers ignorés par Git
├── docker-compose.yml      # Fichier d'orchestration Docker Compose
└── README.md               # Ce fichier
```

## Prochaines étapes (CI/CD)

La mise en place d'un pipeline d'Intégration Continue (CI) et de Déploiement Continu (CD) sera abordée ultérieurement, typiquement avec GitHub Actions pour construire et pousser les images Docker vers un registre (comme Docker Hub ou GitHub Container Registry). 