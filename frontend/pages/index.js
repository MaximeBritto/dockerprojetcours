import Head from "next/head";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import styles from "@/styles/Home.module.css";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // L'URL de base de l'API est injectée via les variables d'environnement par Docker Compose
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fonction pour récupérer les tâches
  const fetchTasks = async () => {
    if (!apiUrl) {
      setError('L\'URL de l\'API n\'est pas configurée.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/tasks`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la récupération des tâches:", err);
      setError(err.message || 'Impossible de charger les tâches.');
      setTasks([]); // S'assurer que tasks est un tableau en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  // Charger les tâches au montage du composant
  useEffect(() => {
    fetchTasks();
  }, []); // Le tableau vide signifie que cet effet ne s'exécute qu'une fois (au montage)

  // Gestion de l'ajout d'une tâche
  const handleAddTask = async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page
    if (!newTaskName.trim()) {
      alert('Le nom de la tâche ne peut pas être vide.');
      return;
    }
    if (!apiUrl) {
      setError('L\'URL de l\'API n\'est pas configurée pour l\'ajout.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newTaskName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      setNewTaskName(''); // Réinitialise le champ de saisie
      fetchTasks(); // Recharge la liste des tâches
      setError(null);
    } catch (err) {
      console.error("Erreur lors de l'ajout de la tâche:", err);
      setError(err.message || 'Impossible d\'ajouter la tâche.');
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
                {task.name} 
                <small style={{ marginLeft: '10px', color: '#777' }}>
                  (ID: {task.id} - Ajouté le: {new Date(task.created_at).toLocaleDateString()})
                </small>
              </li>
            ))}
          </ul>
        </main>
        <footer className={styles.footer}>
          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            Learn
          </a>
          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/window.svg"
              alt="Window icon"
              width={16}
              height={16}
            />
            Examples
          </a>
          <a
            href="https://nextjs.org?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Go to nextjs.org →
          </a>
        </footer>
      </div>
    </>
  );
}
