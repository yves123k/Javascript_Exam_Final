// Données en mémoire
let etudiants = [];

let matieres = [
  { nom: "Mathématiques",   coefficient: 4 },
  { nom: "Physique-Chimie", coefficient: 3 },
  { nom: "SVT",             coefficient: 2 },
  { nom: "Français",        coefficient: 2 },
];


// ---- FONCTIONS UTILITAIRES ----

function genId() {
  return "id_" + Date.now();
}

function getInitiales(nom) {
  const mots = nom.trim().split(" ");
  if (mots.length >= 2) {
    return (mots[0][0] + mots[1][0]).toUpperCase();
  }
  return nom.substring(0, 2).toUpperCase();
}

function calculerMoyenne(notes) {
  if (!notes || notes.length === 0) return "—";

  let totalPoints = 0;
  let totalCoeff  = 0;

  for (const note of notes) {
    totalPoints += note.valeur * note.coefficient;
    totalCoeff  += note.coefficient;
  }

  return (totalPoints / totalCoeff).toFixed(2);
}

function getMention(moyenne) {
  const m = parseFloat(moyenne);
  if (isNaN(m)) return { texte: "—",           classe: "" };
  if (m >= 16)  return { texte: "Très bien",    classe: "badge-success" };
  if (m >= 14)  return { texte: "Bien",          classe: "badge-success" };
  if (m >= 12)  return { texte: "Assez bien",    classe: "badge-info" };
  if (m >= 10)  return { texte: "Passable",      classe: "badge-warning" };
  return              { texte: "Insuffisant",   classe: "badge-danger" };
}

function getObservation(valeur) {
  if (valeur >= 18) return { texte: "Excellent",  classe: "badge-success" };
  if (valeur >= 16) return { texte: "Très bien",  classe: "badge-success" };
  if (valeur >= 14) return { texte: "Bien",        classe: "badge-success" };
  if (valeur >= 12) return { texte: "Assez bien",  classe: "badge-info" };
  if (valeur >= 10) return { texte: "Passable",    classe: "badge-warning" };
  return                   { texte: "Insuffisant", classe: "badge-danger" };
}

function getClassement(id) {
  const moyennes = etudiants.map(e => ({
    id: e.id,
    moy: parseFloat(calculerMoyenne(e.notes)) || 0
  }));

  moyennes.sort((a, b) => b.moy - a.moy);

  const rang    = moyennes.findIndex(item => item.id === id) + 1;
  const suffixe = rang === 1 ? "er" : "e";
  return rang + suffixe + " / " + etudiants.length;
}


// ---- CONSTRUCTION DU HTML ----

function buildLignesNotes(notes, etuId) {
  if (!notes || notes.length === 0) {
    return `<tr><td colspan="5" style="text-align:center;color:#888;">Aucune note enregistrée.</td></tr>`;
  }

  return notes.map(note => {
    const obs = getObservation(note.valeur);
    return `
      <tr data-note-id="${note.id}" data-etu-id="${etuId}">
        <td>${note.matiere}</td>
        <td><span class="coeff-badge">${note.coefficient}</span></td>
        <td><strong>${note.valeur.toFixed(2)}</strong></td>
        <td><span class="badge ${obs.classe}">${obs.texte}</span></td>
        <td class="note-action-cell">
          <button class="delete-note-btn" type="button" aria-label="Supprimer la note de ${note.matiere}">
            <i class="bi bi-trash3"></i>
          </button>
        </td>
      </tr>`;
  }).join("");
}

function buildOptionsMatieres(notesExistantes) {
  const matieresNotees = notesExistantes.map(n => n.matiere);

  const options = matieres
    .filter(m => !matieresNotees.includes(m.nom))
    .map(m => `<option value="${m.nom}" data-coeff="${m.coefficient}">${m.nom}</option>`)
    .join("");

  return `<option value="">Choisir une matière</option>${options}`;
}

function buildBlocEtudiant(etudiant) {
  const moyenne    = calculerMoyenne(etudiant.notes);
  const mention    = getMention(moyenne);
  const classement = getClassement(etudiant.id);
  const initiales  = getInitiales(etudiant.nom);
  const lignes     = buildLignesNotes(etudiant.notes, etudiant.id);
  const options    = buildOptionsMatieres(etudiant.notes);
  const moyAff     = moyenne === "—" ? "—" : moyenne.replace(".", ",");

  return `
  <details class="student-row" data-id="${etudiant.id}">
    <summary class="student-summary">
      <div class="student-left">
        <span class="avatar avatar-main">${initiales}</span>
        <div>
          <h3>${etudiant.nom}</h3>
          <p>Sexe: ${etudiant.sexe} — Ajouté le ${etudiant.date}</p>
        </div>
      </div>
      <div class="student-metrics">
        <div class="metric-item"><span>Moyenne</span><strong>${moyAff}</strong></div>
        <div class="metric-item"><span>Classement</span><strong>${classement}</strong></div>
        <span class="badge ${mention.classe}">${mention.texte}</span>
        <i class="bi bi-chevron-down chevron"></i>
      </div>
    </summary>

    <div class="student-panel">

      <div class="note-form-inline">
        <select class="select-matiere">${options}</select>
        <input type="number" class="input-note" placeholder="Note /20" min="0" max="20" step="0.5">
        <button type="button" class="add-note-btn">
          <i class="bi bi-plus-circle"></i> Ajouter note
        </button>
      </div>

      <div class="notes-table-wrap">
        <table class="notes-table">
          <thead>
            <tr>
              <th>Matière</th><th>Coefficient</th>
              <th>Note</th><th>Observation</th><th>Action</th>
            </tr>
          </thead>
          <tbody class="tbody-notes">${lignes}</tbody>
        </table>
      </div>

      <div class="student-actions-bottom">
        <button type="button" class="delete-student-btn" data-id="${etudiant.id}">
          <i class="bi bi-person-x"></i> Supprimer l'étudiant
        </button>
        <button type="button" class="bulletin-btn">
          <i class="bi bi-printer"></i> Générer le bulletin
        </button>
      </div>

    </div>
  </details>`;
}

// Reconstruit toute la liste à l'écran
function renderListe() {
  const container = document.querySelector(".students-list");
  container.innerHTML = "";

  if (etudiants.length === 0) {
    container.innerHTML = `<p style="text-align:center;color:#888;padding:2rem;">Aucun étudiant enregistré.</p>`;
    return;
  }

  for (const etudiant of etudiants) {
    container.insertAdjacentHTML("beforeend", buildBlocEtudiant(etudiant));
  }
}


// ---- AJOUT D'UN ÉTUDIANT ----

document.querySelector(".student-entry-form button[type='button']")
  .addEventListener("click", function () {
    const form  = document.querySelector(".student-entry-form");
    const nom   = form.querySelector("input[type='text']").value.trim();
    const sexe  = form.querySelector("select").value;

    if (nom === "") {
      alert("Veuillez saisir le nom de l'étudiant.");
      return;
    }
    if (sexe === "") {
      alert("Veuillez sélectionner le sexe.");
      return;
    }

    const nouvelEtudiant = {
      id    : genId(),
      nom   : nom,
      sexe  : sexe,
      date  : new Date().toLocaleDateString("fr-FR"),
      notes : []
    };

    etudiants.push(nouvelEtudiant);

    // Vider le formulaire
    form.querySelector("input[type='text']").value = "";
    form.querySelector("select").value = "";

    renderListe();
  });


// ---- AJOUT D'UNE NOTE ----

document.querySelector(".students-list")
  .addEventListener("click", function (event) {
    const btn = event.target.closest(".add-note-btn");
    if (!btn) return;

    const panel   = btn.closest(".student-panel");
    const etuId   = btn.closest(".student-row").dataset.id;
    const select  = panel.querySelector(".select-matiere");
    const input   = panel.querySelector(".input-note");

    const matiere = select.value;
    const coeff   = parseInt(select.options[select.selectedIndex].dataset.coeff) || 1;
    const valeur  = parseFloat(input.value);

    if (!matiere) {
      alert("Veuillez choisir une matière.");
      return;
    }
    if (isNaN(valeur) || valeur < 0 || valeur > 20) {
      alert("Veuillez saisir une note valide entre 0 et 20.");
      return;
    }

    const etudiant = etudiants.find(e => e.id === etuId);
    if (!etudiant) return;

    etudiant.notes.push({
      id          : genId(),
      matiere     : matiere,
      coefficient : coeff,
      valeur      : valeur
    });

    // Vider le formulaire note
    select.value = "";
    input.value  = "";

    renderListe();
  });


// ---- SUPPRESSION D'UNE NOTE ----

document.querySelector(".students-list")
  .addEventListener("click", function (event) {
    const btn = event.target.closest(".delete-note-btn");
    if (!btn) return;

    const tr     = btn.closest("tr");
    const noteId = tr.dataset.noteId;
    const etuId  = tr.dataset.etuId;

    if (!confirm("Supprimer cette note ?")) return;

    const etudiant = etudiants.find(e => e.id === etuId);
    if (!etudiant) return;

    // Garder toutes les notes sauf celle supprimée
    etudiant.notes = etudiant.notes.filter(n => n.id !== noteId);

    renderListe();
  });


// ---- SUPPRESSION D'UN ÉTUDIANT ----

document.querySelector(".students-list")
  .addEventListener("click", function (event) {
    const btn = event.target.closest(".delete-student-btn");
    if (!btn) return;

    const etuId    = btn.dataset.id;
    const etudiant = etudiants.find(e => e.id === etuId);
    if (!etudiant) return;

    if (!confirm("Supprimer « " + etudiant.nom + " » et toutes ses notes ?")) return;

    // Garder tous les étudiants sauf celui supprimé
    etudiants = etudiants.filter(e => e.id !== etuId);

    renderListe();
  });


// ---- RECHERCHE ----

document.querySelector(".search-bar input")
  .addEventListener("input", function () {
    const terme = this.value.trim().toLowerCase();

    document.querySelector(".search-clear").style.display = terme.length > 0 ? "flex" : "none";

    document.querySelectorAll(".student-row").forEach(function (row) {
      const nom = row.querySelector("h3").textContent.toLowerCase();
      row.style.display = nom.includes(terme) ? "" : "none";
    });
  });

document.querySelector(".search-clear")
  .addEventListener("click", function () {
    const input = document.querySelector(".search-bar input");
    input.value = "";
    input.dispatchEvent(new Event("input"));
  });


// ---- INITIALISATION ----
renderListe();