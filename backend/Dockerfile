# Utiliser une image Node.js officielle comme image de base
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Donner la propriété du répertoire de travail à l'utilisateur node
RUN chown -R node:node /usr/src/app

# Copier package.json et package-lock.json (si disponible)
# Utiliser COPY --chown=node:node pour s'assurer que les fichiers appartiennent à l'utilisateur node
COPY --chown=node:node package*.json ./

# Installer les dépendances de l'application
# Utiliser l'utilisateur node pour des raisons de sécurité
USER node
RUN npm install --only=production

# Copier le reste du code de l'application
# S'assurer que ces fichiers appartiennent également à l'utilisateur node
# Si USER node est déjà actif, COPY . . copiera les fichiers en tant que node.
# L'utilisation de --chown est plus explicite.
COPY --chown=node:node . .

# Exposer le port sur lequel le serveur s'exécute
EXPOSE 3001

# La commande pour démarrer l'application
CMD [ "node", "server.js" ] 