const API_URL = 'http://localhost:5000/tasks';

const urlParams = new URLSearchParams(window.location.search);
const taskId = urlParams.get('id');

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

    // Charger les commentaires
    loadComments();
}

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

async function deleteComment(commentId) {
    try {
        const res = await fetch(`${API_URL}/${taskId}/comments/${commentId}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            throw new Error("Erreur lors de la suppression du commentaire");
        }

        console.log("Commentaire supprimé avec succès");
        loadComments(); // Recharger les commentaires après suppression
    } catch (error) {
        console.error("Erreur lors de la requête:", error);
    }
}

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

    // Recharger les commentaires après ajout
    loadComments();
});

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

// Charger la tâche et les commentaires au chargement de la page
loadTaskData();
