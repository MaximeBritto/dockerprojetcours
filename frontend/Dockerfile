# Étape 1: Build de l'application
FROM node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json (ou yarn.lock)
COPY package*.json ./

# Installer les dépendances
# Note: si vous utilisez yarn, changez npm install en yarn install
RUN npm install

# Copier le reste du code de l'application
COPY . .

# Construire l'application Next.js
RUN npm run build

# Étape 2: Servir l'application avec Node.js en mode production
FROM node:18-alpine

WORKDIR /app

# Copier uniquement les artefacts nécessaires depuis l'étape de build
# (dossier .next, public, package.json et node_modules pour l'exécution)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Installer uniquement les dépendances de production
# Cela suppose que `next` est dans les dépendances normales, pas seulement devDependencies
# et que `next start` est utilisé.
# Si vous avez des dépendances de production spécifiques, assurez-vous qu'elles sont copiées
# ou réinstallez-les ici.
# Pour une image encore plus légère, vous pourriez copier node_modules de l'étape builder
# au lieu de réinstaller, mais cela peut être plus complexe si les dépendances diffèrent.
RUN npm install --only=production

# Exposer le port sur lequel l'application Next.js s'exécute (par défaut 3000)
EXPOSE 3000

# La commande pour démarrer l'application en production
CMD ["npm", "start"] 