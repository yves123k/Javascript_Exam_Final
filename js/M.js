// Matières en mémoire
let matieres = [];


// ---- FONCTIONS UTILITAIRES ----

function genId() {
  return "id_" + Date.now();
}

// Calcule la somme de tous les coefficients
function totalCoefficients() {
  let total = 0;
  for (const mat of matieres) {
    total += mat.coefficient;
  }
  return total;
}


// ---- AFFICHAGE ----

// Reconstruit le tableau des matières à l'écran
function renderMatieres() {
  const tbody = document.querySelector(".subjects-table tbody");
  const info  = document.querySelector(".subject-summary p");

  tbody.innerHTML = "";

  if (matieres.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:#888;">Aucune matière enregistrée.</td></tr>`;
    info.textContent = "0 matière enregistrée · Total coefficients : 0";
    return;
  }

  for (const mat of matieres) {
    tbody.insertAdjacentHTML("beforeend", `
      <tr data-id="${mat.id}">
        <td>${mat.nom}</td>
        <td><span class="coeff-badge">${mat.coefficient}</span></td>
        <td>
          <button class="action-btn delete-matiere-btn" type="button" aria-label="Supprimer ${mat.nom}">
            <i class="bi bi-trash3"></i>
          </button>
        </td>
      </tr>
    `);
  }

  // Mettre à jour le compteur en haut
  info.textContent = matieres.length + " matière(s) enregistrée(s) · Total coefficients : " + totalCoefficients();
}


// ---- AJOUT D'UNE MATIÈRE ----

document.querySelector(".subject-entry-form button[type='button']")
  .addEventListener("click", function () {
    const form  = document.querySelector(".subject-entry-form");
    const nom   = form.querySelector("input[type='text']").value.trim();
    const coeff = parseInt(form.querySelector("input[type='number']").value);

    if (nom === "") {
      alert("Veuillez saisir le nom de la matière.");
      return;
    }
    if (isNaN(coeff) || coeff < 1) {
      alert("Veuillez saisir un coefficient valide (minimum 1).");
      return;
    }

    // Vérifier si la matière existe déjà
    const dejaExiste = matieres.find(m => m.nom.toLowerCase() === nom.toLowerCase());
    if (dejaExiste) {
      alert("Cette matière existe déjà.");
      return;
    }

    matieres.push({
      id          : genId(),
      nom         : nom,
      coefficient : coeff
    });

    // Vider le formulaire
    form.querySelector("input[type='text']").value  = "";
    form.querySelector("input[type='number']").value = "";

    renderMatieres();
  });


// ---- SUPPRESSION D'UNE MATIÈRE ----

document.querySelector(".subjects-table")
  .addEventListener("click", function (event) {
    const btn = event.target.closest(".delete-matiere-btn");
    if (!btn) return;

    const tr    = btn.closest("tr");
    const matId = tr.dataset.id;

    const matiere = matieres.find(m => m.id === matId);
    if (!matiere) return;

    if (!confirm("Supprimer la matière « " + matiere.nom + " » ?")) return;

    // Garder toutes les matières sauf celle supprimée
    matieres = matieres.filter(m => m.id !== matId);

    renderMatieres();
  });


// ---- INITIALISATION ----
renderMatieres();