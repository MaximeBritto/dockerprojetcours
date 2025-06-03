# Notes et Questions d'Examen Potentielles - Projet Docker

Ce document contient une liste de questions types qu'un examinateur pourrait poser concernant ce projet, avec un focus sur Docker, Docker Compose, et les interactions entre les services.

## Questions Générales sur le Projet

1.  Pouvez-vous décrire l'architecture générale de l'application ? Quels sont les principaux composants et comment interagissent-ils ?
    *   **Réponse :** L'application est composée de trois services principaux : un frontend Next.js (React) qui gère l'interface utilisateur, un backend Node.js/Express qui sert d'API et gère la logique métier, et une base de données PostgreSQL pour la persistance des données. Le frontend communique avec le backend via des requêtes HTTP (API REST). Le backend interroge et modifie les données dans la base de données PostgreSQL. Tous ces services sont conteneurisés avec Docker et orchestrés par Docker Compose.

2.  Quel est l'objectif principal de ce projet en termes d'apprentissage et de démonstration ?
    *   **Réponse :** L'objectif principal est de démontrer la capacité à développer, configurer, dockeriser et orchestrer une application multi-services. Il s'agit de comprendre comment les différents composants (frontend, backend, base de données) interagissent dans un environnement conteneurisé, de gérer leurs configurations, leurs dépendances, et de résoudre les problèmes courants liés à ce type d'architecture (networking, variables d'environnement, persistance des données).

3.  Quelles technologies spécifiques avez-vous utilisées pour le frontend, le backend et la base de données, et pourquoi ces choix ?
    *   **Réponse :**
        *   **Frontend :** Next.js (framework React) a été choisi pour sa facilité de développement, son écosystème riche et ses fonctionnalités comme le rendu côté serveur (SSR) ou la génération de sites statiques (SSG), bien que pour ce projet simple, nous utilisions principalement ses capacités côté client. L'option `--no-app` a été utilisée pour rester sur l'ancien routeur `pages` plus simple pour ce cas d'usage.
        *   **Backend :** Node.js avec Express.js a été choisi pour sa légèreté, ses performances pour les applications I/O intensives, et sa cohérence avec l'écosystème JavaScript (permettant potentiellement de partager du code ou des compétences avec le frontend). Express est un framework minimaliste et flexible pour créer des API REST.
        *   **Base de données :** PostgreSQL a été choisie car c'est une base de données relationnelle SQL open-source puissante, fiable et très répandue, adaptée à une grande variété d'applications. L'image Docker officielle `postgres:15-alpine` est légère et facile à utiliser.

4.  Si vous deviez ajouter une nouvelle fonctionnalité, par exemple la gestion des utilisateurs, comment l'aborderiez-vous au niveau de l'architecture et des différents services ?
    *   **Réponse :**
        *   **Base de données :** Ajouter une nouvelle table `users` (avec id, email, mot_de_passe_hashé, etc.) et potentiellement une table de liaison si les tâches sont spécifiques à des utilisateurs.
        *   **Backend :** Créer de nouvelles routes d'API pour l'inscription (`/api/auth/register`), la connexion (`/api/auth/login`), la déconnexion. Implémenter la logique de hachage des mots de passe (ex: avec `bcrypt`), la génération et la validation de tokens (ex: JWT) pour sécuriser les routes de l'API (notamment celles des tâches, pour qu'un utilisateur ne voie que ses propres tâches).
        *   **Frontend :** Créer des pages/composants pour l'inscription et la connexion. Gérer l'état d'authentification de l'utilisateur (stocker le token JWT). Envoyer le token avec les requêtes vers les routes protégées du backend. Adapter l'interface pour afficher les tâches en fonction de l'utilisateur connecté.
        *   **Docker/Docker Compose :** Potentiellement ajouter des variables d'environnement pour les secrets JWT si nécessaire.

## Questions sur Docker

1.  **Qu'est-ce que Docker et quels problèmes résout-il ?**
    *   Quelle est la différence entre une image Docker et un conteneur Docker ?
    *   Pourquoi utiliser Docker pour ce projet plutôt que de lancer les services directement sur votre machine ?
2.  **Expliquez le contenu et le rôle du `Dockerfile` pour le service frontend.**
    *   Qu'est-ce qu'un build multi-étapes (multi-stage build) et pourquoi l'avez-vous utilisé pour le frontend ? Quels en sont les avantages ?
    *   Comment les dépendances (`node_modules`) sont-elles gérées dans l'image du frontend ? Pourquoi la commande `npm install --only=production` est-elle utilisée dans l'étape finale ?
    *   Que signifie l'instruction `EXPOSE 3000` ? Est-ce que cela publie automatiquement le port sur l'hôte ?
    *   Que fait la commande `CMD ["npm", "start"]` ?
3.  **Expliquez le contenu et le rôle du `Dockerfile` pour le service backend.**
    *   Quelles sont les étapes clés de la construction de l'image backend ?
    *   Comment la variable d'environnement `DATABASE_URL` est-elle (ou devrait-elle être) gérée pour le backend dans le contexte de Docker ?
    *   Pourquoi est-il important d'avoir un fichier `.dockerignore` ? Quels types de fichiers y placeriez-vous typiquement ?
    *   Vous avez rencontré un problème de permission `EACCES` lors du `npm install` dans le backend. Comment l'avez-vous résolu et pourquoi cette solution fonctionne-t-elle (`RUN chown -R node:node /usr/src/app`) ?
4.  **Comment avez-vous géré la persistance des données pour PostgreSQL ?**
    *   Qu'est-ce qu'un volume Docker ? Quels types de volumes existent ?
    *   Pourquoi est-il crucial d'utiliser un volume pour les données de la base de données ? Que se passerait-il si vous ne le faisiez pas et que vous arrêtiez/supprimiez le conteneur de la base de données ?
    *   Comment le script `init.sql` est-il exécuté lors du premier démarrage du conteneur PostgreSQL ? Quel est le mécanisme utilisé ?
5.  **Gestion des Variables d'Environnement :**
    *   Comment avez-vous géré la variable `NEXT_PUBLIC_API_URL` pour le frontend, notamment pour qu'elle soit disponible au moment du build et à l'exécution ? Expliquez les rôles de `ARG` et `ENV` dans un `Dockerfile`.
    *   Pourquoi a-t-il été nécessaire de la passer via les `build args` dans `docker-compose.yml` ?
    *   Quel était le problème avec l'utilisation de `backend:3001` comme URL d'API depuis le navigateur et pourquoi `localhost:3001` fonctionne-t-il ?

## Questions sur Docker Compose

1.  **Quel est le rôle de Docker Compose dans ce projet ?**
    *   Pourquoi utiliser Docker Compose alors que vous pourriez lancer chaque conteneur manuellement avec des commandes `docker run` ?
2.  **Décrivez la structure de votre fichier `docker-compose.yml`.**
    *   Comment définissez-vous un service ?
    *   Expliquez les directives `build`, `image`, `ports`, `volumes`, `environment`, `depends_on`, `networks`.
3.  **Gestion des Réseaux (Networking) :**
    *   Pourquoi avez-vous défini un réseau personnalisé (`app-network`) ? Quels sont les avantages par rapport au réseau par défaut ?
    *   Comment les conteneurs (par exemple, le backend) peuvent-ils se référer à d'autres conteneurs (par exemple, la base de données `db`) par leur nom de service ?
4.  **Variables d'Environnement dans Docker Compose :**
    *   Comment passez-vous les variables d'environnement aux services via `docker-compose.yml` ?
    *   Quelle est la différence entre passer une variable d'environnement dans la section `environment` d'un service et la passer via la section `build.args` ?
5.  **Ordonnancement et Dépendances :**
    *   Que garantit la directive `depends_on` ? Garantit-elle que le service dépendant est pleinement opérationnel avant que le service dépendant ne démarre ? (Indice : non, elle garantit seulement l'ordre de démarrage). Comment pourriez-vous gérer des dépendances plus strictes (attendre qu'une base de données soit prête, par exemple) ?
6.  **Débogage avec Docker Compose :**
    *   Quelles commandes Docker Compose avez-vous utilisées fréquemment pour le débogage ? (ex: `logs`, `down`, `up --build`)
    *   Vous avez commenté la section `volumes` du service backend pour résoudre un problème de `Cannot find module 'cors'`. Expliquez ce qui a pu causer ce problème en lien avec les volumes et `node_modules`.
7.  **Conflits de Ports :**
    *   Vous avez rencontré un conflit de port pour PostgreSQL. Comment l'avez-vous identifié et résolu en modifiant le `docker-compose.yml` ?

## Questions sur les Interactions et Problèmes Rencontrés

1.  **Problème CORS :**
    *   Qu'est-ce que CORS (Cross-Origin Resource Sharing) ?
    *   Pourquoi avez-vous rencontré une erreur CORS entre le frontend et le backend ?
    *   Comment avez-vous résolu ce problème ?
2.  **Problème "relation 'tasks' does not exist" :**
    *   Quelle était la cause de cette erreur ?
    *   Comment l'avez-vous résolue et pourquoi la suppression du volume `postgres_data` était-elle nécessaire ?
3.  **Gestion des `.git` imbriqués :**
    *   Quel problème cela a-t-il causé avec votre dépôt GitHub ?
    *   Comment avez-vous corrigé la situation ?

## Questions sur la CI/CD (anticipation)

1.  Quelles seraient les étapes clés pour mettre en place un pipeline de CI/CD pour ce projet avec GitHub Actions ?
2.  Où stockeriez-vous vos images Docker construites par la CI ? (Docker Hub, GitHub Container Registry, etc.)
3.  Comment géreriez-vous les secrets (comme les mots de passe de base de données) dans un pipeline de CI/CD ?

---

N'hésitez pas à me demander des clarifications ou des réponses si vous êtes bloqué sur une question ! 