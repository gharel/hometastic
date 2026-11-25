const INSECABLE = '\u00a0';

/**
 * Typographie française à l’affichage : rend insécables les espaces qui ne doivent pas couper une ligne.
 * Avant `: ; ! ? » · % €`, après `«`, après « n° », entre un nombre et ce qui le suit (unité, mot),
 * dans les grands nombres (150 000) et dans les heures (14 h 05). Idempotente.
 */
export function typographier(texte: string): string {
  return texte
    .replace(/ ([:;!?»·%€])/g, `${INSECABLE}$1`)
    .replace(/« /g, `«${INSECABLE}`)
    .replace(/n° /g, `n°${INSECABLE}`)
    .replace(/(\d) (?=\d{3}\b)/g, `$1${INSECABLE}`)
    .replace(/(\d) (?=[^\s\d])/g, `$1${INSECABLE}`)
    .replace(/\u00a0h (\d)/g, `${INSECABLE}h${INSECABLE}$1`);
}
