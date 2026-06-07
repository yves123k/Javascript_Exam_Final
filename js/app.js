"use strict";

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


// ============================================================
// GESTION DU LOCALSTORAGE
// ============================================================

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


function enregistrerDansLocalStorage(cle, valeur) {
  try {
    localStorage.setItem(
      cle,
      JSON.stringify(valeur)
    );

  } catch (erreur) {
    console.error(
      "Erreur lors de l'enregistrement dans le localStorage :",
      erreur
    );
  }
}


// ============================================================
// CHARGEMENT ET CORRECTION DES DONNÉES
// ============================================================

let etudiants = chargerDepuisLocalStorage(
  CLE_ETUDIANTS,
  []
);

let matieres = chargerDepuisLocalStorage(
  CLE_MATIERES,
  MATIERES_PAR_DEFAUT
);


// Corrige automatiquement les anciens étudiants
// qui ne possèdent pas encore de tableau notes.

etudiants = etudiants.map(function (etudiant) {
  return {
    id: etudiant.id || genId(),

    nom:
      typeof etudiant.nom === "string"
        ? etudiant.nom
        : "Étudiant",

    sexe:
      typeof etudiant.sexe === "string"
        ? etudiant.sexe
        : "—",

    date:
      typeof etudiant.date === "string"
        ? etudiant.date
        : new Date().toLocaleDateString("fr-FR"),

    notes:
      Array.isArray(etudiant.notes)
        ? etudiant.notes
        : []
  };
});


// Corrige également les anciennes matières.

matieres = matieres.map(function (matiere) {
  return {
    id: matiere.id || genId(),

    nom:
      typeof matiere.nom === "string"
        ? matiere.nom
        : "Matière",

    coefficient:
      Number(matiere.coefficient) > 0
        ? Number(matiere.coefficient)
        : 1
  };
});


// Enregistrer les matières par défaut au premier lancement.

if (localStorage.getItem(CLE_MATIERES) === null) {
  enregistrerDansLocalStorage(
    CLE_MATIERES,
    matieres
  );
}


// Enregistrer les données corrigées.

enregistrerDansLocalStorage(
  CLE_ETUDIANTS,
  etudiants
);

enregistrerDansLocalStorage(
  CLE_MATIERES,
  matieres
);


function sauvegarderEtudiants() {
  enregistrerDansLocalStorage(
    CLE_ETUDIANTS,
    etudiants
  );
}


function rechargerMatieres() {
  matieres = chargerDepuisLocalStorage(
    CLE_MATIERES,
    []
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


function echapperHTML(valeur) {
  return String(valeur)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function getInitiales(nom) {
  const nomValide =
    typeof nom === "string"
      ? nom.trim()
      : "";

  if (nomValide === "") {
    return "ET";
  }

  const mots = nomValide
    .split(/\s+/)
    .filter(Boolean);

  if (mots.length >= 2) {
    return (
      mots[0][0]
      + mots[1][0]
    ).toUpperCase();
  }

  return nomValide
    .substring(0, 2)
    .toUpperCase();
}


function calculerMoyenne(notes) {
  const listeNotes =
    Array.isArray(notes)
      ? notes
      : [];

  if (listeNotes.length === 0) {
    return "—";
  }

  let totalPoints = 0;
  let totalCoefficients = 0;

  for (const note of listeNotes) {
    const valeur = Number(note.valeur);
    const coefficient = Number(note.coefficient);

    if (
      !Number.isNaN(valeur)
      && coefficient > 0
    ) {
      totalPoints += valeur * coefficient;
      totalCoefficients += coefficient;
    }
  }

  if (totalCoefficients === 0) {
    return "—";
  }

  return (
    totalPoints / totalCoefficients
  ).toFixed(2);
}


function getMention(moyenne) {
  const valeur = parseFloat(moyenne);

  if (Number.isNaN(valeur)) {
    return {
      texte: "—",
      classe: ""
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


function getObservation(valeur) {
  const note = Number(valeur);

  if (note >= 18) {
    return {
      texte: "Excellent",
      classe: "badge-success"
    };
  }

  if (note >= 16) {
    return {
      texte: "Très bien",
      classe: "badge-success"
    };
  }

  if (note >= 14) {
    return {
      texte: "Bien",
      classe: "badge-success"
    };
  }

  if (note >= 12) {
    return {
      texte: "Assez bien",
      classe: "badge-info"
    };
  }

  if (note >= 10) {
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
    const notes =
      Array.isArray(etudiant.notes)
        ? etudiant.notes
        : [];

    return {
      id: etudiant.id,

      moyenne:
        parseFloat(
          calculerMoyenne(notes)
        ) || 0
    };
  });

  moyennes.sort(function (a, b) {
    return b.moyenne - a.moyenne;
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
// CONSTRUCTION DES LIGNES DE NOTES
// ============================================================

function buildLignesNotes(notes, etudiantId) {
  const listeNotes =
    Array.isArray(notes)
      ? notes
      : [];

  if (listeNotes.length === 0) {
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

  return listeNotes.map(function (note) {
    const observation = getObservation(
      note.valeur
    );

    return `
      <tr
        data-note-id="${echapperHTML(note.id)}"
        data-etu-id="${echapperHTML(etudiantId)}"
      >

        <td>
          ${echapperHTML(note.matiere)}
        </td>

        <td>
          <span class="coeff-badge">
            ${echapperHTML(note.coefficient)}
          </span>
        </td>

        <td>
          <strong>
            ${Number(note.valeur)
              .toFixed(2)
              .replace(".", ",")}
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
            aria-label="Supprimer la note de ${echapperHTML(note.matiere)}"
          >
            <i class="bi bi-trash3"></i>
          </button>

        </td>

      </tr>
    `;
  }).join("");
}


// ============================================================
// CONSTRUCTION DES OPTIONS DE MATIÈRES
// ============================================================

function buildOptionsMatieres(notesExistantes = []) {
  const notes =
    Array.isArray(notesExistantes)
      ? notesExistantes
      : [];

  const listeMatieres =
    Array.isArray(matieres)
      ? matieres
      : [];

  const matieresNotees = notes.map(
    function (note) {
      return String(
        note.matiere || ""
      ).toLowerCase();
    }
  );

  const options = listeMatieres

    .filter(function (matiere) {
      return !matieresNotees.includes(
        String(matiere.nom).toLowerCase()
      );
    })

    .map(function (matiere) {
      return `
        <option
          value="${echapperHTML(matiere.nom)}"
          data-coeff="${echapperHTML(matiere.coefficient)}"
        >
          ${echapperHTML(matiere.nom)}
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
// CONSTRUCTION D'UN BLOC ÉTUDIANT
// ============================================================

function buildBlocEtudiant(etudiant) {
  const notes =
    Array.isArray(etudiant.notes)
      ? etudiant.notes
      : [];

  const moyenne = calculerMoyenne(
    notes
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
    notes,
    etudiant.id
  );

  const options = buildOptionsMatieres(
    notes
  );

  const moyenneAffichee =
    moyenne === "—"
      ? "—"
      : moyenne.replace(".", ",");

  return `
    <details
      class="student-row"
      data-id="${echapperHTML(etudiant.id)}"
    >

      <summary class="student-summary">

        <div class="student-left">

          <span class="avatar avatar-main">
            ${echapperHTML(initiales)}
          </span>

          <div>

            <h3>
              ${echapperHTML(etudiant.nom)}
            </h3>

            <p>
              Sexe: ${echapperHTML(etudiant.sexe)}
              — Ajouté le ${echapperHTML(etudiant.date)}
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
            data-id="${echapperHTML(etudiant.id)}"
          >
            <i class="bi bi-person-x"></i>
            Supprimer l'étudiant
          </button>

          <button
            type="button"
            class="bulletin-btn"
            data-id="${echapperHTML(etudiant.id)}"
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

  if (!container) {
    return;
  }

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
    lignesOuvertes.push(
      idAOuvrir
    );
  }

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

  container.innerHTML = etudiants
    .map(buildBlocEtudiant)
    .join("");

  container
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

  appliquerRecherche();
}


// ============================================================
// AJOUT D'UN ÉTUDIANT
// ============================================================

const formulaireEtudiant = document.querySelector(
  ".student-entry-form"
);

if (formulaireEtudiant) {
  formulaireEtudiant
    .querySelector("button[type='button']")
    .addEventListener("click", function () {

      const champNom = formulaireEtudiant.querySelector(
        "input[type='text']"
      );

      const champSexe = formulaireEtudiant.querySelector(
        "select"
      );

      const nom = champNom.value.trim();
      const sexe = champSexe.value;

      if (nom === "") {
        alert(
          "Veuillez saisir le nom de l'étudiant."
        );

        champNom.focus();
        return;
      }

      if (sexe === "") {
        alert(
          "Veuillez sélectionner le sexe."
        );

        champSexe.focus();
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

      formulaireEtudiant.reset();

      renderListe(
        nouvelEtudiant.id
      );
    });
}


// ============================================================
// ACTIONS SUR LA LISTE DES ÉTUDIANTS
// ============================================================

const listeEtudiants = document.querySelector(
  ".students-list"
);

if (listeEtudiants) {
  listeEtudiants.addEventListener(
    "click",
    function (event) {

      const boutonAjouterNote = event.target.closest(
        ".add-note-btn"
      );

      const boutonSupprimerNote = event.target.closest(
        ".delete-note-btn"
      );

      const boutonSupprimerEtudiant = event.target.closest(
        ".delete-student-btn"
      );

      const boutonBulletin = event.target.closest(
        ".bulletin-btn"
      );


      // ------------------------------------------------------
      // AJOUT D'UNE NOTE
      // ------------------------------------------------------

      if (boutonAjouterNote) {
        const ligneEtudiant = boutonAjouterNote.closest(
          ".student-row"
        );

        const panneau = boutonAjouterNote.closest(
          ".student-panel"
        );

        const select = panneau.querySelector(
          ".select-matiere"
        );

        const input = panneau.querySelector(
          ".input-note"
        );

        const etudiantId =
          ligneEtudiant.dataset.id;

        const matiere =
          select.value;

        const optionSelectionnee =
          select.options[
            select.selectedIndex
          ];

        const coefficient = Number(
          optionSelectionnee?.dataset?.coeff
        );

        const valeur = Number(
          input.value
        );

        if (!matiere) {
          alert(
            "Veuillez choisir une matière."
          );

          select.focus();
          return;
        }

        if (
          input.value === ""
          || Number.isNaN(valeur)
          || valeur < 0
          || valeur > 20
        ) {
          alert(
            "Veuillez saisir une note valide entre 0 et 20."
          );

          input.focus();
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

        if (!Array.isArray(etudiant.notes)) {
          etudiant.notes = [];
        }

        etudiant.notes.push({
          id: genId(),
          matiere: matiere,

          coefficient:
            coefficient > 0
              ? coefficient
              : 1,

          valeur: valeur
        });

        sauvegarderEtudiants();

        renderListe(
          etudiantId
        );

        return;
      }


      // ------------------------------------------------------
      // SUPPRESSION D'UNE NOTE
      // ------------------------------------------------------

      if (boutonSupprimerNote) {
        const ligneNote = boutonSupprimerNote.closest(
          "tr"
        );

        const noteId =
          ligneNote.dataset.noteId;

        const etudiantId =
          ligneNote.dataset.etuId;

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

        const notes =
          Array.isArray(etudiant.notes)
            ? etudiant.notes
            : [];

        etudiant.notes = notes.filter(
          function (note) {
            return note.id !== noteId;
          }
        );

        sauvegarderEtudiants();

        renderListe(
          etudiantId
        );

        return;
      }


      // ------------------------------------------------------
      // SUPPRESSION D'UN ÉTUDIANT
      // ------------------------------------------------------

      if (boutonSupprimerEtudiant) {
        const etudiantId =
          boutonSupprimerEtudiant.dataset.id;

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

        return;
      }


      // ------------------------------------------------------
      // REDIRECTION VERS LE BULLETIN
      // ------------------------------------------------------

      if (boutonBulletin) {
        const ligneEtudiant = boutonBulletin.closest(
          ".student-row"
        );

        if (!ligneEtudiant) {
          return;
        }

        const etudiantId =
          ligneEtudiant.dataset.id;

        window.location.href =
          "./bulletin.html?id="
          + encodeURIComponent(etudiantId);
      }
    }
  );
}


// ============================================================
// RECHERCHE
// ============================================================

function appliquerRecherche() {
  const champRecherche = document.querySelector(
    ".search-bar input"
  );

  const boutonEffacer = document.querySelector(
    ".search-clear"
  );

  if (!champRecherche || !boutonEffacer) {
    return;
  }

  const terme = champRecherche
    .value
    .trim()
    .toLowerCase();

  boutonEffacer.style.display =
    terme.length > 0
      ? "flex"
      : "none";

  document
    .querySelectorAll(".student-row")
    .forEach(function (ligne) {

      const titre = ligne.querySelector(
        "h3"
      );

      const nom =
        titre
          ? titre.textContent.toLowerCase()
          : "";

      ligne.style.display =
        nom.includes(terme)
          ? ""
          : "none";
    });
}


const champRecherche = document.querySelector(
  ".search-bar input"
);

if (champRecherche) {
  champRecherche.addEventListener(
    "input",
    appliquerRecherche
  );
}


const boutonEffacerRecherche = document.querySelector(
  ".search-clear"
);

if (boutonEffacerRecherche) {
  boutonEffacerRecherche.addEventListener(
    "click",
    function () {

      if (!champRecherche) {
        return;
      }

      champRecherche.value = "";

      appliquerRecherche();

      champRecherche.focus();
    }
  );
}


// ============================================================
// EXPORT CSV
// ============================================================

const boutonExport = document.querySelector(
  ".export-btn"
);

if (boutonExport) {
  boutonExport.addEventListener(
    "click",
    function () {

      if (etudiants.length === 0) {
        alert(
          "Aucun étudiant à exporter."
        );

        return;
      }

      const lignesCSV = [
        [
          "Étudiant",
          "Sexe",
          "Date",
          "Matière",
          "Coefficient",
          "Note",
          "Moyenne",
          "Mention"
        ]
      ];

      etudiants.forEach(function (etudiant) {
        const notes =
          Array.isArray(etudiant.notes)
            ? etudiant.notes
            : [];

        const moyenne = calculerMoyenne(
          notes
        );

        const mention = getMention(
          moyenne
        ).texte;

        if (notes.length === 0) {
          lignesCSV.push([
            etudiant.nom,
            etudiant.sexe,
            etudiant.date,
            "",
            "",
            "",
            moyenne,
            mention
          ]);

          return;
        }

        notes.forEach(function (note) {
          lignesCSV.push([
            etudiant.nom,
            etudiant.sexe,
            etudiant.date,
            note.matiere,
            note.coefficient,
            note.valeur,
            moyenne,
            mention
          ]);
        });
      });

      const contenuCSV = lignesCSV
        .map(function (ligne) {
          return ligne
            .map(function (cellule) {
              return (
                '"'
                + String(cellule)
                  .replaceAll('"', '""')
                + '"'
              );
            })
            .join(";");
        })
        .join("\n");

      const fichier = new Blob(
        [
          "\uFEFF"
          + contenuCSV
        ],
        {
          type: "text/csv;charset=utf-8"
        }
      );

      const url = URL.createObjectURL(
        fichier
      );

      const lien = document.createElement(
        "a"
      );

      lien.href = url;
      lien.download = "bulletins-etudiants.csv";

      document.body.appendChild(
        lien
      );

      lien.click();
      lien.remove();

      URL.revokeObjectURL(
        url
      );
    }
  );
}


// ============================================================
// SYNCHRONISATION ENTRE LES PAGES
// ============================================================

window.addEventListener(
  "storage",
  function (event) {

    if (event.key === CLE_MATIERES) {
      rechargerMatieres();
      renderListe();
    }

    if (event.key === CLE_ETUDIANTS) {
      etudiants = chargerDepuisLocalStorage(
        CLE_ETUDIANTS,
        []
      );

      etudiants = etudiants.map(
        function (etudiant) {
          return {
            ...etudiant,

            notes:
              Array.isArray(etudiant.notes)
                ? etudiant.notes
                : []
          };
        }
      );

      renderListe();
    }
  }
);


// Recharge les données lorsque l'utilisateur revient sur la page.

window.addEventListener(
  "focus",
  function () {
    rechargerMatieres();

    etudiants = chargerDepuisLocalStorage(
      CLE_ETUDIANTS,
      []
    );

    etudiants = etudiants.map(
      function (etudiant) {
        return {
          ...etudiant,

          notes:
            Array.isArray(etudiant.notes)
              ? etudiant.notes
              : []
        };
      }
    );

    renderListe();
  }
);


// ============================================================
// INITIALISATION UNIQUE
// ============================================================

renderListe();

