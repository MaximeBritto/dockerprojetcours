-- Ce fichier sera utilisé pour initialiser la base de données PostgreSQL.
-- Vous pouvez y ajouter des instructions CREATE TABLE, INSERT INTO, etc.

-- Exemple :
-- CREATE TABLE IF NOT EXISTS items (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(255) NOT NULL
-- );

-- INSERT INTO items (name) VALUES ('Premier objet'), ('Deuxième objet');

-- Supprime la table si elle existe déjà (utile pour les redémarrages pendant le développement)
DROP TABLE IF EXISTS tasks;

-- Crée la table tasks
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insère quelques tâches d'exemple
INSERT INTO tasks (name) VALUES ('Faire les courses'), ('Préparer la présentation Docker'); 