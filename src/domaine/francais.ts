/** Élision devant une voyelle ou un h muet : « de Guillaume », « d’Hélène », « que Guillaume », « qu’Hélène ». */
const ELIDE = /^[aeiouyhàâäéèêëîïôöùûüœæ]/i;

export const de = (nom: string): string => (ELIDE.test(nom) ? `d’${nom}` : `de ${nom}`);
export const que = (nom: string): string => (ELIDE.test(nom) ? `qu’${nom}` : `que ${nom}`);
