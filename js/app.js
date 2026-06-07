// ============================================================
// DONNÉES + LOCALSTORAGE
// ============================================================

const CLE_ETUDIANTS = "etudiants";
const CLE_MATIERES = "matieres";

const MATIERES_PAR_DEFAUT = [
  {
    id: "mat_math",
    nom: "Mathématiques",
    coefficient: 4
  },
  {
    id: "mat_physique",
    nom: "Physique-Chimie",
    coefficient: 3
  },
  {
    id: "mat_svt",
    nom: "SVT",
    coefficient: 2
  },
  {
    id: "mat_francais",
    nom: "Français",
    coefficient: 2
  }
];


// Charge une valeur depuis le localStorage
function chargerDepuisLocalStorage(cle, valeurParDefaut) {
  try {
    const donnees = localStorage.getItem(cle);

    if (donnees === null) {
      return valeurParDefaut;
    }

    const resultat = JSON.parse(donnees);

    return Array.isArray(resultat)
      ? resultat
      : valeurParDefaut;

  } catch (erreur) {
    console.error(
      "Erreur lors de la lecture du localStorage :",
      erreur
    );

    return valeurParDefaut;
  }
}


// Enregistre une valeur dans le localStorage
function enregistrerDansLocalStorage(cle, valeur) {
  try {
    localStorage.setItem(
      cle,
      JSON.stringify(valeur)
    );

  } catch (erreur) {
    console.error(
      "Erreur lors de l'enregistrement :",
      erreur
    );
  }
}


// Charger les étudiants
let etudiants = chargerDepuisLocalStorage(
  CLE_ETUDIANTS,
  []
);


// Charger les matières
let matieres = chargerDepuisLocalStorage(
  CLE_MATIERES,
  MATIERES_PAR_DEFAUT
);


// Enregistrer les matières par défaut au premier lancement
if (localStorage.getItem(CLE_MATIERES) === null) {
  enregistrerDansLocalStorage(
    CLE_MATIERES,
    matieres
  );
}


// Sauvegarde des étudiants
function sauvegarderEtudiants() {
  enregistrerDansLocalStorage(
    CLE_ETUDIANTS,
    etudiants
  );
}


// Recharge les matières depuis le localStorage
function rechargerMatieres() {
  matieres = chargerDepuisLocalStorage(
    CLE_MATIERES,
    MATIERES_PAR_DEFAUT
  );
}


// ============================================================
// FONCTIONS UTILITAIRES
// ============================================================

function genId() {
  return (
    "id_"
    + Date.now()
    + "_"
    + Math.random().toString(16).slice(2)
  );
}


function getInitiales(nom) {
  const mots = nom
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (mots.length >= 2) {
    return (
      mots[0][0]
      + mots[1][0]
    ).toUpperCase();
  }

  return nom
    .substring(0, 2)
    .toUpperCase();
}


function calculerMoyenne(notes) {
  if (!notes || notes.length === 0) {
    return "—";
  }

  let totalPoints = 0;
  let totalCoeff = 0;

  for (const note of notes) {
    totalPoints += (
      Number(note.valeur)
      * Number(note.coefficient)
    );

    totalCoeff += Number(
      note.coefficient
    );
  }

  if (totalCoeff === 0) {
    return "—";
  }

  return (
    totalPoints / totalCoeff
  ).toFixed(2);
}


function getMention(moyenne) {
  const m = parseFloat(moyenne);

  if (isNaN(m)) {
    return {
      texte: "—",
      classe: ""
    };
  }

  if (m >= 16) {
    return {
      texte: "Très bien",
      classe: "badge-success"
    };
  }

  if (m >= 14) {
    return {
      texte: "Bien",
      classe: "badge-success"
    };
  }

  if (m >= 12) {
    return {
      texte: "Assez bien",
      classe: "badge-info"
    };
  }

  if (m >= 10) {
    return {
      texte: "Passable",
      classe: "badge-warning"
    };
  }

  return {
    texte: "Insuffisant",
    classe: "badge-danger"
  };
}


function getObservation(valeur) {
  if (valeur >= 18) {
    return {
      texte: "Excellent",
      classe: "badge-success"
    };
  }

  if (valeur >= 16) {
    return {
      texte: "Très bien",
      classe: "badge-success"
    };
  }

  if (valeur >= 14) {
    return {
      texte: "Bien",
      classe: "badge-success"
    };
  }

  if (valeur >= 12) {
    return {
      texte: "Assez bien",
      classe: "badge-info"
    };
  }

  if (valeur >= 10) {
    return {
      texte: "Passable",
      classe: "badge-warning"
    };
  }

  return {
    texte: "Insuffisant",
    classe: "badge-danger"
  };
}


function getClassement(id) {
  const moyennes = etudiants.map(function (etudiant) {
    return {
      id: etudiant.id,

      moy:
        parseFloat(
          calculerMoyenne(etudiant.notes)
        ) || 0
    };
  });

  moyennes.sort(function (a, b) {
    return b.moy - a.moy;
  });

  const rang = moyennes.findIndex(
    function (element) {
      return element.id === id;
    }
  ) + 1;

  if (rang <= 0) {
    return "—";
  }

  const suffixe =
    rang === 1
      ? "er"
      : "e";

  return (
    rang
    + suffixe
    + " / "
    + etudiants.length
  );
}


// ============================================================
// CONSTRUCTION DES NOTES
// ============================================================

function buildLignesNotes(notes, etuId) {
  if (!notes || notes.length === 0) {
    return `
      <tr>
        <td
          colspan="5"
          style="text-align:center;color:#888;"
        >
          Aucune note enregistrée.
        </td>
      </tr>
    `;
  }

  return notes.map(function (note) {
    const observation = getObservation(
      Number(note.valeur)
    );

    return `
      <tr
        data-note-id="${note.id}"
        data-etu-id="${etuId}"
      >

        <td>
          ${note.matiere}
        </td>

        <td>
          <span class="coeff-badge">
            ${note.coefficient}
          </span>
        </td>

        <td>
          <strong>
            ${Number(note.valeur).toFixed(2)}
          </strong>
        </td>

        <td>
          <span class="badge ${observation.classe}">
            ${observation.texte}
          </span>
        </td>

        <td class="note-action-cell">

          <button
            class="delete-note-btn"
            type="button"
            aria-label="Supprimer la note de ${note.matiere}"
          >
            <i class="bi bi-trash3"></i>
          </button>

        </td>

      </tr>
    `;
  }).join("");
}


// ============================================================
// OPTIONS DES MATIÈRES
// ============================================================

function buildOptionsMatieres(notesExistantes) {
  const matieresNotees = notesExistantes.map(
    function (note) {
      return note.matiere;
    }
  );

  const options = matieres

    .filter(function (matiere) {
      return !matieresNotees.includes(
        matiere.nom
      );
    })

    .map(function (matiere) {
      return `
        <option
          value="${matiere.nom}"
          data-coeff="${matiere.coefficient}"
        >
          ${matiere.nom}
        </option>
      `;
    })

    .join("");

  return `
    <option value="">
      Choisir une matière
    </option>

    ${options}
  `;
}


// ============================================================
// CONSTRUCTION D'UN ÉTUDIANT
// ============================================================

function buildBlocEtudiant(etudiant) {
  const moyenne = calculerMoyenne(
    etudiant.notes
  );

  const mention = getMention(
    moyenne
  );

  const classement = getClassement(
    etudiant.id
  );

  const initiales = getInitiales(
    etudiant.nom
  );

  const lignes = buildLignesNotes(
    etudiant.notes,
    etudiant.id
  );

  const options = buildOptionsMatieres(
    etudiant.notes
  );

  const moyenneAffichee =
    moyenne === "—"
      ? "—"
      : moyenne.replace(".", ",");

  return `
    <details
      class="student-row"
      data-id="${etudiant.id}"
    >

      <summary class="student-summary">

        <div class="student-left">

          <span class="avatar avatar-main">
            ${initiales}
          </span>

          <div>

            <h3>
              ${etudiant.nom}
            </h3>

            <p>
              Sexe: ${etudiant.sexe}
              — Ajouté le ${etudiant.date}
            </p>

          </div>

        </div>

        <div class="student-metrics">

          <div class="metric-item">

            <span>
              Moyenne
            </span>

            <strong>
              ${moyenneAffichee}
            </strong>

          </div>

          <div class="metric-item">

            <span>
              Classement
            </span>

            <strong>
              ${classement}
            </strong>

          </div>

          <span class="badge ${mention.classe}">
            ${mention.texte}
          </span>

          <i class="bi bi-chevron-down chevron"></i>

        </div>

      </summary>

      <div class="student-panel">

        <div class="note-form-inline">

          <select class="select-matiere">
            ${options}
          </select>

          <input
            type="number"
            class="input-note"
            placeholder="Note /20"
            min="0"
            max="20"
            step="0.5"
          >

          <button
            type="button"
            class="add-note-btn"
          >
            <i class="bi bi-plus-circle"></i>
            Ajouter note
          </button>

        </div>

        <div class="notes-table-wrap">

          <table class="notes-table">

            <thead>

              <tr>
                <th>Matière</th>
                <th>Coefficient</th>
                <th>Note</th>
                <th>Observation</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody class="tbody-notes">
              ${lignes}
            </tbody>

          </table>

        </div>

        <div class="student-actions-bottom">

          <button
            type="button"
            class="delete-student-btn"
            data-id="${etudiant.id}"
          >
            <i class="bi bi-person-x"></i>
            Supprimer l'étudiant
          </button>

          <button
            type="button"
            class="bulletin-btn"
            data-id="${etudiant.id}"
          >
            <i class="bi bi-printer"></i>
            Générer le bulletin
          </button>

        </div>

      </div>

    </details>
  `;
}


// ============================================================
// AFFICHAGE DE LA LISTE
// ============================================================

function renderListe(idAOuvrir = null) {
  const container = document.querySelector(
    ".students-list"
  );

  const lignesOuvertes = Array.from(
    container.querySelectorAll(
      ".student-row[open]"
    )
  ).map(function (ligne) {
    return ligne.dataset.id;
  });

  if (
    idAOuvrir
    && !lignesOuvertes.includes(idAOuvrir)
  ) {
    lignesOuvertes.push(idAOuvrir);
  }

  container.innerHTML = "";

  if (etudiants.length === 0) {
    container.innerHTML = `
      <p
        style="
          text-align:center;
          color:#888;
          padding:2rem;
        "
      >
        Aucun étudiant enregistré.
      </p>
    `;

    return;
  }

  for (const etudiant of etudiants) {
    container.insertAdjacentHTML(
      "beforeend",
      buildBlocEtudiant(etudiant)
    );
  }

  document
    .querySelectorAll(".student-row")
    .forEach(function (ligne) {
      if (
        lignesOuvertes.includes(
          ligne.dataset.id
        )
      ) {
        ligne.open = true;
      }
    });
}


// ============================================================
// AJOUT D'UN ÉTUDIANT
// ============================================================

document
  .querySelector(
    ".student-entry-form button[type='button']"
  )
  .addEventListener("click", function () {

    const form = document.querySelector(
      ".student-entry-form"
    );

    const nom = form
      .querySelector("input[type='text']")
      .value
      .trim();

    const sexe = form
      .querySelector("select")
      .value;

    if (nom === "") {
      alert(
        "Veuillez saisir le nom de l'étudiant."
      );

      return;
    }

    if (sexe === "") {
      alert(
        "Veuillez sélectionner le sexe."
      );

      return;
    }

    const nouvelEtudiant = {
      id: genId(),
      nom: nom,
      sexe: sexe,

      date: new Date()
        .toLocaleDateString("fr-FR"),

      notes: []
    };

    etudiants.push(
      nouvelEtudiant
    );

    sauvegarderEtudiants();

    form
      .querySelector("input[type='text']")
      .value = "";

    form
      .querySelector("select")
      .value = "";

    renderListe();
  });


// ============================================================
// AJOUT D'UNE NOTE
// ============================================================

document
  .querySelector(".students-list")
  .addEventListener("click", function (event) {

    const bouton = event.target.closest(
      ".add-note-btn"
    );

    if (!bouton) {
      return;
    }

    const panneau = bouton.closest(
      ".student-panel"
    );

    const etudiantId = bouton
      .closest(".student-row")
      .dataset
      .id;

    const select = panneau.querySelector(
      ".select-matiere"
    );

    const input = panneau.querySelector(
      ".input-note"
    );

    const matiere = select.value;

    const optionSelectionnee =
      select.options[
        select.selectedIndex
      ];

    const coefficient = parseInt(
      optionSelectionnee?.dataset?.coeff
    ) || 1;

    const valeur = parseFloat(
      input.value
    );

    if (!matiere) {
      alert(
        "Veuillez choisir une matière."
      );

      return;
    }

    if (
      isNaN(valeur)
      || valeur < 0
      || valeur > 20
    ) {
      alert(
        "Veuillez saisir une note valide entre 0 et 20."
      );

      return;
    }

    const etudiant = etudiants.find(
      function (element) {
        return element.id === etudiantId;
      }
    );

    if (!etudiant) {
      return;
    }

    etudiant.notes.push({
      id: genId(),
      matiere: matiere,
      coefficient: coefficient,
      valeur: valeur
    });

    sauvegarderEtudiants();

    select.value = "";
    input.value = "";

    renderListe(
      etudiantId
    );
  });


// ============================================================
// SUPPRESSION D'UNE NOTE
// ============================================================

document
  .querySelector(".students-list")
  .addEventListener("click", function (event) {

    const bouton = event.target.closest(
      ".delete-note-btn"
    );

    if (!bouton) {
      return;
    }

    const ligne = bouton.closest("tr");

    const noteId =
      ligne.dataset.noteId;

    const etudiantId =
      ligne.dataset.etuId;

    if (
      !confirm(
        "Supprimer cette note ?"
      )
    ) {
      return;
    }

    const etudiant = etudiants.find(
      function (element) {
        return element.id === etudiantId;
      }
    );

    if (!etudiant) {
      return;
    }

    etudiant.notes = etudiant.notes.filter(
      function (note) {
        return note.id !== noteId;
      }
    );

    sauvegarderEtudiants();

    renderListe(
      etudiantId
    );
  });


// ============================================================
// SUPPRESSION D'UN ÉTUDIANT
// ============================================================

document
  .querySelector(".students-list")
  .addEventListener("click", function (event) {

    const bouton = event.target.closest(
      ".delete-student-btn"
    );

    if (!bouton) {
      return;
    }

    const etudiantId =
      bouton.dataset.id;

    const etudiant = etudiants.find(
      function (element) {
        return element.id === etudiantId;
      }
    );

    if (!etudiant) {
      return;
    }

    const confirmation = confirm(
      "Supprimer « "
      + etudiant.nom
      + " » et toutes ses notes ?"
    );

    if (!confirmation) {
      return;
    }

    etudiants = etudiants.filter(
      function (element) {
        return element.id !== etudiantId;
      }
    );

    sauvegarderEtudiants();

    renderListe();
  });


// ============================================================
// RECHERCHE
// ============================================================

document
  .querySelector(".search-bar input")
  .addEventListener("input", function () {

    const terme = this
      .value
      .trim()
      .toLowerCase();

    document
      .querySelector(".search-clear")
      .style
      .display =
        terme.length > 0
          ? "flex"
          : "none";

    document
      .querySelectorAll(".student-row")
      .forEach(function (ligne) {

        const nom = ligne
          .querySelector("h3")
          .textContent
          .toLowerCase();

        ligne.style.display =
          nom.includes(terme)
            ? ""
            : "none";
      });
  });


document
  .querySelector(".search-clear")
  .addEventListener("click", function () {

    const input = document.querySelector(
      ".search-bar input"
    );

    input.value = "";

    input.dispatchEvent(
      new Event("input")
    );
  });


// ============================================================
// SYNCHRONISATION AVEC LA PAGE MATIÈRES
// ============================================================

window.addEventListener(
  "storage",
  function (event) {

    if (event.key === CLE_MATIERES) {
      rechargerMatieres();

      renderListe();
    }

    if (event.key === CLE_ETUDIANTS) {
      etudiants =
        chargerDepuisLocalStorage(
          CLE_ETUDIANTS,
          []
        );

      renderListe();
    }
  }
);


// Recharge les matières quand l'utilisateur revient sur la page
window.addEventListener(
  "focus",
  function () {
    rechargerMatieres();

    renderListe();
  }
);


// ============================================================
// INITIALISATION
// ============================================================

renderListe();









// ---- INITIALISATION ----
renderListe();


// ============================================================
// REDIRECTION VERS LE BULLETIN
// ============================================================

document
  .querySelector(".students-list")
  .addEventListener("click", function (event) {

    const bouton = event.target.closest(
      ".bulletin-btn"
    );

    if (!bouton) {
      return;
    }

    const ligneEtudiant = bouton.closest(
      ".student-row"
    );

    if (!ligneEtudiant) {
      return;
    }

    const etudiantId =
      ligneEtudiant.dataset.id;

    window.location.href =
      "bulletin.html?id="
      + encodeURIComponent(etudiantId);
  });