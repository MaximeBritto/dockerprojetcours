const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
const port = process.env.PORT || 3001;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());

app.get('/api', async (req, res) => {
  try {
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

app.get('/api/tasks', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM tasks ORDER BY created_at DESC');
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('[Backend] Erreur lors de la récupération des tâches:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des tâches', error: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  const { name } = req.body;
  console.log('[Backend] Reçu requête POST /api/tasks avec name: ', name);

  if (!name) {
    console.log('[Backend] Nom de tâche manquant, renvoi erreur 400');
    return res.status(400).json({ message: 'Le nom de la tache est requis' });
  }

  try {
    console.log('[Backend] Tentative d\'insertion de la tâche "', name, '" en base de données.');
    const client = await pool.connect();
    const result = await client.query('INSERT INTO tasks (name) VALUES ($1) RETURNING *', [name]);
    client.release();
    console.log('[Backend] Tâche "', name, '" ajoutée avec succès:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // J'ai légèrement modifié le message d'erreur ici pour correspondre au style des autres logs
    console.error('[Backend] Erreur interne lors de l\'ajout de la tâche:', error);
    res.status(500).json({ message: 'Erreur interne lors de l\'ajout de la tâche', error: error.message });
  }
});

// Route pour supprimer une tâche
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`[Backend] Reçu requête DELETE /api/tasks/${id}`);

  try {
    console.log(`[Backend] Tentative de suppression de la tâche ID: ${id}`);
    const client = await pool.connect();
    // Vérifier si la tâche existe avant de la supprimer peut être une bonne pratique, mais pour simplifier:
    const result = await client.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    client.release();

    if (result.rowCount === 0) {
      console.log(`[Backend] Tâche ID: ${id} non trouvée pour suppression.`);
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    console.log(`[Backend] Tâche ID: ${id} supprimée avec succès.`);
    res.status(200).json({ message: 'Tâche supprimée avec succès', deletedTask: result.rows[0] }); // Ou 204 No Content
  } catch (error) {
    console.error(`[Backend] Erreur interne lors de la suppression de la tâche ID: ${id}:`, error);
    res.status(500).json({ message: 'Erreur interne lors de la suppression de la tâche', error: error.message });
  }
});

// Route pour modifier une tâche
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  console.log(`[Backend] Reçu requête PUT /api/tasks/${id} avec nouveau nom: ${name}`);

  if (!name) {
    console.log('[Backend] Nom de tâche manquant pour la modification, renvoi erreur 400');
    return res.status(400).json({ message: 'Le nouveau nom de la tâche est requis' });
  }

  try {
    console.log(`[Backend] Tentative de modification de la tâche ID: ${id} avec nouveau nom: "${name}"`);
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE tasks SET name = $1, created_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [name, id]
    );
    client.release();

    if (result.rowCount === 0) {
      console.log(`[Backend] Tâche ID: ${id} non trouvée pour modification.`);
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    console.log(`[Backend] Tâche ID: ${id} modifiée avec succès:`, result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`[Backend] Erreur interne lors de la modification de la tâche ID: ${id}:`, error);
    res.status(500).json({ message: 'Erreur interne lors de la modification de la tâche', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Serveur backend demarre sur http://localhost:${port}`);
});