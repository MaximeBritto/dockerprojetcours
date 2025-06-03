import Head from "next/head";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import styles from "@/styles/Home.module.css";

// Fonction helper pour envoyer des logs au backend (API route Next.js)
async function logToServer(message, data = null) {
  try {
    await fetch('/api/log_event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, data }),
    });
  } catch (error) {
    // On logue l'échec de l'envoi du log côté client uniquement
    console.warn('[Frontend Client] Échec de l\'envoi du log au serveur:', error);
  }
}

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // L'URL de base de l'API est injectée via les variables d'environnement par Docker Compose
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fonction pour récupérer les tâches
  const fetchTasks = async () => {
    console.log('[Frontend Client] Appel de fetchTasks pour récupérer les tâches...');
    logToServer('[Frontend Server Log] Appel de fetchTasks pour récupérer les tâches.'); // Appel à logToServer
    if (!apiUrl) {
      console.error('[Frontend Client] Erreur: L\'URL de l\'API n\'est pas configurée.');
      logToServer('[Frontend Server Log] Erreur: L\'URL de l\'API backend n\'est pas configurée.'); // Appel à logToServer
      setError('Erreur: L\'URL de l\'API n\'est pas configurée.');
      return;
    }
    try {
      console.log(`[Frontend Client] Envoi requête GET à ${apiUrl}/tasks`);
      logToServer(`[Frontend Server Log] Envoi requête GET à ${apiUrl}/tasks`); // Appel à logToServer
      const response = await fetch(`${apiUrl}/tasks`);
      if (!response.ok) {
        logToServer(`[Frontend Server Log] Erreur HTTP lors de la récupération des tâches: ${response.status}`); // Appel à logToServer
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      console.log('[Frontend Client] Tâches récupérées avec succès:', data);
      logToServer('[Frontend Server Log] Tâches récupérées avec succès.', data); // Appel à logToServer
      setTasks(data);
    } catch (error) {
      console.error('[Frontend Client] Erreur lors de la récupération des tâches:', error);
      logToServer('[Frontend Server Log] Erreur lors de la récupération des tâches.', { message: error.message }); // Appel à logToServer
      setError(`Erreur lors de la récupération des tâches: ${error.message}`);
    }
  };

  // Charger les tâches au montage du composant
  useEffect(() => {
    fetchTasks();
  }, []); // Le tableau vide signifie que cet effet ne s'exécute qu'une fois (au montage)

  // Gestion de l'ajout d'une tâche
  const handleAddTask = async (e) => {
    e.preventDefault();
    console.log(`[Frontend Client] Tentative d'ajout de la tâche: ${newTaskName}`);
    logToServer(`[Frontend Server Log] Tentative d'ajout de la tâche: ${newTaskName}`); // Appel à logToServer

    if (!apiUrl) {
      console.error('[Frontend Client] Erreur: L\'URL de l\'API n\'est pas configurée pour l\'ajout.');
      logToServer('[Frontend Server Log] Erreur: L\'URL de l\'API backend n\'est pas configurée pour l\'ajout.'); // Appel à logToServer
      setError('Erreur: L\'URL de l\'API n\'est pas configurée.');
      return;
    }
    if (!newTaskName.trim()) {
      console.warn('[Frontend Client] Tentative d\'ajout d\'une tâche vide.');
      logToServer('[Frontend Server Log] Tentative d\'ajout d\'une tâche vide.'); // Appel à logToServer
      return;
    }

    try {
      console.log(`[Frontend Client] Envoi requête POST à ${apiUrl}/tasks avec name: ${newTaskName}`);
      logToServer(`[Frontend Server Log] Envoi requête POST à ${apiUrl}/tasks avec name: ${newTaskName}`); // Appel à logToServer
      const response = await fetch(`${apiUrl}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newTaskName }),
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const addedTask = await response.json();
      console.log('[Frontend Client] Tâche ajoutée avec succès:', addedTask);
      logToServer('[Frontend Server Log] Tâche ajoutée avec succès.', addedTask); // Appel à logToServer
      fetchTasks();
      setNewTaskName('');
    } catch (error) {
      console.error('[Frontend Client] Erreur lors de l\'ajout de la tâche:', error);
      logToServer('[Frontend Server Log] Erreur lors de l\'ajout de la tâche.', { name: newTaskName, message: error.message }); // Appel à logToServer
      setError(`Erreur lors de l\'ajout de la tâche: ${error.message}`);
    }
  };

  const handleDeleteTask = async (taskId) => {
    console.log(`[Frontend Client] Tentative de suppression de la tâche ID: ${taskId}`);
    logToServer(`[Frontend Server Log] Tentative de suppression de la tâche ID: ${taskId}`);

    if (!apiUrl) {
      const errorMsg = '[Frontend Client] Erreur: L\'URL de l\'API n\'est pas configurée pour la suppression.';
      console.error(errorMsg);
      logToServer('[Frontend Server Log] Erreur: L\'URL de l\'API backend n\'est pas configurée pour la suppression.');
      setError(errorMsg);
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      console.log('[Frontend Client] Suppression annulée par l\'utilisateur.');
      logToServer('[Frontend Server Log] Suppression annulée par l\'utilisateur pour tâche ID: ', taskId);
      return;
    }

    try {
      console.log(`[Frontend Client] Envoi requête DELETE à ${apiUrl}/tasks/${taskId}`);
      logToServer(`[Frontend Server Log] Envoi requête DELETE à ${apiUrl}/tasks/${taskId}`);
      const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json(); // Essayer de lire le corps de l'erreur
        logToServer(`[Frontend Server Log] Erreur HTTP lors de la suppression: ${response.status}`, errorData);
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }
      
      // const result = await response.json(); // DELETE peut ne pas renvoyer de corps JSON ou un corps vide
      // console.log('[Frontend Client] Tâche supprimée, réponse:', result);
      // logToServer('[Frontend Server Log] Tâche supprimée avec succès côté serveur.', result);
      
      // Pour simplifier, on logue un message générique de succès et on re-fetch
      console.log(`[Frontend Client] Tâche ID: ${taskId} marquée pour suppression, re-fetching tasks.`);
      logToServer(`[Frontend Server Log] Tâche ID: ${taskId} supprimée, re-fetching tasks.`);
      fetchTasks(); // Recharger la liste des tâches
    } catch (error) {
      console.error('[Frontend Client] Erreur lors de la suppression de la tâche:', error);
      logToServer('[Frontend Server Log] Erreur lors de la suppression de la tâche.', { taskId, message: error.message });
      setError(`Erreur lors de la suppression de la tâche: ${error.message}`);
    }
  };

  const handleEditTask = async (task) => {
    console.log(`[Frontend Client] Tentative de modification de la tâche ID: ${task.id}, nom actuel: "${task.name}"`);
    logToServer(`[Frontend Server Log] Modification demandée pour tâche ID: ${task.id}, nom: "${task.name}"`);

    const newTaskName = prompt('Entrez le nouveau nom pour la tâche:', task.name);

    if (newTaskName === null) { // L'utilisateur a cliqué sur Annuler
      console.log('[Frontend Client] Modification annulée par l\'utilisateur.');
      logToServer('[Frontend Server Log] Modification annulée par l\'utilisateur pour tâche ID: ', task.id);
      return;
    }

    if (!newTaskName.trim()) {
      console.warn('[Frontend Client] Nouveau nom de tâche vide, modification annulée.');
      logToServer('[Frontend Server Log] Tentative de modification avec nom vide pour tâche ID: ', task.id);
      alert('Le nom de la tâche ne peut pas être vide.');
      return;
    }

    if (newTaskName.trim() === task.name) {
      console.log('[Frontend Client] Nouveau nom identique à l\'ancien, aucune modification.');
      logToServer('[Frontend Server Log] Nouveau nom identique à l\'ancien pour tâche ID: ', task.id);
      return;
    }

    if (!apiUrl) {
      const errorMsg = '[Frontend Client] Erreur: L\'URL de l\'API n\'est pas configurée pour la modification.';
      console.error(errorMsg);
      logToServer('[Frontend Server Log] Erreur: L\'URL de l\'API backend n\'est pas configurée pour la modification.');
      setError(errorMsg);
      return;
    }

    try {
      console.log(`[Frontend Client] Envoi requête PUT à ${apiUrl}/tasks/${task.id} avec nouveau nom: "${newTaskName}"`);
      logToServer(`[Frontend Server Log] Envoi requête PUT à ${apiUrl}/tasks/${task.id} avec nouveau nom: "${newTaskName}"`);
      const response = await fetch(`${apiUrl}/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newTaskName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        logToServer(`[Frontend Server Log] Erreur HTTP lors de la modification: ${response.status}`, errorData);
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      const updatedTask = await response.json();
      console.log('[Frontend Client] Tâche modifiée avec succès:', updatedTask);
      logToServer('[Frontend Server Log] Tâche modifiée avec succès.', updatedTask);
      fetchTasks(); // Recharger la liste des tâches
    } catch (error) {
      console.error('[Frontend Client] Erreur lors de la modification de la tâche:', error);
      logToServer('[Frontend Server Log] Erreur lors de la modification de la tâche.', { taskId: task.id, newName: newTaskName, message: error.message });
      setError(`Erreur lors de la modification de la tâche: ${error.message}`);
    }
  };

  return (
    <>
      <Head>
        <title>Liste de Tâches Docker</title>
        <meta name="description" content="Application de liste de tâches avec Next.js, Node.js, et PostgreSQL, orchestrée par Docker." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.page}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Ma Liste de Tâches
          </h1>

          {error && <p style={{ color: 'red' }}>Erreur: {error}</p>}

          <form onSubmit={handleAddTask} className={styles.form}>
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Nouvelle tâche..."
              className={styles.input}
            />
            <button type="submit" className={styles.button}>Ajouter</button>
          </form>

          {loading && <p>Chargement des tâches...</p>}
          
          {!loading && tasks.length === 0 && !error && <p>Aucune tâche pour le moment. Ajoutez-en une !</p>}

          <ul className={styles.taskList}>
            {tasks.map((task) => (
              <li key={task.id} className={styles.taskItem}>
                <span>
                  {task.name} 
                  <small style={{ marginLeft: '10px', color: '#777' }}>
                    (ID: {task.id} - Ajouté le: {new Date(task.created_at).toLocaleDateString()})
                  </small>
                </span>
                <div className={styles.taskActions}>
                  <button onClick={() => handleEditTask(task)} className={styles.editButton}>Modifier</button>
                  <button onClick={() => handleDeleteTask(task.id)} className={styles.deleteButton}>Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </>
  );
}
