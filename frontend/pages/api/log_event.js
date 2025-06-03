export default function handler(req, res) {
  if (req.method === 'POST') {
    const { message, data } = req.body;
    if (message) {
      // Ce console.log s'exécutera côté serveur dans le conteneur Next.js
      // et sera visible dans les logs Docker Desktop du conteneur frontend.
      if (data) {
        console.log(`[Frontend API Event] ${message}`, data);
      } else {
        console.log(`[Frontend API Event] ${message}`);
      }
      res.status(200).json({ status: 'Log enregistré côté serveur' });
    } else {
      res.status(400).json({ error: 'Message manquant' });
    }
  } else {
    // Gérer les autres méthodes ou renvoyer une erreur
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 