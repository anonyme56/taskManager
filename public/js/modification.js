const API_URL = 'http://localhost:5000/tasks';

const urlParams = new URLSearchParams(window.location.search);
const taskId = urlParams.get('id');


//chargement ==================================================================================================================]
// rechargement des données de la tâche
async function loadTaskData() {
    const res = await fetch(`${API_URL}/${taskId}`);
    const task = await res.json();

    document.getElementById('editTitre').value = task.titre;
    document.getElementById('editDescription').value = task.description;
    document.getElementById('editEcheance').value = task.echeance ? task.echeance.slice(0, 16) : '';
    document.getElementById('editStatut').value = task.statut;
    document.getElementById('editPriorite').value = task.priorite;
    document.getElementById('editCategorie').value = task.categorie;
    document.getElementById('editEtiquettes').value = task.etiquettes.join(', ');


    loadComments();
}

//recharger les sous taches
async function loadSubtasks() {
    const res = await fetch(`${API_URL}/${taskId}`);
    const task = await res.json();

    const subtaskList = document.getElementById('subtaskList');
    subtaskList.innerHTML = ''; 

    task.sousTaches.forEach(sousTache => {
        const subtaskDiv = document.createElement('div');
        subtaskDiv.classList.add('subtask');
    
        const subtaskInfo = document.createElement('div');
        subtaskInfo.classList.add('subtask-info');
    
        const subtaskTitle = document.createElement('span');
        subtaskTitle.classList.add('subtask-title');
        subtaskTitle.textContent = sousTache.titre;
    
        const subtaskStatus = document.createElement('span');
        subtaskStatus.classList.add('subtask-status');
        subtaskStatus.textContent = `- ${sousTache.statut}`;
    
        const subtaskDate = document.createElement('span');
        subtaskDate.classList.add('subtask-date');
        subtaskDate.textContent = `(Échéance : ${new Date(sousTache.echeance).toLocaleString()})`;
    
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.classList.add('delete-btn-subtask');
        deleteButton.addEventListener('click', async () => {
            await deleteSubtask(sousTache._id);
        });
    
        subtaskInfo.appendChild(subtaskTitle);
        subtaskInfo.appendChild(subtaskStatus);
        subtaskInfo.appendChild(subtaskDate);
        subtaskDiv.appendChild(subtaskInfo);
        subtaskDiv.appendChild(deleteButton);
        document.getElementById('subtaskList').appendChild(subtaskDiv);
    });
}

//recharger  les sommentaires 
async function loadComments() {
    const res = await fetch(`${API_URL}/${taskId}`);
    const task = await res.json();

    const commentList = document.getElementById('commentList');
    commentList.innerHTML = ''; 

    task.commentaires.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.innerHTML = `
            <p><strong>${comment.auteur}</strong> - ${new Date(comment.date).toLocaleString()}</p>
        `;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.classList.add('delete-btn'); 
        deleteButton.addEventListener('click', async () => {
            await deleteComment(comment._id);
        });
        
        const content = document.createElement('textarea');
        content.textContent = comment.contenu;
        content.classList.add('content-comment'); 
        content.setAttribute('readonly', true);
        
        commentDiv.appendChild(content);
        commentDiv.appendChild(deleteButton);
        commentList.appendChild(commentDiv);
    });
}
//chargement ==================================================================================================================]

//ajout ==================================================================================================================]
 
async function addSubtask(event) { // ajout des sous taches
    event.preventDefault();

    const newSubtask = {
        titre: document.getElementById('subtaskTitre').value,
        statut: document.getElementById('subtaskStatut').value,
        echeance: document.getElementById('subtaskEcheance').value || null
    };

    const res = await fetch(`${API_URL}/${taskId}/subtasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubtask)
    });

    if (res.ok) {
        loadSubtasks(); // Recharger sous taches après ajout
    }
}
//ajout ==================================================================================================================]

//supression ==================================================================================================================]

//suppression des sous taches
async function deleteComment(commentId) {
    try {
        const res = await fetch(`${API_URL}/${taskId}/comments/${commentId}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            throw new Error("Erreur lors de la suppression du commentaire");
        }

        console.log("Commentaire supprimé avec succès");
        loadComments(); 
    } catch (error) {
        console.error("Erreur lors de la requête:", error);
    }
}


//suppression des sous taches
async function deleteSubtask(index) {
    const res = await fetch(`${API_URL}/${taskId}/subtasks/${index}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        loadSubtasks(); // Recharger la liste après suppression
    }
}
//supression ==================================================================================================================]

//ajout page ==================================================================================================================]
document.getElementById('addCommentForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const newComment = {
        auteur: document.getElementById('commentAuteur').value,
        contenu: document.getElementById('commentContent').value,
    };

    await fetch(`${API_URL}/${taskId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment)
    });

    
    loadComments(); // Recharger les commentaires après ajout
});

document.getElementById('addSubtaskForm').addEventListener('submit', addSubtask);

document.getElementById('editTaskForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const updatedTask = {
        titre: document.getElementById('editTitre').value,
        description: document.getElementById('editDescription').value,
        echeance: document.getElementById('editEcheance').value,
        statut: document.getElementById('editStatut').value,
        priorite: document.getElementById('editPriorite').value,
        categorie: document.getElementById('editCategorie').value,
        etiquettes: document.getElementById('editEtiquettes').value.split(',').map(tag => tag.trim())
    };

    await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
    });

    window.location.href = "index.html"; 
});
//ajout page ==================================================================================================================]

loadSubtasks();
loadTaskData(); // Charger la tâche et les commentaires et les sous taches au chargement de la page
