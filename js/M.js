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


// Charger les matières enregistrées
let matieres = chargerDepuisLocalStorage(
  CLE_MATIERES,
  MATIERES_PAR_DEFAUT
);


// Charger les étudiants
let etudiants = chargerDepuisLocalStorage(
  CLE_ETUDIANTS,
  []
);


// Enregistrer les matières par défaut au premier lancement
if (localStorage.getItem(CLE_MATIERES) === null) {
  enregistrerDansLocalStorage(
    CLE_MATIERES,
    matieres
  );
}


// Sauvegarder les matières
function sauvegarderMatieres() {
  enregistrerDansLocalStorage(
    CLE_MATIERES,
    matieres
  );
}


// Sauvegarder les étudiants
function sauvegarderEtudiants() {
  enregistrerDansLocalStorage(
    CLE_ETUDIANTS,
    etudiants
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


// Calcule la somme de tous les coefficients
function totalCoefficients() {
  let total = 0;

  for (const matiere of matieres) {
    total += Number(
      matiere.coefficient
    );
  }

  return total;
}


// Calcule combien de notes utilisent une matière
function compterNotesMatiere(matiere) {
  let total = 0;

  for (const etudiant of etudiants) {
    if (
      !Array.isArray(etudiant.notes)
    ) {
      continue;
    }

    for (const note of etudiant.notes) {
      if (
        note.matiere
          .toLowerCase()
        === matiere.nom
          .toLowerCase()
      ) {
        total++;
      }
    }
  }

  return total;
}


// ============================================================
// AFFICHAGE
// ============================================================

function renderMatieres() {
  const tbody = document.querySelector(
    ".subjects-table tbody"
  );

  const information = document.querySelector(
    ".subject-summary p"
  );

  tbody.innerHTML = "";

  if (matieres.length === 0) {
    tbody.innerHTML = `
      <tr>

        <td
          colspan="3"
          style="
            text-align:center;
            color:#888;
          "
        >
          Aucune matière enregistrée.
        </td>

      </tr>
    `;

    information.textContent =
      "0 matière enregistrée · Total coefficients : 0";

    return;
  }

  for (const matiere of matieres) {
    tbody.insertAdjacentHTML(
      "beforeend",
      `
        <tr data-id="${matiere.id}">

          <td>
            ${matiere.nom}
          </td>

          <td>

            <span class="coeff-badge">
              ${matiere.coefficient}
            </span>

          </td>

          <td>

            <button
              class="action-btn delete-matiere-btn"
              type="button"
              aria-label="Supprimer ${matiere.nom}"
            >
              <i class="bi bi-trash3"></i>
            </button>

          </td>

        </tr>
      `
    );
  }

  information.textContent =
    matieres.length
    + " matière(s) enregistrée(s)"
    + " · Total coefficients : "
    + totalCoefficients();
}


// ============================================================
// AJOUT D'UNE MATIÈRE
// ============================================================

document
  .querySelector(
    ".subject-entry-form button[type='button']"
  )
  .addEventListener("click", function () {

    const form = document.querySelector(
      ".subject-entry-form"
    );

    const inputNom = form.querySelector(
      "input[type='text']"
    );

    const inputCoefficient = form.querySelector(
      "input[type='number']"
    );

    const nom = inputNom
      .value
      .trim();

    const coefficient = parseInt(
      inputCoefficient.value
    );

    if (nom === "") {
      alert(
        "Veuillez saisir le nom de la matière."
      );

      inputNom.focus();

      return;
    }

    if (
      isNaN(coefficient)
      || coefficient < 1
    ) {
      alert(
        "Veuillez saisir un coefficient valide, minimum 1."
      );

      inputCoefficient.focus();

      return;
    }

    const matiereExiste = matieres.find(
      function (matiere) {
        return (
          matiere.nom.toLowerCase()
          === nom.toLowerCase()
        );
      }
    );

    if (matiereExiste) {
      alert(
        "Cette matière existe déjà."
      );

      return;
    }

    matieres.push({
      id: genId(),
      nom: nom,
      coefficient: coefficient
    });

    sauvegarderMatieres();

    inputNom.value = "";
    inputCoefficient.value = "";

    renderMatieres();
  });


// ============================================================
// SUPPRESSION D'UNE MATIÈRE
// ============================================================

document
  .querySelector(".subjects-table")
  .addEventListener("click", function (event) {

    const bouton = event.target.closest(
      ".delete-matiere-btn"
    );

    if (!bouton) {
      return;
    }

    const ligne = bouton.closest(
      "tr"
    );

    const matiereId =
      ligne.dataset.id;

    const matiere = matieres.find(
      function (element) {
        return element.id === matiereId;
      }
    );

    if (!matiere) {
      return;
    }

    const nombreNotes = compterNotesMatiere(
      matiere
    );

    let message =
      "Supprimer la matière « "
      + matiere.nom
      + " » ?";

    if (nombreNotes > 0) {
      message +=
        "\n\nAttention : "
        + nombreNotes
        + " note(s) associée(s) seront aussi supprimée(s).";
    }

    if (!confirm(message)) {
      return;
    }

    // Supprimer la matière
    matieres = matieres.filter(
      function (element) {
        return element.id !== matiereId;
      }
    );

    /*
      Supprimer également toutes les notes
      liées à cette matière.
    */
    if (nombreNotes > 0) {
      for (const etudiant of etudiants) {
        if (
          !Array.isArray(etudiant.notes)
        ) {
          etudiant.notes = [];
          continue;
        }

        etudiant.notes =
          etudiant.notes.filter(
            function (note) {
              return (
                note.matiere.toLowerCase()
                !== matiere.nom.toLowerCase()
              );
            }
          );
      }

      sauvegarderEtudiants();
    }

    sauvegarderMatieres();

    renderMatieres();
  });


// ============================================================
// SYNCHRONISATION ENTRE LES PAGES
// ============================================================

window.addEventListener(
  "storage",
  function (event) {

    if (event.key === CLE_MATIERES) {
      matieres =
        chargerDepuisLocalStorage(
          CLE_MATIERES,
          []
        );

      renderMatieres();
    }

    if (event.key === CLE_ETUDIANTS) {
      etudiants =
        chargerDepuisLocalStorage(
          CLE_ETUDIANTS,
          []
        );
    }
  }
);


// Recharge les données lorsque l'utilisateur revient sur la page
window.addEventListener(
  "focus",
  function () {

    matieres =
      chargerDepuisLocalStorage(
        CLE_MATIERES,
        []
      );

    etudiants =
      chargerDepuisLocalStorage(
        CLE_ETUDIANTS,
        []
      );

    renderMatieres();
  }
);


// ============================================================
// INITIALISATION
// ============================================================

renderMatieres();