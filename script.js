// Utiliser la variable d'environnement pour le lien de l'API
const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
    console.error("L'URL de l'API n'est pas définie. Veuillez vérifier votre fichier .env.");
}
// Créer une variable d'environnement pour le lien de l'API
// const API_URL = 'https://uwmyhzcfdh.execute-api.eu-west-3.amazonaws.com/election';

let isCandidateSelected = false; // Suivi de la sélection d'un candidat
let isCodeEntered = false; // Suivi de la saisie dans l'input
let selectedCandidateId = null;

// Appel initial pour récupérer les candidats et démarrer le timer
window.onload = () => {
    getCandidates();
    startTimer();
};

// Fonction pour récupérer les candidats
async function getCandidates() {
    try {
        const response = await fetch(API_URL + '/candidates');
        const data = await response.json();

        if (data.body) {
            const body = JSON.parse(data.body);
            const candidates = body.candidates || []; // Ajout d'une sécurité

            if (candidates.length > 0) {
                // Calcul des statistiques
                const totalVotes = candidates.reduce((sum, candidate) => sum + (candidate.voteCount || 0), 0);
                const candidateCount = candidates.length;

                // Met à jour les statistiques dans le DOM
                document.getElementById('voteCount').textContent = totalVotes;
                document.getElementById('candidateCount').textContent = candidateCount;

                // Appel des fonctions pour afficher les candidats et le graphique
                displayCandidates(candidates);
                displayResultsChart(candidates);
                displayCandidatesInCarousel(candidates);
            } else {
                displayNoCandidates();
            }
        } else {
            throw new Error('Le body est manquant dans la réponse');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des candidats:', error);
        displayNoCandidates();
    }
}

function displayCandidates(candidates) {
    const candidatesContainer = document.getElementById('candidates-list');
    candidatesContainer.innerHTML = ''; // Vider le conteneur

    // Calculer le total des votes
    const totalVotes = candidates.reduce((sum, candidate) => sum + (candidate.voteCount || 0), 0);

    candidates.forEach(candidate => {
        const votePercentage = totalVotes > 0 ? Math.floor((candidate.voteCount / totalVotes) * 100) : 0; // Calcul du pourcentage

        const candidateElement = document.createElement('div');
        candidateElement.className = 'candidate-item p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-all shadow-lg cursor-pointer flex justify-between items-center';
        candidateElement.innerHTML = `
            <div>
                <h3 class="text-lg font-semibold">${candidate.name}</h3>
                <p class="text-sm">Votes: ${candidate.voteCount}</p>
            </div>
            <div class="text-2xl font-bold text-[#9745b7]">
                ${votePercentage}%
            </div>
        `;
        // Passer uniquement l'ID du candidat à la méthode selectCandidate
        candidateElement.addEventListener('click', () => selectCandidate(candidateElement, candidate.id));
        candidatesContainer.appendChild(candidateElement);
    });
}

function selectCandidate(card, candidateId) {
    // Retirer la bordure bleue des autres cartes
    document.querySelectorAll('.candidate-item').forEach(card => card.classList.remove('border-blue-500'));
    // Ajouter la bordure bleue à la carte sélectionnée
    card.classList.add('border-blue-500');

    // Trouver l'input du candidat et lui attribuer l'ID du candidat sélectionné
    const candidateInput = document.querySelector('input[name="candidate"]');
    if (candidateInput) {
        candidateInput.value = candidateId;
    }


    // Mettre à jour l'état de sélection
    isCandidateSelected = true;
    selectedCandidateId = candidateId;
    updateVoteButtonState(); // Vérifier si le bouton peut être activé
}

// Fonction pour activer/désactiver le bouton en fonction de la saisie du code de vote
function handleCodeInput() {
    const codeInput = document.getElementById('code').value;

    isCodeEntered = codeInput.trim() !== ''; // Vérifier si un code a été saisi
    updateVoteButtonState(); // Vérifier si le bouton peut être activé
}

// Fonction pour mettre à jour l'etat du bouton
function updateVoteButtonState() {
    const voteBtn = document.getElementById('voteBtn');

    if (isCandidateSelected && isCodeEntered) {
        // Les deux conditions sont remplies
        voteBtn.style.opacity = '1'; // Vert à 100%
        voteBtn.style.backgroundColor = '#22c55e'; // Vert (ex. : Tailwind "green-500")
        voteBtn.disabled = false; // Supprimer disabled
        voteBtn.style.cursor = 'pointer'; // Changer le curseur en pointeur
    } else if (isCandidateSelected || isCodeEntered) {
        // Une seule des conditions est remplie
        voteBtn.style.opacity = '0.5'; // Vert avec faible opacité
        voteBtn.style.backgroundColor = '#22c55e'; // Conserver le vert
        voteBtn.disabled = true; // Désactiver le bouton
        voteBtn.style.cursor = 'not-allowed'; // Curseur non autorisé
    } else {
        // Aucune condition remplie
        voteBtn.style.opacity = '0.3'; // Grisé
        voteBtn.style.backgroundColor = '#9ca3af'; // Gris (ex. : Tailwind "gray-400")
        voteBtn.disabled = true; // Désactiver le bouton
        voteBtn.style.cursor = 'not-allowed'; // Curseur non autorisé
    }
}

// Ajout de l’événement pour surveiller la saisie dans le champ de code
document.getElementById('code').addEventListener('input', handleCodeInput);

// Fonction pour afficher un message "aucun candidat"
function displayNoCandidates() {
    const candidatesContainer = document.getElementById('candidates-list');
    candidatesContainer.innerHTML = '<p class="text-lg font-semibold text-red-600">Aucun candidat disponible</p>';
}

// Fonction pour afficher les résultats en temps réel
let resultsChartInstance; // Variable globale pour suivre l'instance du graphique

function displayResultsChart(candidates) {
    const ctx = document.getElementById('resultsChart').getContext('2d');

    // Si un graphique existe déjà, détruisez-le
    if (resultsChartInstance) {
        resultsChartInstance.destroy();
    }

    // Préparer les données pour le graphique
    const labels = candidates.map(candidate => candidate.name);
    const votes = candidates.map(candidate => candidate.voteCount);

    // Créer une nouvelle instance de Chart.js
    resultsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Votes',
                data: votes,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Fonction pour afficher les candidats dans le carrousel
function displayCandidatesInCarousel(candidates) {
    const carousel = document.getElementById("carousel");
    carousel.innerHTML = '';

    candidates.forEach(candidate => {
        const item = document.createElement("div");
        item.className = 'carousel-item bg-gray-100 p-4 rounded-lg shadow-lg text-center flex flex-col items-center justify-center relative';
        item.innerHTML = `
            <div class="w-full h-full rounded-lg p-[2px] bg-gradient-to-r from-blue-500 via-white to-red-500">
                <div class="bg-gray-100 rounded-lg flex flex-col items-center justify-center p-4">
                    <img src="${candidate.img}" alt="${candidate.name}" class="w-24 h-24 rounded-full mx-auto mb-4 object-cover">
                    <p class="text-lg italic text-gray-600">"${candidate.speech}"</p>
                    <p class="text-sm text-gray-500 mt-2">- ${candidate.name}</p>
                </div>
            </div>
        `;
        carousel.appendChild(item);
    });

    let index = 0;
    setInterval(() => {
        index = (index + 1) % candidates.length;
        carousel.scrollTo({
            left: index * carousel.offsetWidth,
            behavior: "smooth"
        });
    }, 5000);
}

// Fonction pour gérer le timer
function startTimer() {
    const countdownDate = new Date("Dec 31, 2024 23:59:59").getTime();
    const timerElement = document.getElementById("timer");

    setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        timerElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
}

// Fonction pour envoyer le code de vote par mail
document.getElementById('getCodeBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    if (!email) {
        showToast('Veuillez entrer un email valide.', 'error');
        return;
    }

    try {
        const response = await fetch(API_URL + '/codes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        if (response.ok) {
            if (data.statusCode === 202) {
                showToast(data.body, 'success');

                // Réinitialiser le champ de code
                document.getElementById('email').value = '';
            } else {
                showToast(data.body, 'error');
            }
        } else {
            showToast(data.body, 'error');
        }
    } catch (error) {
        console.error("Erreur :", error);
        showToast('Une erreur est survenue.', 'error');
    }
});

document.getElementById('voteBtn').addEventListener('click', async () => {
    const code = document.getElementById('code').value.trim();

    if (!selectedCandidateId) {
        showToast('Veuillez sélectionner un candidat avant de voter.', 'error');
        return;
    }

    const voteData = {
        code: code,
        candidate_id: selectedCandidateId
    };

    // Envoi du vote à l'API via POST
    try {
        const response = await fetch(API_URL + '/votes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(voteData)
        });

        const data = await response.json();

        if (response.ok) {
            if (data.statusCode === 200) {
                showToast(data.body, 'success');
            } else {
                showToast(data.body, 'error');
            }
            
            // Réinitialiser le champ de code
            document.getElementById('code').value = '';
            // Mettre à jour l'etat du bouton
            voteBtn.style.opacity = '0.3'; // Grisé
            voteBtn.style.backgroundColor = '#9ca3af'; // Gris (ex. : Tailwind "gray-400")
            voteBtn.disabled = true; // Désactiver le bouton
            voteBtn.style.cursor = 'not-allowed'; // Curseur non autorisé

            // Réactualiser la liste des candidats
            await getCandidates();
        } else {
            // Affiche un message d'erreur spécifique
            showToast('Une erreur est survenue lors du vote.', 'error');
            
        }
    } catch (error) {
        console.error('Erreur lors de la soumission du vote :', error);
        showToast('Une erreur inattendue est survenue. Veuillez réessayer plus tard.', 'error');
    }
});

// Fonction pour afficher un message de toast
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');

    // Définir les couleurs selon le type
    const typeColors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
    };

    // Créer un élément toast
    const toast = document.createElement('div');
    toast.className = `p-4 rounded shadow-md ${typeColors[type]} transition-opacity duration-300 opacity-100`;
    toast.innerText = message;

    // Ajouter le toast dans le conteneur
    container.appendChild(toast);

    // Supprimer automatiquement le toast après 3 secondes
    setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
