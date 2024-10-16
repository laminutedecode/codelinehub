import { Timestamp } from "firebase/firestore"; // Import du type Timestamp

export const formatDate = (date?: Date | Timestamp | string): string => {
  if (!date) return "Date invalide";

  let parsedDate: Date;

  if (date instanceof Timestamp) {
    // Conversion du timestamp Firebase en objet Date
    parsedDate = date.toDate();
  } else if (typeof date === "string") {
    parsedDate = new Date(date); // Conversion si la date est une chaîne
  } else if (date instanceof Date) {
    parsedDate = date; // Utilisation si c'est déjà un objet Date
  } else {
    return "Date invalide"; // Gestion des cas où date n'est ni string, ni Timestamp, ni Date
  }

  if (isNaN(parsedDate.getTime())) {
    return "Date invalide"; // Gestion des dates invalides
  }

  // Retourne la date formatée
  return parsedDate.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
