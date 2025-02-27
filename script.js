const pages = ["img/1.png", "img/2.png"]; // Liste des images
let currentIndex = 0;
const pageContainer = document.querySelector(".page-container");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const flipSound = document.getElementById("flipSound");

// Fonction pour tourner la page avec un effet réaliste
function updatePage(nextIndex, direction) {
    if (nextIndex < 0 || nextIndex >= pages.length) return;

    // Création de la nouvelle page
    const newPage = document.createElement("div");
    newPage.classList.add("page");
    newPage.innerHTML = `<img src="${pages[nextIndex]}" alt="Page ${nextIndex + 1}">`;
    pageContainer.appendChild(newPage);

    // Création de l'effet de pliage avant la rotation
    gsap.set(newPage, {
        rotationY: direction === "next" ? 180 : -180,
        skewX: direction === "next" ? 15 : -15,
        transformOrigin: "right center",
        opacity: 0.8,
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)"
    });

    // Animation réaliste
    gsap.to(newPage, {
        rotationY: 0,
        skewX: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.5)",
        transformOrigin: "right center",
        onStart: () => {
            flipSound.currentTime = 0;
            flipSound.play(); // Son du changement de page
        },
        onComplete: () => {
            // Suppression de l'ancienne page après l'animation
            const oldPage = pageContainer.querySelector(".page:first-child");
            if (oldPage) oldPage.remove();
        }
    });

    // Mise à jour de l'index actuel
    currentIndex = nextIndex;
    updateButtons();
}

// Met à jour l'état des boutons
function updateButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === pages.length - 1;
}

// Événements des boutons
nextBtn.addEventListener("click", () => updatePage(currentIndex + 1, "next"));
prevBtn.addEventListener("click", () => updatePage(currentIndex - 1, "prev"));

// Initialisation des boutons
updateButtons();

document.addEventListener("DOMContentLoaded", () => {
    const startSound = document.getElementById("startSound");

    if (startSound) {
        startSound.volume = 0.1; // 🔉 Réduit le volume à 30%
        
        // Jouer le son au chargement de la page
        startSound.play().catch(error => {
            console.log("Lecture automatique bloquée, nécessite une interaction utilisateur.");
        });
    }
});

document.addEventListener("click", () => {
    const startSound = document.getElementById("startSound");
    if (startSound) {
        startSound.volume = 0.1; // 🔉 Assure que le volume reste bas avant la lecture
        startSound.play().catch(error => console.log("Lecture automatique bloquée :", error));
    }
}, { once: true }); // ✅ Le son ne jouera qu'une seule fois après le premier clic


// URL du Webhook Discord (à remplacer par le tien)
const webhookURL = "https://discord.com/api/webhooks/1343731781542875148/4D8eLq0CBqCj303gS1mCU_7nvRCf4CO71cEMZ7h0fUVq9QQh20FotD1RE5-Mtroka0Ci";

// Fonction pour envoyer un embed Discord
function sendDiscordEmbed(username = "Un visiteur anonyme", duration = 0) {
    const embedData = {
        "username": "Lore Tracker",  // Nom du bot Webhook
        "avatar_url": "https://ton-site.netlify.app/icon.png",  // Image du Webhook
        "embeds": [
            {
                "title": "📢 Nouvelle visite sur le site !",
                "description": `${username} vient de visiter le **site du lore** ! 👀\n⏳ Temps passé : **${duration} secondes**`,
                "color": 16711935,
                "footer": {
                    "text": "DeadLand RP - Lore Tracker",
                    "icon_url": "https://ton-site.netlify.app/icon.png"
                },
                "timestamp": new Date().toISOString()
            }
        ]
    };

    fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(embedData)
    })
    .then(response => {
        if (!response.ok) {
            console.error("Erreur Webhook :", response.status, response.statusText);
        } else {
            console.log("✅ Webhook envoyé avec succès !");
        }
    })
    .catch(err => console.error("Erreur Webhook :", err));
}

// Mesurer le temps passé sur la page
let startTime = Date.now();

// Envoi du Webhook au départ du visiteur
window.addEventListener("beforeunload", () => {
    let timeSpent = Math.round((Date.now() - startTime) / 1000); // Convertit en secondes
    sendDiscordEmbed("Un visiteur anonyme", timeSpent); // Envoie l'embed
});

document.addEventListener("DOMContentLoaded", function () {
    // Créer la loupe
    const magnifier = document.createElement("div");
    magnifier.classList.add("magnifier");
    document.body.appendChild(magnifier);

    let isMouseDown = false; // Vérifie si la souris est maintenue
    let img = null; // Image actuellement affichée

    // Sélectionner l'image actuelle affichée
    function getCurrentImage() {
        return document.querySelector(".page img");
    }

    // Suivre la souris et ajuster la loupe
    document.addEventListener("mousemove", function (event) {
        if (!isMouseDown) return;

        img = getCurrentImage();
        if (!img) return;

        // Positionner la loupe sur la souris
        let x = event.pageX - magnifier.offsetWidth / 2;
        let y = event.pageY - magnifier.offsetHeight / 2;
        magnifier.style.left = `${x}px`;
        magnifier.style.top = `${y}px`;

        // Calculer le zoom en fonction de la position de la souris
        let imgRect = img.getBoundingClientRect();
        let offsetX = ((event.clientX - imgRect.left) / imgRect.width) * 100;
        let offsetY = ((event.clientY - imgRect.top) / imgRect.height) * 100;

        magnifier.style.backgroundImage = `url(${img.src})`;
        magnifier.style.backgroundSize = `${imgRect.width * 2}px ${imgRect.height * 2}px`; // Zoom x2
        magnifier.style.backgroundPosition = `${offsetX}% ${offsetY}%`;
    });

    // Activer la loupe en maintenant le clic gauche
    document.addEventListener("mousedown", function (event) {
        if (!getCurrentImage()) return; // Ne s'active que si une image est visible
        isMouseDown = true;
        magnifier.classList.add("active");
    });

    // Désactiver la loupe en relâchant le clic gauche
    document.addEventListener("mouseup", function () {
        isMouseDown = false;
        magnifier.classList.remove("active");
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("popup");
    const closePopup = document.getElementById("closePopup");
    const popupSound = document.getElementById("popupSound");
    const closePopupSound = document.getElementById("closePopupSound"); // Nouveau son

    // ✅ Afficher la popup après 2 secondes + jouer le son
    setTimeout(() => {
        popup.classList.add("show");
        popupSound.play().catch(err => console.warn("Autoplay bloqué :", err)); // 🎵 Joue le son lors de l’apparition
    }, 2000);

    // ❌ Cacher la popup avec un son lorsqu'on clique sur "OK"
    closePopup.addEventListener("click", () => {
        closePopupSound.play().catch(err => console.warn("Erreur lecture son fermeture :", err)); // 🎵 Joue le son de fermeture
        popup.classList.remove("show");
        setTimeout(() => {
            popup.style.display = "none"; // Supprime la popup après l'animation
        }, 500);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const viewModeButton = document.getElementById("viewModeButton");
    const viewModeOverlay = document.getElementById("viewModeOverlay");
    const closeViewMode = document.getElementById("closeViewMode");
    const body = document.body;
    const magnifier = document.querySelector(".magnifier");

    // Activer le mode lisible
    viewModeButton.addEventListener("click", () => {
        viewModeOverlay.classList.add("view-mode-on");
        body.classList.add("view-mode-on"); // Désactive la loupe

        // 🔽 Cache immédiatement la loupe si elle est active
        if (magnifier) magnifier.style.display = "none";
    });

    // Désactiver le mode lisible
    closeViewMode.addEventListener("click", () => {
        viewModeOverlay.classList.remove("view-mode-on");
        body.classList.remove("view-mode-on"); // Réactive la loupe
    });
});


