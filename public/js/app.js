const API_URL = 'http://localhost:5000/tasks';

// Soumettre le formulaire de création de tâche
document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Récupération des valeurs du formulaire
    const titre = document.getElementById('titre').value;
    const description = document.getElementById('description').value;
    const echeance = document.getElementById('echeance').value;
    const statut = document.getElementById('statut').value;
    const priorite = document.getElementById('priorite').value;
    const auteurNom = document.getElementById('auteurNom').value;
    const auteurPrenom = document.getElementById('auteurPrenom').value;
    const auteurEmail = document.getElementById('auteurEmail').value;
    const categorie = document.getElementById('categorie').value;
    const etiquettes = document.getElementById('etiquettes').value.split(',');

    const taskData = {
        titre,
        description,
        echeance,
        statut,
        priorite,
        auteur: {
            nom: auteurNom,
            prenom: auteurPrenom,
            email: auteurEmail
        },
        categorie,
        etiquettes
    };

    // Envoi de la tâche à l'API
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
    });

    // Rafraîchir la liste des tâches après ajout
    fetchTasks();
});

// Fonction pour récupérer les tâches en appliquant les filtres et le tri
async function fetchTasks(queryString = '') {
    const res = await fetch(`${API_URL}${queryString}`);
    const tasks = await res.json();

    // Affichage des tâches dans le DOM
    document.getElementById('taskList').innerHTML = tasks.map(task => {
        const dateCreation = new Date(task.dateCreation).toLocaleDateString('fr-FR');
        const dateEcheance = new Date(task.echeance).toLocaleDateString('fr-FR');
        
        return `
            <div class="task">
                <h3>${task.titre} &emsp; &emsp; (${task.etiquettes.join(', ')})</h3>
                <p><strong>Nom: </strong> ${task.auteur.nom} &emsp; <strong>Prenom:</strong> ${task.auteur.prenom} &emsp; <strong>Email:</strong> ${task.auteur.email}</p>
                <p>Créée le ${dateCreation}</p>
                <p>Echéance: ${dateEcheance}</p>
                <p>Priorité: [${task.priorite}] &emsp; Statut: [${task.statut}]  &emsp; Categorie: [${task.categorie}] </p>
                <p>Description:</p>
                <textarea readonly>${task.description}</textarea>
                <div class="task-buttons">
                    <button onclick="deleteTask('${task._id}')">Supprimer</button>&emsp;
                    <button onclick="window.location.href='modification.html?id=${task._id}'">Modifier</button>
                </div>
            </div>
        `;
    }).join('');
}

// Soumettre les filtres et appliquer la recherche
document.getElementById('filtersForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const searchQuery = document.getElementById('searchQuery').value.trim(); // Récupère la valeur de recherche entrée
    const tri = document.getElementById('tri').value;
    const ordre = document.getElementById('ordre').value;

    let queryParams = [];

    if (searchQuery) queryParams.push(`q=${searchQuery}`);
    if (tri) queryParams.push(`tri=${tri}`);
    if (ordre) queryParams.push(`ordre=${ordre}`);

    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

    fetchTasks(queryString);
});

// Fonction pour supprimer une tâche
async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTasks();  // Rafraîchir la liste des tâches après suppression
}

// Charger les tâches au démarrage de la page
fetchTasks();
