const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));  
});

app.get('/modify/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(404).send('Tâche non trouvée');
    }
    res.sendFile(path.join(__dirname, 'public', 'modification.html'));  
});

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/taskmanager')
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error(err));

// Définition du modèle de données
const TacheSchema = new mongoose.Schema({
    titre: { type: String, required: false },
    description: { type: String, required: false },
    dateCreation: { type: Date, default: Date.now },
    echeance: { type: Date, required: false, default: null },
    statut: { type: String, enum: ['à faire', 'en cours', 'terminée', 'annulée'], required: false, default: null },
    priorite: { type: String, enum: ['basse', 'moyenne', 'haute', 'critique'], required: false, default: null },
    auteur: {
        nom: { type: String, required: false, default: null },
        prenom: { type: String, required: false, default: null },
        email: { type: String, required: false, default: null }
    },
    categorie: { type: String, required: false, default: null },
    etiquettes: { type: [String], required: false, default: [] },
    sousTaches: [{
        titre: { type: String, required: false, default: null },
        statut: { type: String, required: false, default: null },
        echeance: { type: Date, required: false, default: null }
    }],
    commentaires: [{
        auteur: { type: String, required: false, default: null },
        date: { type: Date, default: Date.now },
        contenu: { type: String, required: false, default: null }
    }],
    historiqueModifications: [{
        champModifie: { type: String, required: false, default: null },
        ancienneValeur: { type: String, required: false, default: null },
        nouvelleValeur: { type: String, required: false, default: null },
        date: { type: Date, default: Date.now }
    }]
});

const Task = mongoose.model('Task', TacheSchema);

// Route pour servir le fichier index.html


// Routes API
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find(req.query).sort(req.query.tri ? { [req.query.tri]: req.query.ordre === 'desc' ? -1 : 1 } : {});
    res.json(tasks);
});

app.get('/tasks/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.json(task);
});

app.post('/tasks', async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
});

app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const updatedTask = req.body;

    try {
        await Task.findByIdAndUpdate(id, updatedTask);
        res.json({ message: "Tâche mise à jour avec succès !" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la mise à jour de la tâche" });
    }
});


app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

app.post('/tasks/:id/comments', async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(404).send('Tâche non trouvée');
    }

    const newComment = {
        auteur: req.body.auteur,
        contenu: req.body.contenu,
        date: new Date(),
    };

    task.commentaires.push(newComment);
    await task.save();
    res.status(201).json(newComment);
});

app.delete('/tasks/:taskId/comments/:commentId', async (req, res) => {
    const { taskId, commentId } = req.params;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: "Tâche non trouvée" });
        }

        // Filtrer pour supprimer le commentaire
        task.commentaires = task.commentaires.filter(comment => comment._id.toString() !== commentId);
        
        await task.save();
        res.status(200).json({ message: "Commentaire supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression du commentaire" });
    }
});


// Lancer le serveur
const PORT = 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
