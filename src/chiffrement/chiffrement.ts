/**
 * Chiffrement de la santé (ADR 0004) : AES-GCM 256 bits via Web Crypto, un vecteur d’initialisation
 * aléatoire par enregistrement. Format d’un bloc : « v1.<iv base64url>.<texte chiffré base64url> ».
 */

const ALGO = 'AES-GCM';
const PREFIXE = 'v1';

function versBase64(octets: Uint8Array): string {
  let binaire = '';
  for (const o of octets) binaire += String.fromCharCode(o);
  return btoa(binaire).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function depuisBase64(texte: string): Uint8Array<ArrayBuffer> {
  const normal = texte.replace(/-/g, '+').replace(/_/g, '/');
  const binaire = atob(normal + '='.repeat((4 - (normal.length % 4)) % 4));
  const octets = new Uint8Array(binaire.length);
  for (let i = 0; i < binaire.length; i++) octets[i] = binaire.charCodeAt(i);
  return octets;
}

/** Nouvelle clé du foyer (exportable : elle sert de code de secours et passera par le QR code d’invitation). */
export function genererCle(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: ALGO, length: 256 }, true, ['encrypt', 'decrypt']);
}

/** Code de secours : la clé brute en base64url (43 caractères). */
export async function exporterCle(cle: CryptoKey): Promise<string> {
  return versBase64(new Uint8Array(await crypto.subtle.exportKey('raw', cle)));
}

export async function importerCle(code: string): Promise<CryptoKey> {
  const brut = depuisBase64(code.trim());
  if (brut.length !== 32) throw new Error('Code de secours invalide');
  return crypto.subtle.importKey('raw', brut, { name: ALGO }, true, ['encrypt', 'decrypt']);
}

export async function chiffrer(cle: CryptoKey, texte: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const donnees = new TextEncoder().encode(texte);
  const chiffre = new Uint8Array(await crypto.subtle.encrypt({ name: ALGO, iv }, cle, donnees));
  return `${PREFIXE}.${versBase64(iv)}.${versBase64(chiffre)}`;
}

/** Déchiffre un bloc ; lève une erreur si la clé est mauvaise ou le bloc altéré. */
export async function dechiffrer(cle: CryptoKey, bloc: string): Promise<string> {
  const [version, iv, contenu] = bloc.split('.');
  if (version !== PREFIXE || !iv || !contenu) throw new Error('Bloc chiffré inconnu');
  const clair = await crypto.subtle.decrypt({ name: ALGO, iv: depuisBase64(iv) }, cle, depuisBase64(contenu));
  return new TextDecoder().decode(clair);
}

export const estBlocChiffre = (valeur: unknown): valeur is string =>
  typeof valeur === 'string' && valeur.startsWith(`${PREFIXE}.`);
