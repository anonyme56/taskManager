
// use gestionTaches (création de la base de données)

//db = connect("mongodb://localhost:27017/nom_bdd");

db.createCollection("taskmanager", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["titre", "statut", "priorite", "auteur", "dateCreation"],
        properties: {
          titre: { bsonType: "string" },
          description: { bsonType: "string" },
          dateCreation: { bsonType: "date" },
          echeance: { bsonType: "date" },
          statut: { bsonType: "string", enum: ["à faire", "en cours", "terminée", "annulée"] },
          priorite: { bsonType: "string", enum: ["basse", "moyenne", "haute", "critique"] },
          auteur: {
            bsonType: "object",
            required: ["nom", "prenom", "email"],
            properties: {
              nom: { bsonType: "string" },
              prenom: { bsonType: "string" },
              email: { bsonType: "string", pattern: "^.+@.+\\..+$" }
            }
          },
          categorie: { bsonType: "string" },
          etiquettes: { bsonType: "array", items: { bsonType: "string" } },
          sousTaches: {
            bsonType: "array",
            items: {
              bsonType: "object",
              properties: {
                titre: { bsonType: "string" },
                statut: { bsonType: "string" },
                echeance: { bsonType: "date" }
              }
            }
          },
          commentaires: {
            bsonType: "array",
            items: {
              bsonType: "object",
              properties: {
                auteur: { bsonType: "string" },
                date: { bsonType: "date" },
                contenu: { bsonType: "string" }
              }
            }
          },
          historiqueModifications: {
            bsonType: "array",
            items: {
              bsonType: "object",
              properties: {
                champModifie: { bsonType: "string" },
                ancienneValeur: { bsonType: "string" },
                nouvelleValeur: { bsonType: "string" },
                date: { bsonType: "date" }
              }
            }
          }
        }
      }
    }
  });
  