const API_URL = 'http://localhost:5000/tasks';

async function fetchTasks() {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    document.getElementById('taskList').innerHTML = tasks.map(task => {
        
        const dateCreation = new Date(task.dateCreation).toLocaleDateString('fr-FR');
        const dateEcheance = new Date(task.echeance).toLocaleDateString('fr-FR');
        
        return `
            <div class="task">
            <h3>${task.titre}</h3>
                <p><strong>Nom: </strong> ${task.auteur.nom} &emsp; <strong>Prenom:</strong> ${task.auteur.prenom} &emsp; <strong>Email:</strong> ${task.auteur.email}</p>
                <p> Crée le ${dateCreation}</p> 
                <p>Echéance: ${dateEcheance}</p> 
                <p>Priorité: [${task.priorite}]  Statut: [${task.statut}]</p> 
                <p>Description: </p> 
                <textarea readonly>${task.description}</textarea>
               <div class="task-buttons">
                <button id="deleteButton" onclick="deleteTask('${task._id}')">Supprimer</button>
                <button id="editButton" onclick="window.location.href='modification.html?id=${task._id}'">Modifier</button>
               </div>
            </div>
        `;
    }).join('');
}






document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const titre = document.getElementById('titre').value;
    const description = document.getElementById('description').value;
    const echeance = document.getElementById('echeance').value;  
    const statut = document.getElementById('statut').value;  
    const priorite = document.getElementById('priorite').value;  
    const auteurNom = document.getElementById('auteurNom').value;  
    const auteurPrenom = document.getElementById('auteurPrenom').value;  
    const auteurEmail = document.getElementById('auteurEmail').value;  
    const categorie = document.getElementById('categorie').value;  
    const etiquettes = document.getElementById('etiquettes').value.split(',');  // Liste d'étiquettes séparées par des virgules
   
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

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)  // Corrigé ici
    });
    fetchTasks();
});

async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTasks();
}

fetchTasks();
