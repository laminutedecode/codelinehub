// formatDate.ts
export const formatDate = (date?: Date | string): string => {
  if (!date) return "Date invalide";

  let parsedDate: Date;

  if (typeof date === "string") {
    // Vérifier si la chaîne peut être convertie en date
    parsedDate = new Date(date);
  } else if (date instanceof Date) {
    parsedDate = date;
  } else {
    return "Date invalide"; // Gestion des cas où date n'est ni string, ni Date
  }

  // Vérifie si la date est valide
  if (isNaN(parsedDate.getTime())) {
    return "Date invalide"; // Gérer les dates invalides
  }

  // Retourne la date formatée
  return parsedDate.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
