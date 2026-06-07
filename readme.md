# Générateur de Bulletins Scolaires

Application web permettant de gérer des étudiants, d’ajouter des matières avec leurs coefficients, d’enregistrer les notes et de générer automatiquement un bulletin scolaire individuel.

Le projet fonctionne entièrement côté navigateur avec HTML, CSS et JavaScript. Les données sont conservées grâce au `localStorage`.

---

## Aperçu du projet

Le Générateur de Bulletins Scolaires permet de :

* gérer une liste d’étudiants ;
* enregistrer le nom et le sexe de chaque étudiant ;
* créer et supprimer des matières ;
* définir un coefficient pour chaque matière ;
* ajouter une note sur 20 ;
* calculer automatiquement la moyenne pondérée ;
* afficher la mention de l’étudiant ;
* calculer le classement général ;
* supprimer une note ou un étudiant ;
* rechercher un étudiant ;
* exporter les résultats au format CSV ;
* générer un bulletin scolaire individuel ;
* imprimer ou enregistrer le bulletin au format PDF ;
* conserver les données après actualisation de la page.

---

## Technologies utilisées

* HTML5
* CSS3
* JavaScript
* LocalStorage
* Bootstrap Icons
* Google Fonts — Inter

Aucun framework JavaScript ni serveur distant n’est nécessaire.

---

## Structure du projet

```text
generateur-bulletin/
│
├── index.html
├── classes.html
├── bulletin.html
├── README.md
│
├── css/
│   ├── index.css
│   ├── classes.css
│   └── bulletin.css
│
└── js/
    ├── app.js
    ├── M.js
    └── bulletin.js
```

---

## Description des fichiers

### `index.html`

Page principale de l’application.

Elle permet de :

* créer un étudiant ;
* afficher la liste des étudiants ;
* rechercher un étudiant ;
* ajouter des notes ;
* consulter les moyennes ;
* afficher les classements ;
* supprimer une note ;
* supprimer un étudiant ;
* exporter les résultats ;
* accéder au bulletin individuel.

### `classes.html`

Page de gestion des matières.

Elle permet de :

* ajouter une matière ;
* définir son coefficient ;
* afficher les matières enregistrées ;
* calculer le total des coefficients ;
* supprimer une matière.

Lorsqu’une matière est supprimée, les notes associées peuvent également être supprimées afin de maintenir la cohérence des données.

### `bulletin.html`

Page dédiée à l’affichage du bulletin individuel.

Elle présente :

* l’identité de l’étudiant ;
* sa moyenne générale ;
* son classement ;
* sa meilleure note ;
* sa plus faible note ;
* le total des coefficients ;
* les résultats par matière ;
* les observations ;
* la mention générale ;
* une appréciation automatique ;
* les espaces de signature ;
* une fonction d’impression ou d’enregistrement en PDF.

### `js/app.js`

Gère la page principale :

* ajout des étudiants ;
* ajout des notes ;
* suppression des étudiants ;
* suppression des notes ;
* calcul des moyennes ;
* calcul des mentions ;
* calcul du classement ;
* recherche des étudiants ;
* export CSV ;
* redirection vers le bulletin ;
* sauvegarde des données dans le `localStorage`.

### `js/M.js`

Gère les matières :

* ajout d’une matière ;
* suppression d’une matière ;
* vérification des doublons ;
* calcul du total des coefficients ;
* synchronisation avec les étudiants ;
* sauvegarde dans le `localStorage`.

### `js/bulletin.js`

Gère la page du bulletin :

* récupération de l’identifiant de l’étudiant dans l’URL ;
* chargement de l’étudiant depuis le `localStorage` ;
* calcul des statistiques ;
* génération du tableau des notes ;
* affichage de la mention ;
* génération de l’appréciation ;
* impression du bulletin.

---

## Installation

### 1. Cloner le projet

```bash
git clone URL_DU_DEPOT
```

### 2. Accéder au dossier

```bash
cd generateur-bulletin
```

### 3. Ouvrir le projet dans Visual Studio Code

```bash
code .
```

### 4. Lancer le projet

Il est recommandé d’utiliser l’extension **Live Server** de Visual Studio Code.

Dans Visual Studio Code :

1. ouvrir `index.html` ;
2. effectuer un clic droit dans le fichier ;
3. sélectionner **Open with Live Server**.

L’application s’ouvrira dans le navigateur.

---

## Utilisation

### Ajouter un étudiant

1. saisir le nom complet de l’étudiant ;
2. sélectionner son sexe ;
3. cliquer sur **Ajouter**.

L’étudiant apparaît automatiquement dans la liste.

### Ajouter une matière

1. ouvrir la page **Matières** ;
2. saisir le nom de la matière ;
3. saisir son coefficient ;
4. cliquer sur **Ajouter matière**.

La matière devient disponible dans le formulaire d’ajout des notes.

### Ajouter une note

1. ouvrir la fiche de l’étudiant ;
2. sélectionner une matière ;
3. saisir une note comprise entre `0` et `20` ;
4. cliquer sur **Ajouter note**.

La moyenne, la mention et le classement sont recalculés automatiquement.

### Générer un bulletin

1. ouvrir la fiche de l’étudiant ;
2. cliquer sur **Générer le bulletin** ;
3. consulter le bulletin individuel ;
4. cliquer sur **Imprimer** pour lancer l’impression ;
5. sélectionner **Enregistrer au format PDF** dans les options d’impression du navigateur.

### Exporter les résultats

Cliquer sur le bouton **Exporter** présent sur la page principale.

Un fichier CSV contenant les étudiants, les matières, les notes, les moyennes et les mentions est généré.

---

## Calcul de la moyenne

La moyenne générale est calculée avec une moyenne pondérée :

```text
Moyenne = somme des notes × coefficients / somme des coefficients
```

Exemple :

```text
Mathématiques : 16 × 4 = 64
Physique : 14 × 3 = 42
Français : 12 × 2 = 24

Total des points = 130
Total des coefficients = 9

Moyenne = 130 / 9
Moyenne = 14,44 / 20
```

---

## Système de mentions

| Moyenne         | Mention     |
| --------------- | ----------- |
| Inférieure à 10 | Insuffisant |
| De 10 à 11,99   | Passable    |
| De 12 à 13,99   | Assez bien  |
| De 14 à 15,99   | Bien        |
| À partir de 16  | Très bien   |

---

## Système d’observations

| Note            | Observation |
| --------------- | ----------- |
| Inférieure à 10 | Insuffisant |
| De 10 à 11,99   | Passable    |
| De 12 à 13,99   | Assez bien  |
| De 14 à 15,99   | Bien        |
| De 16 à 17,99   | Très bien   |
| À partir de 18  | Excellent   |

---

## Stockage des données

L’application utilise le `localStorage` du navigateur.

Deux clés principales sont utilisées :

```javascript
etudiants
matieres
```

La clé `etudiants` contient :

* les informations des étudiants ;
* les dates d’ajout ;
* les notes ;
* les coefficients associés aux notes.

La clé `matieres` contient :

* le nom de chaque matière ;
* son identifiant ;
* son coefficient.

Les données restent disponibles après :

* actualisation de la page ;
* fermeture du navigateur ;
* redémarrage de l’ordinateur.

Les données peuvent cependant disparaître si le stockage du navigateur est supprimé.

---

## Navigation entre les pages

```text
index.html
    │
    ├── classes.html
    │       Gestion des matières
    │
    └── bulletin.html?id=IDENTIFIANT
            Bulletin individuel
```

L’identifiant de l’étudiant est transmis à la page du bulletin dans l’URL.

Exemple :

```text
bulletin.html?id=id_1749312456000
```

La page `bulletin.html` utilise ensuite cet identifiant pour retrouver l’étudiant dans le `localStorage`.

---

## Fonctionnalités de sécurité

Le projet applique plusieurs vérifications :

* refus d’un nom d’étudiant vide ;
* obligation de sélectionner le sexe ;
* refus d’une matière sans nom ;
* refus d’un coefficient inférieur à 1 ;
* détection des matières en double ;
* limitation des notes entre 0 et 20 ;
* confirmation avant suppression ;
* vérification de l’existence de l’étudiant ;
* gestion d’un identifiant de bulletin invalide ;
* protection de certaines données affichées contre l’injection HTML.

---

## Compatibilité

L’application est compatible avec les navigateurs modernes :

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Brave
* Opera

Pour une meilleure expérience, il est recommandé d’utiliser une version récente de Google Chrome ou Microsoft Edge.

---

## Améliorations possibles

Les prochaines versions pourraient intégrer :

* la modification d’un étudiant ;
* la modification d’une note ;
* la modification d’une matière ;
* la gestion des classes ;
* la gestion des années scolaires ;
* l’ajout du prénom séparément ;
* l’ajout du matricule ;
* l’ajout d’une photo ;
* la génération de tous les bulletins en une seule fois ;
* l’exportation directe en PDF ;
* l’importation de fichiers CSV ;
* un tableau de bord statistique ;
* un système d’authentification ;
* une base de données distante ;
* une version mobile ;
* une gestion des absences ;
* des appréciations personnalisées ;
* un classement par classe.

---

## Limites actuelles

Cette version utilise uniquement le stockage local du navigateur.

Elle ne permet donc pas encore :

* la synchronisation entre plusieurs ordinateurs ;
* la sauvegarde en ligne ;
* l’utilisation simultanée par plusieurs utilisateurs ;
* la récupération des données après suppression du stockage du navigateur.

Pour une utilisation en production, une future version pourrait utiliser une API et une base de données comme MySQL, PostgreSQL, Firebase ou MongoDB.


## Auteur

Projet réalisé dans le cadre d’un exercice de développement web en JavaScript.

---

## Licence

Ce projet est destiné à un usage pédagogique.

Il peut être utilisé, modifié et amélioré dans le cadre d’un apprentissage ou d’une présentation scolaire.

---

## Conclusion

Le Générateur de Bulletins Scolaires propose une solution simple, claire et fonctionnelle pour gérer les étudiants, les matières et les résultats scolaires.

Son interface épurée, son système de sauvegarde locale et sa génération de bulletins imprimables permettent de disposer d’une application complète sans serveur ni base de données externe.
