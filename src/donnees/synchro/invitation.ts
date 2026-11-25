/**
 * Invitation d’un téléphone dans le foyer : identifiant du foyer, secret d’invitation (prouve qu’on a
 * reçu le lien) et clé de santé (ADR 0004), réunis dans un code « foyer.secret.cle » placé dans le lien.
 * Le lien donne accès au foyer et à sa santé chiffrée : à n’envoyer qu’à l’autre membre du foyer.
 */
export interface Invitation {
  foyerId: string;
  secret: string;
  cle: string;
}

const BASE64URL = /^[A-Za-z0-9_-]+$/;

export function encoderInvitation(i: Invitation): string {
  return `${i.foyerId}.${i.secret}.${i.cle}`;
}

/** Accepte le lien complet ou le code seul ; `undefined` si invalide. */
export function decoderInvitation(texte: string): Invitation | undefined {
  const code = texte.trim().replace(/^.*#\/rejoindre\//, '');
  const [foyerId = '', secret = '', cle = '', ...reste] = code.split('.');
  if (reste.length) return undefined;
  if (!BASE64URL.test(foyerId) || foyerId.length < 10 || foyerId.length > 40) return undefined;
  if (!BASE64URL.test(secret) || secret.length < 22) return undefined;
  if (!BASE64URL.test(cle) || cle.length !== 43) return undefined;
  return { foyerId, secret, cle };
}

/** Secret d’invitation : 128 bits aléatoires en base64url. */
export function nouveauSecret(): string {
  const octets = crypto.getRandomValues(new Uint8Array(16));
  let binaire = '';
  for (const o of octets) binaire += String.fromCharCode(o);
  return btoa(binaire).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
