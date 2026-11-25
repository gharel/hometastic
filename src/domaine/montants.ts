/** « 14 800 F » (XPF, sans décimales) ou « 12,50 € ». Espaces ordinaires : la typographie les rend insécables. */
export function formatMontant(montant: number, devise: 'XPF' | 'EUR' = 'XPF'): string {
  if (devise === 'EUR') {
    const texte = montant.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${texte.replace(/[\u202f\u00a0]/g, ' ')} €`;
  }
  return `${Math.round(montant)
    .toLocaleString('fr-FR')
    .replace(/[\u202f\u00a0]/g, ' ')} F`;
}

/** Lit un montant saisi (« 14 800 », « 12,5 ») ; `undefined` si vide ou invalide. */
export function lireMontant(texte: string): number | undefined {
  const propre = texte.replace(/[\s\u202f\u00a0]/g, '').replace(',', '.');
  if (!propre) return undefined;
  const n = Number(propre);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}
