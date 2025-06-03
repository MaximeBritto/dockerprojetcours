const express = require('express');
const { Pool } = require('pg'); // Ajout du client PostgreSQL
const cors = require('cors'); // Ajout de l'import pour CORS

const app = express();

// Utilisation du middleware CORS
// Cela doit être fait avant la définition de vos routes
app.use(cors());

const port = process.env.PORT || 3001;

// Configuration de la connexion à PostgreSQL
// DATABASE_URL est fournie par l'environnement Docker Compose
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Activer SSL si nécessaire en production hors Docker, mais pas typiquement pour la communication interne Docker
  // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Middleware pour parser le JSON
app.use(express.json());

// Route de test (modifiée pour indiquer la connexion à la BDD)
app.get('/api', async (req, res) => {
  try {
    // Test simple de connexion à la base de données
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.json({ 
      message: 'Bonjour depuis le backend Express ! Connecté à PostgreSQL.',
      heure_bdd: result.rows[0].now 
    });
  } catch (error) {
    console.error('Erreur de connexion à la BDD', error);
    res.status(500).json({ message: 'Erreur de connexion à la base de données', error: error.message });
  }
});

// Route pour récupérer toutes les tâches
app.get('/api/tasks', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM tasks ORDER BY created_at DESC');
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des tâches', error: error.message });
  }
});

// Route pour ajouter une nouvelle tâche
app.post('/api/tasks', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Le nom de la tache est requis' });
  }

  try {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO tasks (name) VALUES ($1) RETURNING *', [name]);
    client.release();
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur interne ajout tache', error);
    res.status(500).json({ message: 'Erreur interne ajout tache', error: error.message });
  }
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur backend demarre sur http://localhost:${port}`);
}); 