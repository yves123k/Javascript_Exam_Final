// ============================================================
// CONFIGURATION
// ============================================================

const CLE_ETUDIANTS = "etudiants";


// ============================================================
// CHARGEMENT LOCALSTORAGE
// ============================================================

function chargerEtudiants() {
  try {
    const donnees =
      localStorage.getItem(
        CLE_ETUDIANTS
      );

    if (donnees === null) {
      return [];
    }

    const etudiants =
      JSON.parse(donnees);

    return Array.isArray(etudiants)
      ? etudiants
      : [];

  } catch (erreur) {

    console.error(
      "Erreur de lecture du localStorage :",
      erreur
    );

    return [];
  }
}


// ============================================================
// SÉCURITÉ HTML
// ============================================================

function echapperHTML(valeur) {
  return String(valeur)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


// ============================================================
// UTILITAIRES
// ============================================================

function getInitiales(nom) {
  const mots = String(nom)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (mots.length >= 2) {
    return (
      mots[0][0]
      + mots[1][0]
    ).toUpperCase();
  }

  return String(nom)
    .substring(0, 2)
    .toUpperCase();
}


function calculerMoyenne(notes) {
  if (
    !Array.isArray(notes)
    || notes.length === 0
  ) {
    return null;
  }

  let totalPoints = 0;
  let totalCoefficients = 0;

  for (const note of notes) {
    const valeur =
      Number(note.valeur);

    const coefficient =
      Number(note.coefficient);

    if (
      !Number.isNaN(valeur)
      && coefficient > 0
    ) {
      totalPoints +=
        valeur * coefficient;

      totalCoefficients +=
        coefficient;
    }
  }

  if (totalCoefficients === 0) {
    return null;
  }

  return (
    totalPoints
    / totalCoefficients
  );
}


function formaterNombre(valeur) {
  if (
    valeur === null
    || Number.isNaN(Number(valeur))
  ) {
    return "—";
  }

  return Number(valeur)
    .toFixed(2)
    .replace(".", ",");
}


function getMention(moyenne) {
  if (moyenne === null) {
    return {
      texte: "Non évalué",
      classe: ""
    };
  }

  if (moyenne >= 16) {
    return {
      texte: "Très bien",
      classe: "mention-success"
    };
  }

  if (moyenne >= 14) {
    return {
      texte: "Bien",
      classe: "mention-success"
    };
  }

  if (moyenne >= 12) {
    return {
      texte: "Assez bien",
      classe: "mention-info"
    };
  }

  if (moyenne >= 10) {
    return {
      texte: "Passable",
      classe: "mention-warning"
    };
  }

  return {
    texte: "Insuffisant",
    classe: "mention-danger"
  };
}


function getObservation(note) {
  if (note >= 18) {
    return {
      texte: "Excellent",
      classe: "observation-success"
    };
  }

  if (note >= 16) {
    return {
      texte: "Très bien",
      classe: "observation-success"
    };
  }

  if (note >= 14) {
    return {
      texte: "Bien",
      classe: "observation-success"
    };
  }

  if (note >= 12) {
    return {
      texte: "Assez bien",
      classe: "observation-success"
    };
  }

  if (note >= 10) {
    return {
      texte: "Passable",
      classe: "observation-warning"
    };
  }

  return {
    texte: "Insuffisant",
    classe: "observation-danger"
  };
}


function getMessageAppreciation(moyenne) {
  if (moyenne === null) {
    return (
      "Aucune note n’a encore été "
      + "enregistrée pour cet étudiant."
    );
  }

  if (moyenne >= 16) {
    return (
      "Excellents résultats. "
      + "Travail sérieux, régulier "
      + "et très satisfaisant."
    );
  }

  if (moyenne >= 14) {
    return (
      "Très bons résultats. "
      + "L’ensemble du travail "
      + "est satisfaisant."
    );
  }

  if (moyenne >= 12) {
    return (
      "Résultats encourageants. "
      + "Les efforts doivent être "
      + "maintenus pour progresser."
    );
  }

  if (moyenne >= 10) {
    return (
      "Résultats acceptables. "
      + "Un travail plus régulier "
      + "permettra une progression."
    );
  }

  return (
    "Résultats insuffisants. "
    + "Des efforts supplémentaires "
    + "et un meilleur suivi sont nécessaires."
  );
}


function getClassement(
  etudiantId,
  etudiants
) {
  const classement =
    etudiants.map(
      function (etudiant) {

        return {
          id: etudiant.id,

          moyenne:
            calculerMoyenne(
              etudiant.notes
            ) ?? 0
        };
      }
    );

  classement.sort(
    function (a, b) {
      return b.moyenne
        - a.moyenne;
    }
  );

  const rang =
    classement.findIndex(
      function (element) {
        return element.id
          === etudiantId;
      }
    ) + 1;

  if (rang <= 0) {
    return "—";
  }

  return (
    rang
    + (
      rang === 1
        ? "er"
        : "e"
    )
    + " / "
    + classement.length
  );
}


// ============================================================
// AFFICHAGE D'UNE ERREUR
// ============================================================

function afficherErreur(message) {
  document
    .querySelector("#bulletinDocument")
    .hidden = true;

  document
    .querySelector("#errorCard")
    .hidden = false;

  document
    .querySelector("#errorMessage")
    .textContent = message;

  document
    .querySelector("#printBulletinBtn")
    .disabled = true;
}


// ============================================================
// CONSTRUCTION DU TABLEAU
// ============================================================

function construireLignesNotes(notes) {
  const tbody = document.querySelector(
    "#bulletinNotesBody"
  );

  if (
    !Array.isArray(notes)
    || notes.length === 0
  ) {
    tbody.innerHTML = `
      <tr>

        <td
          colspan="5"
          class="empty-cell"
        >
          Aucune note enregistrée.
        </td>

      </tr>
    `;

    return;
  }

  tbody.innerHTML =
    notes.map(
      function (note) {

        const valeur =
          Number(note.valeur);

        const coefficient =
          Number(note.coefficient);

        const points =
          valeur * coefficient;

        const observation =
          getObservation(valeur);

        return `
          <tr>

            <td>
              ${echapperHTML(note.matiere)}
            </td>

            <td class="center">

              <span class="coefficient-badge">
                ${echapperHTML(coefficient)}
              </span>

            </td>

            <td class="center note-value">
              ${formaterNombre(valeur)}
            </td>

            <td class="center">
              ${formaterNombre(points)}
            </td>

            <td>

              <span
                class="
                  observation
                  ${observation.classe}
                "
              >
                ${observation.texte}
              </span>

            </td>

          </tr>
        `;
      }
    ).join("");
}


// ============================================================
// AFFICHAGE DU BULLETIN
// ============================================================

function afficherBulletin() {
  const parametres =
    new URLSearchParams(
      window.location.search
    );

  const etudiantId =
    parametres.get("id");

  if (!etudiantId) {
    afficherErreur(
      "Aucun étudiant n’a été sélectionné."
    );

    return;
  }

  const etudiants =
    chargerEtudiants();

  const etudiant =
    etudiants.find(
      function (element) {
        return element.id
          === etudiantId;
      }
    );

  if (!etudiant) {
    afficherErreur(
      "Cet étudiant n’existe pas ou a été supprimé."
    );

    return;
  }

  const notes =
    Array.isArray(etudiant.notes)
      ? etudiant.notes
      : [];

  const moyenne =
    calculerMoyenne(notes);

  const mention =
    getMention(moyenne);

  const notesNumeriques =
    notes.map(
      function (note) {
        return Number(note.valeur);
      }
    );

  const meilleureNote =
    notesNumeriques.length > 0
      ? Math.max(...notesNumeriques)
      : null;

  const plusFaibleNote =
    notesNumeriques.length > 0
      ? Math.min(...notesNumeriques)
      : null;

  const totalCoefficients =
    notes.reduce(
      function (total, note) {
        return total
          + Number(note.coefficient);
      },
      0
    );

  const classement =
    getClassement(
      etudiant.id,
      etudiants
    );

  const dateActuelle =
    new Date()
      .toLocaleDateString(
        "fr-FR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric"
        }
      );

  const reference =
    "BLT-"
    + String(etudiant.id)
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(-8)
      .toUpperCase();


  // Informations générales

  document
    .querySelector("#studentAvatar")
    .textContent =
      getInitiales(etudiant.nom);

  document
    .querySelector("#studentName")
    .textContent =
      etudiant.nom;

  document
    .querySelector("#studentGender")
    .textContent =
      etudiant.sexe || "—";

  document
    .querySelector("#studentDate")
    .textContent =
      etudiant.date || "—";

  document
    .querySelector("#bulletinReference")
    .textContent =
      reference;

  document
    .querySelector("#generationDate")
    .textContent =
      "Généré le " + dateActuelle;

  document
    .querySelector("#footerDate")
    .textContent =
      dateActuelle;


  // Statistiques

  document
    .querySelector("#averageValue")
    .textContent =
      formaterNombre(moyenne);

  document
    .querySelector("#rankingValue")
    .textContent =
      classement;

  document
    .querySelector("#highestValue")
    .textContent =
      formaterNombre(meilleureNote);

  document
    .querySelector("#lowestValue")
    .textContent =
      formaterNombre(plusFaibleNote);

  document
    .querySelector("#coefficientValue")
    .textContent =
      totalCoefficients;


  // Mention

  const badge =
    document.querySelector(
      "#mentionBadge"
    );

  badge.textContent =
    mention.texte;

  badge.className =
    "mention-badge "
    + mention.classe;


  // Appréciation

  document
    .querySelector(
      "#generalAppreciation"
    )
    .textContent =
      mention.texte;

  document
    .querySelector(
      "#appreciationMessage"
    )
    .textContent =
      getMessageAppreciation(
        moyenne
      );


  // Tableau

  construireLignesNotes(
    notes
  );


  // Titre de la page

  document.title =
    "Bulletin - "
    + etudiant.nom;
}


// ============================================================
// IMPRESSION
// ============================================================

document
  .querySelector("#printBulletinBtn")
  .addEventListener(
    "click",
    function () {
      window.print();
    }
  );


// ============================================================
// MISE À JOUR ENTRE ONGLETS
// ============================================================

window.addEventListener(
  "storage",
  function (event) {

    if (
      event.key
      === CLE_ETUDIANTS
    ) {
      afficherBulletin();
    }
  }
);


// ============================================================
// INITIALISATION
// ============================================================

afficherBulletin();

